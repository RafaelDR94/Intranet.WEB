import { useState, useMemo, useEffect } from "react"

import { useMediaBreakpoints } from "../../DynamicForm/hooks/useMediaBreakpoints"

import { KeyOrFn, CardsGridProps } from "../types"

import { useIsMobile } from "../../DataTable/components/DataTableLayout/hooks/useMediaQuery";
/**
 * Calcula el grid y la paginacion maximo dos filas para CardsGrid.
 *
 * @param props - Entrada con datos, adaptadores y configuraciones.
 * @returns Estado memorizado para renderizar tarjetas y paginar.
 */
function useCardsGrid<T>({ rowsPerPage, adapt, data }: CardsGridProps<T>) {
    const isMobile = useIsMobile();
    const getVal = <T,>(row: T, k?: KeyOrFn<T>, fallback = ''): string => {
        if (!k) return fallback
        return typeof k === 'function' ? String(k(row) ?? fallback) : String((row as any)[k] ?? fallback)
    }

    const { current, width } = useMediaBreakpoints() // tó­picamente: 'sm' | 'md' | 'lg'

    const [viewportHeight, setViewportHeight] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 1080);
    useEffect(() => {
        const handleResize = () => setViewportHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    let gridCols = 'grid-cols-1'
    let cols = 1;
    if (current === 'lg') {
        if (width > 1780) { gridCols = 'grid-cols-5'; cols = 5; }
        else if (width > 1470 && width < 1780) { gridCols = 'grid-cols-4'; cols = 4; }
        else if (width <= 1470 && width >= 1160) { gridCols = 'grid-cols-3'; cols = 3; }
        else if (width < 1160) { gridCols = 'grid-cols-2'; cols = 2; }
    } else if (current === 'md') {
        gridCols = 'grid-cols-2';
        cols = 2;
    }

    const CARD_HEIGHT = isMobile ? 105 : 226; // px aprox.
    const RESERVED_SPACE = 450; // header/footer, margen inferior, etc.
    const usableHeight = Math.max(0, viewportHeight - RESERVED_SPACE);
    const rowsThatFit = Math.max(1, Math.floor(usableHeight / CARD_HEIGHT));


    // como mó¡ximo 2 filas => pageSize = cols * 2; respeta un valor menor si lo envó­an
    const desired = cols * rowsThatFit;
    const requested = adapt.cardsPerPage ?? rowsPerPage ?? desired
    const pageSize = Math.max(1, Math.min(desired, requested)) // nunca excede 2 filas, nunca < 1

    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(1)
    }, [data])

    const { totalPages, pageItems } = useMemo(() => {
        const total = Math.max(1, Math.ceil((data?.length ?? 0) / pageSize))
        const start = (page - 1) * pageSize
        const end = start + pageSize
        return {
            totalPages: total,
            pageItems: (data ?? []).slice(start, end),
        }
    }, [data, page, pageSize])
    return { getVal, totalPages, pageItems, setPage, page, gridCols, pageSize }
}
export default useCardsGrid;
