import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PortalNavbar from "@/components/feature/PortalNavbar";
import PortalFooter from "@/components/feature/PortalFooter";
import PageHero from "@/components/feature/PageHero";
import Stepper from "./components/Stepper";
import StepIdentity from "./components/StepIdentity";
import StepCode from "./components/StepCode";
import StepBac, { type BacFormValues } from "./components/StepBac";
import StepRecap from "./components/StepRecap";
import useDemoSession, { creerProfilDemo, type BacInfo, type ProfilDemo } from "@/hooks/useDemoSession";
import { tokenizeNpi, ApiError } from "@/lib/api";
const ETAPES = [
  { titre: "Identité NPI", icone: "ri-fingerprint-line" },
  { titre: "Code à usage unique", icone: "ri-lock-password-line" },
  { titre: "Baccalauréat", icone: "ri-file-list-3-line" },
  { titre: "Confirmation", icone: "ri-shield-check-line" },
];
export default function Acces() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { identifier } = useDemoSession();
  const [etape, setEtape] = useState(1);
  const [npi, setNpi] = useState("");
  const [telephone, setTelephone] = useState("");
  const [codeEnvoye, setCodeEnvoye] = useState("");
  const [bacValues, setBacValues] = useState<BacFormValues>({
    numeroTable: "",
    serie: "",
    annee: "2026",
    email: "",
  });
  const [profil, setProfil] = useState<ProfilDemo | null>(null);
  const [erreur, setErreur] = useState("");
  const [verificationEnCours, setVerificationEnCours] = useState(false);
  const genererCode = () => String(Math.floor(100000 + Math.random() * 900000));
  const envoyerCode = () => {
    if (npi.length < 10) {
      setErreur("Le NPI doit comporter 10 chiffres.");
      return;
    }
    if (telephone.replace(/\D/g, "").length < 8) {
      setErreur("Le numéro de téléphone saisi semble incomplet.");
      return;
    }
    setErreur("");
    setCodeEnvoye(genererCode());
    setEtape(2);
  };
  const verifierCode = (code: string) => {
    if (code !== codeEnvoye) {
      setErreur("Le code saisi ne correspond pas au code envoyé.");
      return;
    }
    setErreur("");
    setEtape(3);
  };
  const verifierBac = async () => {
    if (!bacValues.numeroTable.trim()) {
      setErreur("Le numéro de table est obligatoire.");
      return;
    }
    if (!bacValues.serie) {
      setErreur("Sélectionnez la série de votre baccalauréat.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(bacValues.email)) {
      setErreur("Renseignez une adresse e-mail valide.");
      return;
    }
    setErreur("");
    setVerificationEnCours(true);
    try {
      // Real round-trip to the backend: the NPI is tokenized server-side
      // (HMAC, never stored raw) and, as a side effect, a confirmation
      // e-mail goes out to the address just entered — see
      // server/src/routes/identity.ts and server/README.md.
      const { npiToken } = await tokenizeNpi(npi, bacValues.email);
      const bac: BacInfo = {
        serie: bacValues.serie,
        annee: bacValues.annee,
        numeroTable: bacValues.numeroTable,
        mention: "",
        statut: "Vérifié — office du baccalauréat",
        priseEnCharge: "",
      };
      setProfil(creerProfilDemo(npi, telephone, bac, bacValues.email, npiToken));
      setEtape(4);
    } catch (error) {
      setErreur(
        error instanceof ApiError
          ? error.message
          : "Impossible de joindre le serveur de vérification. Réessayez dans un instant."
      );
    } finally {
      setVerificationEnCours(false);
    }
  };
  const confirmer = () => {
    if (!profil) return;
    identifier(profil);
    navigate("/espace");
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PortalNavbar />
      <main className="w-full flex-1">
        <PageHero
          eyebrow={t("nav.acces")}
          title={t("acces.wizard.title")}
          subtitle={t("acces.wizard.desc")}
          crumbs={[{ label: t("brand.name"), to: "/" }, { label: t("nav.acces") }]}
        />
        <section className="w-full px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto w-full max-w-2xl">
            <div className="w-full">
              <div className="rounded-lg border border-background-200 bg-background-50 p-5 md:p-8">
                <Stepper etape={etape} etapes={ETAPES} onGoTo={setEtape} />
                <div className="mt-8 border-t border-background-200 pt-8">
                  {etape === 1 && (
                    <StepIdentity
                      npi={npi}
                      telephone={telephone}
                      erreur={erreur}
                      onChange={(patch) => {
                        setErreur("");
                        if (patch.npi !== undefined) setNpi(patch.npi);
                        if (patch.telephone !== undefined) setTelephone(patch.telephone);
                      }}
                      onSubmit={envoyerCode}
                    />
                  )}
                  {etape === 2 && (
                    <StepCode
                      codeEnvoye={codeEnvoye}
                      telephone={telephone}
                      erreur={erreur}
                      onVerify={verifierCode}
                      onResend={() => {
                        setErreur("");
                        setCodeEnvoye(genererCode());
                      }}
                      onRetour={() => {
                        setErreur("");
                        setEtape(1);
                      }}
                    />
                  )}
                  {etape === 3 && (
                    <StepBac
                      values={bacValues}
                      erreur={erreur}
                      enCours={verificationEnCours}
                      onChange={(patch) => {
                        setErreur("");
                        setBacValues((prev) => ({ ...prev, ...patch }));
                      }}
                      onSubmit={verifierBac}
                      onRetour={() => {
                        setErreur("");
                        setEtape(2);
                      }}
                    />
                  )}
                  {etape === 4 && profil && (
                    <StepRecap
                      profil={profil}
                      onConfirm={confirmer}
                      onRetour={() => {
                        setErreur("");
                        setEtape(3);
                      }}
                    />
                  )}
                </div>
              </div>
              <p className="mt-4 flex items-start gap-2 rounded-md bg-accent-50 p-3 text-[11px] leading-relaxed text-accent-900">
                <i className="ri-flask-line mt-0.5"></i>
                {t("acces.demoHint")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}
