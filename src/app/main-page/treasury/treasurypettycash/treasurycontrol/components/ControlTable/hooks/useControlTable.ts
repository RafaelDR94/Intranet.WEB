'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const toValidNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && !Number.isNaN(value) ? value : undefined;

const pickFirstNumber = (
  ...values: Array<number | undefined>
): number | undefined => {
  for (const value of values) {
    if (value !== undefined) return value;
  }

  return undefined;
};

function voucherTypeToLabelType(voucher?: string): LabelType {
  const v = (voucher ?? "").toLowerCase();
  if (v.includes("rosa")) return "vale-rosa";
  if (v.includes("azul")) return "vale-azul";
  return "restringido";
}

/**
 * Maps a descriptive voucher type (e.g. "Vale rosa") to the
 * single-letter payload expected by the backend.
 */
const mapVoucherTypeToPayload = (voucherType?: string): 'R' | 'A' | '' => {
  const normalized = (voucherType ?? '')
    .trim()
    .toLocaleLowerCase('es-MX')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (!normalized) return '';
  if (normalized.length === 1) {
    if (normalized === 'r') return 'R';
    if (normalized === 'a') return 'A';
    return '';
  }

  if (normalized.includes('rosa')) return 'R';
  if (normalized.includes('azul')) return 'A';
  if (normalized.startsWith('r')) return 'R';
  if (normalized.startsWith('a')) return 'A';

  return '';
};

const resolveVoucherTypeCode = (
  detail: ControlDetail | null,
  row: ControlRow | null,
): 'R' | 'A' | '' => {
  const fromDetail = mapVoucherTypeToPayload(detail?.voucher_type);
  if (fromDetail) return fromDetail;

  const fromRow = mapVoucherTypeToPayload(row?.voucherType);
  if (fromRow) return fromRow;

  if (row?.VoucherLabelType === 'vale-rosa') return 'R';
  if (row?.VoucherLabelType === 'vale-azul') return 'A';

  return '';
};

const mapVoucherToControlRow = (voucher: PettyCashVoucherData): ControlRow => {
  const subtotal = toValidNumber(voucher.subtotal);
  const iva = toValidNumber(voucher.iva);
  const totalValue = toValidNumber(voucher.total);
  const requestedAmount = toValidNumber(voucher.amount);
  const voucherType = voucher.voucher_type ?? '';
  const voucherTypeCode = mapVoucherTypeToPayload(voucherType);
  const totalCandidate =
    voucherTypeCode === 'A'
      ? pickFirstNumber(requestedAmount, totalValue)
      : pickFirstNumber(totalValue, requestedAmount);

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

const isVoucherValid = (status?: string): boolean => {
  if (!status) return false;
  const normalized = status
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized.includes("valido");
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
  const [editOpen, setEditOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<ControlDetail | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ControlRow | null>(null);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const skipErrorAlertRef = useRef(false);
  const suppressedErrorRef = useRef<string | undefined>(undefined);

  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);

  const {
    pettyCashVouchers,
    loading,
    error,
    removing,
    updating,
    validating,
    rejecting,
    fetchPettyCashVouchers,
    fetchPettyCashVoucherById,
    fetchPettyCashFunds,
    deletePettyCashVoucher,
    updatePettyCashVoucher,
    validatePettyCashVoucher,
    rejectPettyCashVoucher,
    resetFlags,
  } = useBillingPettyCash(
    (state) => ({
      pettyCashVouchers: state.pettyCashVouchers,
      loading: state.loading,
      error: state.error,
      removing: state.removing,
      updating: state.updating,
      validating: state.validating,
      rejecting: state.rejecting,
      fetchPettyCashVouchers: state.fetchPettyCashVouchers,
      fetchPettyCashVoucherById: state.fetchPettyCashVoucherById,
      fetchPettyCashFunds: state.fetchPettyCashFunds,
      deletePettyCashVoucher: state.deletePettyCashVoucher,
      updatePettyCashVoucher: state.updatePettyCashVoucher,
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
    if (!error) {
      suppressedErrorRef.current = undefined;
      return;
    }

    if (isFetchingDetail) return;

    if (skipErrorAlertRef.current) {
      skipErrorAlertRef.current = false;
      suppressedErrorRef.current = error;
      return;
    }

    if (suppressedErrorRef.current && suppressedErrorRef.current === error) {
      return;
    }

    suppressedErrorRef.current = undefined;

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
  }, [
    error,
    fetchPettyCashVouchers,
    hideAlert,
    isFetchingDetail,
    showAlert,
  ]);

  useEffect(() => {
    if (
      loading ||
      removing ||
      updating ||
      validating ||
      rejecting ||
      isFetchingDetail
    ) {
      return;
    }
    resetFlags();
  }, [
    isFetchingDetail,
    loading,
    removing,
    updating,
    validating,
    rejecting,
    resetFlags,
  ]);

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

  const openDetail = async (row: ControlRow, mode: "detail" | "edit") => {
    setIsFetchingDetail(true);
    setSelectedRow(row);
    setDetailLoading(true);
    setDetailData(null);
    setIsEditingAmount(false);

    const openEditPanel = mode === "edit";
    setEditOpen(openEditPanel);
    setDetailOpen(!openEditPanel);
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
      setIsEditingAmount(false);
      setEditOpen(false);
      setDetailOpen(false);
    } else {
      setDetailData(detail);
    }
    setDetailLoading(false);
    setIsFetchingDetail(false);
  };

  const onView = (row: ControlRow) => {
    const mode = isVoucherValid(row.status) ? "edit" : "detail";
    void openDetail(row, mode);
  };

  const onDelete = (row: ControlRow) => {
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const handleEditModeChange = (editing: boolean) => {
    setIsEditingAmount(editing);
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

  const handleUpdateAmount = async (amount: number) => {
    const currentDetail = detailData;
    const currentRow = selectedRow;

    if (!currentRow) return;

    if (!currentDetail) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'Información incompleta',
        description:
          'Espera a que se cargue el detalle del vale para poder editar el monto.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      return;
    }

    const pettyCashFundId = currentDetail.petty_cash_funds?.id;
    const projectId = currentDetail.project?.id;

    if (!pettyCashFundId || !projectId) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'Información incompleta',
        description:
          'El vale no cuenta con la información necesaria para actualizar el monto.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      return;
    }

    const voucherTypeCode = resolveVoucherTypeCode(currentDetail, currentRow);

    if (!voucherTypeCode) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'Tipo de vale desconocido',
        description:
          'No se pudo identificar si el vale es rosa o azul. Actualiza la información e inténtalo de nuevo.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      return;
    }

    skipErrorAlertRef.current = true;
    suppressedErrorRef.current = undefined;

    showSpinner({ message: 'Guardando monto solicitado…' });
    let updated: PettyCashVoucherData | null = null;
    try {
      updated = await updatePettyCashVoucher({
        id: currentDetail.id,
        petty_cash_funds_id: pettyCashFundId,
        employee_id: currentDetail.employee_id,
        voucher_type: voucherTypeCode,
        application_date: currentDetail.application_date,
        concept: currentDetail.concept,
        amount,
        total: amount,
        comments: currentDetail.comments ?? '',
        project_id: projectId,
        xml: currentDetail.xml ?? '',
        pdf: currentDetail.pdf ?? '',
      });
    } finally {
      hideSpinner();
    }

    if (updated) {
      setIsEditingAmount(false);
      setDetailData((prev) =>
        prev && prev.id === updated?.id
          ? { ...prev, amount, total: amount }
          : prev,
      );
      setSelectedRow((prev) => {
        if (!prev || prev.id !== updated?.id) return prev;
        const mapped = mapVoucherToControlRow(updated);
        return { ...prev, ...mapped };
      });

      showAlert({
        type: 'success',
        variant: 'filled',
        title: 'Monto actualizado',
        description: 'El monto solicitado se actualizó correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
        onClose: hideAlert,
      });

      setDetailLoading(true);
      try {
        const refreshed = await fetchPettyCashVoucherById(updated.id, true);
        if (refreshed) {
          setDetailData(refreshed);
        }
      } finally {
        setDetailLoading(false);
      }

      await Promise.all([fetchPettyCashVouchers(true), fetchPettyCashFunds(true)]);
    } else {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo actualizar el monto',
        description: 'Intenta nuevamente en unos segundos.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
    }

    skipErrorAlertRef.current = false;
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

  const handleReject = async (
    row: ControlRow | null,
    comments?: string,
    options?: { skipSuccessAlert?: boolean },
  ): Promise<boolean> => {
    const target = row ?? selectedRow;
    if (!target) return false;

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
      if (!options?.skipSuccessAlert) {
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
      }
      return true;
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
      return false;
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
    setEditOpen(false);
    setDetailData(null);
    setSelectedRow(null);
    setIsEditingAmount(false);
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
    editOpen,
    detailLoading,
    detailData,
    selectedRow,
    handleCloseDetail,
    formatDate,
    handleValidate,
    handleReject,
    validating,
    rejecting,
    isEditing: isEditingAmount,
    handleEditModeChange,
    handleUpdateAmount,
    updatingAmount: updating,
  };
};
