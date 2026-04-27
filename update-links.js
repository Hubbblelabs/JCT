const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk("./src");
let changedItems = [];

files.forEach((f) => {
  let content = fs.readFileSync(f, "utf8");
  let original = content;
  const lines = content.split("\n");
  let lineChanged = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // HTML tags
    if (line.match(/>\s*Apply Now\s*</i) && line.match(/href=/)) {
      lines[i] = line.replace(
        /href=(?:["'][^"']*["']|\{["'][^"']*["']\})/,
        'href="/apply-now"',
      );
      lineChanged = true;
    } else if (
      line.match(/>\s*(Life @ JCT|Campus Life)\s*</i) &&
      line.match(/href=/)
    ) {
      lines[i] = line.replace(
        /href=(?:["'][^"']*["']|\{["'][^"']*["']\})/,
        'href="/campus-life"',
      );
      lineChanged = true;
    } else if (
      line.match(/>\s*Admissions?\s*</i) &&
      line.match(/href=/) &&
      !line.match(/"\/admissions"/)
    ) {
      lines[i] = line.replace(
        /href=(?:["'][^"']*["']|\{["'][^"']*["']\})/,
        'href="/admissions"',
      );
      lineChanged = true;
    } else if (
      line.match(/>\s*Placements?\s*</i) &&
      line.match(/href=/) &&
      !line.match(/"\/placements"/)
    ) {
      lines[i] = line.replace(
        /href=(?:["'][^"']*["']|\{["'][^"']*["']\})/,
        'href="/placements"',
      );
      lineChanged = true;
    } else if (
      line.match(/>\s*(Research|coe|Centre of Excellence)\s*</i) &&
      line.match(/href=/) &&
      !line.match(/"\/research"/)
    ) {
      lines[i] = line.replace(
        /href=(?:["'][^"']*["']|\{["'][^"']*["']\})/,
        'href="/research"',
      );
      lineChanged = true;
    }

    // Object attributes name: , href: ...
    if (line.match(/name:\s*["']Apply Now["']/i) && line.match(/href:/)) {
      lines[i] = line.replace(/href:\s*["'][^"']*["']/, 'href: "/apply-now"');
      lineChanged = true;
    } else if (
      line.match(/name:\s*["'](?:Life @ JCT|Campus Life)["']/i) &&
      line.match(/href:/)
    ) {
      lines[i] = line.replace(/href:\s*["'][^"']*["']/, 'href: "/campus-life"');
      lineChanged = true;
    } else if (
      line.match(/name:\s*["']Admissions?["']/i) &&
      line.match(/href:/) &&
      !line.match(/"\/admissions"/)
    ) {
      lines[i] = line.replace(/href:\s*["'][^"']*["']/, 'href: "/admissions"');
      lineChanged = true;
    } else if (
      line.match(/name:\s*["']Placements?["']/i) &&
      line.match(/href:/) &&
      !line.match(/"\/placements"/)
    ) {
      lines[i] = line.replace(/href:\s*["'][^"']*["']/, 'href: "/placements"');
      lineChanged = true;
    } else if (
      line.match(/name:\s*["'](?:Research|coe|Centre of Excellence)["']/i) &&
      line.match(/href:/) &&
      !line.match(/"\/research"/)
    ) {
      lines[i] = line.replace(/href:\s*["'][^"']*["']/, 'href: "/research"');
      lineChanged = true;
    }
  }

  // Multiline replacements might be needed for elements like:
  // <Link
  //   href="/..."
  // >
  //   Apply Now
  // </Link>
  // However, I can also review these afterwards.

  if (lineChanged && lines.join("\n") !== original) {
    fs.writeFileSync(f, lines.join("\n"), "utf8");
    changedItems.push(f);
  }
});
console.log("Modified files:", changedItems.length);
changedItems.forEach((f) => console.log(" -", f));
