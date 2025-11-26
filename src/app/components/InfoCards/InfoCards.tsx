"use client";
import clsx from "clsx";
import React, { useMemo } from "react";
import Image from "next/image";
import type { InfoCardsProps } from "./types";

import { useMediaBreakpoints } from "@/app/components/DynamicForm/hooks/useMediaBreakpoints";
import type { ResponsiveLayoutMatrix } from "@/app/components/DynamicForm/types";
import {
  containerCls,
  rowGridCls,
  cardBaseCls,
  labelCls,
  valueCls,
  staticCls,
} from "./styles";
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";

function resolveEffectiveLayout(
  layoutMatrix: number[][] | undefined,
  responsiveLayoutMatrix: ResponsiveLayoutMatrix | undefined,
  current: "sm" | "md" | "lg",
): number[][] | undefined {
  if (layoutMatrix?.length) return layoutMatrix;
  if (!responsiveLayoutMatrix) return undefined;
  const order: Array<keyof ResponsiveLayoutMatrix> =
    current === "lg"
      ? ["lg", "md", "sm"]
      : current === "md"
        ? ["md", "sm", "lg"]
        : ["sm", "md", "lg"];
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
  dataTestId = "info-cards",
}) => {
  const { current } = useMediaBreakpoints(breakpoints ?? { sm: 640, md: 1024 });
  const isMobile = useIsMobile();
  const effective = useMemo(
    () => resolveEffectiveLayout(layoutMatrix, responsiveLayoutMatrix, current),
    [layoutMatrix, responsiveLayoutMatrix, current],
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
      <div
        className={clsx(
          "w-full space-y-4 md:space-y-5",
          maxWidthClassName && ["mx-auto", maxWidthClassName],
        )}
      >
        {rows.map((row, rIdx) => (
          <div
            className={rowGridCls}
            key={`${dataTestId}-row-${rIdx}`}
            data-testid={`${dataTestId}-row-${rIdx}`}
          >
            {row.cardIndexes.map((cardIdx, cIdx) => {
              const span = row.widths[cIdx] ?? 10;
              const card = cards[cardIdx] ?? [];
              return (
                <div
                  key={`card-${cardIdx}`}
                  className={clsx(
                    cardBaseCls,
                    cardClassName,
                    staticCls,
                    "w-full",
                  )}
                  style={{ ["--span" as any]: String(span) }}
                  data-testid={`${dataTestId}-card-${cardIdx}`}
                >
                  <div className="space-y-1">
                    {card.map((item, iIdx) => (
                      <div
                        key={`kv-${item.dataTestId}-${iIdx}`}
                        className={clsx("text-sm", itemClassName)}
                        data-testid={item.dataTestId}
                      >
                        <div className="flex gap-1">
                          {item.icon && (
                            <item.icon
                              className={isMobile ? "h-10 w-10" : ""}
                            />
                          )}
                          <span className={labelCls}>{item.label}: </span>
                          {!isMobile && (
                            <span className={valueCls}>
                              {item.value ?? "—"}
                            </span>
                          )}
                        </div>

                        <div>
                          {item.src && (
                            <Image src={item.src} alt="" width={100} height={100} style={{marginBlock: '1rem'}}/>
                          )}
                        </div>

                        {isMobile && (
                          <span className={valueCls}>{item.value ?? "—"}</span>
                        )}
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
