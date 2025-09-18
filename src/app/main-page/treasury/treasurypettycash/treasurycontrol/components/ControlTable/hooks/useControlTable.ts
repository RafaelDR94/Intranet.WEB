'use client';

import { useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import type { ControlDetail, ControlRow } from '../types';

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore';
import { useBillingPettyCash } from '@/app/stores/useBillingPettyCash/useBillingPettyCash';
import { formatDateES } from '@/app/utilities/DatesHelper/Dateshelper';
import type { LabelType } from "@/app/components/Label/types";

function voucherTypeToLabelType(voucher?: string): LabelType {
  const v = (voucher ?? "").toLowerCase();
  if (v.includes("rosa")) return "vale-rosa";
  if (v.includes("azul")) return "vale-azul";
  return "restringido";
}

/**
 * Handles data loading, filtering and row actions for the petty cash control table.
 */
export const useControlTable = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const [query, setQuery] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ControlRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<ControlDetail | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ControlRow | null>(null);

  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);

  const {
    pettyCashVouchers,
    loading,
    error,
    removing,
    fetchPettyCashVouchers,
    fetchPettyCashVoucherById,
    deletePettyCashVoucher,
    resetFlags,
  } = useBillingPettyCash(
    (state) => ({
      pettyCashVouchers: state.pettyCashVouchers,
      loading: state.loading,
      error: state.error,
      removing: state.removing,
      fetchPettyCashVouchers: state.fetchPettyCashVouchers,
      fetchPettyCashVoucherById: state.fetchPettyCashVoucherById,
      deletePettyCashVoucher: state.deletePettyCashVoucher,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  useEffect(() => {
    if (!isGatewayReady) return;
    fetchPettyCashVouchers();
  }, [isGatewayReady, fetchPettyCashVouchers]);

  useEffect(() => {
    if (loading && !isFetchingDetail) {
      showSpinner({ message: 'Cargando vales de caja chica…' });
      return;
    }
    hideSpinner();
  }, [hideSpinner, loading, isFetchingDetail, showSpinner]);

  useEffect(() => {
    if (!error || isFetchingDetail) return;

    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudieron cargar los vales de caja chica',
      description: String(error),
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Reintentar',
      onSecondaryClick: () => {
        hideAlert();
        fetchPettyCashVouchers(true);
      },
    });
  }, [error, fetchPettyCashVouchers, hideAlert, isFetchingDetail, showAlert]);

  useEffect(() => {
    if (loading || removing || isFetchingDetail) return;
    resetFlags();
  }, [isFetchingDetail, loading, removing, resetFlags]);

  const rows: ControlRow[] = useMemo(() => {
    const base = pettyCashVouchers.map((voucher) => {
      const subtotal = typeof voucher.subtotal === 'number' && !Number.isNaN(voucher.subtotal)
        ? voucher.subtotal
        : undefined;
      const iva = typeof voucher.iva === 'number' && !Number.isNaN(voucher.iva)
        ? voucher.iva
        : undefined;
      const totalCandidate =
        typeof voucher.total === 'number' && !Number.isNaN(voucher.total)
          ? voucher.total
          : typeof voucher.amount === 'number' && !Number.isNaN(voucher.amount)
          ? voucher.amount
          : undefined;
        
        const voucherType = voucher.voucher_type ?? "";

      return {
        id: voucher.id,
        employeeName: voucher.employeename?.trim() || voucher.employee_id || '',
        applicationDate: voucher.application_date,
        provider: voucher.provider?.trim() || voucher.rfc_emisor?.trim() || '',
        concept: voucher.concept,
        subtotal,
        iva,
        total: totalCandidate,
        voucherType: voucher.voucher_type,
        voucherLabelType: voucherTypeToLabelType(voucherType),
        status: voucher.status,
        rfcEmisor: voucher.rfc_emisor,
      } satisfies ControlRow;
    });

    if (!query) return base;
    const normalized = query.toLowerCase();

    return base.filter((row) => {
      const haystack = [
        row.employeeName,
        row.provider ?? '',
        row.concept ?? '',
        row.voucherType ?? '',
        row.status ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [pettyCashVouchers, query]);

  const onView = async (row: ControlRow) => {
    setIsFetchingDetail(true);
    setSelectedRow(row);
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    const detail = await fetchPettyCashVoucherById(row.id, true);
    if (!detail) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo obtener el detalle',
        description: 'Intenta nuevamente en unos segundos.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
    } else {
      setDetailData(detail);
    }
    setDetailLoading(false);
    setIsFetchingDetail(false);
  };

  const onDelete = (row: ControlRow) => {
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const current = rowToDelete;
    if (!current) return;

    setConfirmOpen(false);
    showSpinner({ message: 'Espera un momento, el vale se está eliminando' });
    const ok = await deletePettyCashVoucher(current.id);
    hideSpinner();
    setRowToDelete(null);

    if (ok) {
      showAlert({
        type: 'warning',
        variant: 'filled',
        title: 'Vale eliminado',
        description: `El vale se eliminó correctamente.`,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
        onClose: hideAlert,
      });
      fetchPettyCashVouchers(true);
    } else {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo eliminar',
        description: 'Intenta de nuevo en unos segundos.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: () => {
          hideAlert();
          setRowToDelete(current);
          setConfirmOpen(true);
        },
      });
    }
  };

  const refresh = (start?: Date, end?: Date) => {
    void start;
    void end;
    fetchPettyCashVouchers(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetailData(null);
    setSelectedRow(null);
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    try {
      return formatDateES(new Date(date));
    } catch (e) {
      void e;
      return date;
    }
  };

  return {
    rows,
    setQuery,
    confirmOpen,
    setConfirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    onView,
    onDelete,
    refresh,
    detailOpen,
    detailLoading,
    detailData,
    selectedRow,
    handleCloseDetail,
    formatDate,
  };
};
