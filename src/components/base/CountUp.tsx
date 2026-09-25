import useCountUp from "@/hooks/useCountUp";
interface CountUpProps {
  /** Number, or a formatted string such as "1 240" / "81,4". */
  value: number | string;
  /** Text appended right after the animated number (e.g. " %", "k"). */
  suffix?: string;
  /** Text placed before the animated number (e.g. "+"). */
  prefix?: string;
  /** Force the number of decimals; auto-detected from the string otherwise. */
  decimals?: number;
  /** Animation duration in milliseconds. */
  duration?: number;
  className?: string;
}
function parseValue(value: number | string) {
  if (typeof value === "number") {
    return { target: value, decimals: Number.isInteger(value) ? 0 : 2 };
  }
  const match = value.match(/-?\d[\d\s\u00a0.,]*/);
  if (!match) return { target: 0, decimals: 0 };
  const cleaned = match[0].replace(/[\s\u00a0]/g, "").replace(",", ".");
  const target = Number.parseFloat(cleaned) || 0;
  const dot = cleaned.indexOf(".");
  const decimals = dot >= 0 ? cleaned.length - dot - 1 : 0;
  return { target, decimals };
}
export default function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals,
  duration,
  className = "",
}: CountUpProps) {
  const parsed = parseValue(value);
  const finalDecimals = decimals ?? parsed.decimals;
  const { ref, value: current } = useCountUp({
    target: parsed.target,
    decimals: finalDecimals,
    duration,
  });
  const formatted = current.toLocaleString("fr-FR", {
    minimumFractionDigits: finalDecimals,
    maximumFractionDigits: finalDecimals,
  });
  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
