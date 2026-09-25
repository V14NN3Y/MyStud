import { useState } from "react";
import { useTranslation } from "react-i18next";
import { profilProfessionnel } from "@/mocks/emplois";
interface ProfilProProps {
  nomComplet?: string;
}
export default function ProfilPro({ nomComplet }: ProfilProProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(profilProfessionnel.visibiliteActive);
  const [portees, setPortees] = useState(profilProfessionnel.portees);
  const [cvMessage, setCvMessage] = useState(false);
  const togglePortee = (id: string) => {
    setPortees((prev) => prev.map((p) => (p.id === id ? { ...p, actif: !p.actif } : p)));
  };
  const nom = nomComplet || "Hermine Agbodjan";
  return (
    <article className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <i className="ri-user-star-line text-xl text-primary-700"></i>
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-base font-bold text-foreground-950">{nom}</h2>
            <p className="text-xs text-foreground-600">{profilProfessionnel.formation}</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            visible ? "bg-primary-100 text-primary-800" : "bg-background-200 text-foreground-600"
          }`}
        >
          <i className={visible ? "ri-eye-line" : "ri-eye-off-line"}></i>
          {visible ? t("emplois.profil.visible") : t("emplois.profil.hidden")}
        </span>
      </div>
      <p className="mt-3 text-sm font-medium text-foreground-900">{profilProfessionnel.titre}</p>
      <p className="mt-2 text-xs leading-relaxed text-foreground-600">{profilProfessionnel.resume}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-1 text-[11px] font-semibold text-accent-900">
          <i className={profilProfessionnel.disponible ? "ri-checkbox-circle-line" : "ri-close-circle-line"}></i>
          {profilProfessionnel.disponible ? t("emplois.profil.disponible") : t("emplois.profil.indisponible")}
        </span>
      </div>
      {/* Consentement de visibilité */}
      <div className="mt-5 rounded-md border border-background-200 bg-background-100 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground-950">
              {visible ? t("emplois.profil.visibleNote") : t("emplois.profil.hiddenNote")}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={visible}
            onClick={() => setVisible((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              visible ? "bg-primary-500" : "bg-background-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-background-50 transition-transform ${
                visible ? "translate-x-5" : "translate-x-0.5"
              }`}
            ></span>
          </button>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-wide text-foreground-500">{t("emplois.profil.portees")}</p>
        <p className="mt-1 text-xs text-foreground-600">{t("emplois.profil.porteesDesc")}</p>
        <ul className="mt-3 space-y-2">
          {portees.map((portee) => {
            const actif = portee.actif && visible;
            return (
              <li key={portee.id}>
                <button
                  type="button"
                  onClick={() => visible && togglePortee(portee.id)}
                  disabled={!visible}
                  className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors ${
                    !visible
                      ? "cursor-not-allowed border-background-200 bg-background-50 opacity-60"
                      : "cursor-pointer border-background-200 bg-background-50 hover:border-primary-300"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      actif ? "border-primary-500 bg-primary-500" : "border-background-300 bg-background-50"
                    }`}
                  >
                    {actif && <i className="ri-check-line text-xs text-background-50"></i>}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground-900">{portee.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${actif ? "bg-primary-100 text-primary-800" : "bg-background-200 text-foreground-600"}`}>
                        {actif ? t("emplois.profil.actif") : t("emplois.profil.inactif")}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-foreground-600">{portee.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-foreground-500">
          <i className="ri-lock-2-line mt-0.5 text-sm text-secondary-500"></i>
          {t("emplois.profil.consentNote")}
        </p>
      </div>
      {/* Compétences et langues */}
      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("emplois.profil.competences")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {profilProfessionnel.competences.map((c) => (
            <span key={c} className="rounded-full border border-background-200 bg-background-100 px-2.5 py-1 text-[11px] font-medium text-foreground-700">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("emplois.profil.langues")}</p>
        <ul className="mt-2 space-y-1.5">
          {profilProfessionnel.langues.map((l) => (
            <li key={l} className="flex items-center gap-2 text-xs text-foreground-700">
              <i className="ri-global-line text-secondary-500"></i>
              {l}
            </li>
          ))}
        </ul>
      </div>
      {/* Expériences */}
      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-wide text-foreground-500">{t("emplois.profil.experiences")}</p>
        <ol className="mt-3 space-y-4 border-l border-background-200 pl-4">
          {profilProfessionnel.experiences.map((exp) => (
            <li key={exp.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary-500"></span>
              <p className="text-sm font-semibold text-foreground-950">{exp.poste}</p>
              <p className="text-xs text-foreground-600">
                {exp.structure} · {exp.periode}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-foreground-600">{exp.description}</p>
            </li>
          ))}
        </ol>
      </div>
      {/* CV */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-background-200 bg-background-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-background-50">
            <i className="ri-file-pdf-2-line text-lg text-secondary-600"></i>
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground-950">{profilProfessionnel.cvNom}</p>
            <p className="text-[11px] text-foreground-500">
              {t("emplois.profil.cvMaj")} {profilProfessionnel.cvMajLe}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setCvMessage(true);
            window.setTimeout(() => setCvMessage(false), 2200);
          }}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-3 py-2 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
        >
          <i className="ri-download-2-line text-sm"></i>
          {t("emplois.profil.telecharger")}
        </button>
      </div>
      {cvMessage && (
        <p className="mt-3 flex items-center gap-2 rounded-md bg-primary-100 px-3 py-2 text-xs font-medium text-primary-800 animate-fade-in">
          <i className="ri-check-line"></i>
          {t("emplois.profil.cvPret")}
        </p>
      )}
      <div className="mt-4 flex items-start gap-2 rounded-md bg-secondary-50 p-3 text-[11px] leading-relaxed text-foreground-700">
        <i className="ri-chat-1-line mt-0.5 text-sm text-secondary-500"></i>
        <span>
          <strong className="font-semibold text-foreground-900">{t("emplois.messagerie.title")}</strong> {t("emplois.messagerie.desc")}
        </span>
      </div>
    </article>
  );
}
