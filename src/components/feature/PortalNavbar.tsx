import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotificationBell from "@/components/feature/NotificationBell";
const NAV_LINKS = [
  { to: "/formations", key: "nav.formations" },
  { to: "/etablissements", key: "nav.etablissements" },
  { to: "/bourses", key: "nav.bourses" },
  { to: "/stages-emplois", key: "emplois.navLabel" },
  { to: "/annonces", key: "nav.annonces" },
];
export default function PortalNavbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = location.pathname === "/";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  const solid = scrolled || !isHome;
  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-300 ${
        solid
          ? "border-b border-background-200 bg-background-50/95 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="w-full px-4 py-3 md:px-6 md:py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
              <i className="ri-graduation-cap-fill text-xl text-background-50"></i>
            </span>
            <span className="flex flex-col leading-none">
              <span
                className={`font-heading text-lg font-bold tracking-tight ${
                  solid ? "text-foreground-950" : "text-background-50"
                }`}
              >
                {t("brand.name")}
              </span>
              <span
                className={`mt-1 hidden text-[11px] font-medium sm:block ${
                  solid ? "text-foreground-600" : "text-background-200"
                }`}
              >
                {t("brand.tagline")}
              </span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `cursor-pointer rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    solid
                      ? isActive
                        ? "bg-primary-100 text-primary-800"
                        : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
                      : isActive
                        ? "bg-background-50/20 text-background-50"
                        : "text-background-100 hover:bg-background-50/15"
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell solid={solid} />
            <Link
              to="/acces"
              className={`hidden cursor-pointer items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors sm:inline-flex ${
                solid
                  ? "bg-primary-500 text-background-50 hover:bg-primary-600"
                  : "bg-background-50 text-foreground-950 hover:bg-background-100"
              }`}
            >
              <i className="ri-user-line text-base"></i>
              {t("nav.acces")}
            </Link>
            <button
              type="button"
              aria-label={t("nav.menu")}
              onClick={() => setOpen((v) => !v)}
              className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md md:hidden ${
                solid ? "bg-background-100 text-foreground-950" : "bg-background-50/20 text-background-50"
              }`}
            >
              <i className={`${open ? "ri-close-line" : "ri-menu-line"} text-xl`}></i>
            </button>
          </div>
        </div>
      </nav>
      {open && (
        <div className="border-t border-background-200 bg-background-50 px-4 pb-4 pt-2 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `cursor-pointer rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-100 text-primary-800"
                      : "text-foreground-700 hover:bg-background-100"
                  }`
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
            <Link
              to="/acces"
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-3 text-sm font-semibold whitespace-nowrap text-background-50"
            >
              <i className="ri-user-line text-base"></i>
              {t("nav.acces")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
