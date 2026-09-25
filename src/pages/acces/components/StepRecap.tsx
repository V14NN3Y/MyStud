import { useTranslation } from "react-i18next";
import type { ProfilDemo } from "@/hooks/useDemoSession";
interface StepRecapProps {
  profil: ProfilDemo;
  onConfirm: () => void;
  onRetour: () => void;
}
export default function StepRecap({ profil, onConfirm, onRetour }: StepRecapProps) {
  const { t } = useTranslation();
  const lignes = [
    { label: t("acces.npi"), value: profil.npi, icon: "ri-fingerprint-line" },
    { label: t("espace.matricule"), value: profil.matricule, icon: "ri-id-card-line" },
    { label: "Nom et prénoms", value: `${profil.prenom} ${profil.nom}`, icon: "ri-user-line" },
    { label: t("espace.naissance"), value: `${profil.dateNaissance} · ${profil.lieuNaissance}`, icon: "ri-calendar-line" },
    { label: t("acces.telephone"), value: `+229 ${profil.telephone}`, icon: "ri-smartphone-line" },
    { label: t("acces.email"), value: profil.email, icon: "ri-mail-line" },
  ];
  return (
    <div className="animate-fade-up space-y-5">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
          {t("acces.step")} 4 · {t("acces.step4.title")}
        </span>
        <h2 className="mt-3 font-heading text-xl font-bold text-foreground-950">{t("acces.step4.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-600">{t("acces.step4.desc")}</p>
      </header>
      <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 animate-pulse-ring">
          <i className="ri-shield-check-line text-xl text-background-50"></i>
        </span>
        <div>
          <p className="text-sm font-semibold text-primary-900">{t("espace.dossierOk")}</p>
          <p className="text-xs text-foreground-600">{t("acces.resultatBac")}</p>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {lignes.map((ligne) => (
          <div key={ligne.label} className="rounded-lg border border-background-200 bg-background-100 p-3">
            <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-foreground-500">
              <i className={ligne.icon}></i>
              {ligne.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-foreground-950">{ligne.value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("acces.serie")}</p>
          <p className="mt-1 text-sm font-semibold text-secondary-900">Série {profil.bac.serie} · {profil.bac.annee}</p>
        </div>
        <div className="rounded-lg border border-accent-200 bg-accent-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("acces.mention")}</p>
          <p className="mt-1 text-sm font-semibold text-accent-900">{profil.bac.mention}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("acces.numeroTable")}</p>
          <p className="mt-1 text-sm font-semibold text-foreground-950">{profil.bac.numeroTable}</p>
        </div>
      </div>
      <p className="flex items-start gap-2 rounded-md border border-accent-200 bg-accent-50 p-3 text-xs leading-relaxed text-accent-900">
        <i className="ri-hand-coin-line mt-0.5 text-base"></i>
        {profil.bac.priseEnCharge}
      </p>
      <label className="flex cursor-pointer items-start gap-3 rounded-md bg-background-100 p-3">
        <input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 cursor-pointer accent-primary-500" />
        <span className="text-[11px] leading-relaxed text-foreground-700">
          J'autorise MyStud à transmettre ces informations aux établissements choisis pour l'instruction de mes candidatures.
        </span>
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onRetour}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-5 py-3.5 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300"
        >
          <i className="ri-arrow-left-line text-base"></i>
          {t("acces.retour")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
        >
          <i className="ri-user-shared-line text-base"></i>
          {t("acces.goEspace")}
        </button>
      </div>
    </div>
  );
}
