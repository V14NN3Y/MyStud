import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { series } from "@/mocks/referentiels";
export interface BacFormValues {
  numeroTable: string;
  serie: string;
  annee: string;
  email: string;
}
interface StepBacProps {
  values: BacFormValues;
  erreur: string;
  onChange: (patch: Partial<BacFormValues>) => void;
  onSubmit: () => void;
  onRetour: () => void;
}
const ANNEES = ["2026", "2025", "2024"];
export default function StepBac({ values, erreur, onChange, onSubmit, onRetour }: StepBacProps) {
  const { t } = useTranslation();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  return (
    <form onSubmit={submit} className="animate-fade-up space-y-5">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
          {t("acces.step")} 3 · {t("acces.step3.title")}
        </span>
        <h2 className="mt-3 font-heading text-xl font-bold text-foreground-950">{t("acces.step3.title")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground-600">{t("acces.step3.desc")}</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="numeroTable" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600">
            {t("acces.numeroTable")}
          </label>
          <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-3 focus-within:border-primary-400">
            <i className="ri-file-list-3-line text-lg text-foreground-500"></i>
            <input
              id="numeroTable"
              name="numeroTable"
              type="text"
              autoComplete="off"
              value={values.numeroTable}
              onChange={(e) => onChange({ numeroTable: e.target.value.toUpperCase().slice(0, 12) })}
              placeholder="Ex. 1278456"
              className="w-full bg-transparent text-sm tracking-wide text-foreground-950 outline-none placeholder:text-foreground-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="serie" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600">
            {t("acces.serie")}
          </label>
          <select
            id="serie"
            name="serie"
            value={values.serie}
            onChange={(e) => onChange({ serie: e.target.value })}
            className="w-full cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-3 text-sm text-foreground-900 outline-none focus:border-primary-400"
          >
            <option value="">—</option>
            {series.map((s) => (
              <option key={s} value={s}>
                Série {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="annee" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600">
            {t("acces.annee")}
          </label>
          <select
            id="annee"
            name="annee"
            value={values.annee}
            onChange={(e) => onChange({ annee: e.target.value })}
            className="w-full cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-3 text-sm text-foreground-900 outline-none focus:border-primary-400"
          >
            {ANNEES.map((annee) => (
              <option key={annee} value={annee}>
                Session {annee}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-foreground-600">
            {t("acces.email")}
          </label>
          <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-3 focus-within:border-primary-400">
            <i className="ri-mail-line text-lg text-foreground-500"></i>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="prenom.nom@exemple.bj"
              className="w-full bg-transparent text-sm text-foreground-950 outline-none placeholder:text-foreground-500"
            />
          </div>
        </div>
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
          className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-500 px-5 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
        >
          <i className="ri-search-eye-line text-base"></i>
          {t("acces.verifyBac")}
        </button>
      </div>
    </form>
  );
}
