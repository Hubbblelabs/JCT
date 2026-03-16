import { cn } from "@/lib/utils";

type FacultyCardProps = {
  name: string;
  designation: string;
  qualification: string;
  experience?: string;
  specialization?: string;
  email?: string;
  className?: string;
};

export function FacultyCard({
  name,
  designation,
  qualification,
  experience,
  specialization,
  email,
  className,
}: FacultyCardProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface card-hover-lift rounded-xl border p-5",
        className,
      )}
    >
      {/* Avatar placeholder */}
      <div className="bg-navy/10 text-navy mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full font-serif text-xl font-bold">
        {name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
      <h3 className="text-foreground text-center font-sans text-sm font-semibold">
        {name}
      </h3>
      <p className="text-gold mt-0.5 text-center text-xs font-medium">
        {designation}
      </p>
      <p className="text-muted-foreground mt-1 text-center text-xs">
        {qualification}
      </p>
      {experience && (
        <p className="text-muted-foreground mt-0.5 text-center text-xs">
          {experience}
        </p>
      )}
      {specialization && (
        <p className="text-muted-foreground mt-0.5 text-center text-xs italic">
          {specialization}
        </p>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="text-gold hover:text-gold-light mt-2 block text-center text-xs transition-colors"
        >
          {email}
        </a>
      )}
    </div>
  );
}
