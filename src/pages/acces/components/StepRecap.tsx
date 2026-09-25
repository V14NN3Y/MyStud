import { useTranslation } from "react-i18next";
interface StepperProps {
  etape: number;
  etapes: { titre: string; icone: string }[];
  onGoTo: (etape: number) => void;
}
export default function Stepper({ etape, etapes, onGoTo }: StepperProps) {
  const { t } = useTranslation();
  return (
    <ol className="flex w-full items-start">
      {etapes.map((item, index) => {
        const numero = index + 1;
        const atteinte = numero < etape;
        const courante = numero === etape;
        return (
          <li key={item.titre} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span
                className={`h-[2px] flex-1 transition-colors duration-500 ${
                  index === 0 ? "bg-transparent" : atteinte || courante ? "bg-primary-400" : "bg-background-300"
                }`}
              ></span>
              <button
                type="button"
                disabled={!atteinte}
                onClick={() => atteinte && onGoTo(numero)}
                aria-current={courante ? "step" : undefined}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                  atteinte
                    ? "cursor-pointer border-primary-500 bg-primary-500 text-background-50"
                    : courante
                      ? "border-primary-500 bg-background-50 text-primary-700 animate-pulse-ring"
                      : "border-background-300 bg-background-50 text-foreground-500"
                }`}
              >
                {atteinte ? <i className="ri-check-line text-lg"></i> : <i className={`${item.icone} text-lg`}></i>}
              </button>
              <span
                className={`h-[2px] flex-1 transition-colors duration-500 ${
                  index === etapes.length - 1 ? "bg-transparent" : atteinte ? "bg-primary-400" : "bg-background-300"
                }`}
              ></span>
            </div>
            <span
              className={`mt-2 hidden text-center text-[11px] font-medium leading-tight sm:block ${
                courante ? "text-primary-800" : atteinte ? "text-foreground-700" : "text-foreground-500"
              }`}
            >
              {t("acces.step")} {numero} · {item.titre}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
