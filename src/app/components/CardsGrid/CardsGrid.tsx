"use client";

import React from "react";

import { Card } from "@/app/components/Card/Card";
import Pagination from "@/app/components/Pagination/Pagination";
import Default1 from "@/assets/images/DefautlImagesCards/Default1.png";
import Default2 from "@/assets/images/DefautlImagesCards/Default2.png";
import Default3 from "@/assets/images/DefautlImagesCards/Default3.png";
import clsx from "clsx";

import { CardsGridProps } from "./types";
import useCardsGrid from "./hooks/useCardsGrid";
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";

/**
 * Grilla de tarjetas con paginacion adaptive.
 *
 * Ajusta automaticamente el numero de columnas segun el breakpoint actual
 * y limita la paginacion a un maximo de dos filas por pagina. Permite
 * customizar los campos mostrados mediante el adaptador `adapt`.
 *
 * @remarks
 * - Si `adapt.cardsPerPage` o `rowsPerPage` solicitan mas tarjetas de las
 *   que caben en dos filas, se limita al maximo permitido para mantener el
 *   layout consistente.
 * - Cuando la fuente no provee imagen, se rota entre tres imagenes por
 *   defecto (`Default1`, `Default2`, `Default3`).
 * - El componente delega la logica de paginacion a `useCardsGrid`, lo que
 *   facilita las pruebas unitarias del comportamiento interno.
 *
 * @accessibility
 * - Las tarjetas reutilizan el componente `Card`, que expone semantica y
 *   botones accesibles.
 * - El paginador usa botones nativos a traves de `Pagination`.
 */
export function CardsGrid<T>({ data, adapt, rowsPerPage }: Readonly<CardsGridProps<T>>) {
  const { pageItems, gridCols, page, getVal, pageSize, totalPages, setPage } = useCardsGrid({
    data,
    adapt,
    rowsPerPage,
  });
  const isMobile = useIsMobile();
  const defaultImages = React.useMemo(() => [Default1.src, Default2.src, Default3.src], []);

  return (
    <div className="w-full">
      <div className={clsx("grid gap-4 md:gap-5 justify-items-center", isMobile ? "mt-5" : "mt-20", gridCols)}>
        {pageItems.map((row, idx) => {
          const absoluteIndex = (page - 1) * pageSize + idx;
          const defaultSrc = defaultImages[absoluteIndex % defaultImages.length];
          const rawSrc = getVal(row, adapt.imageKey, "");
          const candidateSrc = rawSrc && rawSrc.trim().length > 0 ? rawSrc : defaultSrc;
          const menuProps = adapt.actionMenuProps?.(row);

          return (
            <Card
              key={(row as any).id ?? `${page}-${idx}`}
              orientation={isMobile ? "horizontal" : "vertical"}
              imageSrc={candidateSrc}
              fallbackSrc={defaultSrc}
              label={getVal(row, adapt.labelKey, "")}
              title={getVal(row, adapt.titleKey, "")}
              description={getVal(row, adapt.descriptionKey, "")}
              onAccept={() => adapt.onPrimaryAction(row)}
              onCancel={adapt.onSecondaryAction ? () => adapt.onSecondaryAction!(row) : undefined}
              showPrimaryButton={adapt.showPrimaryButton !== false}
              showSecondaryButton={!!adapt.showSecondaryButton}
              primaryLabel={adapt.primaryLabel ?? "Ver"}
              secondaryLabel={adapt.secondaryLabel ?? "Cancelar"}
              actionMenuProps={menuProps as any}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center px-3">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default CardsGrid;
