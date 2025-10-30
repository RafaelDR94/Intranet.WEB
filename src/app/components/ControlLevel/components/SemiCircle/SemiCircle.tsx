import React, { type FC } from "react";
import useSemicircleLevel from "./hooks/useSemicircleLevel";
import {
  containerClass,
  defaultActiveClasses,
  defaultBackgroundClass,
  defaultHubClass,
  svgBaseClass,
} from "./styles";
import type { SemicircleProps, StyledProps } from "./types";

const SemicircleLevel: FC<SemicircleProps & StyledProps> = ({
  min,
  max,
  divisions,
  level,
  setLevel,
  label,
  backgroundClass = defaultBackgroundClass,
  activeClasses = defaultActiveClasses,
  hubClass = defaultHubClass,
}) => {
  const {
    svgRef,
    backgroundSlices,
    activeSlices,
    hubPath,
    viewBox,
    onClick,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onKeyDown,
    sectorPathFromTo,
  } = useSemicircleLevel({
    min,
    max,
    divisions,
    level,
    setLevel,
  });

  const palette =
    activeClasses && activeClasses.length > 0
      ? activeClasses
      : defaultActiveClasses;

  return (
    <div className={containerClass}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={level}
        tabIndex={0}
        className={svgBaseClass}
        onKeyDown={onKeyDown}
      >
        {backgroundSlices.map(({ start, end, index }) => (
          <path
            key={`bg-${index}`}
            d={sectorPathFromTo(start, end)}
            fill="currentColor"
            className={backgroundClass}
          />
        ))}

        {activeSlices.map(({ start, end, index }) => (
          <path
            key={`fg-${index}`}
            d={sectorPathFromTo(start, end)}
            fill="currentColor"
            className={palette[index % palette.length]}
          />
        ))}

        <path d={hubPath} fill="currentColor" className={hubClass} />
      </svg>

      {label && (
        <div className="text-center text-b2 mt-1 text-gray-70 font-medium">{label}</div>
      )}
    </div>
  );
};

export default SemicircleLevel;
