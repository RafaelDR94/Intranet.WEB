import React from "react";

import { donutStyles as s } from "./styles";
import { DonutProps } from "./types";

/**
 * Renderiza un gráfico de **donut** (anillo) en SVG.
 *
 * Muestra una pista (track) y un trazo de progreso calculado con `strokeDasharray`
 * y `strokeDashoffset`. El inicio del trazo es **plano** (butt) a las 12 en punto
 * (se logra rotando el grupo -90°) y el extremo final se remata con un **cap** redondo.
 *
 * @remarks
 * - El componente es **controlado por props**: no guarda estado interno.
 * - Si `showLabel` es `true`, se dibuja el porcentaje centrado y escalado
 *   automáticamente en función de `size` e `innerRadius`.
 * - El color del texto usa `currentColor`, por lo que puedes controlarlo con Tailwind
 *   en el `<svg>` (p. ej. `className="text-blue-90"` desde `s.svg` o un wrapper).
 *
 * @accessibility
 * - El `<svg>` no define `aria-*` por defecto. Si el donut comunica información
 *   esencial, añade un nombre accesible (p. ej. con `aria-label` en el contenedor).
 * - El contenido numérico del label (si `showLabel`) puede ayudar a lectores de pantalla,
 *   pero no sustituye una descripción clara del contexto.
 *
 * @example Uso básico
 * ```tsx
 * <Donut percentage={65} />
 * ```
 *
 * @example Con etiqueta centrada y tamaño personalizado
 * ```tsx
 * <Donut percentage={72} size={160} thickness={24} innerRadius={54} showLabel />
 * ```
 */

const Donut: React.FC<DonutProps> = ({
  percentage,
  size = 200,
  thickness = 30,
  innerRadius = 70,
  showLabel = false, // <— NUEVO
  sizeLabel = "",
  colorLabel = "",
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

  // Tamaño del texto en función del tamaño y del hueco central
  // (clamp entre 10px y ~24% del diámetro total)
  const fontSize = Math.max(10, Math.min(innerRadius * 0.75, size * 0.24));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={s.svg}>
      {/* Rotamos para que el inicio esté arriba (12 en punto) */}
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          className={s.track}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
        />

        {/* Progreso con inicio PLANO */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          className={s.progress}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="butt" // plano en el inicio (arriba)
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />

        {/* “Cap” redondo solo en el extremo final */}
        {ratio > 0 && ratio < 1 && (
          <circle cx={endX} cy={endY} r={thickness / 2} className={s.cap} />
        )}
      </g>

      {/* Texto centrado (opcional) */}
      {showLabel && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={sizeLabel || fontSize}
          fontWeight={700}
          // usa el color del texto heredado; puedes controlar con Tailwind: `text-blue-90`, etc.
          fill={colorLabel || "currentColor"}
        >
          {`${Math.round(percentage)}%`}
        </text>
      )}

      {/* hueco central (visual, no perfora el SVG) */}
      <circle cx={cx} cy={cy} r={innerRadius} fill="none" />
    </svg>
  );
};

export default Donut;
