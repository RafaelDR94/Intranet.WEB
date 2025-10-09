"use client";
import React from "react";

import useActivitiesViewer from "./hooks/useActivitiesViewe";
import type { ActivitiesViewerProps } from "./types";

import { Card } from "@/app/components/Card/Card";
import PaginationDots from "@/app/components/PaginationDots/PaginationDots";

/**
 * Visor paginado de actividades con layout responsivo.
 *
 * Calcula automaticamente cuantas columnas (1..3) caben en el contenedor y
 * muestra hasta dos filas por pagina. En dispositivos mobiles rota las
 * tarjetas a orientacion horizontal.
 *
 * @remarks
 * - Usa un `ResizeObserver` dentro del hook `useActivitiesViewer` para
 *   recalcular columnas cuando cambia el ancho disponible.
 * - El paginador solo aparece cuando hay mas de una pagina.
 * - Puedes forzar el numero de columnas pasando `columns` (util para pruebas
 *   o contenedores con ancho fijo).
 *
 * @accessibility
 * - El contenedor expone `data-testid` configurable (`dataTestId`).
 * - Los botones de paginacion provienen de `PaginationDots`, que ya incluye
 *   atributos ARIA para describir la pagina activa.
 */
export const ActivitiesViewer = <TRow,>({
  items,
  dataTestId = "activities-viewer",
  maxWidthClassName = "max-w-6xl",
  columns,
  forcehorizontal,
  forcevertical,
}: ActivitiesViewerProps<TRow>) => {
  const {
    isMobile,
    pageItems,
    start,
    totalPages,
    containerRef,
    effectiveCols,
    currentInWindow,
    visibleCount,
    windowStart,
    setPage,
  } = useActivitiesViewer<TRow>(items, columns);

  const orientation: "horizontal" | "vertical" = React.useMemo(() => {
    if (forcevertical) return "vertical";
    if (forcehorizontal) return "horizontal";
    return isMobile ? "horizontal" : "vertical";
  }, [forcevertical, forcehorizontal, isMobile]);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={`w-full mx-auto ${maxWidthClassName}`}
        data-testid={dataTestId}
      >
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${effectiveCols}, minmax(0, 1fr))` }}
          data-testid={`${dataTestId}-grid`}
        >
          {pageItems.map((it, idx) => (
            <div key={`${start + idx}`} className="flex justify-center">
              <Card<any>
                orientation={orientation}
                imageSrc={it.image ?? ""}
                fallbackSrc={it.image ?? ""}
                label=""
                title={it.title}
                description={it.description ?? ""}
                showPrimaryButton={false}
                showSecondaryButton={false}
                onAccept={() => {}}
                actionMenuProps={it.actionMenuProps}
              />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <PaginationDots
              totalPages={visibleCount}
              currentPage={currentInWindow}
              onPageChange={localIdx => setPage(windowStart + localIdx)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesViewer;

