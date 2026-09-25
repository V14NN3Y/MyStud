import CountUp from "@/components/base/CountUp";
interface KpiItem {
  key: string;
  label: string;
  valeur: string;
  unite: string;
  icon: string;
  tendance: string;
  positif: boolean;
}
interface KpiGridProps {
  items: KpiItem[];
}
export default function KpiGrid({ items }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <article
          key={item.key}
          className={`reveal hover-lift flex flex-col rounded-lg border border-background-200 bg-background-50 p-5 ${
            index < 4 ? `delay-${index + 1}` : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-background-100">
              <i className={`${item.icon} text-lg text-primary-700`}></i>
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                item.positif ? "bg-primary-100 text-primary-800" : "bg-secondary-100 text-secondary-900"
              }`}
            >
              <i className={item.positif ? "ri-arrow-up-line" : "ri-arrow-down-line"}></i>
              {item.tendance}
            </span>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground-950">
            <CountUp value={item.valeur} />
          </p>
          <p className="mt-1 text-xs leading-relaxed text-foreground-600">{item.label}</p>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-foreground-400">{item.unite}</p>
        </article>
      ))}
    </div>
  );
}
