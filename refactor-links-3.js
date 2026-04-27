const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), "src"));
let count = 0;

files.forEach((f) => {
  let content = fs.readFileSync(f, "utf8");
  let original = content;

  // Space/comma characters only between name and href:
  const gap = "[ \\r\\n\\t,]{1,20}";

  const rules = [
    { text: "Apply Now", link: "/apply-now" },
    { text: "Life @ JCT|Campus Life", link: "/campus-life" },
    { text: "Admissions?", link: "/admissions" },
    { text: "Placements?", link: "/placements" },
    { text: "Research|coe|Centre of Excellence", link: "/research" },
  ];

  rules.forEach((r) => {
    // 1. Data arrays (forward): name: "Text", href: "href"
    let regex1 = new RegExp(
      `((?:name|title):\\s*['"]\\s*(?:${r.text})\\s*['"]${gap}href:\\s*)(['"][^'"]*['"])`,
      "gi",
    );
    content = content.replace(regex1, `$1"${r.link}"`);

    // 2. Data arrays (backward): href: "href", name: "Text"
    let regex2 = new RegExp(
      `(href:\\s*)(['"][^'"]*['"])(${gap}(?:name|title):\\s*['"]\\s*(?:${r.text})\\s*['"])`,
      "gi",
    );
    content = content.replace(regex2, `$1"${r.link}"$3`);
  });

  // 3. JSX tags: href="..." > Text <
  // First, extract all href tags with their contents, making sure we don't cross another tag.
  // Match href=..., then until the next `<`
  const regex =
    /(href\s*=\s*)(['"][^'"]*['"]|\{\s*['"][^'"]*['"]\s*\})([^<]{0,150}?)</gi;
  let offsetAcc = 0;
  let updatedContent = "";
  let match;

  while ((match = regex.exec(content)) !== null) {
    updatedContent += content.substring(offsetAcc, match.index);
    const prefix = match[1];
    const oldHref = match[2];
    const innerHtmlChunk = match[3];
    // Note: we're only looking BEFORE the FIRST opening/closing tag. This works for simple buttons.
    // If it's a nested tag, we might have to search until `</` or up to a short distance (150 chars).
    // Let's actually look until the closing tag of the element!
    const nextTagsStart = regex.lastIndex - 1; // right at the `<`
    const nextCloseTag = content.indexOf("</", nextTagsStart);

    let newHref = oldHref;
    if (nextCloseTag !== -1 && nextCloseTag - nextTagsStart < 300) {
      let fullInnerChunk = content.substring(
        match.index + prefix.length + oldHref.length,
        nextCloseTag,
      );
      let innerText = fullInnerChunk
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (
        !oldHref.includes("mailto:") &&
        !oldHref.includes("tel:") &&
        !oldHref.includes("admissionsEmail")
      ) {
        if (/^\s*Apply Now\s*$/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/apply-now"}' : '"/apply-now"';
        } else if (/^\s*(Life @ JCT|Campus Life)\s*$/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/campus-life"}' : '"/campus-life"';
        } else if (/^\s*(Admissions?)\s*$/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/admissions"}' : '"/admissions"';
        } else if (/^\s*(Placements?)\s*$/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/placements"}' : '"/placements"';
        } else if (
          /^\s*(Research|coe|Centre of Excellence)\s*$/i.test(innerText)
        ) {
          newHref = oldHref[0] === "{" ? '{"/research"}' : '"/research"';
        } else if (/\bApply Now\b/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/apply-now"}' : '"/apply-now"';
        } else if (/\b(Life @ JCT|Campus Life)\b/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/campus-life"}' : '"/campus-life"';
        } else if (
          /\b(Admissions?)\b/i.test(innerText) &&
          !oldHref.includes("admissionsEmail")
        ) {
          newHref = oldHref[0] === "{" ? '{"/admissions"}' : '"/admissions"';
        } else if (/\b(Placements?)\b/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/placements"}' : '"/placements"';
        } else if (/\b(Research|coe|Centre of Excellence)\b/i.test(innerText)) {
          newHref = oldHref[0] === "{" ? '{"/research"}' : '"/research"';
        }
      }
    }

    updatedContent += prefix + newHref;
    // We only advance to the end of the `href="..."` part, NOT up to the `<`.
    offsetAcc = match.index + prefix.length + oldHref.length;
    regex.lastIndex = offsetAcc;
  }

  updatedContent += content.substring(offsetAcc);
  content = updatedContent;

  if (content !== original) {
    fs.writeFileSync(f, content, "utf8");
    count++;
    console.log("Updated: " + f);
  }
});
console.log("Modified files:", count);
