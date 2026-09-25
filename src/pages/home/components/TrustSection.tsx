import { useTranslation } from "react-i18next";
const PROVENANCES = [
  { statut: "Vérifiée", desc: "Donnée confirmée par un service officiel autorisé.", icon: "ri-shield-check-line" },
  { statut: "Importée", desc: "Fichier validé par un établissement, conservé dans un journal.", icon: "ri-download-cloud-line" },
  { statut: "En attente", desc: "Information déclarée, en cours de confirmation.", icon: "ri-time-line" },
  { statut: "Démonstration", desc: "Donnée simulée pour le prototype, à remplacer.", icon: "ri-flask-line" },
];
export default function TrustSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-background-100 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-700">
              {t("common.demo")}
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground-950 md:text-3xl">
              {t("home.trust.title")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground-600 md:text-base">
              {t("home.trust.desc")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-primary-100 px-3 py-2 text-xs font-medium text-primary-800">
                <i className="ri-lock-2-line"></i>
                NPI utilisé pour l'identification uniquement
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-secondary-100 px-3 py-2 text-xs font-medium text-secondary-800">
                <i className="ri-eye-off-line"></i>
                Aucune donnée individuelle publique
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PROVENANCES.map((item) => (
              <div
                key={item.statut}
                className="rounded-lg border border-background-200 bg-background-50 p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-background-200">
                  <i className={`${item.icon} text-lg text-foreground-800`}></i>
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground-950">{item.statut}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
