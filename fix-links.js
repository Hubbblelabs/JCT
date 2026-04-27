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

const files = walk("./src");
let changedItems = [];

const replacements = [
  {
    match:
      /href=(?:["'][^"']*["']|[{]["'][^"']*["'][}])([^>]*>\s*Apply Now\s*<)/gi,
    replacement: 'href="/apply-now"$1',
  },
  {
    match:
      /href=(?:["'][^"']*["']|[{]["'][^"']*["'][}])([^>]*>\s*(?:Life @ JCT|Campus Life)\s*<)/gi,
    replacement: 'href="/campus-life"$1',
  },
  {
    match:
      /href=(?:["'][^"']*["']|[{]["'][^"']*["'][}])([^>]*>\s*Admissions?\s*<)/gi,
    replacement: 'href="/admissions"$1',
  },
  {
    match:
      /href=(?:["'][^"']*["']|[{]["'][^"']*["'][}])([^>]*>\s*Placements?\s*<)/gi,
    replacement: 'href="/placements"$1',
  },
  {
    match:
      /href=(?:["'][^"']*["']|[{]["'][^"']*["'][}])([^>]*>\s*(?:Research|coe|Centre of Excellence)\s*<)/gi,
    replacement: 'href="/research"$1',
  },

  {
    match: /name:\s*(["']Apply Now["'])\s*(,\s*)href:\s*(["'][^"']*["'])/gi,
    replacement: 'name: $1$2href: "/apply-now"',
  },
  {
    match: /href:\s*(["'][^"']*["'])\s*(,\s*)name:\s*(["']Apply Now["'])/gi,
    replacement: 'href: "/apply-now"$2name: $3',
  },

  {
    match:
      /name:\s*(["'](?:Life @ JCT|Campus Life)["'])\s*(,\s*)href:\s*(["'][^"']*["'])/gi,
    replacement: 'name: $1$2href: "/campus-life"',
  },
  {
    match:
      /href:\s*(["'][^"']*["'])\s*(,\s*)name:\s*(["'](?:Life @ JCT|Campus Life)["'])/gi,
    replacement: 'href: "/campus-life"$2name: $3',
  },

  {
    match:
      /name:\s*(["'](?:Admissions?)["'])\s*(,\s*)href:\s*(["'][^"']*["'])/gi,
    replacement: 'name: $1$2href: "/admissions"',
  },
  {
    match:
      /href:\s*(["'][^"']*["'])\s*(,\s*)name:\s*(["'](?:Admissions?)["'])/gi,
    replacement: 'href: "/admissions"$2name: $3',
  },

  {
    match: /name:\s*(["']Placements?["'])\s*(,\s*)href:\s*(["'][^"']*["'])/gi,
    replacement: 'name: $1$2href: "/placements"',
  },
  {
    match: /href:\s*(["'][^"']*["'])\s*(,\s*)name:\s*(["']Placements?["'])/gi,
    replacement: 'href: "/placements"$2name: $3',
  },

  {
    match:
      /name:\s*(["'](?:Research|coe|Centre of Excellence)["'])\s*(,\s*)href:\s*(["'][^"']*["'])/gi,
    replacement: 'name: $1$2href: "/research"',
  },
  {
    match:
      /href:\s*(["'][^"']*["'])\s*(,\s*)name:\s*(["'](?:Research|coe|Centre of Excellence)["'])/gi,
    replacement: 'href: "/research"$2name: $3',
  },
];

files.forEach((f) => {
  let content = fs.readFileSync(f, "utf8");
  let original = content;

  replacements.forEach((r) => {
    content = content.replace(r.match, r.replacement);
  });

  if (content !== original) {
    fs.writeFileSync(f, content, "utf8");
    changedItems.push(f);
  }
});

console.log("Modified files:", changedItems.length);
changedItems.forEach((f) => console.log(" -", f));
