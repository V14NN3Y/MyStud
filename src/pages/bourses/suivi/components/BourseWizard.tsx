import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useDemoSession from "@/hooks/useDemoSession";
import { bourses } from "@/mocks/bourses";
import { piecesComplementairesBourse } from "@/mocks/candidaturesBourse";
export interface NouvelleCandidaturePayload {
  programmeId: string;
  programme: string;
  organisme: string;
  montant: string;
}
interface BourseWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: NouvelleCandidaturePayload) => Promise<void>;
}
const ETAPES = [
  { key: "programme", titleKey: "bsuivi.depot.choose", icon: "ri-award-line" },
  { key: "infos", titleKey: "bsuivi.depot.infos", icon: "ri-user-line" },
  { key: "pieces", titleKey: "bsuivi.depot.pieces", icon: "ri-attachment-2" },
  { key: "recap", titleKey: "bsuivi.depot.recap", icon: "ri-file-check-line" },
];
const PROGRAMMES_OUVERTS = bourses.filter((b) => b.statut === "Ouverte" || b.statut === "Bientôt clôturée");
export default function BourseWizard({ open, onClose, onSubmit }: BourseWizardProps) {
  const { t } = useTranslation();
  const { profil } = useDemoSession();
  const [step, setStep] = useState(0);
  const [programmeId, setProgrammeId] = useState("");
  const [pieces, setPieces] = useState<string[]>([]);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    if (open) {
      setStep(0);
      setProgrammeId("");
      setPieces([]);
      setErreur(null);
    }
  }, [open]);
  if (!open) return null;
  const programme = PROGRAMMES_OUVERTS.find((b) => b.id === programmeId);
  const canNext = step === 0 ? Boolean(programmeId) : true;
  const togglePiece = (id: string) => {
    setPieces((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };
  const handleSubmit = async () => {
    if (!programme) return;
    setEnCours(true);
    setErreur(null);
    try {
      await onSubmit({
        programmeId: programme.id,
        programme: programme.nom,
        organisme: programme.organisme,
        montant: programme.montant,
      });
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "La soumission a échoué. Réessayez.");
    } finally {
      setEnCours(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground-950/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button type="button" aria-label={t("bsuivi.depot.back")} onClick={onClose} className="absolute inset-0 cursor-pointer"></button>
      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-background-50 p-5 animate-scale-in sm:rounded-lg md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground-950">{t("bsuivi.depot.title")}</h2>
            <p className="mt-1 text-sm text-foreground-600">{t("bsuivi.depot.desc")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("bsuivi.depot.back")}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-background-100 text-foreground-700 transition-colors hover:bg-background-200"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        {/* Stepper */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {ETAPES.map((etape, index) => {
            const actif = index === step;
            const fait = index < step;
            return (
              <span
                key={etape.key}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  actif ? "bg-primary-500 text-background-50" : fait ? "bg-primary-100 text-primary-800" : "bg-background-100 text-foreground-500"
                }`}
              >
                <i className={fait ? "ri-check-line" : `${etape.icon}`}></i>
                {t(etape.titleKey)}
              </span>
            );
          })}
        </div>
        {/* Étape 1 : programme */}
        {step === 0 && (
          <div className="mt-5 space-y-3">
            {PROGRAMMES_OUVERTS.length === 0 && <p className="text-sm text-foreground-600">{t("bsuivi.depot.aucunProgramme")}</p>}
            {PROGRAMMES_OUVERTS.map((p) => {
              const actif = programmeId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProgrammeId(p.id)}
                  className={`flex w-full items-start gap-3 rounded-md border p-4 text-left transition-colors ${
                    actif ? "border-primary-400 bg-primary-50" : "border-background-200 bg-background-50 hover:border-primary-300"
                  }`}
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${actif ? "border-primary-500" : "border-background-300"}`}>
                    {actif && <span className="h-2.5 w-2.5 rounded-full bg-primary-500"></span>}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground-950">{p.nom}</span>
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-800">{t("bsuivi.depot.programmeOuvert")}</span>
                    </span>
                    <span className="mt-1 block text-xs text-foreground-600">{p.organisme}</span>
                    <span className="mt-1 block text-xs text-foreground-500">
                      {t("bsuivi.depot.montant")} : {p.montant}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {/* Étape 2 : infos */}
        {step === 1 && (
          <div className="mt-5">
            <p className="text-xs text-foreground-600">{t("bsuivi.depot.infosDesc")}</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: t("espace.hello"), value: profil ? `${profil.prenom} ${profil.nom}` : "—" },
                { label: t("espace.matricule"), value: profil?.matricule ?? "—" },
                { label: t("espace.bac"), value: `${profil?.bac.serie ?? "—"} · ${profil?.bac.mention ?? ""}` },
                { label: t("acces.email"), value: profil?.email ?? "—" },
              ].map((info) => (
                <div key={info.label} className="rounded-md bg-background-100 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-foreground-500">{info.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground-950">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Étape 3 : pièces */}
        {step === 2 && (
          <div className="mt-5">
            <p className="text-xs text-foreground-600">{t("bsuivi.depot.piecesDesc")}</p>
            <ul className="mt-3 space-y-2">
              {piecesComplementairesBourse.map((piece) => {
                const coche = pieces.includes(piece.id);
                return (
                  <li key={piece.id}>
                    <button
                      type="button"
                      onClick={() => togglePiece(piece.id)}
                      className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors ${
                        coche ? "border-primary-300 bg-primary-50" : "border-background-200 bg-background-50 hover:border-primary-300"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${coche ? "border-primary-500 bg-primary-500" : "border-background-300"}`}>
                        {coche && <i className="ri-check-line text-xs text-background-50"></i>}
                      </span>
                      <span className="min-w-0 flex-1 text-sm text-foreground-800">{piece.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${piece.requis ? "bg-accent-100 text-accent-900" : "bg-background-200 text-foreground-600"}`}>
                        {piece.requis ? t("bsuivi.pieces.requis") : t("bsuivi.pieces.facultatif")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* Étape 4 : recap */}
        {step === 3 && programme && (
          <div className="mt-5">
            <p className="text-xs text-foreground-600">{t("bsuivi.depot.recapDesc")}</p>
            <div className="mt-3 space-y-3 rounded-md border border-background-200 bg-background-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-foreground-500">{t("bsuivi.depot.programme")}</span>
                <span className="text-sm font-semibold text-foreground-950">{programme.nom}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-foreground-500">{t("bsuivi.depot.organisme")}</span>
                <span className="text-sm font-semibold text-foreground-950">{programme.organisme}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-foreground-500">{t("bsuivi.depot.montant")}</span>
                <span className="text-sm font-semibold text-foreground-950">{programme.montant}</span>
              </div>
            </div>
            <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-foreground-500">
              <i className="ri-information-line mt-0.5"></i>
              {t("bsuivi.depot.referenceNote")}
            </p>
          </div>
        )}
        {erreur && (
          <p className="mt-4 flex items-center gap-2 text-xs font-medium text-accent-900">
            <i className="ri-error-warning-line"></i>
            {erreur}
          </p>
        )}
        {/* Actions */}
        <div className="mt-6 flex flex-col items-stretch gap-3 border-t border-background-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <i className="ri-arrow-left-line"></i>
            {step === 0 ? t("bsuivi.depot.back") : t("bsuivi.depot.back")}
          </button>
          {step < ETAPES.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
                canNext ? "cursor-pointer bg-primary-500 text-background-50 hover:bg-primary-600" : "cursor-not-allowed bg-background-200 text-foreground-500"
              }`}
            >
              {t("bsuivi.depot.next")}
              <i className="ri-arrow-right-line"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={enCours}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-foreground-950 transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <i className={enCours ? "ri-loader-4-line animate-spin" : "ri-send-plane-line"}></i>
              {t("bsuivi.depot.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
