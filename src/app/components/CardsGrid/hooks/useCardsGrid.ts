import { useState, useMemo } from "react"

import { useMediaBreakpoints } from "../../DynamicForm/hooks/useMediaBreakpoints"

import { KeyOrFn ,CardsGridProps} from "../types"
/**
 * Calcula el grid y la paginacion maximo dos filas para CardsGrid.
 *
 * @param props - Entrada con datos, adaptadores y configuraciones.
 * @returns Estado memorizado para renderizar tarjetas y paginar.
 */
function useCardsGrid<T>({ rowsPerPage, adapt, data }: CardsGridProps<T>) {
    const getVal = <T,>(row: T, k?: KeyOrFn<T>, fallback = ''): string => {
        if (!k) return fallback
        return typeof k === 'function' ? String(k(row) ?? fallback) : String((row as any)[k] ?? fallback)
    }

    const { current, width } = useMediaBreakpoints() // tÃ­picamente: 'sm' | 'md' | 'lg'



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




    // como mÃ¡ximo 2 filas => pageSize = cols * 2; respeta un valor menor si lo envÃ­an
    const desired = cols * 2
    const requested = adapt.cardsPerPage ?? rowsPerPage ?? desired
    const pageSize = Math.max(1, Math.min(desired, requested)) // nunca excede 2 filas, nunca < 1

    const [page, setPage] = useState(1)

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
