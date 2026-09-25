import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const APERCUS = [
  { icon: "ri-calendar-schedule-line", key: "etudiant.tabs.edt" },
  { icon: "ri-bar-chart-box-line", key: "etudiant.tabs.notes" },
  { icon: "ri-file-list-2-line", key: "etudiant.tabs.examens" },
  { icon: "ri-folder-download-line", key: "etudiant.tabs.documents" },
];
export default function EtudiantGate() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-lg border border-dashed border-background-300 bg-background-100 px-6 py-14 text-center animate-fade-up">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 animate-pulse-ring">
        <i className="ri-user-star-line text-3xl text-primary-700"></i>
      </span>
      <h2 className="mt-5 font-heading text-xl font-bold text-foreground-950">{t("etudiant.gate.title")}</h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-600">{t("etudiant.gate.desc")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {APERCUS.map((item) => (
          <span
            key={item.key}
            className="inline-flex items-center gap-2 rounded-full border border-background-200 bg-background-50 px-3 py-1.5 text-xs font-medium text-foreground-700"
          >
            <i className={`${item.icon} text-[13px] text-secondary-500`}></i>
            {t(item.key)}
          </span>
        ))}
      </div>
      <Link
        to="/acces"
        className="mt-7 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
      >
        <i className="ri-user-add-line text-base"></i>
        {t("etudiant.gate.cta")}
      </Link>
    </div>
  );
}
