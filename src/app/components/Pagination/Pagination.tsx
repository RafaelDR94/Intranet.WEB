'use client';

import React from 'react';
import { PaginationProps } from './types';
import { container } from './styles';
import usePagination from './hooks/usePagination';

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { getPageClass, getArrowClass } = usePagination(currentPage);

  const renderPages = () =>
    Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        className={getPageClass(i + 1)}
        onClick={() => onPageChange(i + 1)}
        disabled={i + 1 === currentPage}
      >
        {i + 1}
      </button>
    ));

  return (
    <div className={container}>
      <button
        className={getArrowClass(currentPage === 1)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#x2039;
      </button>
      {renderPages()}
      <button
        className={getArrowClass(currentPage === totalPages)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &#x203A;
      </button>
    </div>
  );
};

export default Pagination;
