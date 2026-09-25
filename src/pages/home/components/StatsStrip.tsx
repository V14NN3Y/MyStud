import { useTranslation } from "react-i18next";
import CountUp from "@/components/base/CountUp";
import { chiffresCles } from "@/mocks/referentiels";
export default function StatsStrip() {
  const { t } = useTranslation();
  return (
    <section className="relative z-20 w-full px-4 md:px-6">
      <div className="mx-auto -mt-14 grid w-full max-w-6xl grid-cols-2 gap-3 rounded-lg border border-background-200 bg-background-50 p-4 md:-mt-16 md:grid-cols-4 md:gap-4 md:p-6">
        {chiffresCles.map((item, index) => (
          <div
            key={item.labelKey}
            className={`flex flex-col items-start gap-2 px-1 py-2 md:px-2 ${
              index !== 0 ? "md:border-l md:border-background-200" : ""
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-100">
              <i className={`${item.icon} text-lg text-accent-800`}></i>
            </span>
            <CountUp
              value={item.valeur}
              className="font-heading text-2xl font-bold tracking-tight text-foreground-950 md:text-3xl"
            />
            <span className="text-xs leading-snug text-foreground-600 md:text-sm">
              {t(item.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
