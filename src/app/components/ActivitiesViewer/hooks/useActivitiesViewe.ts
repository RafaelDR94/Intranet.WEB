
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "../../DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { Item } from "../types";
/**
 * Calcula columnas, paginacion y orientacion responsiva para ActivitiesViewer.
 *
 * @param items - Actividades a renderizar.
 * @param columns - Numero de columnas forzado (1..3).
 * @returns Estado derivado para pintar la grilla y navegar por paginas.
 */
const useActivitiesViewer = (items: Item[], columns?: number) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cols, setCols] = useState(3); // nÃºmero de columnas efectivo (1..3)
  const isMobile = useIsMobile();
  // Medir ancho del contenedor y resolver columnas (1..3) segÃºn cardWidth estimado

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const GAP = 24; // gap-6
    const CARD_W = 280; // coincide con Card vertical

    const compute = () => {
      const w = el.clientWidth;
      const possible = Math.floor((w + GAP) / (CARD_W + GAP));
      const resolved = Math.max(1, Math.min(3, possible));
      setCols(resolved);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Page size dinÃ¡mico (hasta 3 filas)
  const rows = 2;
  const forcedCols = columns && columns >= 1 && columns <= 3 ? columns : undefined;
  const effectiveCols = forcedCols ?? cols;
  const effectivePageSize = effectiveCols * rows;
  const [page, setPage] = useState(0);

  // Reajusta pÃ¡gina si cambian columnas y la pÃ¡gina actual queda fuera de rango
  useEffect(() => {
    const total = Math.max(1, Math.ceil((items?.length ?? 0) / effectivePageSize));
    if (page >= total) setPage(0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, items, effectivePageSize]);

  const totalPages = Math.max(1, Math.ceil((items?.length ?? 0) / effectivePageSize));
  const start = page * effectivePageSize;
  const pageItems = (items ?? []).slice(start, start + effectivePageSize);

  // ventana de 3 puntos mÃ¡ximo
  const windowStart = Math.floor(page / 3) * 3;
  const visibleCount = Math.min(3, totalPages - windowStart);
  const currentInWindow = page - windowStart;
  return {isMobile, start, containerRef, effectiveCols, pageItems, totalPages, visibleCount, currentInWindow, windowStart, setPage };
};

export default useActivitiesViewer;

