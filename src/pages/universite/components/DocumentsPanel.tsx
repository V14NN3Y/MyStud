import { useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { fileCandidatures } from "@/mocks/universite";
import { API_URL, ApiError, getDocumentLink, uploadDocument } from "@/lib/api";
import type { AuditEvent } from "./AuditLog";
interface DocumentsPanelProps {
  token: string | null;
  onAudit: (event: AuditEvent) => void;
}
interface LienGenere {
  url: string;
  expiresInSeconds: number;
}
const TYPES_DOCUMENT = ["Certificat de scolarité", "Relevé de notes", "Quittance de paiement"];
const stamp = () => `Aujourd'hui · ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
export default function DocumentsPanel({ token, onAudit }: DocumentsPanelProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [matricule, setMatricule] = useState(fileCandidatures[0]?.matricule ?? "");
  const [typeDoc, setTypeDoc] = useState(TYPES_DOCUMENT[0]);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [lien, setLien] = useState<LienGenere | null>(null);
  const [copie, setCopie] = useState(false);
  const generer = async (event: FormEvent) => {
    event.preventDefault();
    setErreur(null);
    setLien(null);
    setCopie(false);
    if (!token) {
      setErreur(t("univ.docs.offline"));
      return;
    }
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setErreur(t("univ.docs.fichierRequis"));
      return;
    }
    setEnCours(true);
    try {
      const { id } = await uploadDocument(token, file, matricule);
      const { url, expiresInSeconds } = await getDocumentLink(token, id, matricule);
      setLien({ url: `${API_URL}${url}`, expiresInSeconds });
      onAudit({
        id: `aud-${Date.now()}-${id}`,
        action: `${typeDoc} généré`,
        cible: `Matricule ${matricule}`,
        auteur: "Service de scolarité",
        role: "Scolarité",
        date: stamp(),
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setErreur(err instanceof ApiError ? err.message : t("univ.docs.erreur"));
    } finally {
      setEnCours(false);
    }
  };
  const copier = async () => {
    if (!lien) return;
    try {
      await navigator.clipboard.writeText(lien.url);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): the link is
      // still visible and selectable, so this is a soft failure.
    }
  };
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary-100">
          <i className="ri-folder-download-line text-lg text-secondary-700"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">{t("univ.docs.title")}</h2>
          <p className="mt-1 max-w-3xl text-sm text-foreground-600">{t("univ.docs.desc")}</p>
        </div>
      </div>
      {!token && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-accent-200 bg-accent-50 p-3.5 text-xs leading-relaxed text-foreground-700">
          <i className="ri-error-warning-line mt-0.5 text-base text-accent-700"></i>
          {t("univ.docs.offline")}
        </p>
      )}
      <form onSubmit={generer} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
            {t("univ.docs.matricule")}
          </span>
          <select
            value={matricule}
            onChange={(event) => setMatricule(event.target.value)}
            className="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-900"
          >
            {fileCandidatures.map((dossier) => (
              <option key={dossier.matricule} value={dossier.matricule}>
                {dossier.matricule} — {dossier.nom}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
            {t("univ.docs.type")}
          </span>
          <select
            value={typeDoc}
            onChange={(event) => setTypeDoc(event.target.value)}
            className="rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-900"
          >
            {TYPES_DOCUMENT.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
            {t("univ.docs.fichier")}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            className="rounded-md border border-dashed border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-700 file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-800"
          />
        </label>
        {erreur && (
          <p className="md:col-span-2 flex items-center gap-2 text-xs font-medium text-red-700">
            <i className="ri-error-warning-line"></i>
            {erreur}
          </p>
        )}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={enCours || !token}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className={`${enCours ? "ri-loader-4-line animate-spin" : "ri-file-add-line"} text-base`}></i>
            {enCours ? t("univ.docs.enCours") : t("univ.docs.generer")}
          </button>
        </div>
      </form>
      {lien && (
        <div className="mt-5 rounded-lg border border-primary-200 bg-primary-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary-900">
            <i className="ri-link"></i>
            {t("univ.docs.lienPret")}
          </p>
          <p className="mt-1 text-xs text-primary-800">
            {t("univ.docs.expiration", { seconds: lien.expiresInSeconds })}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="flex-1 truncate rounded-md border border-primary-200 bg-background-50 px-3 py-2 text-xs text-foreground-800">
              {lien.url}
            </code>
            <button
              type="button"
              onClick={copier}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-primary-300 bg-background-50 px-3 py-2 text-xs font-semibold text-primary-800 hover:bg-primary-100"
            >
              <i className={copie ? "ri-check-line" : "ri-clipboard-line"}></i>
              {copie ? t("univ.docs.copie") : t("univ.docs.copier")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
