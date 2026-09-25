import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const ETAPES = [
  { icon: "ri-fingerprint-line", key: "acces.step1.title" },
  { icon: "ri-lock-password-line", key: "acces.step2.title" },
  { icon: "ri-file-list-3-line", key: "acces.step3.title" },
];
export default function EspaceGate() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-lg border border-dashed border-background-300 bg-background-100 px-6 py-14 text-center animate-fade-up">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 animate-pulse-ring">
        <i className="ri-lock-2-line text-3xl text-primary-700"></i>
      </span>
      <h2 className="mt-5 font-heading text-xl font-bold text-foreground-950">
        {t("espace.gate.title")}
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground-600">
        {t("espace.gate.desc")}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {ETAPES.map((etape) => (
          <span
            key={etape.key}
            className="inline-flex items-center gap-2 rounded-full border border-background-200 bg-background-50 px-3 py-1.5 text-xs font-medium text-foreground-700"
          >
            <i className={`${etape.icon} text-[13px] text-secondary-500`}></i>
            {t(etape.key)}
          </span>
        ))}
      </div>
      <Link
        to="/acces"
        className="mt-7 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
      >
        <i className="ri-user-add-line text-base"></i>
        {t("espace.gate.cta")}
      </Link>
    </div>
  );
}
