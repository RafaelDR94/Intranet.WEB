'use client';

import DataTableLayout from './DataTableLayout';

export default function DataTableLayoutCatalog() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-h3 font-display">DataTableLayout</h2>
      <DataTableLayout showFilter />
    </div>
  );
}
