'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { shallow } from 'zustand/shallow';

import useQuery from '@/app/hooks/useQuery/useQuery';
import RefactionsForm from '@/app/main-page/proyects/components/RefactionsCrud/components/RefactionsForm';
import useProyectInventoryStore from '@/app/stores/useProyectInventoryStore/useProyectInventoryStore';
import useReportBuilderStore from '@/app/stores/useReportBuilderStore/useReportBuilderStore';

import { NEW_REFACTION_ID } from '../../Refactions';
import {
  mapSparePartToReportRefaction,
} from '../../utilities/reportRefactions';

type ReportRefactionsCrudFormProps = {
  selectedRowId: string | null;
  onClose: () => void;
  onSaved?: () => void;
};

type Snapshot = {
  sparePartIds: Set<string>;
  selectedRefactionIndex: number | null;
};

const getSingleValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const ReportRefactionsCrudForm = ({
  selectedRowId,
  onClose,
}: ReportRefactionsCrudFormProps) => {
  const { all, updateQuery } = useQuery();
  const openedRef = useRef(false);
  const closingRef = useRef(false);
  const snapshotRef = useRef<Snapshot | null>(null);

  const { sparePartsByProyect, fetchSparePartsByProyectId } = useProyectInventoryStore(
    (state) => ({
      sparePartsByProyect: state.sparePartsByProyect,
      fetchSparePartsByProyectId: state.fetchSparePartsByProyectId,
    }),
    shallow,
  );

  const { report, updateRefactions } = useReportBuilderStore(
    (state) => ({
      report: state.report,
      updateRefactions: state.updateRefactions,
    }),
    shallow,
  );

  const crudView = getSingleValue(all.crudView);
  const crudMode = getSingleValue(all.crudMode);
  const crudItemId = getSingleValue(all.crudItemId);
  const onlyproveedor = getSingleValue(all.onlyproveedor);

  const projectId = useMemo(() => {
    const reportProjectId = String(report?.proyect?.id ?? '').trim();
    if (reportProjectId) return reportProjectId;
    return String(getSingleValue(all.id) ?? '').trim();
  }, [all.id, report?.proyect?.id]);

  const expectedMode = selectedRowId === NEW_REFACTION_ID ? 'create' : 'edit';
  const expectedItemId =
    selectedRowId && selectedRowId !== NEW_REFACTION_ID ? selectedRowId : null;

  useEffect(() => {
    openedRef.current = false;
    closingRef.current = false;
    snapshotRef.current = null;
  }, [selectedRowId]);

  useEffect(() => {
    if (!selectedRowId || snapshotRef.current) return;

    const selectedRefactionIndex =
      selectedRowId && selectedRowId !== NEW_REFACTION_ID
        ? (() => {
            const targetId = String(selectedRowId).trim();
            const index = (report.idSpareParts ?? []).findIndex(
              (item) => String(item ?? '').trim() === targetId,
            );
            return index >= 0 ? index : null;
          })()
        : null;

    snapshotRef.current = {
      sparePartIds: new Set(sparePartsByProyect.map((item) => item.id)),
      selectedRefactionIndex: selectedRefactionIndex !== -1 ? selectedRefactionIndex : null,
    };
  }, [report.refactions, selectedRowId, sparePartsByProyect]);

  useEffect(() => {
    if (!selectedRowId) return;

    const queryMatches =
      crudView === 'form' &&
      crudMode === expectedMode &&
      (expectedItemId ? crudItemId === expectedItemId : !crudItemId) &&
      !onlyproveedor;

    if (queryMatches) {
      openedRef.current = true;
      return;
    }

    updateQuery({
      crudView: 'form',
      crudMode: expectedMode,
      crudItemId: expectedItemId,
      onlyproveedor: null,
    });
  }, [
    crudItemId,
    crudMode,
    crudView,
    expectedItemId,
    expectedMode,
    onlyproveedor,
    selectedRowId,
    updateQuery,
  ]);

  useEffect(() => {
    if (!selectedRowId || !openedRef.current || crudView === 'form' || closingRef.current) return;

    closingRef.current = true;

    const finalizeClose = async () => {
      if (projectId) {
        await fetchSparePartsByProyectId(projectId, true);

        const latestSpareParts = useProyectInventoryStore.getState().sparePartsByProyect;
        const latestReport = useReportBuilderStore.getState().report;
        const snapshot = snapshotRef.current;

        if (selectedRowId === NEW_REFACTION_ID) {
          const createdSparePart = latestSpareParts.find(
            (item) => !snapshot?.sparePartIds.has(item.id),
          );

          if (createdSparePart) {
            const currentIds = latestReport.idSpareParts ?? [];
            updateRefactions(
              [
                ...latestReport.refactions,
                mapSparePartToReportRefaction(createdSparePart),
              ],
              [
                ...currentIds,
                createdSparePart.id,
              ],
            );
          }
        } else if (snapshot?.selectedRefactionIndex != null) {
          const updatedSparePart = latestSpareParts.find((item) => item.id === selectedRowId);

          if (updatedSparePart) {
            const next = [...latestReport.refactions];
            next[snapshot.selectedRefactionIndex] = mapSparePartToReportRefaction(updatedSparePart);
            updateRefactions(next, latestReport.idSpareParts ?? []);
          }
        }
      }

      onClose();
    };

    void finalizeClose();
  }, [crudView, fetchSparePartsByProyectId, onClose, projectId, selectedRowId, updateRefactions]);

  if (!selectedRowId) return null;

  return <RefactionsForm scope="project" />;
};

export default ReportRefactionsCrudForm;
