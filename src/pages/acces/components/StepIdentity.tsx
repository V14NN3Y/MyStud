import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
interface StepIdentityProps {
  npi: string;
  telephone: string;
  erreur: string;
  onChange: (patch: { npi?: string; telephone?: string }) => void;
  onSubmit: () => void;
}
export default function StepIdentity({ npi, telephone, erreur, onChange, onSubmit }: StepIdentityProps) {
  const { t } = useTranslation();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  return (
    <form onSubmit={submit} className="animate-fade-up space-y-5">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
          {t("acces.step")} 1 · {t("acces.step1.title")}
        </span>
        <h2 className="mt-3 font-heading text-xl font-bold text-foreground-950">
          {t("acces.step1.title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-600">{t("acces.step1.desc")}</p>
      </header>
      <div>
        <label htmlFor="npi" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600">
          {t("acces.npi")}
        </label>
        <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-3 focus-within:border-primary-400">
          <i className="ri-fingerprint-line text-lg text-foreground-500"></i>
          <input
            id="npi"
            name="npi"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={npi}
            onChange={(e) => onChange({ npi: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            placeholder="Ex. 1234567890"
            className="w-full bg-transparent text-sm tracking-[0.15em] text-foreground-950 outline-none placeholder:tracking-normal placeholder:text-foreground-500"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-foreground-500">{t("acces.npiHint")}</p>
      </div>
      <div>
        <label htmlFor="telephone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600">
          {t("acces.telephone")}
        </label>
        <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-3 focus-within:border-primary-400">
          <span className="flex items-center gap-1.5 border-r border-background-300 pr-2 text-sm font-medium text-foreground-700">
            <i className="ri-smartphone-line text-base"></i>
            +229
          </span>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            value={telephone}
            onChange={(e) => onChange({ telephone: e.target.value.replace(/[^\d\s]/g, "").slice(0, 12) })}
            placeholder="01 XX XX XX XX"
            className="w-full bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-500"
          />
        </div>
      </div>
      {erreur && (
        <p className="animate-scale-in flex items-start gap-2 rounded-md border border-secondary-200 bg-secondary-50 p-3 text-xs text-secondary-900">
          <i className="ri-error-warning-line mt-0.5 text-base"></i>
          {erreur}
        </p>
      )}
      <button
        type="submit"
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
      >
        <i className="ri-send-plane-line text-base"></i>
        {t("acces.sendCode")}
      </button>
      <p className="flex items-start gap-2 rounded-md bg-background-100 p-3 text-[11px] leading-relaxed text-foreground-600">
        <i className="ri-flask-line mt-0.5 text-secondary-600"></i>
        {t("acces.demoHint")}
      </p>
    </form>
  );
}
