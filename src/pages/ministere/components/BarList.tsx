import { useEffect, useState } from "react";
import CountUp from "@/components/base/CountUp";
interface BarItem {
  id: string;
  label: string;
  sub?: string;
  value: number;
}
interface BarListProps {
  items: BarItem[];
  total: number;
  accentClass?: string;
  suffix?: string;
  delayBase?: boolean;
}
export default function BarList({
  items,
  total,
  accentClass = "bg-primary-500",
  suffix = "",
  delayBase = false,
}: BarListProps) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const pct = Math.max((item.value / max) * 100, 3);
        const part = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
        return (
          <div key={item.id} className={`reveal ${delayBase ? `delay-${(index % 5) + 1}` : ""}`}>
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground-950">{item.label}</p>
                {item.sub && <p className="truncate text-xs text-foreground-500">{item.sub}</p>}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-foreground-950">
                  <CountUp value={item.value} suffix={suffix} />
                </p>
                <p className="text-[11px] text-foreground-500">{part} %</p>
              </div>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-background-200">
              <div
                className={`h-full rounded-full ${accentClass} transition-[width] duration-1000 ease-out`}
                style={{ width: grown ? `${pct}%` : "0%", transitionDelay: `${(index % 6) * 70}ms` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
