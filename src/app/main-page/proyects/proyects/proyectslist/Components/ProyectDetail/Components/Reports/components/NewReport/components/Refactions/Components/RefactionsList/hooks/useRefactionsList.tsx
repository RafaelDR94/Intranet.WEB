"use client"
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
import { PopUp } from '@/app/components/PopUp/PopUp';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import useQuery from '@/app/hooks/useQuery/useQuery';
import type { SparePart } from '@/app/mappings/inventory/inventory.types';
import useProyectInventoryStore from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';

import {
  buildRefactionFingerprint,
  buildSparePartLabel,
  mapSparePartToReportRefaction,
  mapSparePartsSelectionToReport,
} from '../../../utilities/reportRefactions';

const PAGE_SIZE = 4;

export type RefactionRow = {
  id: string;
  description: string;
  brand: string;
  model: string;
  serialnumber: string;
  partnumber: string;
  source: SparePart;
};

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const getPreferredText = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? '').trim())
    .find(Boolean) ?? '';

const buildRowId = (sparePart: SparePart, index: number) => {
  const explicitId = String(sparePart.id ?? '').trim();
  if (explicitId) return explicitId;

  const fingerprint = buildRefactionFingerprint(mapSparePartToReportRefaction(sparePart));
  if (fingerprint) return `spare-${fingerprint}`;

  return `spare-row-${index}`;
};

const buildRowFromSparePart = (sparePart: SparePart, index: number): RefactionRow => ({
  id: buildRowId(sparePart, index),
  description: getPreferredText(sparePart.name, sparePart.characteristic, sparePart.sku),
  brand: getPreferredText(sparePart.brand),
  model: getPreferredText(sparePart.model),
  serialnumber: getPreferredText(sparePart.serialNumber),
  partnumber: getPreferredText(sparePart.sku),
  source: sparePart,
});

const useRefactionsList = () => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [rowPendingDeletion, setRowPendingDeletion] = useState<RefactionRow | null>(null);
  const isMobile = useIsMobile();
  const { all } = useQuery();
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  const { report, updateRefactions } = useReportBuilderStore(
    (state) => ({
      report: state.report,
      updateRefactions: state.updateRefactions,
    }),
    shallow,
  );
  const skipHydrationSelectionSync = useRef((report?.idSpareParts?.length ?? 0) > 0);

  const {
    sparePartsByProyect,
    loadingSparePartsByProyect,
    removing,
    error,
    fetchSparePartsByProyectId,
    deleteSparePart,
    resetFlags,
  } = useProyectInventoryStore(
    (state) => ({
      sparePartsByProyect: state.sparePartsByProyect,
      loadingSparePartsByProyect: state.loadingSparePartsByProyect,
      removing: state.removing,
      error: state.error,
      fetchSparePartsByProyectId: state.fetchSparePartsByProyectId,
      deleteSparePart: state.deleteSparePart,
      resetFlags: state.resetFlags,
    }),
    shallow,
  );

  const projectId = useMemo(() => {
    const reportProjectId = String(report?.proyect?.id ?? '').trim();
    if (reportProjectId) return reportProjectId;
    return String(getSingleValue(all.id) ?? '').trim();
  }, [all.id, report?.proyect?.id]);

  useEffect(() => {
    if (!projectId) return;
    void fetchSparePartsByProyectId(projectId, true);
  }, [fetchSparePartsByProyectId, projectId]);

  const rows = useMemo<RefactionRow[]>(
    () => sparePartsByProyect.map((sparePart, index) => buildRowFromSparePart(sparePart, index)),
    [sparePartsByProyect],
  );

  const initialSelectedIds = useMemo(() => {
    if (!Array.isArray(report.idSpareParts) || report.idSpareParts.length === 0) return [] as string[];

    const selectedIds = new Set(report.idSpareParts.map((id) => String(id ?? '').trim()).filter(Boolean));
    return rows
      .map((row) => String(row.id ?? '').trim())
      .filter((rowId) => selectedIds.has(rowId));
  }, [report.idSpareParts, rows]);

  useEffect(() => {
    const message = removing
      ? 'Eliminando refacción...'
      : loadingSparePartsByProyect
        ? 'Cargando refacciones...'
        : null;

    if (message) {
      showSpinner({ message });
      return;
    }

    hideSpinner();
  }, [hideSpinner, loadingSparePartsByProyect, removing, showSpinner]);

  useEffect(() => () => hideSpinner(), [hideSpinner]);

  useEffect(() => {
    if (!error || rowPendingDeletion) return;

    hideAlert();
    showAlert({
      type: 'error',
      variant: 'subtle',
      title: 'No fue posible cargar las refacciones',
      description: error,
      showPrimaryButton: false,
      showSecondaryButton: false,
    });
    resetFlags();
  }, [error, hideAlert, resetFlags, rowPendingDeletion, showAlert]);

  const askDelete = useCallback((row: RefactionRow) => {
    setRowPendingDeletion(row);
    setConfirmDeleteOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setConfirmDeleteOpen(false);
    setRowPendingDeletion(null);
  }, []);

  const handleSelectedChange = useCallback(
    (selectedRows: RefactionRow[]) => {
      if (skipHydrationSelectionSync.current) {
        skipHydrationSelectionSync.current = false;
        return;
      }

      const nextSelection = mapSparePartsSelectionToReport(selectedRows.map((row) => row.source));
      updateRefactions(nextSelection.refactions, nextSelection.idSpareParts);
    },
    [updateRefactions],
  );

  const confirmDelete = useCallback(async () => {
    if (!rowPendingDeletion) return;

    const success = await deleteSparePart(rowPendingDeletion.id);

    if (!success) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo eliminar la refacción',
        description: useProyectInventoryStore.getState().error ?? 'Ocurrió un error inesperado.',
        autoCloseMs: 4000,
        showPrimaryButton: false,
        showSecondaryButton: false,
        onClose: hideAlert,
      });
      resetFlags();
      closeDialog();
      return;
    }

    if (projectId) {
      await fetchSparePartsByProyectId(projectId, true);
    }

    const currentReport = useReportBuilderStore.getState().report;
    const currentIds = currentReport.idSpareParts ?? [];
    const selectedIndex = currentIds.findIndex(
      (id) => String(id ?? '').trim() === String(rowPendingDeletion.id ?? '').trim(),
    );

    if (selectedIndex >= 0) {
      const nextIds = [...currentIds];
      const nextRefactions = [...currentReport.refactions];
      nextIds.splice(selectedIndex, 1);
      nextRefactions.splice(selectedIndex, 1);
      updateRefactions(nextRefactions, nextIds);
    }

    showAlert({
      type: 'warning',
      variant: 'filled',
      title: 'Refacción eliminada',
      description: `Se eliminó correctamente ${buildSparePartLabel(rowPendingDeletion.source)}.`,
      autoCloseMs: 3000,
      showPrimaryButton: false,
      showSecondaryButton: false,
      onClose: hideAlert,
    });
    resetFlags();
    closeDialog();
  }, [
    closeDialog,
    deleteSparePart,
    fetchSparePartsByProyectId,
    hideAlert,
    projectId,
    resetFlags,
    rowPendingDeletion,
    showAlert,
    updateRefactions,
  ]);

  const confirmDeleteUI = (
    <PopUp
      open={confirmDeleteOpen}
      title="Eliminar Refacción"
      content={`Esta acción confirmará la eliminación de ${buildSparePartLabel(rowPendingDeletion?.source)}.\nUna vez confirmado, no podrás revertir el cambio.`}
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
    onSelectedChange: handleSelectedChange,
    pageSize: PAGE_SIZE,
    deleteRow: askDelete,
    confirmDeleteUI,
    initialSelectedIds,
    report,
    isMobile,
    loading: loadingSparePartsByProyect,
    projectSelected: Boolean(projectId),
  };
};

export default useRefactionsList;
