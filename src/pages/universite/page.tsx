import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import SectionHeading from "@/components/base/SectionHeading";
import { journalAudit, rolesInstitutionnels, modulesInstitutionnels } from "@/mocks/universite";
import { createSession, listAuditEvents, postAuditEvent } from "@/lib/api";
import { formatServerDate } from "@/lib/format";
import RoleSwitcher from "./components/RoleSwitcher";
import StatsInstitution from "./components/StatsInstitution";
import CandidatureQueue from "./components/CandidatureQueue";
import PublicationPanel from "./components/PublicationPanel";
import NotesValidation from "./components/NotesValidation";
import DocumentsPanel from "./components/DocumentsPanel";
import AuditLog, { type AuditEvent } from "./components/AuditLog";
const MODULE_DESC: Record<string, string> = {
  formations: "Publier, mettre à jour et retirer les formations du catalogue national, avec date et statut.",
  bourses: "Publier les programmes d'aide et instruire les candidatures selon les critères officiels.",
  recruteurs: "Vérifier l'identité des organisations et suivre les offres publiées.",
  annonces: "Publier une annonce officielle sur le portail public à destination des candidats et étudiants.",
  offreCiblee: "Cibler une offre, une bourse ou une aide par zone, filière, niveau ou établissement.",
  roles: "Définir les rôles, les habilitations et les périmètres d'accès selon le moindre privilège.",
};
const IMPLEMENTES = ["dashboard", "candidatures", "publications", "notes", "documents", "audit"];
function roleNomFor(roleId: string): string {
  return rolesInstitutionnels.find((r) => r.id === roleId)?.nom ?? roleId;
}
export default function Universite() {
  const { t } = useTranslation();
  const [roleId, setRoleId] = useState("universite");
  const [token, setToken] = useState<string | null>(null);
  const [backendEnLigne, setBackendEnLigne] = useState(true);
  const [audit, setAudit] = useState<AuditEvent[]>(journalAudit as AuditEvent[]);
  const [toast, setToast] = useState(false);
  const role = rolesInstitutionnels.find((r) => r.id === roleId) ?? rolesInstitutionnels[0];
  const modules = useMemo(
    () => modulesInstitutionnels.filter((m) => role.modules.includes(m.id)),
    [role]
  );
  const placeholders = modules.filter((m) => !IMPLEMENTES.includes(m.id));
  // The RoleSwitcher still just *offers* a role for the demo — but every
  // protected read/write now runs against a token the server minted for
  // that role, instead of the UI simply asserting it. If the backend isn't
  // running (common when only `npm run dev` at the repo root is started),
  // this fails silently and the page falls back to local-only demo state.
  useEffect(() => {
    let cancelled = false;
    createSession(roleId)
      .then(({ token: next }) => {
        if (cancelled) return;
        setToken(next);
        setBackendEnLigne(true);
      })
      .catch(() => {
        if (cancelled) return;
        setToken(null);
        setBackendEnLigne(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roleId]);
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    listAuditEvents(token)
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setAudit(
          rows.map((row) => ({
            id: String(row.id),
            action: row.action,
            cible: row.cible,
            auteur: roleNomFor(row.auteur_role),
            role: roleNomFor(row.auteur_role),
            date: formatServerDate(row.created_at),
          }))
        );
      })
      .catch(() => {
        // Keep whatever audit log is already displayed (mock or previous fetch).
      });
    return () => {
      cancelled = true;
    };
  }, [token]);
  const handleAudit = (event: AuditEvent) => {
    setToast(true);
    window.setTimeout(() => setToast(false), 2600);
    if (!token) {
      setAudit((prev) => [event, ...prev]);
      return;
    }
    postAuditEvent(token, event.action, event.cible)
      .then((row) => {
        setAudit((prev) => [
          {
            id: String(row.id),
            action: row.action,
            cible: row.cible,
            auteur: roleNomFor(row.auteur_role),
            role: roleNomFor(row.auteur_role),
            date: formatServerDate(row.created_at),
          },
          ...prev,
        ]);
      })
      .catch(() => {
        setAudit((prev) => [event, ...prev]);
      });
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("univ.eyebrow")}
          title={t("univ.title")}
          subtitle={t("univ.subtitle")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("univ.title") }]}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-800">
              <i className="ri-shield-check-line text-sm"></i>
              {t("univ.anonyme")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-background-300 bg-background-50 px-3 py-1.5 text-xs font-semibold text-foreground-700">
              <i className="ri-map-pin-2-line text-sm"></i>
              {t("univ.perimetre")}
            </span>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                backendEnLigne
                  ? "border-primary-200 bg-primary-50 text-primary-800"
                  : "border-accent-300 bg-accent-50 text-accent-900"
              }`}
            >
              <i className={`${backendEnLigne ? "ri-server-line" : "ri-cloud-off-line"} text-sm`}></i>
              {backendEnLigne ? t("univ.session.online") : t("univ.session.offline")}
            </span>
          </div>
        </PageHero>
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            <p className="flex items-start gap-2 rounded-lg border border-accent-200 bg-accent-50 p-4 text-xs leading-relaxed text-foreground-700">
              <i className="ri-information-line mt-0.5 text-base text-accent-700"></i>
              {t("univ.notice")}
            </p>
            <div>
              <SectionHeading title={t("univ.role.label")} subtitle={t("univ.role.desc")} />
              <div className="mt-5">
                <RoleSwitcher value={roleId} onChange={setRoleId} />
              </div>
            </div>
            <div key={roleId} className="animate-fade-in space-y-8">
              {role.modules.includes("dashboard") && <StatsInstitution />}
              {role.modules.includes("candidatures") && (
                <CandidatureQueue token={token} onAudit={handleAudit} />
              )}
              {role.modules.includes("publications") && (
                <PublicationPanel token={token} onAudit={handleAudit} />
              )}
              {role.modules.includes("notes") && <NotesValidation token={token} onAudit={handleAudit} />}
              {role.modules.includes("documents") && (
                <DocumentsPanel token={token} onAudit={handleAudit} />
              )}
              {placeholders.length > 0 && (
                <div>
                  <SectionHeading
                    eyebrow={t("univ.role.modules")}
                    title="Modules du périmètre"
                    subtitle="Modules ouverts à ce rôle. Les écrans opérationnels marqués « démonstration » sont simulés dans le prototype."
                  />
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {placeholders.map((module) => (
                      <div
                        key={module.id}
                        className="flex flex-col rounded-lg border border-background-200 bg-background-50 p-5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary-100">
                            <i className={`${module.icon} text-xl text-secondary-700`}></i>
                          </span>
                          <span className="rounded-full bg-background-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground-600">
                            Démonstration
                          </span>
                        </div>
                        <h3 className="mt-4 font-heading text-base font-bold text-foreground-950">{module.nom}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-foreground-600">
                          {MODULE_DESC[module.id] ?? "Module du périmètre institutionnel."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {role.modules.includes("audit") && <AuditLog events={audit} />}
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground-800 bg-foreground-950 px-5 py-3 text-sm font-medium text-background-50">
            <i className="ri-history-line text-base text-accent-400"></i>
            {t("univ.audit.newEvent")}
          </div>
        </div>
      )}
    </div>
  );
}
