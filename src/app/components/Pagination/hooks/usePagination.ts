import { useEffect, useMemo, useState } from 'react';


type Ellipsis = 'dots-left' | 'dots-right';

export default function usePagination(currentPage: number, totalPages: number = 1) {
  const [maxVisible, setMaxVisible] = useState(5);

  // 🔹 Ajustar dinámicamente según ancho disponible
  useEffect(() => {
    const updateMaxVisible = () => {
      const width = window.innerWidth;

      if (width <= 340) setMaxVisible(3);        // móviles muy pequeños (Galaxy Fold, SE)
      else if (width <= 400) setMaxVisible(4);   // móviles 375–400 px
      else if (width <= 480) setMaxVisible(5);   // móviles grandes
      else if (width <= 640) setMaxVisible(7);   // tablets pequeñas
      else setMaxVisible(9);                     // desktop
    };
    updateMaxVisible();
    window.addEventListener('resize', updateMaxVisible);
    return () => window.removeEventListener('resize', updateMaxVisible);
  }, []);

  // 🔹 Calcular siblingCount en función de maxVisible
  const siblingCount = Math.floor((maxVisible - 3) / 2);
  const blockJump = Math.max(3, 2 * siblingCount + 1);

  const items = useMemo<(number | Ellipsis)[]>(() => {
    const DOTS_LEFT: Ellipsis = 'dots-left';
    const DOTS_RIGHT: Ellipsis = 'dots-right';

    const totalPageNumbers = 3 + siblingCount * 2;
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
      const leftRange = Array.from({ length: 2 + siblingCount * 2 }, (_, i) => i + 1);
      return [...leftRange, DOTS_RIGHT, lastPage];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = Array.from(
        { length: 2 + siblingCount * 2 },
        (_, i) => lastPage - (2 + siblingCount * 2) + 1 + i
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

  return { items, canPrev, canNext, jumpLeft, jumpRight };
}
