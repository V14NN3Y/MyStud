import { useState } from "react";
import { useTranslation } from "react-i18next";
import { situationEtudiante, unitesEnseignement } from "@/mocks/etudiant";
const STATUT_STYLE: Record<string, { classes: string; icon: string; labelKey: string }> = {
  "Validée": { classes: "bg-primary-100 text-primary-800 border-primary-200", icon: "ri-checkbox-circle-line", labelKey: "etudiant.notes.validee" },
  "Non validée": { classes: "bg-secondary-100 text-secondary-900 border-secondary-200", icon: "ri-close-circle-line", labelKey: "etudiant.notes.nonValidee" },
  "En attente": { classes: "bg-accent-100 text-accent-900 border-accent-300", icon: "ri-time-line", labelKey: "etudiant.notes.enAttente" },
};
const dateDuJour = () =>
  new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
export default function NotesProgression() {
  const { t } = useTranslation();
  const [openUe, setOpenUe] = useState<string | null>(null);
  const [motif, setMotif] = useState("");
  const [demandes, setDemandes] = useState<Record<string, string>>({});
  const creditsValides = unitesEnseignement
    .filter((ue) => ue.statut === "Validée")
    .reduce((sum, ue) => sum + ue.credits, 0);
  const creditsTotal = unitesEnseignement.reduce((sum, ue) => sum + ue.credits, 0);
  const pourcentage = Math.round((creditsValides / creditsTotal) * 100);
  const envoyer = (ueId: string) => {
    setDemandes((prev) => ({ ...prev, [ueId]: dateDuJour() }));
    setOpenUe(null);
    setMotif("");
  };
  return (
    <section className="rounded-lg border border-background-200 bg-background-50 p-5 animate-fade-up md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-heading text-base font-bold text-foreground-950">{t("etudiant.notes.title")}</h2>
          <p className="mt-1 text-xs text-foreground-600">{t("etudiant.notes.desc")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-md bg-background-100 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("etudiant.notes.semestreCredits")}</p>
            <p className="mt-1 font-heading text-base font-bold text-foreground-950">
              {creditsValides} / {creditsTotal}
              <span className="ml-1.5 text-xs font-medium text-foreground-500">({pourcentage}%)</span>
            </p>
          </div>
          <div className="rounded-md bg-primary-100 px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-primary-800">{t("etudiant.notes.moyenneGenerale")}</p>
            <p className="mt-1 font-heading text-base font-bold text-foreground-950">
              {situationEtudiante.moyenneGenerale.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} / 20
            </p>
          </div>
        </div>
      </div>
      {unitesEnseignement.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-background-300 bg-background-100 px-6 py-10 text-center text-sm text-foreground-600">
          {t("etudiant.notes.aucune")}
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-y-1.5">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-3 pb-1 font-semibold">{t("etudiant.notes.ueCode")}</th>
                <th className="px-3 pb-1 font-semibold">{t("etudiant.notes.ueName")}</th>
                <th className="px-3 pb-1 text-center font-semibold">{t("etudiant.notes.credits")}</th>
                <th className="px-3 pb-1 text-center font-semibold">{t("etudiant.notes.note")}</th>
                <th className="px-3 pb-1 font-semibold">{t("etudiant.notes.statut")}</th>
                <th className="px-3 pb-1 text-right font-semibold">{t("etudiant.notes.contester")}</th>
              </tr>
            </thead>
            <tbody>
              {unitesEnseignement.map((ue) => {
                const style = STATUT_STYLE[ue.statut] ?? STATUT_STYLE["En attente"];
                const demande = demandes[ue.id];
                return (
                  <tr key={ue.id} className="bg-background-100 text-sm">
                    <td className="rounded-l-md px-3 py-3 text-xs font-semibold text-foreground-600">{ue.code}</td>
                    <td className="px-3 py-3 font-medium text-foreground-950">{ue.nom}</td>
                    <td className="px-3 py-3 text-center text-foreground-700">{ue.credits}</td>
                    <td className="px-3 py-3 text-center font-semibold text-foreground-950">
                      {ue.moyenne === null ? (
                        <span className="text-xs font-medium text-foreground-500">—</span>
                      ) : (
                        ue.moyenne.toLocaleString("fr-FR", { minimumFractionDigits: 1 })
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${style.classes}`}>
                        <i className={`${style.icon} text-[13px]`}></i>
                        {t(style.labelKey)}
                      </span>
                    </td>
                    <td className="rounded-r-md px-3 py-3 text-right">
                      {ue.moyenne === null ? (
                        <span className="text-[11px] text-foreground-500">{t("etudiant.notes.enAttenteHint")}</span>
                      ) : demande ? (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-secondary-700">
                          <i className="ri-checkbox-circle-line text-[13px]"></i>
                          {demande}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenUe(openUe === ue.id ? null : ue.id);
                            setMotif("");
                          }}
                          className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-2.5 py-1.5 text-[11px] font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                        >
                          <i className="ri-question-line text-[13px]"></i>
                          {t("etudiant.notes.contester")}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {openUe && (
        <div className="mt-4 animate-fade-in rounded-md border border-secondary-200 bg-secondary-50 p-4">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-secondary-900">
            <i className="ri-question-answer-line"></i>
            {t("etudiant.notes.contester")} — {unitesEnseignement.find((u) => u.id === openUe)?.nom}
          </p>
          <label className="mt-3 block">
            <span className="text-[11px] font-semibold text-foreground-600">{t("etudiant.notes.motif")}</span>
            <textarea
              value={motif}
              maxLength={500}
              onChange={(e) => setMotif(e.target.value)}
              rows={3}
              placeholder={t("etudiant.notes.motifPlaceholder")}
              className="mt-1 w-full resize-none rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-950 outline-none focus:border-primary-400 placeholder:text-foreground-500"
            ></textarea>
          </label>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-foreground-500">{motif.length} / 500</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpenUe(null);
                  setMotif("");
                }}
                className="cursor-pointer whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3.5 py-2 text-xs font-semibold text-foreground-600 transition-colors hover:text-foreground-900"
              >
                {t("etudiant.notes.annuler")}
              </button>
              <button
                type="button"
                disabled={motif.trim().length < 5}
                onClick={() => envoyer(openUe)}
                className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md bg-secondary-500 px-4 py-2 text-xs font-semibold text-background-50 transition-colors hover:bg-secondary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="ri-send-plane-line"></i>
                {t("etudiant.notes.envoyer")}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 text-[11px] text-foreground-600">
          <i className="ri-shield-check-line text-secondary-500"></i>
          {t("etudiant.notes.rappel")}
        </p>
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-secondary-700">
          <i className="ri-time-line"></i>
          {t("etudiant.notes.demandeStatut")}
        </p>
      </div>
    </section>
  );
}
