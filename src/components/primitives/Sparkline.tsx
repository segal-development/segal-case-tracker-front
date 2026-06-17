interface SparklineProps {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fillSoft?: boolean;
}

export function Sparkline({ data, w = 120, h = 32, color = "var(--fj-primary)", fillSoft = true }: SparklineProps) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as [number, number];
  });
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${path} L${w} ${h} L0 ${h}Z`;
  return (
    <svg width={w} height={h}>
      {fillSoft && <path d={area} fill="var(--fj-primary-soft)" opacity=".7" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
