import { useTranslation } from "react-i18next";
import type { ProfilDemo } from "@/hooks/useDemoSession";
interface ProfilCardProps {
  profil: ProfilDemo;
  onLogout: () => void;
}
export default function ProfilCard({ profil, onLogout }: ProfilCardProps) {
  const { t } = useTranslation();
  const initiales = `${profil.prenom.charAt(0)}${profil.nom.charAt(0)}`.toUpperCase();
  const lignes = [
    { label: t("espace.matricule"), value: profil.matricule, icon: "ri-id-card-line" },
    { label: t("espace.npi"), value: profil.npi, icon: "ri-fingerprint-line" },
    { label: t("espace.naissance"), value: `${profil.dateNaissance} · ${profil.lieuNaissance}`, icon: "ri-cake-2-line" },
    { label: t("acces.telephone"), value: profil.telephone, icon: "ri-smartphone-line" },
    { label: t("acces.email"), value: profil.email, icon: "ri-mail-line" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-background-200 bg-background-50 p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-500">
            <span className="font-heading text-lg font-bold text-background-50">{initiales}</span>
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-bold text-foreground-950">
              {profil.prenom} {profil.nom}
            </p>
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-100 px-2.5 py-1 text-[11px] font-semibold text-primary-800">
              <i className="ri-shield-check-line text-[13px]"></i>
              {t("espace.dossierOk")}
            </span>
          </div>
        </div>
        <dl className="mt-5 space-y-3 border-t border-background-200 pt-4">
          {lignes.map((ligne) => (
            <div key={ligne.label} className="flex items-start justify-between gap-3">
              <dt className="inline-flex items-center gap-2 text-xs text-foreground-600">
                <i className={`${ligne.icon} text-[13px] text-secondary-500`}></i>
                {ligne.label}
              </dt>
              <dd className="text-right text-xs font-semibold text-foreground-950">{ligne.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-lg border border-background-200 bg-background-100 p-5">
        <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
          <i className="ri-award-line text-base text-primary-600"></i>
          {t("espace.bac")}
        </h3>
        <dl className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-xs text-foreground-600">{t("acces.serie")}</dt>
            <dd className="text-xs font-semibold text-foreground-950">{profil.bac.serie}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-xs text-foreground-600">{t("acces.annee")}</dt>
            <dd className="text-xs font-semibold text-foreground-950">{profil.bac.annee}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-xs text-foreground-600">{t("espace.mention")}</dt>
            <dd className="text-xs font-semibold text-foreground-950">{profil.bac.mention}</dd>
          </div>
          <div className="rounded-md bg-accent-50 p-3">
            <dt className="text-[11px] uppercase tracking-wide text-accent-800">
              {t("espace.priseEnCharge")}
            </dt>
            <dd className="mt-1 text-xs font-semibold text-foreground-950">{profil.bac.priseEnCharge}</dd>
          </div>
        </dl>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-foreground-600">
          <i className="ri-verified-badge-line text-secondary-500"></i>
          {profil.bac.statut}
        </p>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:border-secondary-300 hover:text-secondary-700"
      >
        <i className="ri-logout-box-r-line text-base"></i>
        {t("espace.logout")}
      </button>
    </div>
  );
}
