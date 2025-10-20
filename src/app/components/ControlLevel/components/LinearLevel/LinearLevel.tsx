import React, { type FC } from "react";
import useLinearLevel from "./hooks/useLinearLevel";
import {
  containerClass,
  fillBaseClass,
  tickBaseClass,
  tickInlineStyle,
  trackBaseClass,
} from "./styles";
import { LinearProps, StyleProps } from "./types";

/**
 * Props extra opcionales (clases de Tailwind)
 * - trackClass: color base del track (ej: bg-gray-70)
 * - fillClass:  color del relleno activo (ej: bg-green-80)
 * - dotActiveClass: color de puntos activos (ej: bg-green-80)
 * - dotInactiveClass: color de puntos inactivos (ej: bg-green-100/40)
 */
const LinearLevel: FC<LinearProps & StyleProps> = ({
  min,
  max,
  divisions,
  level,
  setLevel,
  trackClass = "bg-green-10",
  fillClass = "bg-green-100",
  dotActiveClass = "bg-green-90",
  dotInactiveClass = "bg-green-90/40",
}) => {
  const { barRef, percent, ticks, onMouseDown, onMouseMove, onMouseUp, onKeyDown } =
    useLinearLevel({
      min,
      max,
      divisions,
      level,
      setLevel,
    });

  return (
    <div className={containerClass}>
      <div
        ref={barRef}
        className={`${trackBaseClass} ${trackClass}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={level}
        onKeyDown={onKeyDown}
      >
        <div className={`${fillBaseClass} ${fillClass}`} style={{ width: `${percent * 100}%` }} />

        {ticks.map((i) => {
          const left = (i / divisions) * 100;
          const isActive = i / divisions <= percent + 1e-6;
          return (
            <div
              key={i}
              className={`${tickBaseClass} ${isActive ? dotActiveClass : dotInactiveClass}`}
              style={{
                ...tickInlineStyle,
                left: `${left}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LinearLevel;
