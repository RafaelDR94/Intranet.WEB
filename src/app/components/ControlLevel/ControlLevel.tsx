'use client';

import React, { type FC } from "react";
import clsx from "clsx";
import LinearLevel from "./components/LinearLevel/LinearLevel";
import SemicircleLevel from "./components/SemiCircle/SemiCircle";
import useControlLevel from "./hooks/useControlLevel";
import { containerBaseClass, linearOffsetClass, titleClass } from "./styles";
import type { ControlLevelProps } from "./types";

export const ControlLevel: FC<ControlLevelProps> = (props) => {
  const {
    title,
    showSemicircle,
    showLinear,
    min,
    max,
    divisions,
    labelMode,
    decimals,
    level,
    label,
    setLevel: handleLevelChange,
    shouldOffsetLinear,
    className,
  } = useControlLevel(props);

  return (
    <div className={clsx(containerBaseClass, className)}>
      {title && <div className={titleClass}>{title}</div>}

      {showSemicircle && (
        <SemicircleLevel
          min={min}
          max={max}
          divisions={divisions}
          level={level}
          setLevel={handleLevelChange}
          label={label}
          labelMode={labelMode}
          decimals={decimals}
        />
      )}

      {showLinear && (
        <div className={clsx(shouldOffsetLinear ? linearOffsetClass : undefined)}>
          <LinearLevel
            min={min}
            max={max}
            divisions={divisions}
            level={level}
            setLevel={handleLevelChange}
            labelMode={labelMode}
            decimals={decimals}
          />
        </div>
      )}
    </div>
  );
};
