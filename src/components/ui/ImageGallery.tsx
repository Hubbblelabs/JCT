import { cn } from "@/lib/utils";

type ImageGalleryProps = {
  images: { src: string; alt: string }[];
  className?: string;
};

export function ImageGallery({ images, className }: ImageGalleryProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {images.map((img, i) => (
        <div
          key={i}
          className="border-border group relative aspect-4/3 overflow-hidden rounded-xl border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <p className="absolute right-3 bottom-2 left-3 truncate text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            {img.alt}
          </p>
        </div>
      ))}
    </div>
  );
}
