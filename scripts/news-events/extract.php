<?php
/**
 * Dump every published `news-event` post from the three legacy WordPress
 * installs on the OLD server (182.74.29.15) as one JSON manifest.
 *
 * Run it ON the old server — it reads the DB credentials out of each install's
 * wp-config.php, so nothing secret lives in this repo:
 *
 *   php extract.php > manifest.json && gzip -9 manifest.json
 *
 * The output is a faithful dump, not a migration: no slugs are rewritten, no
 * dates are resolved, no HTML is touched. Every transform lives in
 * seed-news-events.mjs so it stays reviewable and re-runnable against a
 * manifest that never changes.
 *
 * PHP 7.0 is what the old box has (Ubuntu 16.04). Keep the syntax to that.
 */

// Each legacy install → the institution slug the new Event model uses.
$INSTALLS = [
    [
        "dir" => "/var/www/html/engineering",
        "institution" => "engineering",
        // Public prefix images are fetched from, relative to the site root.
        "uploads_base" => "/engineering/wp-content/uploads/",
    ],
    [
        "dir" => "/var/www/html/cas",
        "institution" => "arts-science",
        "uploads_base" => "/cas/wp-content/uploads/",
    ],
    [
        "dir" => "/var/www/html/polytechnic",
        "institution" => "polytechnic",
        "uploads_base" => "/polytechnic/wp-content/uploads/",
    ],
];

/** Pull a define() out of a wp-config.php without booting WordPress. */
function wp_define($config, $name)
{
    if (
        preg_match(
            "/define\(\s*'" . preg_quote($name, "/") . "'\s*,\s*'(.*?)'\s*\)/s",
            $config,
            $m
        )
    ) {
        return $m[1];
    }
    fwrite(STDERR, "missing define $name\n");
    exit(1);
}

function wp_prefix($config)
{
    if (preg_match('/\$table_prefix\s*=\s*[\'"](.*?)[\'"]/', $config, $m)) {
        return $m[1];
    }
    fwrite(STDERR, "missing \$table_prefix\n");
    exit(1);
}

/**
 * The ACF repeater holding the photo album is named differently per install
 * (`gallery_section` on engineering/cas, `news_gallery` on polytechnic), and so
 * is its image sub-field. One regex covers both rather than branching per site.
 */
const GALLERY_IMAGE_RE = '/^(?:gallery_section|news_gallery)_(\d+)_(?:news_)?upload_image$/';
const GALLERY_CAPTION_RE = '/^(?:gallery_section|news_gallery)_(\d+)_caption$/';

// Date fields, in the order seed-news-events.mjs prefers them. Kept raw here.
const DATE_KEYS = [
    "wpcf-event-date", // engineering — unix timestamp
    "wpcf-date", // polytechnic  — unix timestamp
    "publication_date", // arts & science — Ymd
    "_wp_old_date", // any — Y-m-d, set when a post was re-dated
];

$out = [
    "source" => "http://182.74.29.15",
    "generated_by" => "scripts/news-events/extract.php",
    "installs" => [],
];

foreach ($INSTALLS as $install) {
    $configPath = $install["dir"] . "/wp-config.php";
    $config = file_get_contents($configPath);
    if ($config === false) {
        fwrite(STDERR, "cannot read $configPath\n");
        exit(1);
    }

    $db = new mysqli(
        wp_define($config, "DB_HOST"),
        wp_define($config, "DB_USER"),
        wp_define($config, "DB_PASSWORD"),
        wp_define($config, "DB_NAME")
    );
    if ($db->connect_error) {
        fwrite(STDERR, "connect failed: " . $db->connect_error . "\n");
        exit(1);
    }
    // The columns are utf8mb4 even though the database default is latin1.
    // Without this the connection downgrades and every curly quote and Tamil
    // character comes back as mojibake.
    $db->set_charset("utf8mb4");

    $p = wp_prefix($config);

    // ---- posts -------------------------------------------------------------
    $posts = [];
    $ids = [];
    $res = $db->query(
        "SELECT ID, post_name, post_title, post_content, post_excerpt, post_date
           FROM {$p}posts
          WHERE post_type = 'news-event' AND post_status = 'publish'
          ORDER BY post_date ASC, ID ASC"
    );
    while ($row = $res->fetch_assoc()) {
        $id = (int) $row["ID"];
        $ids[] = $id;
        $posts[$id] = [
            "id" => $id,
            "slug" => $row["post_name"],
            "title" => $row["post_title"],
            "content" => $row["post_content"],
            "excerpt" => $row["post_excerpt"],
            "postDate" => $row["post_date"],
            "dates" => new stdClass(),
            "coverId" => null,
            "galleryIds" => [], // index => attachment id
            "captions" => [], // index => caption
        ];
    }
    $res->free();

    if (!$ids) {
        $install["events"] = [];
        $out["installs"][] = $install;
        $db->close();
        continue;
    }
    $idList = implode(",", $ids);

    // ---- post meta ---------------------------------------------------------
    $res = $db->query(
        "SELECT post_id, meta_key, meta_value
           FROM {$p}postmeta
          WHERE post_id IN ($idList)"
    );
    $attachmentIds = [];
    while ($row = $res->fetch_assoc()) {
        $id = (int) $row["post_id"];
        $key = $row["meta_key"];
        $val = $row["meta_value"];
        if (!isset($posts[$id])) {
            continue;
        }

        if ($key === "_thumbnail_id" && ctype_digit($val)) {
            $posts[$id]["coverId"] = (int) $val;
            $attachmentIds[(int) $val] = true;
        } elseif (in_array($key, DATE_KEYS, true) && $val !== "") {
            $posts[$id]["dates"]->$key = $val;
        } elseif (preg_match(GALLERY_IMAGE_RE, $key, $m) && ctype_digit($val)) {
            $posts[$id]["galleryIds"][(int) $m[1]] = (int) $val;
            $attachmentIds[(int) $val] = true;
        } elseif (preg_match(GALLERY_CAPTION_RE, $key, $m) && $val !== "") {
            $posts[$id]["captions"][(int) $m[1]] = $val;
        }
    }
    $res->free();

    // ---- attachments -------------------------------------------------------
    // Resolve every referenced attachment to its uploads-relative path. Also
    // carry the mime type and on-disk size so the seeder can skip non-images
    // (a handful of mp4/docx are attached to these posts) without a HEAD
    // request per file.
    $files = [];
    if ($attachmentIds) {
        $attList = implode(",", array_keys($attachmentIds));
        $res = $db->query(
            "SELECT pm.post_id, pm.meta_value AS path, a.post_mime_type AS mime
               FROM {$p}postmeta pm
               JOIN {$p}posts a ON a.ID = pm.post_id
              WHERE pm.meta_key = '_wp_attached_file' AND pm.post_id IN ($attList)"
        );
        while ($row = $res->fetch_assoc()) {
            $abs =
                $install["dir"] . "/wp-content/uploads/" . $row["path"];
            $files[(int) $row["post_id"]] = [
                "path" => $row["path"],
                "mime" => $row["mime"],
                "bytes" => is_file($abs) ? filesize($abs) : 0,
            ];
        }
        $res->free();
    }

    // ---- assemble ----------------------------------------------------------
    $events = [];
    foreach ($posts as $post) {
        $cover = null;
        if ($post["coverId"] !== null && isset($files[$post["coverId"]])) {
            $cover = $files[$post["coverId"]];
            $cover["attachmentId"] = $post["coverId"];
        }

        // ACF numbers repeater rows from 0; sort so the album keeps the order
        // the editor arranged it in rather than MySQL's row order.
        ksort($post["galleryIds"]);
        $gallery = [];
        foreach ($post["galleryIds"] as $index => $attId) {
            if (!isset($files[$attId])) {
                continue;
            }
            $item = $files[$attId];
            $item["attachmentId"] = $attId;
            $item["caption"] = isset($post["captions"][$index])
                ? $post["captions"][$index]
                : "";
            $gallery[] = $item;
        }

        $events[] = [
            "id" => $post["id"],
            "slug" => $post["slug"],
            "title" => $post["title"],
            "content" => $post["content"],
            "excerpt" => $post["excerpt"],
            "postDate" => $post["postDate"],
            "dates" => $post["dates"],
            "cover" => $cover,
            "gallery" => $gallery,
        ];
    }

    $install["events"] = $events;
    $out["installs"][] = $install;
    $db->close();
}

echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), "\n";
