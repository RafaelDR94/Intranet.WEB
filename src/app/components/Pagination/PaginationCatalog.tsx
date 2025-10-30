'use client';

import { useState } from 'react';

import Pagination from './Pagination';

export const PaginationCatalog = () => {
  const [page, setPage] = useState(1);
  return <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />;
};
