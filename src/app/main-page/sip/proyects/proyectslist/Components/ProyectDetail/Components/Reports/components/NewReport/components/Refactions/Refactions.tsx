'use client';

import React, { useCallback, useState } from 'react';

import RefactionsForm from './Components/RefactionsForm/RefactionsForm';
import RefactionsList from './Components/RefactionsList/RefactionsList';

export const NEW_REFACTION_ID = '__new__';

const Refactions: React.FC = () => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleCreate = useCallback(() => setSelectedRowId(NEW_REFACTION_ID), []);
  const handleEdit = useCallback((id: string) => setSelectedRowId(id), []);
  const handleCloseForm = useCallback(() => setSelectedRowId(null), []);

  return (
    <section className="flex flex-col gap-6">
      {!selectedRowId && (
        <RefactionsList
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      )}

      {selectedRowId && (
        <RefactionsForm
          selectedRowId={selectedRowId}
          onClose={handleCloseForm}
          onSaved={handleCloseForm}
        />
      )}
    </section>
  );
};

export default Refactions;
