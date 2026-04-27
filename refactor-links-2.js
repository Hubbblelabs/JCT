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

  // Pattern 1: object arrays like { name: "Apply Now", href: "/admissions" }
  const replacePatterns = [
    {
      r: /((?:name|title):\s*['"]\s*Apply Now\s*['"]\s*,[\s\S]{0,50}href:\s*)['"][^'"]*['"]/gi,
      v: '$1"/apply-now"',
    },
    {
      r: /(href:\s*['"][^'"]*['"][\s\S]{0,50}(?:name|title):\s*['"]\s*Apply Now\s*['"])/gi,
      fn: (m) => m.replace(/href:\s*['"][^'"]*['"]/, 'href: "/apply-now"'),
    },

    {
      r: /((?:name|title):\s*['"]\s*(Life @ JCT|Campus Life)\s*['"]\s*,[\s\S]{0,50}href:\s*)['"][^'"]*['"]/gi,
      v: '$1"/campus-life"',
    },
    {
      r: /(href:\s*['"][^'"]*['"][\s\S]{0,50}(?:name|title):\s*['"]\s*(Life @ JCT|Campus Life)\s*['"])/gi,
      fn: (m) => m.replace(/href:\s*['"][^'"]*['"]/, 'href: "/campus-life"'),
    },

    {
      r: /((?:name|title):\s*['"]\s*(Admissions?)\s*['"]\s*,[\s\S]{0,50}href:\s*)['"][^'"]*['"]/gi,
      v: '$1"/admissions"',
    },
    {
      r: /(href:\s*['"][^'"]*['"][\s\S]{0,50}(?:name|title):\s*['"]\s*(Admissions?)\s*['"])/gi,
      fn: (m) => m.replace(/href:\s*['"][^'"]*['"]/, 'href: "/admissions"'),
    },

    {
      r: /((?:name|title):\s*['"]\s*(Placements?)\s*['"]\s*,[\s\S]{0,50}href:\s*)['"][^'"]*['"]/gi,
      v: '$1"/placements"',
    },
    {
      r: /(href:\s*['"][^'"]*['"][\s\S]{0,50}(?:name|title):\s*['"]\s*(Placements?)\s*['"])/gi,
      fn: (m) => m.replace(/href:\s*['"][^'"]*['"]/, 'href: "/placements"'),
    },

    {
      r: /((?:name|title):\s*['"]\s*(Research|coe|Centre of Excellence)\s*['"]\s*,[\s\S]{0,50}href:\s*)['"][^'"]*['"]/gi,
      v: '$1"/research"',
    },
    {
      r: /(href:\s*['"][^'"]*['"][\s\S]{0,50}(?:name|title):\s*['"]\s*(Research|coe|Centre of Excellence)\s*['"])/gi,
      fn: (m) => m.replace(/href:\s*['"][^'"]*['"]/, 'href: "/research"'),
    },
  ];

  for (const p of replacePatterns) {
    if (p.v) content = content.replace(p.r, p.v);
    if (p.fn) content = content.replace(p.r, p.fn);
  }

  // Pattern 2: JSX <Link href="...">Apply Now</Link>
  const regex = /(href\s*=\s*)(['"][^'"]*['"]|\{\s*['"][^'"]*['"]\s*\})/gi;
  let offsetAcc = 0;
  let updatedContent = "";
  let match;

  while ((match = regex.exec(content)) !== null) {
    updatedContent += content.substring(offsetAcc, match.index);
    const prefix = match[1];
    const oldHref = match[2];
    const nextTagsStart = regex.lastIndex;
    const nextCloseTag = content.indexOf("</", nextTagsStart);

    let newHref = oldHref;
    if (nextCloseTag !== -1 && nextCloseTag - nextTagsStart < 300) {
      let innerHtmlChunk = content.substring(nextTagsStart, nextCloseTag);
      let innerText = innerHtmlChunk
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (
        !oldHref.includes("mailto:") &&
        !oldHref.includes("tel:") &&
        !oldHref.includes("admissionsEmail")
      ) {
        if (/^\s*Apply Now\s*$/i.test(innerText)) {
          newHref = '"/apply-now"';
        } else if (/^\s*(Life @ JCT|Campus Life)\s*$/i.test(innerText)) {
          newHref = '"/campus-life"';
        } else if (/^\s*(Admissions?)\s*$/i.test(innerText)) {
          newHref = '"/admissions"';
        } else if (/^\s*(Placements?)\s*$/i.test(innerText)) {
          newHref = '"/placements"';
        } else if (
          /^\s*(Research|coe|Centre of Excellence)\s*$/i.test(innerText)
        ) {
          newHref = '"/research"';
        } else if (/\bApply Now\b/i.test(innerText)) {
          if (oldHref.startsWith("{")) newHref = '{"/apply-now"}';
          else newHref = '"/apply-now"';
        } else if (/\b(Life @ JCT|Campus Life)\b/i.test(innerText)) {
          if (oldHref.startsWith("{")) newHref = '{"/campus-life"}';
          else newHref = '"/campus-life"';
        } else if (/\b(Admissions?)\b/i.test(innerText)) {
          if (oldHref.startsWith("{")) newHref = '{"/admissions"}';
          else newHref = '"/admissions"';
        } else if (/\b(Placements?)\b/i.test(innerText)) {
          if (oldHref.startsWith("{")) newHref = '{"/placements"}';
          else newHref = '"/placements"';
        } else if (/\b(Research|coe|Centre of Excellence)\b/i.test(innerText)) {
          if (oldHref.startsWith("{")) newHref = '{"/research"}';
          else newHref = '"/research"';
        }
      }
    }

    updatedContent += prefix + newHref;
    offsetAcc = regex.lastIndex;
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
