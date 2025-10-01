'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/navigation';

import type { ControlDetail, ControlRow } from '../types';

import type { LabelType } from "@/app/components/Label/types";
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import type { PettyCashVoucherData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types';
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore';
import { useBillingPettyCash } from '@/app/stores/useBillingPettyCash/useBillingPettyCash';
import { formatDateES } from '@/app/utilities/DatesHelper/Dateshelper';
import {
  parseDateFlexible,
  startOfDay,
  endOfDay,
} from '@/app/components/DataTable/utilities/datesTable';

function voucherTypeToLabelType(voucher?: string): LabelType {
  const v = (voucher ?? "").toLowerCase();
  if (v.includes("rosa")) return "vale-rosa";
  if (v.includes("azul")) return "vale-azul";
  return "restringido";
}

const mapVoucherToControlRow = (voucher: PettyCashVoucherData): ControlRow => {
  const subtotal =
    typeof voucher.subtotal === 'number' && !Number.isNaN(voucher.subtotal)
      ? voucher.subtotal
      : undefined;
  const iva =
    typeof voucher.iva === 'number' && !Number.isNaN(voucher.iva)
      ? voucher.iva
      : undefined;
  const totalCandidate =
    typeof voucher.total === 'number' && !Number.isNaN(voucher.total)
      ? voucher.total
      : typeof voucher.amount === 'number' && !Number.isNaN(voucher.amount)
      ? voucher.amount
      : undefined;

  const voucherType = voucher.voucher_type ?? '';

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
    VoucherLabelType: voucherTypeToLabelType(voucherType),
    status: voucher.status,
    rfcEmisor: voucher.rfc_emisor,
  } satisfies ControlRow;
};

/**
 * Handles data loading, filtering and row actions for the petty cash control table.
 */
export const useControlTable = () => {
  const router = useRouter();
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
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
    validating,
    rejecting,
    fetchPettyCashVouchers,
    fetchPettyCashVoucherById,
    fetchPettyCashFunds,
    deletePettyCashVoucher,
    validatePettyCashVoucher,
    rejectPettyCashVoucher,
    resetFlags,
  } = useBillingPettyCash(
    (state) => ({
      pettyCashVouchers: state.pettyCashVouchers,
      loading: state.loading,
      error: state.error,
      removing: state.removing,
      validating: state.validating,
      rejecting: state.rejecting,
      fetchPettyCashVouchers: state.fetchPettyCashVouchers,
      fetchPettyCashVoucherById: state.fetchPettyCashVoucherById,
      fetchPettyCashFunds: state.fetchPettyCashFunds,
      deletePettyCashVoucher: state.deletePettyCashVoucher,
      validatePettyCashVoucher: state.validatePettyCashVoucher,
      rejectPettyCashVoucher: state.rejectPettyCashVoucher,
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
    if (loading || removing || validating || rejecting || isFetchingDetail) return;
    resetFlags();
  }, [isFetchingDetail, loading, removing, validating, rejecting, resetFlags]);

  const rows: ControlRow[] = useMemo(() => {
    const base = pettyCashVouchers.map(mapVoucherToControlRow);
    const normalizedSearch = searchTerm.trim().toLowerCase();

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

      const matchesSearch = normalizedSearch
        ? haystack.includes(normalizedSearch)
        : true;

      const voucher = (row.voucherType ?? '').toLowerCase();
      const status = (row.status ?? '').toLowerCase();

      let matchesFilter = true;
      switch (activeFilter) {
        case 'voucher:rosa':
          matchesFilter = voucher.includes('rosa');
          break;
        case 'voucher:azul':
          matchesFilter = voucher.includes('azul');
          break;
        case 'status:validado':
          matchesFilter = status.includes('valid');
          break;
        case 'status:rechazado':
          matchesFilter = status.includes('rechaz');
          break;
        case 'status:proceso':
          matchesFilter = status.includes('proceso');
          break;
        default:
          matchesFilter = true;
      }

      let matchesDate = true;
      if (startDate || endDate) {
        const rowDate = parseDateFlexible(row.applicationDate ?? null);
        if (rowDate) {
          const ts = rowDate.getTime();
          const from = startDate ? startOfDay(startDate).getTime() : -Infinity;
          const to = endDate ? endOfDay(endDate).getTime() : Infinity;
          matchesDate = ts >= from && ts <= to;
        }
      }

      return matchesSearch && matchesFilter && matchesDate;
    });
  }, [pettyCashVouchers, searchTerm, activeFilter, startDate, endDate]);

  useEffect(() => {
    const selectedId = selectedRow?.id;
    if (!selectedId) return;

    const updatedVoucher = pettyCashVouchers.find((voucher) => voucher.id === selectedId);
    if (!updatedVoucher) return;

    setSelectedRow((prev) => {
      if (!prev || prev.id !== selectedId) return prev;
      const mapped = mapVoucherToControlRow(updatedVoucher);
      return { ...prev, ...mapped };
    });
  }, [pettyCashVouchers, selectedRow?.id]);

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

  const handleValidate = async (row: ControlRow | null) => {
    const target = row ?? selectedRow;
    if (!target) return;

    showSpinner({ message: 'Validando vale seleccionado…' });
    const ok = await validatePettyCashVoucher(target.id);
    const selectedId = selectedRow?.id;
    const panelOpen = detailOpen;

    if (ok) {
      await Promise.all([fetchPettyCashVouchers(true), fetchPettyCashFunds(true)]);

      if (panelOpen && selectedId === target.id) {
        setDetailLoading(true);
        try {
          const detail = await fetchPettyCashVoucherById(target.id, true);
          setDetailData(detail);
        } finally {
          setDetailLoading(false);
        }
      }

      hideSpinner();
      showAlert({
        type: 'success',
        variant: 'filled',
        title: 'Vale validado',
        description: 'El vale se validó correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
        onClose: hideAlert,
      });
    } else {
      hideSpinner();
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo validar el vale',
        description: 'Intenta de nuevo en unos segundos.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      resetFlags();
    }
  };

  const handleReject = async (row: ControlRow | null, comments?: string) => {
    const target = row ?? selectedRow;
    if (!target) return;

    showSpinner({ message: 'Rechazando vale seleccionado…' });
    const ok = await rejectPettyCashVoucher(target.id, comments);
    const selectedId = selectedRow?.id;
    const panelOpen = detailOpen;

    if (ok) {
      await Promise.all([fetchPettyCashVouchers(true), fetchPettyCashFunds(true)]);

      if (panelOpen && selectedId === target.id) {
        setDetailLoading(true);
        try {
          const detail = await fetchPettyCashVoucherById(target.id, true);
          setDetailData(detail);
        } finally {
          setDetailLoading(false);
        }
      }

      hideSpinner();
      showAlert({
        type: 'warning',
        variant: 'filled',
        title: 'Vale rechazado',
        description: 'El vale se rechazó correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
        onClose: hideAlert,
      });
    } else {
      hideSpinner();
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo rechazar el vale',
        description: 'Intenta de nuevo en unos segundos.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      resetFlags();
    }
  };

  const refreshData = useCallback(() => {
    fetchPettyCashVouchers(true);
  }, [fetchPettyCashVouchers]);

  const refreshPage = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload();
      return;
    }
    router.refresh();
  }, [router]);

  const handleSearchChange = useCallback(
    (value?: string, start?: Date | null, end?: Date | null) => {
      setSearchTerm((value ?? '').trim());
      setStartDate(start ?? null);
      setEndDate(end ?? null);
    },
    [],
  );

  const handleFilterChange = useCallback((value: string) => {
    setActiveFilter(value || 'all');
  }, []);

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
    handleSearchChange,
    handleFilterChange,
    activeFilter,
    confirmOpen,
    setConfirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    onView,
    onDelete,
    refreshData,
    refreshPage,
    detailOpen,
    detailLoading,
    detailData,
    selectedRow,
    handleCloseDetail,
    formatDate,
    handleValidate,
    handleReject,
    validating,
    rejecting,
  };
};
