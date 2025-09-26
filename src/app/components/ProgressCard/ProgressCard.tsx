"use client";
import clsx from 'clsx';
import React from 'react';

import type { ProgressCardProps } from './types';

import Donut from '@/app/components/Donut/Donut';


const baseCard = 'bg-white rounded-xl shadow-sm   p-2 md:p-4';

export const ProgressCard: React.FC<ProgressCardProps> = ({
  percentage,
  title = 'Progreso',
  subtitle = 'Reporte del progreso del trabajo',
  size = 180,
  dataTestId = 'progress-card',
  className,
}) => {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  return (
    <div className={clsx(baseCard, className)} data-testid={dataTestId}>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-1 ">
        <div className="space-y-1">
          <h3 className="text-s1 font-semibold text-green-100">{title}</h3>
          <p className="text-d3 font-medium text-gray-90">{subtitle}</p>

          <div className="pt-20">
            <div className="text-s1 font-semibold text-green-100">{pct}%</div>
            <div className="text-d3 font-medium text-gray-90">Completado</div>
          </div>
        </div>

        <div className="flex justify-center md:justify-center">
          <div data-testid={`${dataTestId}-donut`}>
            <Donut percentage={pct} size={size} thickness={24} innerRadius={size / 2 - 28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;

