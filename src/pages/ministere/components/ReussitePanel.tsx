import { useEffect, useState } from "react";
import CountUp from "@/components/base/CountUp";
import { tauxReussiteNiveaux } from "@/mocks/ministere";
export default function ReussitePanel() {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div className="space-y-6">
      {tauxReussiteNiveaux.map((item, index) => (
        <div key={item.niveau}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground-900">{item.niveau}</span>
            <span className="text-sm font-bold text-foreground-950">
              <CountUp value={item.taux} suffix=" %" />
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-background-200">
            <div
              className="h-full rounded-full bg-accent-500 transition-[width] duration-1000 ease-out"
              style={{ width: grown ? `${item.taux}%` : "0%", transitionDelay: `${index * 90}ms` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
