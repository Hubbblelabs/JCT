import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type DocumentCardProps = {
  title: string;
  description?: string;
  year?: string;
  downloadUrl?: string;
  className?: string;
};

export function DocumentCard({
  title,
  description,
  year,
  downloadUrl,
  className,
}: DocumentCardProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface card-hover-lift flex items-start gap-4 rounded-xl border p-5",
        className,
      )}
    >
      <div className="bg-gold/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
        <FileText size={18} className="text-gold" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-foreground font-sans text-sm font-semibold">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
        {year && (
          <span className="text-muted-foreground mt-1 block text-xs">
            {year}
          </span>
        )}
      </div>
      {downloadUrl && (
        <a
          href={downloadUrl}
          className="text-gold hover:text-gold-light shrink-0 transition-colors"
          aria-label={`Download ${title}`}
        >
          <Download size={18} />
        </a>
      )}
    </div>
  );
}
