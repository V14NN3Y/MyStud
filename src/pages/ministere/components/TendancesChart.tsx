import { useEffect, useState } from "react";
import CountUp from "@/components/base/CountUp";
interface TendanceItem {
  annee: string;
  effectif: number;
}
interface TendancesChartProps {
  items: TendanceItem[];
}
const formatNombre = (n: number) => n.toLocaleString("fr-FR");
export default function TendancesChart({ items }: TendancesChartProps) {
  const max = Math.max(...items.map((item) => item.effectif), 1);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div className="flex h-64 w-full items-end justify-between gap-3 md:gap-6">
      {items.map((item, index) => {
        const h = Math.max((item.effectif / max) * 100, 8);
        const isLast = index === items.length - 1;
        return (
          <div key={item.annee} className="flex flex-1 flex-col items-center justify-end gap-3">
            <span className="text-[11px] font-semibold text-foreground-700">
              <CountUp value={Math.round(item.effectif / 1000)} suffix="k" />
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-md ${isLast ? "bg-primary-500" : "bg-primary-200"} transition-all duration-700 ease-out`}
                style={{ height: grown ? `${h}%` : "0%", transitionDelay: `${index * 80}ms` }}
                title={`${formatNombre(item.effectif)} étudiants`}
              ></div>
            </div>
            <span className={`text-xs font-medium ${isLast ? "text-primary-700" : "text-foreground-600"}`}>
              {item.annee}
            </span>
          </div>
        );
      })}
    </div>
  );
}
