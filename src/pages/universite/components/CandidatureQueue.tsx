import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fileCandidatures, motifsRefus } from "@/mocks/universite";
import { decideCandidature, listCandidatures, type ServerCandidature } from "@/lib/api";
import type { AuditEvent } from "./AuditLog";
export interface Dossier {
  id: string;
  matricule: string;
  nom: string;
  formation: string;
  serie: string;
  mention: string;
  moyenneBac: number;
  dateDepot: string;
  statut: string;
}
interface CandidatureQueueProps {
  token: string | null;
  onAudit: (event: AuditEvent) => void;
}
const DECISION_STYLES: Record<string, string> = {
  Acceptée: "bg-primary-100 text-primary-800 border-primary-200",
  "Liste d'attente": "bg-accent-100 text-accent-900 border-accent-300",
  Refusée: "bg-foreground-200 text-foreground-600 border-foreground-300",
};
function toDossier(row: ServerCandidature): Dossier {
  return {
    id: row.id,
    matricule: row.matricule,
    nom: row.nom,
    formation: row.formation,
    serie: row.serie,
    mention: row.mention,
    moyenneBac: row.moyenne_bac,
    dateDepot: row.date_depot,
    statut: row.statut,
  };
}
const stamp = () => `Aujourd'hui · ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
export default function CandidatureQueue({ token, onAudit }: CandidatureQueueProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Dossier[]>(fileCandidatures as Dossier[]);
  const [modalId, setModalId] = useState<string | null>(null);
  const [motif, setMotif] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [erreur, setErreur] = useState("");
  // Falls back to the fileCandidatures mock (already the initial state) when
  // there's no backend session — every decision below then stays local-only,
  // exactly like before this feature was wired up.
  useEffect(() => {
    if (!token) return;
    listCandidatures(token)
      .then((serverRows) => setRows(serverRows.map(toDossier)))
      .catch(() => {
        // Keep whatever is already displayed (mock or previous fetch).
      });
  }, [token]);
  const appliquer = (id: string, decision: string, motifChoisi?: string, commentaireChoisi?: string) => {
    const dossier = rows.find((r) => r.id === id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, statut: decision } : r)));
    onAudit({
      id: `aud-${Date.now()}-${id}`,
      action:
        decision === "Refusée"
          ? `Refus enregistré — ${motifChoisi ?? "motif non précisé"}`
          : `Décision publiée : ${decision}`,
      cible: `Candidature ${id} — ${dossier?.nom ?? ""}`,
      auteur: "Commission pédagogique",
      role: "Université",
      date: stamp(),
    });
    if (!token) return;
    decideCandidature(
      token,
      id,
      decision as "Acceptée" | "Liste d'attente" | "Refusée",
      motifChoisi || commentaireChoisi ? { motif: motifChoisi, commentaire: commentaireChoisi } : undefined
    )
      .then((row) => setRows((prev) => prev.map((r) => (r.id === id ? toDossier(row) : r))))
      .catch(() => {
        // The optimistic update above stands even if the backend call fails.
      });
  };
  const confirmerRefus = () => {
    if (!motif) {
      setErreur(t("univ.cand.motifRequis"));
      return;
    }
    if (modalId) appliquer(modalId, "Refusée", motif, commentaire || undefined);
    setModalId(null);
    setMotif("");
    setCommentaire("");
    setErreur("");
  };
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-100">
          <i className="ri-inbox-archive-line text-lg text-primary-700"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">{t("univ.cand.title")}</h2>
          <p className="mt-1 max-w-3xl text-sm text-foreground-600">{t("univ.cand.desc")}</p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="bg-background-100">
              <th className="border-b border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.cand.col.candidat")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.cand.col.formation")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.cand.col.serie")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.cand.col.mention")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.cand.col.moyenne")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.cand.col.decision")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const traite = row.statut !== "En attente";
              return (
                <tr key={row.id} className={index % 2 === 1 ? "bg-background-100/60" : ""}>
                  <td className="border-b border-background-200 p-3.5">
                    <p className="text-sm font-semibold text-foreground-950">{row.nom}</p>
                    <p className="text-[11px] text-foreground-500">{row.matricule} · {row.dateDepot}</p>
                  </td>
                  <td className="border-b border-l border-background-200 p-3.5 text-sm text-foreground-700">{row.formation}</td>
                  <td className="border-b border-l border-background-200 p-3.5 text-center text-sm text-foreground-700">{row.serie}</td>
                  <td className="border-b border-l border-background-200 p-3.5 text-center text-sm text-foreground-700">{row.mention}</td>
                  <td className="border-b border-l border-background-200 p-3.5 text-center text-sm font-medium text-foreground-900">{row.moyenneBac.toFixed(1)}</td>
                  <td className="border-b border-l border-background-200 p-3.5">
                    {traite ? (
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${DECISION_STYLES[row.statut] ?? ""}`}>
                        <i className="ri-checkbox-circle-line text-[13px]"></i>
                        {row.statut}
                      </span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => appliquer(row.id, "Acceptée")}
                          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-primary-500 px-2.5 py-1.5 text-[11px] font-semibold text-background-50 transition-colors hover:bg-primary-600"
                        >
                          <i className="ri-check-line text-[12px]"></i>
                          {t("univ.cand.accepter")}
                        </button>
                        <button
                          type="button"
                          onClick={() => appliquer(row.id, "Liste d'attente")}
                          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border border-accent-300 bg-accent-50 px-2.5 py-1.5 text-[11px] font-semibold text-accent-900 transition-colors hover:bg-accent-100"
                        >
                          <i className="ri-time-line text-[12px]"></i>
                          {t("univ.cand.listeAttente")}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setModalId(row.id); setMotif(""); setCommentaire(""); setErreur(""); }}
                          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-2.5 py-1.5 text-[11px] font-semibold text-foreground-700 transition-colors hover:border-foreground-400"
                        >
                          <i className="ri-close-line text-[12px]"></i>
                          {t("univ.cand.refuser")}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-950/50 p-4">
          <div className="animate-scale-in w-full max-w-lg rounded-lg border border-background-200 bg-background-50 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground-950">{t("univ.cand.motifTitle")}</h3>
                <p className="mt-1 text-sm text-foreground-600">{t("univ.cand.motifDesc")}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalId(null)}
                aria-label={t("univ.cand.annuler")}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-600 transition-colors hover:bg-background-100"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {motifsRefus.map((m) => {
                const actif = motif === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMotif(m); setErreur(""); }}
                    aria-pressed={actif}
                    className={`flex items-center gap-3 rounded-md border px-3.5 py-2.5 text-left text-sm transition-colors ${
                      actif ? "border-primary-400 bg-primary-50 text-foreground-950" : "border-background-200 bg-background-50 text-foreground-700 hover:border-primary-200"
                    }`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${actif ? "border-primary-500 bg-primary-500" : "border-background-300"}`}>
                      {actif && <i className="ri-check-line text-[10px] text-background-50"></i>}
                    </span>
                    {m}
                  </button>
                );
              })}
            </div>
            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                {t("univ.cand.commentaire")}
              </span>
              <textarea
                value={commentaire}
                maxLength={500}
                onChange={(e) => setCommentaire(e.target.value.slice(0, 500))}
                placeholder={t("univ.cand.commentairePlaceholder")}
                rows={3}
                className="mt-1.5 w-full resize-none rounded-md border border-background-300 bg-background-50 px-3.5 py-2.5 text-sm text-foreground-900 outline-none transition-colors focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
              ></textarea>
              <span className="mt-1 block text-right text-[11px] text-foreground-500">{commentaire.length}/500</span>
            </label>
            {erreur && (
              <p className="mt-2 flex items-center gap-2 text-xs font-medium text-accent-900">
                <i className="ri-error-warning-line"></i>
                {erreur}
              </p>
            )}
            <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-foreground-500">
              <i className="ri-information-line mt-0.5"></i>
              {t("univ.cand.irreversible")}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModalId(null)}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100"
              >
                {t("univ.cand.annuler")}
              </button>
              <button
                type="button"
                onClick={confirmerRefus}
                className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:opacity-90"
              >
                <i className="ri-close-circle-line text-base"></i>
                {t("univ.cand.confirmer")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
