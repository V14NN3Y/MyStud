import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  effectifsDomaines,
  effectifsEtablissements,
  zonesMinistere,
} from "@/mocks/ministere";
import { modesCiblage, offresCiblees, typesOffreCiblee } from "@/mocks/offreCiblee";
interface OffrePubliee {
  id: string;
  type: string;
  titre: string;
  mode: string;
  cible: string;
  portee: number;
  statut: string;
  majLe: string;
}
interface CibleOption {
  id: string;
  nom: string;
  effectif: number;
}
const TYPE_STYLES: Record<string, string> = {
  Bourse: "bg-primary-100 text-primary-800",
  Aide: "bg-secondary-100 text-secondary-900",
  Annonce: "bg-accent-100 text-accent-900",
};
const dateAujourdhui = () =>
  new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
const nf = (n: number) => n.toLocaleString("fr-FR");
export default function OffreCibleePanel() {
  const { t } = useTranslation();
  const [typeId, setTypeId] = useState("bourse");
  const [modeId, setModeId] = useState("filiere");
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [cibleId, setCibleId] = useState(effectifsDomaines[0].domaine);
  const [publiees, setPubliees] = useState<OffrePubliee[]>(offresCiblees as OffrePubliee[]);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const options = useMemo<CibleOption[]>(() => {
    if (modeId === "zone") {
      return zonesMinistere.map((z) => ({
        id: z,
        nom: t("offre.cible.zoneNom", { zone: z }),
        effectif: effectifsEtablissements.filter((e) => e.zone === z).reduce((s, e) => s + e.effectif, 0),
      }));
    }
    if (modeId === "etablissement") {
      return effectifsEtablissements.map((e) => ({
        id: e.id,
        nom: `${e.sigle} — ${e.nom}`,
        effectif: e.effectif,
      }));
    }
    return effectifsDomaines.map((d) => ({ id: d.domaine, nom: d.domaine, effectif: d.effectif }));
  }, [modeId, t]);
  const cibleActive = options.find((o) => o.id === cibleId) ?? options[0];
  const portee = cibleActive?.effectif ?? 0;
  const typeActive = typesOffreCiblee.find((tp) => tp.id === typeId) ?? typesOffreCiblee[0];
  const changerMode = (next: string) => {
    setModeId(next);
    setErreur("");
    if (next === "zone") setCibleId(zonesMinistere[0]);
    else if (next === "etablissement") setCibleId(effectifsEtablissements[0].id);
    else setCibleId(effectifsDomaines[0].domaine);
  };
  const publier = () => {
    if (!titre.trim() || !message.trim() || !cibleActive) {
      setErreur(t("offre.error"));
      return;
    }
    const modeLabel = t(`offre.mode.${modeId}`);
    const nouvelle: OffrePubliee = {
      id: `oc-${Date.now()}`,
      type: typeActive.nom,
      titre: titre.trim(),
      mode: modeLabel,
      cible: cibleActive.nom,
      portee,
      statut: t("offre.list.statut.publiee"),
      majLe: dateAujourdhui(),
    };
    setPubliees((prev) => [nouvelle, ...prev]);
    setTitre("");
    setMessage("");
    setErreur("");
    setSucces(true);
    window.setTimeout(() => setSucces(false), 2800);
  };
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-100">
          <i className="ri-focus-3-line text-lg text-primary-700"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">{t("offre.title")}</h2>
          <p className="mt-1 max-w-3xl text-sm text-foreground-600">{t("offre.subtitle")}</p>
        </div>
      </div>
      <p className="mt-4 flex items-start gap-2 rounded-md border border-accent-200 bg-accent-50 p-3 text-xs leading-relaxed text-foreground-700">
        <i className="ri-information-line mt-0.5 text-base text-accent-700"></i>
        {t("offre.notice")}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Formulaire */}
        <div className="space-y-5 lg:col-span-3">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-foreground-500">
              {t("offre.type.label")}
            </span>
            <div className="flex flex-wrap gap-2">
              {typesOffreCiblee.map((tp) => {
                const actif = typeId === tp.id;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => setTypeId(tp.id)}
                    aria-pressed={actif}
                    className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                      actif
                        ? "border-primary-400 bg-primary-50 text-primary-800"
                        : "border-background-300 bg-background-50 text-foreground-700 hover:border-primary-200"
                    }`}
                  >
                    <i className={`${tp.icon} text-sm`}></i>
                    {tp.nom}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-500">
              {t("offre.titre.label")}
            </span>
            <input
              type="text"
              value={titre}
              maxLength={120}
              onChange={(e) => {
                setTitre(e.target.value);
                setErreur("");
              }}
              placeholder={t("offre.titre.placeholder")}
              className="w-full rounded-md border border-background-300 bg-background-50 px-3.5 py-2.5 text-sm text-foreground-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-500">
              {t("offre.message.label")}
            </span>
            <textarea
              value={message}
              maxLength={500}
              rows={4}
              onChange={(e) => {
                setMessage(e.target.value.slice(0, 500));
                setErreur("");
              }}
              placeholder={t("offre.message.placeholder")}
              className="w-full resize-none rounded-md border border-background-300 bg-background-50 px-3.5 py-2.5 text-sm leading-relaxed text-foreground-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
            ></textarea>
            <span className="mt-1 block text-right text-[11px] text-foreground-500">{message.length}/500</span>
          </label>
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-500">
              {t("offre.cible.label")}
            </span>
            <p className="mb-2 text-xs text-foreground-600">{t("offre.cible.desc")}</p>
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-background-100 p-1">
              {modesCiblage.map((mode) => {
                const actif = modeId === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => changerMode(mode.id)}
                    aria-pressed={actif}
                    className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                      actif
                        ? "bg-primary-500 text-background-50"
                        : "text-foreground-600 hover:bg-background-50 hover:text-foreground-950"
                    }`}
                  >
                    <i className={`${mode.icon} text-sm`}></i>
                    {t(`offre.mode.${mode.id}`)}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 max-h-56 space-y-1.5 overflow-y-auto rounded-md border border-background-200 bg-background-100/50 p-2">
              {options.map((option) => {
                const actif = cibleActive?.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setCibleId(option.id);
                      setErreur("");
                    }}
                    aria-pressed={actif}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
                      actif
                        ? "border-primary-400 bg-background-50 text-foreground-950"
                        : "border-transparent bg-background-50/60 text-foreground-700 hover:border-primary-200"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          actif ? "border-primary-500 bg-primary-500" : "border-background-300"
                        }`}
                      >
                      {actif && <i className="ri-check-line text-[10px] text-background-50"></i>}
                      </span>
                      <span className="truncate text-sm font-medium">{option.nom}</span>
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-foreground-500">
                      {nf(option.effectif)} {t("offre.list.etudiants")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {erreur && (
            <p className="flex items-center gap-2 text-xs font-medium text-accent-900">
              <i className="ri-error-warning-line"></i>
              {erreur}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={publier}
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
            >
              <i className="ri-send-plane-line text-base"></i>
              {t("offre.publish")}
            </button>
            {succes && (
              <span className="animate-fade-in inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-semibold text-primary-800">
                <i className="ri-checkbox-circle-fill"></i>
                {t("offre.published")}
              </span>
            )}
          </div>
        </div>
        {/* Aperçu */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-background-200 bg-background-100/60 p-5">
            <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
              <i className="ri-eye-line text-base text-secondary-600"></i>
              {t("offre.preview.title")}
            </h3>
            <div className="mt-4 rounded-lg border border-background-200 bg-background-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ${
                    TYPE_STYLES[typeActive.nom] ?? TYPE_STYLES.Annonce
                  }`}
                >
                  <i className={`${typeActive.icon} text-[12px]`}></i>
                  {typeActive.nom}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary-100 px-2.5 py-1 text-[11px] font-semibold text-secondary-900">
                  <i className="ri-focus-3-line text-[12px]"></i>
                  {t(`offre.mode.${modeId}`)}
                </span>
              </div>
              <h4 className="mt-3 font-heading text-base font-bold leading-snug text-foreground-950">
                {titre.trim() || t("offre.preview.empty")}
              </h4>
              {message.trim() && (
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground-600">{message}</p>
              )}
              <div className="mt-4 border-t border-background-200 pt-3">
                <p className="text-[11px] uppercase tracking-wide text-foreground-500">
                  {t("offre.preview.target")}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground-950">{cibleActive?.nom}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 p-4">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-primary-800">
                <i className="ri-group-line text-[13px]"></i>
                {t("offre.portee")}
              </p>
              <p className="mt-1 font-heading text-2xl font-bold text-primary-900">{nf(portee)}</p>
              <p className="text-[11px] text-foreground-600">{t("offre.portee.hint")}</p>
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-[11px] text-foreground-500">
              <i className="ri-flashlight-line"></i>
              {t("offre.preview.immediate")}
            </p>
          </div>
        </div>
      </div>
      {/* Offres publiées */}
      <div className="mt-8">
        <h3 className="font-heading text-base font-bold text-foreground-950">{t("offre.list.title")}</h3>
        <p className="mt-1 text-sm text-foreground-600">{t("offre.list.desc")}</p>
        <div className="mt-4 overflow-hidden rounded-lg border border-background-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-background-200 bg-background-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                    {t("offre.list.col.offre")}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                    {t("offre.list.col.type")}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                    {t("offre.list.col.ciblage")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                    {t("offre.list.col.portee")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                    {t("offre.list.col.statut")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-foreground-500">
                    {t("offre.list.col.maj")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {publiees.map((offre) => {
                  const enPreparation = offre.statut !== t("offre.list.statut.publiee");
                  return (
                    <tr key={offre.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                      <td className="px-4 py-3 font-medium text-foreground-900">{offre.titre}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${
                            TYPE_STYLES[offre.type] ?? TYPE_STYLES.Annonce
                          }`}
                        >
                          {offre.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-foreground-800">{offre.cible}</p>
                        <p className="text-[11px] text-foreground-500">{offre.mode}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground-800">
                        {nf(offre.portee)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            enPreparation
                              ? "bg-background-200 text-foreground-600"
                              : "bg-primary-100 text-primary-800"
                          }`}
                        >
                          <i className={enPreparation ? "ri-draft-line" : "ri-check-line"}></i>
                          {offre.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground-600">{offre.majLe}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
