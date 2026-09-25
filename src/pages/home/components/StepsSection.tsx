import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/base/SectionHeading";
export default function StepsSection() {
  const { t } = useTranslation();
  const steps = [
    { key: "1", icon: "ri-fingerprint-line" },
    { key: "2", icon: "ri-file-shield-2-line" },
    { key: "3", icon: "ri-send-plane-line" },
  ];
  return (
    <section className="w-full bg-background-100 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          eyebrow={t("home.steps.eyebrow")}
          title={t("home.steps.title")}
          subtitle={t("home.steps.subtitle")}
          align="center"
        />
        <div className="relative mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-background-300 md:block"></div>
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`relative flex flex-col items-center rounded-lg border border-background-200 bg-background-50 px-6 py-8 text-center animate-fade-up delay-${index + 1}`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary-200 bg-primary-100">
                <i className={`${step.icon} text-2xl text-primary-700`}></i>
              </span>
              <span className="mt-4 inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-900">
                Étape {step.key}
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground-950">
                {t(`home.steps.${step.key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-600">
                {t(`home.steps.${step.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
