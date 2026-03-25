"use client"
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { PopUp } from '@/app/components/PopUp/PopUp';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';
import type { Refaction } from '@/app/mappings/reports/reports.types';
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
const PAGE_SIZE = 8;

export type RefactionRow = Refaction & { id: string; index: number };

const buildRefactionLabel = (row: RefactionRow | null) => {
  if (!row) return 'la refacción seleccionada';
  const parts = [row.description, row.brand, row.model, row.serialnumber, row.partnumber]
    .map((value) => value?.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : 'la refacción seleccionada';
};

const useRefactionsList = () => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [rowPendingDeletion, setRowPendingDeletion] = useState<RefactionRow | null>(null);
  const isMobile = useIsMobile();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { refactions, updateRefactions, report } = useReportBuilderStore(
    (state) => ({
      refactions: state.report.refactions ?? [],
      updateRefactions: state.updateRefactions,
      report: state.report
    }),
    shallow
  );

  const rows = useMemo<RefactionRow[]>(
    () =>
      refactions.map((item, index) => ({
        ...item,
        id: String(index),
        index,
      })),
    [refactions]
  );

  useEffect(() => () => hideSpinner(), [hideSpinner]);

  const askDelete = useCallback((row: RefactionRow) => {
    setRowPendingDeletion(row);
    setConfirmDeleteOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setConfirmDeleteOpen(false);
    setRowPendingDeletion(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!rowPendingDeletion) return;

    const targetIndex = rowPendingDeletion.index;
    showSpinner({ message: 'Eliminando refacción...' });

    try {
      const next = refactions.filter((_, index) => index !== targetIndex);
      updateRefactions(next);

      showAlert({
        type: 'warning',
        variant: 'filled',
        title: 'Refacción eliminada',
        description: `Se eliminó correctamente ${buildRefactionLabel(rowPendingDeletion)}.`,
        autoCloseMs: 3000,
        showPrimaryButton: false,
        showSecondaryButton: false,
        onClose: hideAlert,
      });
    } catch (error) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo eliminar la refacción',
        description: String(error),
        autoCloseMs: 4000,
        showPrimaryButton: false,
        showSecondaryButton: false,
        onClose: hideAlert,
      });
    } finally {
      hideSpinner();
      closeDialog();
    }
  }, [closeDialog, hideAlert, hideSpinner, refactions, rowPendingDeletion, showAlert, showSpinner, updateRefactions]);

  const confirmDeleteUI = (
    <PopUp
      open={confirmDeleteOpen}
      title="Eliminar Refacción"
      content={`Esta acción confirmará la eliminación de ${buildRefactionLabel(rowPendingDeletion)}.\nUna vez confirmado, no podrás revertir el cambio.`}
      onClose={closeDialog}
      onPrimaryButtonClick={confirmDelete}
      onSecondaryButtonClick={closeDialog}
      primaryButtonText="Eliminar"
      secondaryButtonText="Cancelar"
      showPrimaryButton
      showSecondaryButton
    />
  );

  return {
    rows,
    pageSize: PAGE_SIZE,
    deleteRow: askDelete,
    confirmDeleteUI,
    report,
    isMobile
  };
};

export default useRefactionsList;
