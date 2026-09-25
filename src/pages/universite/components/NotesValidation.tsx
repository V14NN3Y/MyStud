import { useState } from "react";
import { useTranslation } from "react-i18next";
import { validationsNotes } from "@/mocks/universite";
import type { AuditEvent } from "./AuditLog";
interface Validation {
  id: string;
  ue: string;
  enseignant: string;
  effectif: number;
  moyenneClasse: number;
  statut: string;
}
interface NotesValidationProps {
  onAudit: (event: AuditEvent) => void;
}
const stamp = () => `Aujourd'hui · ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
export default function NotesValidation({ onAudit }: NotesValidationProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Validation[]>(validationsNotes as Validation[]);
  const valider = (id: string) => {
    const row = rows.find((r) => r.id === id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, statut: "Validée" } : r)));
    onAudit({
      id: `aud-${Date.now()}-${id}`,
      action: "Notes validées et publiées",
      cible: row?.ue ?? id,
      auteur: row?.enseignant ?? "Enseignant",
      role: "Enseignant",
      date: stamp(),
    });
  };
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-100">
          <i className="ri-bar-chart-box-line text-lg text-primary-700"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">{t("univ.notes.title")}</h2>
          <p className="mt-1 max-w-3xl text-sm text-foreground-600">{t("univ.notes.desc")}</p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-background-100">
              <th className="border-b border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.notes.col.ue")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.notes.col.enseignant")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.notes.col.effectif")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.notes.col.moyenne")}</th>
              <th className="border-b border-l border-background-200 p-3.5 text-xs font-semibold uppercase tracking-wide text-foreground-600">{t("univ.notes.col.statut")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const validee = row.statut === "Validée";
              return (
                <tr key={row.id} className={index % 2 === 1 ? "bg-background-100/60" : ""}>
                  <td className="border-b border-background-200 p-3.5 text-sm font-medium text-foreground-900">{row.ue}</td>
                  <td className="border-b border-l border-background-200 p-3.5 text-sm text-foreground-700">{row.enseignant}</td>
                  <td className="border-b border-l border-background-200 p-3.5 text-center text-sm text-foreground-700">{row.effectif}</td>
                  <td className="border-b border-l border-background-200 p-3.5 text-center text-sm font-medium text-foreground-900">{row.moyenneClasse.toFixed(1)}</td>
                  <td className="border-b border-l border-background-200 p-3.5">
                    {validee ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-100 px-2.5 py-1 text-[11px] font-semibold text-primary-800">
                        <i className="ri-shield-check-line text-[13px]"></i>
                        {t("univ.notes.validee")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => valider(row.id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md bg-primary-500 px-3 py-1.5 text-[11px] font-semibold text-background-50 transition-colors hover:bg-primary-600"
                      >
                        <i className="ri-check-double-line text-[12px]"></i>
                        {t("univ.notes.valider")}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
