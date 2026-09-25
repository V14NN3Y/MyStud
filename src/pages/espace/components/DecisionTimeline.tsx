import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DECISIONS, type CandidatureDemo } from "@/hooks/useDemoSession";
import { documentsDemandes } from "@/mocks/suivi";
interface DecisionTimelineProps {
  candidature: CandidatureDemo;
}
const ETAPES = [
  { key: "soumise", icon: "ri-send-plane-line", seuil: 0 },
  { key: "transmise", icon: "ri-share-forward-line", seuil: 1 },
  { key: "pieces", icon: "ri-file-search-line", seuil: 2 },
  { key: "commission", icon: "ri-team-line", seuil: 3 },
  { key: "decision", icon: "ri-scales-3-line", seuil: 4 },
];
type Etat = "fait" | "encours" | "attente";
const NODE_STYLE: Record<Etat, string> = {
  fait: "border-primary-500 bg-primary-500 text-background-50",
  encours: "border-accent-500 bg-accent-100 text-accent-800 animate-pulse-ring",
  attente: "border-background-300 bg-background-100 text-foreground-500",
};
const TAG_STYLE: Record<Etat, string> = {
  fait: "bg-primary-100 text-primary-800",
  encours: "bg-accent-100 text-accent-900",
  attente: "bg-background-200 text-foreground-600",
};
export default function DecisionTimeline({ candidature }: DecisionTimelineProps) {
  const { t } = useTranslation();
  const [piecesDeposees, setPiecesDeposees] = useState(false);
  const decisionMeta = DECISIONS.find((d) => d.key === candidature.decision) ?? DECISIONS[0];
  const etatDe = (seuil: number): Etat => {
    if (candidature.statutIndex >= seuil) return "fait";
    if (candidature.statutIndex === seuil - 1) return "encours";
    return "attente";
  };
  return (
    <ol className="relative">
      {ETAPES.map((etape, index) => {
        const etat = etatDe(etape.seuil);
        const dernier = index === ETAPES.length - 1;
        const decisionPubliee = etape.key === "decision" && etat === "fait";
        return (
          <li key={etape.key} className="relative flex gap-4 pb-6 last:pb-0">
            {!dernier && (
              <span
                aria-hidden="true"
                className={`absolute left-[15px] top-9 h-[calc(100%-1.25rem)] w-px ${
                  etat === "fait" ? "bg-primary-300" : "bg-background-300"
                }`}
              ></span>
            )}
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${NODE_STYLE[etat]}`}
            >
              <i className={`${etat === "fait" ? "ri-check-line" : etape.icon} text-sm`}></i>
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground-950">
                  {t(`espace.etape.${etape.key}`)}
                </p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TAG_STYLE[etat]}`}>
                  {t(`espace.etape.${etat}`)}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground-600">
                {t(`espace.etape.${etape.key}Desc`)}
              </p>
              {decisionPubliee && (
                <div className={`mt-3 rounded-md border p-3 ${decisionMeta.badge}`}>
                  <p className="flex items-center gap-2 text-xs font-semibold">
                    <i className={decisionMeta.icon}></i>
                    {t(decisionMeta.labelKey)}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    {t(`espace.decisionDesc.${decisionMeta.key}`)}
                  </p>
                </div>
              )}
              {decisionPubliee && candidature.decision === "pieces_demandees" && (
                <div className="mt-3 rounded-md border border-secondary-200 bg-secondary-50 p-3">
                  <p className="flex items-center gap-2 text-xs font-semibold text-secondary-900">
                    <i className="ri-file-warning-line"></i>
                    {t("espace.pieces.title")}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-foreground-700">
                    {t("espace.pieces.desc")}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {documentsDemandes.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-start justify-between gap-3 rounded-md border border-background-200 bg-background-50 p-2.5"
                      >
                        <span className="min-w-0">
                          <span className="block text-xs font-medium text-foreground-950">{doc.nom}</span>
                          <span className="mt-0.5 block text-[11px] text-foreground-500">{doc.format}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-900">
                          {t("espace.pieces.requis")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={piecesDeposees}
                    onClick={() => setPiecesDeposees(true)}
                    className={`mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-xs font-semibold transition-colors ${
                      piecesDeposees
                        ? "cursor-default bg-primary-100 text-primary-800"
                        : "bg-secondary-500 text-background-50 hover:bg-secondary-600"
                    }`}
                  >
                    <i className={piecesDeposees ? "ri-checkbox-circle-line" : "ri-upload-cloud-2-line"}></i>
                    {piecesDeposees ? t("espace.pieces.depose") : t("espace.pieces.deposer")}
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
