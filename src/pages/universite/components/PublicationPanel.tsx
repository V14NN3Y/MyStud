import { useState } from "react";
import { useTranslation } from "react-i18next";
import { publicationsInstitution } from "@/mocks/universite";
import type { AuditEvent } from "./AuditLog";
interface Publication {
  id: string;
  type: string;
  libelle: string;
  statut: string;
  majLe: string;
}
interface PublicationPanelProps {
  onAudit: (event: AuditEvent) => void;
}
const stamp = () => `Aujourd'hui · ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
export default function PublicationPanel({ onAudit }: PublicationPanelProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Publication[]>(publicationsInstitution as Publication[]);
  const basculer = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const publie = row.statut !== "Publié";
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, statut: publie ? "Publié" : "Brouillon", majLe: stamp() } : r))
    );
    onAudit({
      id: `aud-${Date.now()}-${id}`,
      action: publie ? "Publication validée" : "Publication repassée en brouillon",
      cible: `${row.type} — ${row.libelle}`,
      auteur: "Cellule emploi du temps",
      role: "Université",
      date: stamp(),
    });
  };
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-100">
          <i className="ri-calendar-schedule-line text-lg text-accent-800"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">{t("univ.pub.title")}</h2>
          <p className="mt-1 max-w-3xl text-sm text-foreground-600">{t("univ.pub.desc")}</p>
        </div>
      </div>
      <ul className="mt-5 flex flex-col gap-3">
        {rows.map((row) => {
          const publie = row.statut === "Publié";
          return (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-background-200 bg-background-100/60 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background-50">
                  <i className={`${row.type === "Emploi du temps" ? "ri-calendar-line" : "ri-file-list-2-line"} text-base text-secondary-600`}></i>
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground-950">{row.libelle}</p>
                  <p className="mt-0.5 text-[11px] text-foreground-500">
                    {row.type} · {t("univ.pub.majLe")} {row.majLe}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                    publie
                      ? "border-primary-200 bg-primary-100 text-primary-800"
                      : "border-background-300 bg-background-200 text-foreground-700"
                  }`}
                >
                  <i className={`${publie ? "ri-checkbox-circle-line" : "ri-draft-line"} text-[13px]`}></i>
                  {publie ? t("univ.pub.publie") : t("univ.pub.brouillon")}
                </span>
                <button
                  type="button"
                  onClick={() => basculer(row.id)}
                  className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2 text-xs font-semibold transition-colors ${
                    publie
                      ? "border border-background-300 bg-background-50 text-foreground-700 hover:bg-background-100"
                      : "bg-primary-500 text-background-50 hover:bg-primary-600"
                  }`}
                >
                  <i className={`${publie ? "ri-arrow-go-back-line" : "ri-upload-cloud-line"} text-sm`}></i>
                  {publie ? t("univ.pub.repasser") : t("univ.pub.publier")}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
