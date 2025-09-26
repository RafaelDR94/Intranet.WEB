"use client";
import clsx from 'clsx';
import React, { useMemo } from 'react';

import type { InfoCardsProps } from './types';

import { useMediaBreakpoints } from '@/app/components/DynamicForm/hooks/useMediaBreakpoints';
import type { ResponsiveLayoutMatrix } from '@/app/components/DynamicForm/types';


const containerCls = 'space-y-3 w-full';
const rowGridCls = 'grid grid-cols-10 gap-y-4 gap-x-5 md:gap-x-6 w-full isolate';
const cardBaseCls = 'bg-white rounded-xl shadow-sm border border-gray-200 p-4';
const labelCls = 'font-semibold text-gray-90 text-b3';
const valueCls = 'text-gray-90 text-b3';

function resolveEffectiveLayout(
  layoutMatrix: number[][] | undefined,
  responsiveLayoutMatrix: ResponsiveLayoutMatrix | undefined,
  current: 'sm' | 'md' | 'lg'
): number[][] | undefined {
  if (layoutMatrix?.length) return layoutMatrix;
  if (!responsiveLayoutMatrix) return undefined;
  const order: Array<keyof ResponsiveLayoutMatrix> =
    current === 'lg' ? ['lg', 'md', 'sm'] : current === 'md' ? ['md', 'sm', 'lg'] : ['sm', 'md', 'lg'];
  for (const key of order) {
    const candidate = responsiveLayoutMatrix[key];
    if (candidate?.length) return candidate;
  }
  return undefined;
}

export const InfoCards: React.FC<InfoCardsProps> = ({
  cards,
  layoutMatrix,
  responsiveLayoutMatrix,
  breakpoints,
  className,
  maxWidthClassName,
  cardClassName,
  itemClassName,
  dataTestId = 'info-cards',
}) => {
  const { current } = useMediaBreakpoints(breakpoints ?? { sm: 640, md: 1024 });

  const effective = useMemo(
    () => resolveEffectiveLayout(layoutMatrix, responsiveLayoutMatrix, current),
    [layoutMatrix, responsiveLayoutMatrix, current]
  );

  // Construye filas a partir de la matriz de layout, consumiendo tarjetas en orden
  const rows = useMemo(() => {
    const result: { widths: number[]; cardIndexes: number[] }[] = [];
    let idx = 0;
    if (!effective || effective.length === 0) {
      // todo full width
      while (idx < cards.length) {
        result.push({ widths: [10], cardIndexes: [idx] });
        idx++;
      }
      return result;
    }
    for (const widths of effective) {
      const slots = widths.length;
      const cardIndexes: number[] = [];
      for (let i = 0; i < slots && idx < cards.length; i++) {
        cardIndexes.push(idx++);
      }
      if (cardIndexes.length > 0) result.push({ widths, cardIndexes });
      if (idx >= cards.length) break;
    }
    // Si quedan tarjetas sin asignar, agregarlas en filas full width
    while (idx < cards.length) {
      result.push({ widths: [10], cardIndexes: [idx++] });
    }
    return result;
  }, [cards, effective]);

  return (
    <div className={clsx(containerCls, className)} data-testid={dataTestId}>
      <div className={clsx('w-full space-y-4 md:space-y-5', maxWidthClassName && ['mx-auto', maxWidthClassName])}>
        {rows.map((row, rIdx) => (
          <div className={rowGridCls} key={`${dataTestId}-row-${rIdx}`} data-testid={`${dataTestId}-row-${rIdx}`}>
            {row.cardIndexes.map((cardIdx, cIdx) => {
              const span = row.widths[cIdx] ?? 10;
              const card = cards[cardIdx] ?? [];
              return (
                <div
                  key={`card-${cardIdx}`}
                  className={clsx(
                    cardBaseCls,
                    cardClassName,
                    // clase estática usando arbitrary property
                    '[grid-column:span_var(--span)_/_span_var(--span)]',
                    'w-full'
                  )}
                  style={{ ['--span' as any]: String(span) }}
                  data-testid={`${dataTestId}-card-${cardIdx}`}
                >
                  <div className="space-y-1">
                    {card.map((item, iIdx) => (
                      <div key={`kv-${item.dataTestId}-${iIdx}`} className={clsx('text-sm', itemClassName)} data-testid={item.dataTestId}>
                        <span className={labelCls}>{item.label}: </span>
                        <span className={valueCls}>{item.value ?? '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCards;
