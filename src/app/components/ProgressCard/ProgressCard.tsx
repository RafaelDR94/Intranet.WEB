"use client";
import clsx from 'clsx';
import React from 'react';

import type { ProgressCardProps } from './types';
import Donut from '@/app/components/Donut/Donut';
import { classes as s, baseCard } from './styles';
import { useIsMobile } from '../DataTable/components/DataTableLayout/hooks/useMediaQuery';

export const ProgressCard: React.FC<ProgressCardProps> = ({
  percentage,
  title = 'Progreso',
  subtitle = 'Reporte del progreso del trabajo',
  size = 180,
  dataTestId = 'progress-card',
  className,
}) => {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  const isMobile = useIsMobile();
  const finalSize = isMobile?size-40:size
  return (
    <div className={clsx(baseCard, className)} data-testid={dataTestId}>
      <div className={s.grid}>
        <div className={s.leftCol}>
          <h3 className={s.title}>{title}</h3>
          <p className={s.subtitle}>{subtitle}</p>

          <div className={s.statsWrapper}>
            <div className={s.statsValue}>{pct}%</div>
            <div className={s.statsLabel}>Completado</div>
          </div>
        </div>

        <div className={s.donutCol}>
          <div className={s.donutWrapper} data-testid={`${dataTestId}-donut`}>
            <Donut
              percentage={pct}
              size={finalSize}
              thickness={24}
              innerRadius={finalSize / 2 - 28}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
