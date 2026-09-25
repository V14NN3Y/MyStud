import type { ReactNode } from "react";
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: "left" | "center";
}
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        isCenter ? "md:flex-col md:items-center" : ""
      }`}
    >
      <div className={isCenter ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground-950">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-sm md:text-base leading-relaxed text-foreground-600">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
