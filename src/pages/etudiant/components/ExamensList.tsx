import { useState } from "react";
import { useTranslation } from "react-i18next";
import { examens } from "@/mocks/etudiant";
const TYPE_TONE: Record<string, string> = {
  "Examen de semestre": "bg-primary-100 text-primary-800 border-primary-200",
  Rattrapage: "bg-accent-100 text-accent-900 border-accent-300",
  Soutenance: "bg-secondary-100 text-secondary-900 border-secondary-200",
};
export default function ExamensList() {
  const { t } = useTranslation();
  const [rappels, setRappels] = useState<Record<string, boolean>>({});
  return (
    <section className="rounded-lg border border-background-200 bg-background-50 p-5 animate-fade-up md:p-6">
      <h2 className="font-heading text-base font-bold text-foreground-950">{t("etudiant.examens.title")}</h2>
      <p className="mt-1 text-xs text-foreground-600">{t("etudiant.examens.desc")}</p>
      {examens.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-background-300 bg-background-100 px-6 py-10 text-center text-sm text-foreground-600">
          {t("etudiant.examens.empty")}
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {examens.map((examen) => {
            const tone = TYPE_TONE[examen.type] ?? TYPE_TONE["Examen de semestre"];
            const rappel = Boolean(rappels[examen.id]);
            return (
              <article
                key={examen.id}
                className="hover-lift flex flex-col gap-4 rounded-lg border border-background-200 bg-background-100/60 p-4 md:flex-row md:items-center"
              >
                <div className="flex w-full shrink-0 items-center gap-3 md:w-48 md:flex-col md:items-start">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-background-50">
                    <i className="ri-file-list-2-line text-xl text-primary-600"></i>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground-950">{examen.date}</p>
                    <p className="text-[11px] text-foreground-500">{examen.jour}</p>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-foreground-950">{examen.matiere}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${tone}`}>
                      {examen.type}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-foreground-600">
                    <span className="inline-flex items-center gap-1.5">
                      <i className="ri-time-line text-secondary-500"></i>
                      {examen.heure} · {t("etudiant.examens.duree")} {examen.duree}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <i className="ri-map-pin-2-line text-secondary-500"></i>
                      {examen.salle}, {examen.batiment}
                    </span>
                  </div>
                  <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-foreground-600">
                    <i className="ri-information-line mt-0.5 text-accent-700"></i>
                    <span>
                      <strong className="font-semibold text-foreground-800">{t("etudiant.examens.consignes")} : </strong>
                      {examen.consignes}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRappels((prev) => ({ ...prev, [examen.id]: !prev[examen.id] }))}
                  aria-pressed={rappel}
                  className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    rappel
                      ? "bg-primary-100 text-primary-800"
                      : "border border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700"
                  }`}
                >
                  <i className={rappel ? "ri-notification-3-fill" : "ri-notification-3-line"}></i>
                  {rappel ? t("etudiant.examens.rappelActif") : t("etudiant.examens.rappeler")}
                </button>
              </article>
            );
          })}
        </div>
      )}
      <p className="mt-5 flex items-start gap-2 rounded-md bg-accent-50 px-3.5 py-3 text-[11px] leading-relaxed text-foreground-700">
        <i className="ri-shield-star-line mt-0.5 text-sm text-accent-700"></i>
        {t("etudiant.examens.info")}
      </p>
    </section>
  );
}
