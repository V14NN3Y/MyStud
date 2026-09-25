import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
export default function NotFound() {
  const { t } = useTranslation();
  const location = useLocation();
  const shortcuts = [
    { to: "/", label: t("brand.name"), icon: "ri-home-5-line" },
    { to: "/formations", label: t("nav.formations"), icon: "ri-book-open-line" },
    { to: "/faq", label: t("footer.faq"), icon: "ri-question-line" },
  ];
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        <span className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-[9rem] font-black leading-none text-background-100 md:text-[14rem]">
          404
        </span>
        <div className="relative z-10 flex max-w-xl flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-800">
            <i className="ri-map-pin-line"></i>
            {t("notFound.eyebrow")}
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
            {t("notFound.title")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
            {t("notFound.desc")}
          </p>
          <p className="mt-4 rounded-md bg-background-100 px-3 py-1.5 font-mono text-xs text-foreground-500">
            {location.pathname}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.to}
                to={shortcut.to}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-5 py-2.5 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300 hover:text-primary-700"
              >
                <i className={`${shortcut.icon} text-base`}></i>
                {shortcut.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}
