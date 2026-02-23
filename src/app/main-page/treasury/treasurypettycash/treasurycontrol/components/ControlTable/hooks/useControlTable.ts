'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/navigation';

import type { ControlDetail, ControlRow } from '../types';

import type { LabelType } from "@/app/components/Label/types";
import type { SelectOption } from "@/app/components/Select/types";
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { PettyCashVoucherData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types';
import type { PostAuthorization } from "@/app/mappings/authorizations/authorizations.types";
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore';
import { useAuthorizationsStore } from "@/app/stores/useAuthorizationsStore/useAuthorizationsStore";
import { useBillingPettyCash } from '@/app/stores/useBillingPettyCash/useBillingPettyCash';
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
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
    amount: voucher.amount || '0',
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

const resolveAuthorizationKind = (voucherType?: string): string => {
  const normalized = (voucherType ?? "")
    .trim()
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!normalized) return "Vale";
  if (normalized.includes("azul")) return "Vale azul";
  if (normalized.includes("rosa")) return "Vale rosa";
  return voucherType ?? "Vale";
};

/**
 * Handles data loading, filtering and row actions for the petty cash control table.
 */
export const useControlTable = () => {
  const router = useRouter();
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { user } = useAuth();

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
  const [authorizationRequestOpen, setAuthorizationRequestOpen] = useState(false);
  const [authorizationRequestSelected, setAuthorizationRequestSelected] = useState("");
  const [authorizationRequestError, setAuthorizationRequestError] = useState<string | null>(null);
  const [isRequestingAuthorization, setIsRequestingAuthorization] = useState(false);
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
    pettyCashVoucherAmountHistory,
    loadingAmountHistory,
    fetchPettyCashVouchers,
    fetchPettyCashVoucherById,
    fetchPettyCashFunds,
    deletePettyCashVoucher,
    fetchPettyCashVoucherAmountHistory,
    updatePettyCashVoucherAmount,
    validatePettyCashVoucher,
    rejectAuthorizationEvidence,
    rejectPettyCashVoucher,
    rejectBillingInvoice,
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
      pettyCashVoucherAmountHistory: state.pettyCashVoucherAmountHistory,
      loadingAmountHistory: state.loadingAmountHistory,
      fetchPettyCashVouchers: state.fetchPettyCashVouchers,
      fetchPettyCashVoucherById: state.fetchPettyCashVoucherById,
      fetchPettyCashFunds: state.fetchPettyCashFunds,
      deletePettyCashVoucher: state.deletePettyCashVoucher,
      fetchPettyCashVoucherAmountHistory: state.fetchPettyCashVoucherAmountHistory,
      updatePettyCashVoucherAmount: state.updatePettyCashVoucherAmount,
      validatePettyCashVoucher: state.validatePettyCashVoucher,
      rejectAuthorizationEvidence: state.rejectAuthorizationEvidence,
      rejectPettyCashVoucher: state.rejectPettyCashVoucher,
      rejectBillingInvoice: state.rejectBillingInvoice,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  const { employees, employeesError, fetchEmployees } = useEmployeesStore(
    (state) => ({
      employees: state.employees,
      employeesError: state.error,
      fetchEmployees: state.fetchEmployees,
    }),
    shallow,
  );

  const { createAuthorization } = useAuthorizationsStore(
    (state) => ({
      createAuthorization: state.createAuthorization,
    }),
    shallow,
  );

  useEffect(() => {
    if (!isGatewayReady) return;
    fetchPettyCashVouchers();
  }, [isGatewayReady, fetchPettyCashVouchers]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (!employeesError) return;
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo cargar la lista de empleados',
      description: String(employeesError) || 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
    });
  }, [employeesError, hideAlert, showAlert]);

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

  useEffect(() => {
    const detailId = detailData?.id;
    if (!detailId) return;

    const status = detailData?.status ?? selectedRow?.status;
    if (!isVoucherValid(status)) return;

    void fetchPettyCashVoucherAmountHistory(detailId);
  }, [detailData?.id, detailData?.status, selectedRow?.status, fetchPettyCashVoucherAmountHistory]);

  const authorizerOptions = useMemo<SelectOption[]>(() => {
    if (!Array.isArray(employees)) return [];
    return employees.map((employee) => ({
      label: employee.fullname,
      value: employee.employee_id,
    }));
  }, [employees]);

  useEffect(() => {
    if (!authorizationRequestOpen) return;
    if (authorizationRequestSelected) return;
    if (!authorizerOptions.length) return;
    setAuthorizationRequestSelected(authorizerOptions[0].value);
  }, [authorizationRequestOpen, authorizationRequestSelected, authorizerOptions]);

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

  const handleOpenAuthorizationRequest = (row: ControlRow | null) => {
    const target = row ?? selectedRow;
    const detail = detailData;
    if (!target || !detail?.employee_id) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'InformaciÃ³n incompleta',
        description:
          'No se encontrÃ³ el colaborador asociado para solicitar la autorización.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      return;
    }

    setAuthorizationRequestError(null);
    setAuthorizationRequestOpen(true);
  };

  const handleCancelAuthorizationRequest = () => {
    setAuthorizationRequestOpen(false);
    setAuthorizationRequestError(null);
  };

  const handleAuthorizationRequestChange = (value: string) => {
    setAuthorizationRequestSelected(value);
    if (authorizationRequestError) setAuthorizationRequestError(null);
  };

  const handleConfirmAuthorizationRequest = async () => {
    if (!detailData?.id || !detailData?.employee_id) {
      setAuthorizationRequestOpen(false);
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'InformaciÃ³n incompleta',
        description:
          'No se encontrÃ³ la informaciÃ³n necesaria para solicitar la autorización.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      return;
    }

    if (!authorizationRequestSelected) {
      setAuthorizationRequestError('Selecciona un autorizador.');
      return;
    }

    setIsRequestingAuthorization(true);
    showSpinner({ message: 'Enviando solicitud de autorizaciónâ€¦' });
    try {
      const applicantId = detailData.employee_id;
      const applicant = (employees ?? []).find(
        (employee) => employee.employee_id === applicantId,
      );

      const payload: PostAuthorization = {
        authorization_id: '',
        applicant_id: applicantId,
        authorizer_id: authorizationRequestSelected,
        enterprise_id:
          applicant?.department?.enterprise_id ?? user?.idEnterprise ?? '',
        department_id:
          applicant?.department?.department_id ?? user?.idDepartment ?? '',
        kind: resolveAuthorizationKind(detailData.voucher_type),
        proyect_id: detailData.project?.id ?? undefined,
        event_id: detailData.id,
      };

      const created = await createAuthorization(payload);
      if (!created) {
        throw new Error(
          useAuthorizationsStore.getState().error ||
            'No se pudo crear la autorización.',
        );
      }

      showAlert({
        type: 'success',
        variant: 'filled',
        title: 'Solicitud enviada',
        description: 'La autorización fue enviada correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
        onClose: hideAlert,
      });

      setAuthorizationRequestOpen(false);
      setAuthorizationRequestError(null);
      setAuthorizationRequestSelected('');

      setDetailLoading(true);
      try {
        const refreshed = await fetchPettyCashVoucherById(detailData.id, true);
        if (refreshed) {
          setDetailData(refreshed);
        }
      } finally {
        setDetailLoading(false);
      }

      await fetchPettyCashVouchers(true);
    } catch (error) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo enviar la solicitud',
        description: String(error) || 'OcurriÃ³ un error al crear la autorización.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
    } finally {
      hideSpinner();
      setIsRequestingAuthorization(false);
    }
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
      await Promise.all([
        fetchPettyCashVouchers(true),
        fetchPettyCashFunds(true),
      ]);
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
    const voucherId = detailData?.id ?? selectedRow?.id;

    if (!voucherId) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'Información incompleta',
        description:
          'No se encontró el identificador del vale para actualizar el monto.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      return;
    }

    skipErrorAlertRef.current = true;
    suppressedErrorRef.current = undefined;

    showSpinner({ message: 'Guardando monto solicitado…' });
    let ok = false;
    try {
      ok = await updatePettyCashVoucherAmount({
        id: voucherId,
        date: new Date().toISOString(),
        amount,
      });
    } finally {
      hideSpinner();
    }

    if (ok) {
      setIsEditingAmount(false);
      setDetailData((prev) =>
        prev && prev.id === voucherId
          ? { ...prev, amount: amount.toFixed(2), total: amount }
          : prev,
      );
      setSelectedRow((prev) =>
        prev && prev.id === voucherId
          ? { ...prev, total: amount, amount: amount.toFixed(2) }
          : prev,
      );

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

      await fetchPettyCashVoucherAmountHistory(voucherId, true);

      setDetailLoading(true);
      try {
        const refreshed = await fetchPettyCashVoucherById(voucherId, true);
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

  const handleRejectAuthorizationEvidence = async (
    row: ControlRow | null,
    comments: string,
  ): Promise<boolean> => {
    const target = row ?? selectedRow;
    if (!target) return false;

    const trimmedComment = comments.trim();
    if (!trimmedComment) {
      showAlert({
        type: 'warning',
        variant: 'filled',
        title: 'Comentario requerido',
        description: 'Agrega un comentario para rechazar la evidencia de autorización.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      resetFlags();
      return false;
    }

    showSpinner({ message: 'Rechazando evidencia de autorización…' });
    const ok = await rejectAuthorizationEvidence({ id: target.id, comment: trimmedComment });
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
        title: 'Evidencia rechazada',
        description: 'La evidencia de autorización se rechazó correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
        onClose: hideAlert,
      });
      return true;
    }

    hideSpinner();
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo rechazar la evidencia',
      description: 'Intenta de nuevo en unos segundos.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
    });
    resetFlags();
    return false;
  };

  const handleRejectInvoice = async (
    row: ControlRow | null,
    comments: string,
  ): Promise<boolean> => {
    const target = row ?? selectedRow;
    const trimmedComment = comments.trim();
    if (!target || !trimmedComment) return false;

    const invoiceId = detailData?.id ?? target.id;
    if (!invoiceId) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'Información incompleta',
        description: 'No se encontró el identificador de la factura para rechazarla.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      });
      return false;
    }

    showSpinner({ message: 'Rechazando factura seleccionada…' });
    const ok = await rejectBillingInvoice({ id: invoiceId, comments: trimmedComment });
    const selectedId = selectedRow?.id;
    const panelOpen = detailOpen || editOpen;

    if (ok) {
      const nextStatus = (() => {
        const currentStatus = detailData?.status ?? target.status ?? '';
        const normalized = currentStatus
          .toLocaleLowerCase('es-MX')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        if (normalized.includes('factura') && normalized.includes('rechaz')) {
          return currentStatus;
        }

        return 'Factura rechazada';
      })();

      setDetailData((prev) => {
        if (!prev || prev.id !== invoiceId) return prev;
        return { ...prev, status: nextStatus };
      });

      setSelectedRow((prev) => {
        if (!prev || prev.id !== target.id) return prev;
        return { ...prev, status: nextStatus };
      });

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
        title: 'Factura rechazada',
        description: 'Se rechazó la factura y el vale correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 2000,
        onClose: hideAlert,
      });
      return true;
    } else {
      hideSpinner();
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo rechazar la factura',
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
    handleRejectInvoice,
    handleRejectAuthorizationEvidence,
    validating,
    rejecting,
    isEditing: isEditingAmount,
    handleEditModeChange,
    handleUpdateAmount,
    updatingAmount: updating,
    amountHistory: pettyCashVoucherAmountHistory,
    isAmountHistoryLoading: loadingAmountHistory,
    authorizerOptions,
    authorizationRequestOpen,
    authorizationRequestSelected,
    authorizationRequestError,
    isRequestingAuthorization,
    handleOpenAuthorizationRequest,
    handleCancelAuthorizationRequest,
    handleConfirmAuthorizationRequest,
    handleAuthorizationRequestChange,
  };
};
