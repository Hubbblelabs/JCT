import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize CMS-authored HTML before rendering with dangerouslySetInnerHTML.
 *
 * Editor-role users can author `richText` sections in the program builder,
 * so the HTML reaching the public layout (and the admin preview) is
 * authenticated-but-untrusted. We strip scripts, event handlers, and
 * non-http(s) URLs to prevent stored XSS.
 *
 * Allowlist favors safety over richness — extend the tag/attr lists below
 * if a legitimate editor need surfaces. Never disable sanitization to
 * support a feature; add the feature to the allowlist instead.
 */
const ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

// No `class`, `id`, `name` or `style`: with Tailwind on the page a class list
// is enough to lay a full-screen link over the site, and an id/name can
// clobber globals such as `dataLayer` that analytics and the chatbot read.
const ALLOWED_ATTR = [
  "href",
  "title",
  "target",
  "rel",
  "colspan",
  "rowspan",
  "src",
  "alt",
  "width",
  "height",
];

export function sanitizeHtml(input: unknown): string {
  if (typeof input !== "string" || input.length === 0) return "";
  // No `USE_PROFILES`: DOMPurify replaces ALLOWED_TAGS/ALLOWED_ATTR with the
  // whole HTML profile when it is set, which silently turned the allowlist
  // above into DOMPurify's full default set.
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick"],
    KEEP_CONTENT: true,
  });
}
