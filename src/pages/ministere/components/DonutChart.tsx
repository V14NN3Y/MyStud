import CountUp from "@/components/base/CountUp";
interface DonutSegment {
  id: string;
  label: string;
  value: number;
  color: string;
}
interface DonutChartProps {
  segments: DonutSegment[];
  centerLabel: string;
  centerValue: number | string;
  centerSuffix?: string;
  suffix?: string;
}
export default function DonutChart({
  segments,
  centerLabel,
  centerValue,
  centerSuffix = "",
  suffix = "",
}: DonutChartProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;
  let acc = 0;
  const stops = segments
    .map((seg) => {
      const start = (acc / total) * 100;
      acc += seg.value;
      const end = (acc / total) * 100;
      return `oklch(${seg.color}) ${start}% ${end}%`;
    })
    .join(", ");
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full" style={{ backgroundImage: `conic-gradient(${stops})` }}>
        <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-background-50">
          <span className="text-lg font-bold text-foreground-950">
            <CountUp value={centerValue} suffix={centerSuffix} />
          </span>
          <span className="text-[10px] uppercase tracking-wide text-foreground-500">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full max-w-xs space-y-3">
        {segments.map((seg) => (
          <li key={seg.id} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-foreground-700">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: `oklch(${seg.color})` }}></span>
              {seg.label}
            </span>
            <span className="text-sm font-semibold text-foreground-950">
              <CountUp value={seg.value} suffix={suffix} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
