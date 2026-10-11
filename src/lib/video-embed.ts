/**
 * Turns a video link an editor pasted (a YouTube watch page, a youtu.be short
 * link, a Vimeo page, a Facebook video…) into something the site can show.
 *
 * Sites we can embed get a player URL; anything else is kept as a plain link
 * that opens in a new tab. The player hosts must be allowed by the CSP
 * `frame-src` in next.config.ts — add a provider in both places or neither.
 */

export type VideoEmbed =
  | {
      kind: "embed";
      provider: "youtube" | "vimeo" | "facebook";
      /** The iframe `src`. */
      src: string;
      /** The original link, for "watch on …". */
      url: string;
    }
  | { kind: "link"; url: string };

const YOUTUBE_ID = /^[A-Za-z0-9_-]{6,20}$/;

function youtubeId(u: URL): string | null {
  const host = u.hostname.replace(/^www\.|^m\./, "");
  if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;
  if (u.pathname === "/watch") return u.searchParams.get("v");
  // /embed/<id>, /shorts/<id>, /live/<id>
  const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/);
  return m ? m[1] : null;
}

function vimeoId(u: URL): string | null {
  const host = u.hostname.replace(/^www\./, "");
  if (host === "player.vimeo.com") {
    const m = u.pathname.match(/^\/video\/(\d+)/);
    return m ? m[1] : null;
  }
  if (host !== "vimeo.com") return null;
  const m = u.pathname.match(/^\/(?:.*\/)?(\d+)(?:\/|$)/);
  return m ? m[1] : null;
}

function isFacebookVideo(u: URL): boolean {
  const host = u.hostname.replace(/^www\.|^m\.|^web\./, "");
  if (host === "fb.watch") return true;
  if (host !== "facebook.com") return false;
  return /\/videos\/|\/watch\/?|\/reel\//.test(u.pathname);
}

export function toVideoEmbed(raw: string): VideoEmbed | null {
  const value = raw.trim();
  if (!value) return null;
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const url = u.toString();

  const yt = youtubeId(u);
  if (yt && YOUTUBE_ID.test(yt)) {
    return {
      kind: "embed",
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${yt}`,
      url,
    };
  }

  const vm = vimeoId(u);
  if (vm) {
    return {
      kind: "embed",
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${vm}`,
      url,
    };
  }

  if (isFacebookVideo(u)) {
    return {
      kind: "embed",
      provider: "facebook",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
      url,
    };
  }

  return { kind: "link", url };
}

/** The embeddable/linkable videos in a list, invalid entries dropped. */
export function toVideoEmbeds(
  list: readonly string[] | undefined,
): VideoEmbed[] {
  return (list ?? [])
    .map(toVideoEmbed)
    .filter((v): v is VideoEmbed => v !== null);
}
