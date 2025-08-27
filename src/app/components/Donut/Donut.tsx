import { DonutProps } from "./types";

const Donut: React.FC<DonutProps> = ({
  percentage, size = 200, thickness = 30, innerRadius = 70
}) => {
  const ratio = Math.max(0, Math.min(1, percentage / 100));
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;



  // Ángulo del extremo (en radianes) dentro del <g rotate(-90 ...)>
  const angle = 2 * Math.PI * ratio;
  const endX = cx + r * Math.cos(angle);
  const endY = cy + r * Math.sin(angle);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="[filter:drop-shadow(0_6px_10px_rgba(0,0,0,0.12))]">
      {/* Rotamos para que el inicio esté arriba (12 en punto) */}
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r}  className="stroke-green-10" strokeWidth={thickness} fill="none" strokeLinecap="round" />

        {/* Progreso con inicio PLANO */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
         className="stroke-green-90"
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="butt"              // <— plano en el inicio (arriba)
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />

        {/* “Cap” redondo solo en el extremo final */}
        {ratio > 0 && ratio < 1 && (
          <circle cx={endX} cy={endY} r={thickness / 2} className="fill-green-90" />
        )}
      </g>

      {/* hueco central */}
      <circle cx={cx} cy={cy} r={innerRadius} fill="none" />
    </svg>
  );
};

export default Donut;
