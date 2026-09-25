import { useState } from "react";
import { useTranslation } from "react-i18next";
import { documentsAdministratifs } from "@/mocks/etudiant";
const STATUT_STYLE: Record<string, { classes: string; icon: string; labelKey: string }> = {
  Disponible: { classes: "bg-primary-100 text-primary-800 border-primary-200", icon: "ri-checkbox-circle-line", labelKey: "etudiant.docs.disponible" },
  "En traitement": { classes: "bg-accent-100 text-accent-900 border-accent-300", icon: "ri-loader-4-line", labelKey: "etudiant.docs.enTraitement" },
  "À demander": { classes: "bg-background-200 text-foreground-700 border-background-300", icon: "ri-add-circle-line", labelKey: "etudiant.docs.aDemander" },
};
export default function DocumentsList() {
  const { t } = useTranslation();
  const [demandes, setDemandes] = useState<Record<string, boolean>>({});
  const [telecharges, setTelecharges] = useState<Record<string, boolean>>({});
  return (
    <section className="rounded-lg border border-background-200 bg-background-50 p-5 animate-fade-up md:p-6">
      <h2 className="font-heading text-base font-bold text-foreground-950">{t("etudiant.docs.title")}</h2>
      <p className="mt-1 text-xs text-foreground-600">{t("etudiant.docs.desc")}</p>
      {documentsAdministratifs.length === 0 ? (
        <p className="mt-6 rounded-md border border-dashed border-background-300 bg-background-100 px-6 py-10 text-center text-sm text-foreground-600">
          {t("etudiant.docs.aucun")}
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {documentsAdministratifs.map((doc) => {
            const style = STATUT_STYLE[doc.statut] ?? STATUT_STYLE["À demander"];
            const demande = Boolean(demandes[doc.id]);
            const telecharge = Boolean(telecharges[doc.id]);
            const disponible = doc.statut === "Disponible";
            return (
              <article
                key={doc.id}
                className="hover-lift flex flex-col rounded-lg border border-background-200 bg-background-100/50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-background-50">
                      <i className="ri-file-text-line text-lg text-primary-600"></i>
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold leading-snug text-foreground-950">{doc.nom}</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-foreground-600">{doc.description}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${style.classes}`}>
                    <i className={`${style.icon} mr-1`}></i>
                    {t(style.labelKey)}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-background-200 pt-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-[11px] text-foreground-500">{t("etudiant.docs.delai")}</dt>
                    <dd className="text-[11px] font-semibold text-foreground-800">{doc.delai}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-[11px] text-foreground-500">{t("etudiant.docs.reference")}</dt>
                    <dd className="text-[11px] font-semibold text-foreground-800">{doc.reference}</dd>
                  </div>
                </dl>
                <div className="mt-auto pt-4">
                  {disponible ? (
                    <button
                      type="button"
                      onClick={() => setTelecharges((prev) => ({ ...prev, [doc.id]: true }))}
                      className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-xs font-semibold transition-colors ${
                        telecharge
                          ? "bg-primary-100 text-primary-800"
                          : "bg-primary-500 text-background-50 hover:bg-primary-600"
                      }`}
                    >
                      <i className={telecharge ? "ri-checkbox-circle-line" : "ri-download-2-line"}></i>
                      {telecharge ? t("etudiant.docs.pret") : t("etudiant.docs.telecharger")}
                    </button>
                  ) : demande ? (
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary-100 px-4 py-2.5 text-xs font-semibold text-secondary-900">
                      <i className="ri-checkbox-circle-line"></i>
                      {t("etudiant.docs.demandeEnvoyee")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDemandes((prev) => ({ ...prev, [doc.id]: true }))}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
                    >
                      <i className="ri-send-plane-line"></i>
                      {t("etudiant.docs.demander")}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="mt-5 flex items-start gap-2 rounded-md border border-secondary-200 bg-secondary-50 px-3.5 py-3 text-[11px] leading-relaxed text-foreground-700">
        <i className="ri-qr-code-line mt-0.5 text-sm text-secondary-700"></i>
        {t("etudiant.docs.verif")}
      </p>
    </section>
  );
}
