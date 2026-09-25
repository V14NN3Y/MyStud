import { useState } from "react";
import { useTranslation } from "react-i18next";
import { piecesComplementairesBourse } from "@/mocks/candidaturesBourse";
import BourseSteps from "./BourseSteps";
interface CandidatureBourse {
  id: string;
  programmeId: string;
  programme: string;
  organisme: string;
  montant: string;
  reference: string;
  statut: string;
  montantAccorde: string;
  dateDepot: string;
  majLe: string;
  message: string;
}
interface BourseCandidatureCardProps {
  candidature: CandidatureBourse;
  onRemove: (id: string) => void;
}
const STATUT_STYLES: Record<string, string> = {
  soumise: "bg-background-200 text-foreground-700",
  etude: "bg-accent-100 text-accent-900",
  complement: "bg-secondary-100 text-secondary-900",
  acceptee: "bg-primary-100 text-primary-800",
  rejetee: "bg-foreground-200 text-foreground-600",
  paiement: "bg-primary-100 text-primary-800",
  cloture: "bg-background-200 text-foreground-600",
};
export default function BourseCandidatureCard({ candidature, onRemove }: BourseCandidatureCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [piecesDeposees, setPiecesDeposees] = useState(false);
  return (
    <article className="reveal rounded-lg border border-background-200 bg-background-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-100">
            <i className="ri-hand-coin-line text-xl text-accent-800"></i>
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-base font-bold leading-snug text-foreground-950">{candidature.programme}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-foreground-600">
              <i className="ri-bank-line text-secondary-500"></i>
              {candidature.organisme}
            </p>
          </div>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-semibold ${STATUT_STYLES[candidature.statut] ?? STATUT_STYLES.soumise}`}>
          {t(`bsuivi.statut.${candidature.statut}`)}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md bg-background-100 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-500">{t("bsuivi.card.reference")}</p>
          <p className="mt-0.5 text-xs font-semibold text-foreground-900">{candidature.reference}</p>
        </div>
        <div className="rounded-md bg-background-100 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-500">{t("bsuivi.depot.montant")}</p>
          <p className="mt-0.5 text-xs font-semibold text-foreground-900">{candidature.montant}</p>
        </div>
        <div className="rounded-md bg-background-100 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-500">{t("bsuivi.card.deposeLe")}</p>
          <p className="mt-0.5 text-xs font-semibold text-foreground-900">{candidature.dateDepot}</p>
        </div>
        <div className="rounded-md bg-background-100 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-500">{t("bsuivi.card.montantAccorde")}</p>
          <p className="mt-0.5 text-xs font-semibold text-foreground-900">{candidature.montantAccorde}</p>
        </div>
      </div>
      {candidature.statut === "complement" && (
        <div className="mt-4 rounded-md border border-secondary-200 bg-secondary-50 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-950">
            <i className="ri-file-warning-line text-base text-secondary-600"></i>
            {t("bsuivi.pieces.title")}
          </p>
          <p className="mt-1 text-xs text-foreground-600">{t("bsuivi.pieces.desc")}</p>
          <ul className="mt-3 space-y-2">
            {piecesComplementairesBourse.map((piece) => (
              <li key={piece.id} className="flex items-center justify-between gap-3 rounded-md bg-background-50 px-3 py-2">
                <span className="inline-flex items-center gap-2 text-xs text-foreground-800">
                  <i className="ri-attachment-2 text-sm text-secondary-500"></i>
                  {piece.label}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${piece.requis ? "bg-accent-100 text-accent-900" : "bg-background-200 text-foreground-600"}`}>
                  {piece.requis ? t("bsuivi.pieces.requis") : t("bsuivi.pieces.facultatif")}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPiecesDeposees(true)}
            disabled={piecesDeposees}
            className={`mt-3 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-xs font-semibold transition-colors ${
              piecesDeposees ? "cursor-default bg-primary-100 text-primary-800" : "bg-primary-500 text-background-50 hover:bg-primary-600"
            }`}
          >
            <i className={piecesDeposees ? "ri-check-line" : "ri-upload-2-line"}></i>
            {piecesDeposees ? t("bsuivi.pieces.depose") : t("bsuivi.pieces.deposer")}
          </button>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-background-200 pt-4">
        <span className="text-[11px] text-foreground-500">
          {t("bsuivi.card.majLe")} {candidature.majLe}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onRemove(candidature.id)}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium text-foreground-500 transition-colors hover:text-foreground-800"
          >
            <i className="ri-delete-bin-line text-sm"></i>
            {t("bsuivi.card.masquer")}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-xs font-semibold text-foreground-700 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <i className={open ? "ri-arrow-up-s-line text-sm" : "ri-arrow-down-s-line text-sm"}></i>
            {open ? t("bsuivi.card.chronoHide") : t("bsuivi.card.chrono")}
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-5 border-t border-background-200 pt-5 animate-fade-in">
          <BourseSteps statut={candidature.statut} message={candidature.message} />
        </div>
      )}
    </article>
  );
}
