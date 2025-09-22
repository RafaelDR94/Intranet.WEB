import { useMemo } from 'react';
import { useMediaBreakpoints } from '@/app/components/DynamicForm/hooks/useMediaBreakpoints';

type Ellipsis = 'dots-left' | 'dots-right';

/**
 * Genera un modelo de paginacion responsivo con colapsado (...).
 * - Usa siblingCount segun breakpoint: xs:0, sm:1, md:2, lg:3
 * - Devuelve los items a renderizar y helpers para saltos por bloques.
 */
export default function usePagination(currentPage: number, totalPages: number = 1) {
  const { current } = useMediaBreakpoints(); // 'sm' | 'md' | 'lg' (xs por descarte)

  const siblingCount =
    current === 'lg' ? 3 :
    current === 'md' ? 2 :
    current === 'sm' ? 1 : 0;

  const blockJump = Math.max(3, 2 * siblingCount + 1);

  const items = useMemo<(number | Ellipsis)[]>(() => {
    const DOTS_LEFT: Ellipsis = 'dots-left';
    const DOTS_RIGHT: Ellipsis = 'dots-right';

    const totalPageNumbers = 5 + siblingCount * 2;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const firstPage = 1;
    const lastPage = totalPages;

    if (!showLeftDots && showRightDots) {
      const leftRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => i + 1
      );
      return [...leftRange, DOTS_RIGHT, lastPage];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = Array.from(
        { length: 3 + 2 * siblingCount },
        (_, i) => lastPage - (3 + 2 * siblingCount) + 1 + i
      );
      return [firstPage, DOTS_LEFT, ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPage, DOTS_LEFT, ...middleRange, DOTS_RIGHT, lastPage];
  }, [currentPage, totalPages, siblingCount]);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const jumpLeft = () => Math.max(1, currentPage - blockJump);
  const jumpRight = () => Math.min(totalPages, currentPage + blockJump);

  const basePageClass = 'px-3 py-1 rounded-md border text-sm transition-colors';
  const getPageClass = (page: number) =>
    page === currentPage
      ? `${basePageClass} bg-blue-50 text-white`
      : `${basePageClass} bg-white-100 text-gray-70 hover:bg-blue-10`

  const baseArrowClass = 'px-2 py-1 rounded-md text-sm transition-colors';
  const getArrowClass = (enabled: boolean) =>
    enabled
      ? `${baseArrowClass} text-blue-60 hover:bg-blue-10`
      : `${baseArrowClass} text-gray-50 cursor-not-allowed`;

  return { items, canPrev, canNext, jumpLeft, jumpRight, getPageClass, getArrowClass };
}
