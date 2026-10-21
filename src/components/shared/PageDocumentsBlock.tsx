import { Download, FileText } from "lucide-react";
import type { PageBodySection } from "@/lib/validation";
import { getImageUrl } from "@/lib/utils";

type DocumentsSection = Extract<PageBodySection, { type: "documents" }>;

type ResolvedDocument = DocumentsSection["items"][number] & {
  file: string;
  /** Null while the file is an unsaved pick with no URL yet. */
  href: string | null;
};

/**
 * Names a file that has no typed-in label after the upload itself:
 * "documents/1712345678901-R2021-Syllabus.pdf" → "R2021 Syllabus".
 */
function fileLabel(file: string): string {
  const base = (file.split("?")[0].split("/").pop() ?? "")
    .replace(/^\d{10,}-/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base || "Download";
}

const CARD =
  "flex h-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm";

/**
 * The "Documents" content block: one download card per file. Shared by
 * `PageBlocksRenderer` and the Page CMS `DynamicPageRenderer`, and hook-free
 * because the latter renders as a server component on the public route.
 */
export function PageDocumentsBlock({ section }: { section: DocumentsSection }) {
  const docs = section.items.flatMap((d): ResolvedDocument[] => {
    const file = d.file?.trim() ?? "";
    // A file picked in the admin editor is a `pending:` placeholder until the
    // save uploads it, so the live preview has nothing to link to yet.
    if (file.startsWith("pending:")) return [{ ...d, file, href: null }];
    // Program section blocks reach here without schema validation, so link
    // only what resolves to an asset URL, a web URL or a site path.
    const href = getImageUrl(file);
    return href && /^(https?:\/\/|\/)/i.test(href)
      ? [{ ...d, file, href }]
      : [];
  });
  if (docs.length === 0) return null;

  return (
    <ul className="my-6 grid grid-cols-1 gap-3 md:grid-cols-2">
      {docs.map((doc, i) => {
        const pending = doc.href === null;
        const label =
          doc.label?.trim() || (pending ? "New document" : fileLabel(doc.file));
        const body = (
          <>
            <span className="bg-gold/15 text-gold-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <FileText size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold break-words text-gray-900">
                {label}
              </span>
              {doc.description?.trim() && (
                <span className="mt-1 block text-sm text-gray-600">
                  {doc.description}
                </span>
              )}
              {pending ? (
                <span className="mt-2 block text-xs text-gray-500">
                  Uploads when you save
                </span>
              ) : (
                <span className="text-navy mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  <Download size={12} />
                  Download
                </span>
              )}
            </span>
          </>
        );
        return (
          <li key={i}>
            {doc.href === null ? (
              <div className={CARD}>{body}</div>
            ) : (
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CARD} transition-all hover:shadow-md`}
              >
                {body}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
