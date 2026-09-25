import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function PortalFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-primary-900 text-background-100">
      <div className="w-full px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-50/10">
                <i className="ri-graduation-cap-fill text-xl text-accent-400"></i>
              </span>
              <span className="font-heading text-lg font-bold text-background-50">
                {t("brand.name")}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background-200">
              {t("footer.about")}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-background-50/10 px-3 py-2 text-xs text-accent-200">
              <i className="ri-flask-line text-sm"></i>
              {t("footer.official")}
            </div>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent-300">
              {t("footer.portal")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><Link to="/formations" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">Catalogue des formations</Link></li>
              <li><Link to="/etablissements" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">{t("nav.etablissements")}</Link></li>
              <li><Link to="/bourses" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">{t("nav.bourses")}</Link></li>
              <li><Link to="/stages-emplois" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">Stages et emplois</Link></li>
              <li><Link to="/annonces" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">{t("nav.annonces")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent-300">
              {t("footer.resources")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><Link to="/bourses/suivi" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">Suivi des candidatures de bourse</Link></li>
              <li><Link to="/ministere" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">Espace ministère</Link></li>
              <li><Link to="/universite" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">Espace université</Link></li>
              <li><Link to="/notifications" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">Notifications</Link></li>
              <li><Link to="/faq" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">{t("footer.faq")}</Link></li>
              <li><Link to="/acces" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">{t("footer.guide")}</Link></li>
              <li><Link to="/annonces" className="cursor-pointer text-background-200 transition-colors hover:text-background-50">{t("footer.calendar")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent-300">
              {t("footer.legal")}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li><span className="text-background-200">{t("footer.legalNotices")}</span></li>
              <li><span className="text-background-200">{t("footer.privacy")}</span></li>
              <li><span className="text-background-200">{t("footer.accessibility")}</span></li>
              <li><span className="text-background-200">{t("footer.terms")}</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-background-50/15 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-background-300">
            © {year} {t("brand.name")} — {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-background-300">
            <span className="inline-flex items-center gap-1.5">
              <i className="ri-map-pin-2-line"></i>
              Cotonou, Bénin
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="ri-mail-line"></i>
              contact@mystud.bj
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
