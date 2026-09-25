import { Link } from "react-router-dom";
import type { ReactNode } from "react";
interface Crumb {
  label: string;
  to?: string;
}
interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}
export default function PageHero({ eyebrow, title, subtitle, crumbs, children }: PageHeroProps) {
  return (
    <section className="w-full border-b border-background-200 bg-background-100 px-4 pb-10 pt-28 md:px-6 md:pb-14 md:pt-36">
      <div className="mx-auto w-full max-w-6xl">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Fil d'ariane" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-foreground-600">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 && <i className="ri-arrow-right-s-line text-foreground-400"></i>}
                {crumb.to ? (
                  <Link to={crumb.to} className="cursor-pointer transition-colors hover:text-primary-700">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground-800">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground-950 md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground-600 md:text-base">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
