'use client';

import Pagination from './Pagination';
import { useState } from 'react';

export const PaginationCatalog = () => {
  const [page, setPage] = useState(1);
  return <Pagination currentPage={page} totalPages={5} onPageChange={setPage} />;
};
