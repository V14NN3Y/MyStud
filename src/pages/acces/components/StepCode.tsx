import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
interface StepCodeProps {
  codeEnvoye: string;
  telephone: string;
  erreur: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onRetour: () => void;
}
const DUREE = 300;
const formaterTemps = (secondes: number) =>
  `${String(Math.floor(secondes / 60)).padStart(2, "0")}:${String(secondes % 60).padStart(2, "0")}`;
export default function StepCode({ codeEnvoye, telephone, erreur, onVerify, onResend, onRetour }: StepCodeProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [secondes, setSecondes] = useState(DUREE);
  useEffect(() => {
    setSecondes(DUREE);
    setCode("");
  }, [codeEnvoye]);
  useEffect(() => {
    if (secondes <= 0) return undefined;
    const timer = window.setInterval(() => setSecondes((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [secondes]);
  const expire = secondes <= 0;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (expire) return;
    onVerify(code);
  };
  return (
    <form onSubmit={submit} className="animate-fade-up space-y-5">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
          {t("acces.step")} 2 · {t("acces.step2.title")}
        </span>
        <h2 className="mt-3 font-heading text-xl font-bold text-foreground-950">{t("acces.step2.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-600">
          {t("acces.step2.desc")} — <span className="font-medium text-foreground-900">+229 {telephone}</span>
        </p>
      </header>
      <div className="flex items-center justify-between gap-3 rounded-md border border-accent-200 bg-accent-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-900">{t("acces.demoCode")}</p>
          <p className="font-heading text-lg font-bold tracking-[0.35em] text-accent-900">{codeEnvoye}</p>
        </div>
        <i className="ri-message-2-line text-2xl text-accent-700"></i>
      </div>
      <div>
        <label htmlFor="code" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600">
          {t("acces.code")}
        </label>
        <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-3 focus-within:border-primary-400">
          <i className="ri-lock-password-line text-lg text-foreground-500"></i>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="
-
-
-
-
-
- "
            className="w-full bg-transparent text-center font-heading text-xl font-bold tracking-[0.5em] text-foreground-950 outline-none placeholder:tracking-[0.3em] placeholder:text-foreground-400"
          />
        </div>
        <p className="mt-2 flex items-center justify-between gap-3 text-[11px]">
          <span className={expire ? "font-semibold text-secondary-700" : "text-foreground-500"}>
            <i className="ri-timer-line mr-1"></i>
            {expire ? "Code expiré" : `Expire dans ${formaterTemps(secondes)}`}
          </span>
          <button
            type="button"
            onClick={onResend}
            className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-primary-700 transition-colors hover:text-primary-800"
          >
            <i className="ri-refresh-line"></i>
            {t("acces.resend")}
          </button>
        </p>
      </div>
      {erreur && (
        <p className="animate-scale-in flex items-start gap-2 rounded-md border border-secondary-200 bg-secondary-50 p-3 text-xs text-secondary-900">
          <i className="ri-error-warning-line mt-0.5 text-base"></i>
          {erreur}
        </p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onRetour}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-300 bg-background-50 px-5 py-3.5 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300"
        >
          <i className="ri-arrow-left-line text-base"></i>
          {t("acces.retour")}
        </button>
        <button
          type="submit"
          disabled={expire || code.length < 6}
          className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-5 py-3.5 text-sm font-semibold transition-colors ${
            expire || code.length < 6
              ? "cursor-not-allowed bg-background-200 text-foreground-500"
              : "bg-primary-500 text-background-50 hover:bg-primary-600"
          }`}
        >
          <i className="ri-shield-check-line text-base"></i>
          {t("acces.verifyCode")}
        </button>
      </div>
    </form>
  );
}
