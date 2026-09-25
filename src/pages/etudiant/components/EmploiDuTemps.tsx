import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { emploiDuTemps, joursSemaine, creneauxJour } from "@/mocks/etudiant";
type Seance = (typeof emploiDuTemps)[number];
type Vue = "grille" | "liste";
const TYPE_TONE: Record<string, string> = {
  Cours: "bg-primary-100 text-primary-800",
  TD: "bg-secondary-100 text-secondary-900",
  TP: "bg-accent-100 text-accent-900",
  Atelier: "bg-background-200 text-foreground-700",
};
export default function EmploiDuTemps() {
  const { t } = useTranslation();
  const [matiere, setMatiere] = useState("");
  const [enseignant, setEnseignant] = useState("");
  const [salle, setSalle] = useState("");
  const [vue, setVue] = useState<Vue>("grille");
  const options = useMemo(
    () => ({
      matieres: Array.from(new Set(emploiDuTemps.map((s) => s.matiere))),
      enseignants: Array.from(new Set(emploiDuTemps.map((s) => s.enseignant))),
      salles: Array.from(new Set(emploiDuTemps.map((s) => s.salle))),
    }),
    []
  );
  const filtres = emploiDuTemps.filter(
    (s) =>
      (!matiere || s.matiere === matiere) &&
      (!enseignant || s.enseignant === enseignant) &&
      (!salle || s.salle === salle)
  );
  const actif = matiere || enseignant || salle;
  const reset = () => {
    setMatiere("");
    setEnseignant("");
    setSalle("");
  };
  const renderCarte = (seance: Seance) => {
    const annule = "annule" in seance ? Boolean(seance.annule) : false;
    const alerte = "alerte" in seance ? seance.alerte : undefined;
    return (
      <div
        className={`flex h-full flex-col rounded-md border p-2.5 ${
          annule
            ? "border-background-300 bg-background-100 opacity-70"
            : "border-background-200 bg-background-50"
        }`}
      >
        <div className="flex items-center justify-between gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_TONE[seance.type] ?? TYPE_TONE.Cours}`}>
            {seance.type}
          </span>
          {annule && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-secondary-700">
              <i className="ri-close-circle-line"></i>
              {t("etudiant.edt.annule")}
            </span>
          )}
        </div>
        <p className={`mt-1.5 text-xs font-semibold leading-snug text-foreground-950 ${annule ? "line-through" : ""}`}>
          {seance.matiere}
        </p>
        <p className="mt-1 text-[11px] text-foreground-600">{seance.enseignant}</p>
        <p className="mt-auto pt-1.5 text-[11px] text-foreground-500">
          <i className="ri-map-pin-2-line mr-1"></i>
          {seance.salle}
        </p>
        {alerte && (
          <p className="mt-1.5 inline-flex items-start gap-1 rounded bg-accent-100 px-1.5 py-1 text-[10px] font-medium leading-snug text-accent-900">
            <i className="ri-error-warning-line mt-0.5"></i>
            {alerte}
          </p>
        )}
      </div>
    );
  };
  return (
    <section className="rounded-lg border border-background-200 bg-background-50 p-5 animate-fade-up md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-heading text-base font-bold text-foreground-950">{t("etudiant.edt.title")}</h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-foreground-600">
            <i className="ri-calendar-line text-secondary-500"></i>
            {t("etudiant.edt.week")}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-background-100 p-1">
          {(["grille", "liste"] as Vue[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVue(v)}
              className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                vue === v ? "bg-primary-500 text-background-50" : "text-foreground-600 hover:text-foreground-900"
              }`}
            >
              <i className={v === "grille" ? "ri-grid-line" : "ri-list-check-2"}></i>
              {t(v === "grille" ? "etudiant.edt.viewGrid" : "etudiant.edt.viewList")}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-foreground-600">{t("etudiant.edt.matiere")}</span>
          <select
            value={matiere}
            onChange={(e) => setMatiere(e.target.value)}
            className="cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-950 outline-none focus:border-primary-400"
          >
            <option value="">{t("etudiant.edt.all")}</option>
            {options.matieres.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-foreground-600">{t("etudiant.edt.enseignant")}</span>
          <select
            value={enseignant}
            onChange={(e) => setEnseignant(e.target.value)}
            className="cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-950 outline-none focus:border-primary-400"
          >
            <option value="">{t("etudiant.edt.all")}</option>
            {options.enseignants.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-foreground-600">{t("etudiant.edt.salle")}</span>
          <select
            value={salle}
            onChange={(e) => setSalle(e.target.value)}
            className="cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-950 outline-none focus:border-primary-400"
          >
            <option value="">{t("etudiant.edt.all")}</option>
            {options.salles.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="button"
            onClick={reset}
            disabled={!actif}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i className="ri-refresh-line"></i>
            {t("etudiant.edt.reset")}
          </button>
        </div>
      </div>
      {filtres.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-md border border-dashed border-background-300 bg-background-100 px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background-200">
            <i className="ri-calendar-close-line text-xl text-foreground-600"></i>
          </span>
          <p className="mt-3 text-sm text-foreground-600">{t("etudiant.edt.empty")}</p>
        </div>
      ) : vue === "grille" ? (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="w-24 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                  {t("etudiant.edt.creneau")}
                </th>
                {joursSemaine.map((jour) => (
                  <th key={jour} className="rounded-md bg-background-100 px-3 py-2 text-xs font-semibold text-foreground-700">
                    {jour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creneauxJour.map((creneau) => (
                <tr key={creneau}>
                  <th scope="row" className="rounded-md bg-background-100 px-2 py-2 align-middle text-[11px] font-semibold text-foreground-600">
                    {creneau}
                  </th>
                  {joursSemaine.map((jour) => {
                    const seance = filtres.find((s) => s.jour === jour && s.creneau === creneau);
                    return (
                      <td key={jour} className="w-[15%] align-top">
                        {seance ? (
                          renderCarte(seance)
                        ) : (
                          <div className="h-full min-h-[104px] rounded-md border border-dashed border-background-200"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {joursSemaine.map((jour) => {
            const seancesJour = filtres.filter((s) => s.jour === jour);
            if (seancesJour.length === 0) return null;
            return (
              <div key={jour}>
                <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
                  <i className="ri-calendar-line text-secondary-500"></i>
                  {jour}
                </h3>
                <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {seancesJour.map((seance) => (
                    <div key={seance.id}>
                      <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground-600">
                        <i className="ri-time-line text-secondary-500"></i>
                        {seance.creneau}
                      </p>
                      <div className="min-h-[112px]">{renderCarte(seance)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-5 flex items-start gap-2 rounded-md bg-accent-50 px-3.5 py-3 text-[11px] leading-relaxed text-foreground-700">
        <i className="ri-notification-3-line mt-0.5 text-sm text-accent-700"></i>
        {t("etudiant.edt.legende")}
      </p>
    </section>
  );
}
