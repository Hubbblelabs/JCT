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
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, "src"));
let count = 0;

files.forEach((f) => {
  let content = fs.readFileSync(f, "utf8");
  let original = content;

  // 1. Data arrays: { name: "Apply Now", href: "..." }
  content = content.replace(
    /((?:name|title):\s*['"]\s*Apply Now\s*['"]\s*,\s*href:\s*)['"][^'"]*['"]/gi,
    '$1"/apply-now"',
  );
  content = content.replace(
    /(href:\s*['"][^'"]*['"]\s*,\s*(?:name|title):\s*['"]\s*Apply Now\s*['"])/gi,
    (match) => {
      return match.replace(/href:\s*['"][^'"]*['"]/, 'href: "/apply-now"');
    },
  );

  content = content.replace(
    /((?:name|title):\s*['"]\s*(Life @ JCT|Campus Life)\s*['"]\s*,\s*href:\s*)['"][^'"]*['"]/gi,
    '$1"/campus-life"',
  );
  content = content.replace(
    /(href:\s*['"][^'"]*['"]\s*,\s*(?:name|title):\s*['"]\s*(Life @ JCT|Campus Life)\s*['"])/gi,
    (match) => {
      return match.replace(/href:\s*['"][^'"]*['"]/, 'href: "/campus-life"');
    },
  );

  content = content.replace(
    /((?:name|title):\s*['"]\s*(Admissions?)\s*['"]\s*,\s*href:\s*)['"][^'"]*['"]/gi,
    '$1"/admissions"',
  );
  content = content.replace(
    /(href:\s*['"][^'"]*['"]\s*,\s*(?:name|title):\s*['"]\s*(Admissions?)\s*['"])/gi,
    (match) => {
      return match.replace(/href:\s*['"][^'"]*['"]/, 'href: "/admissions"');
    },
  );

  content = content.replace(
    /((?:name|title):\s*['"]\s*(Placements?)\s*['"]\s*,\s*href:\s*)['"][^'"]*['"]/gi,
    '$1"/placements"',
  );
  content = content.replace(
    /(href:\s*['"][^'"]*['"]\s*,\s*(?:name|title):\s*['"]\s*(Placements?)\s*['"])/gi,
    (match) => {
      return match.replace(/href:\s*['"][^'"]*['"]/, 'href: "/placements"');
    },
  );

  content = content.replace(
    /((?:name|title):\s*['"]\s*(Research|coe|Centre of Excellence)\s*['"]\s*,\s*href:\s*)['"][^'"]*['"]/gi,
    '$1"/research"',
  );
  content = content.replace(
    /(href:\s*['"][^'"]*['"]\s*,\s*(?:name|title):\s*['"]\s*(Research|coe|Centre of Excellence)\s*['"])/gi,
    (match) => {
      return match.replace(/href:\s*['"][^'"]*['"]/, 'href: "/research"');
    },
  );

  // 2. JSX elements
  // We match href="" and look forward slightly to see the text node
  // Limit to next 100 chars, avoid replacing if there's no closing tag
  const regex = /(href\s*=\s*)(['"][^'"]*['"]|\{['"][^'"]*['"]\})/gi;
  let offsetAcc = 0;
  let updatedContent = "";
  let match;

  while ((match = regex.exec(content)) !== null) {
    updatedContent += content.substring(offsetAcc, match.index);
    const prefix = match[1];
    const oldHref = match[2];
    const nextTagsStart = regex.lastIndex;
    const nextCloseTag = content.indexOf("</", nextTagsStart);

    let newHref = oldHref; // Default to keep original
    if (nextCloseTag !== -1 && nextCloseTag - nextTagsStart < 300) {
      let innerHtmlChunk = content.substring(nextTagsStart, nextCloseTag);
      let innerText = innerHtmlChunk
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!oldHref.includes("mailto:") && !oldHref.includes("tel:")) {
        if (/\bApply Now\b/i.test(innerText)) {
          newHref = '"/apply-now"';
        } else if (/\b(Life @ JCT|Campus Life)\b/i.test(innerText)) {
          newHref = '"/campus-life"';
        } else if (/\b(Admissions?)\b/i.test(innerText)) {
          newHref = '"/admissions"';
        } else if (/\b(Placements?)\b/i.test(innerText)) {
          newHref = '"/placements"';
        } else if (/\b(Research|coe|Centre of Excellence)\b/i.test(innerText)) {
          newHref = '"/research"';
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
