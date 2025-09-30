'use client';

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { useBillingPettyCash } from "../../../../../stores/useBillingPettyCash/useBillingPettyCash";
import { PettyCashHistoryRow } from "../types";

import type { LabelType } from "@/app/components/Label/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingHistoryStore } from "@/app/stores/useBillingHistoryStore/useBillingHistoryStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";

/** Mapea el texto de voucher a un LabelType mostrado por <Label /> */
function voucherTypeToLabelType(voucher?: string): LabelType {
  const v = (voucher ?? "").toLowerCase();
  if (v.includes("rosa")) return "vale-rosa";
  if (v.includes("azul")) return "vale-azul";
  return "restringido";
}

function statusToLabelType(status?: string): LabelType {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("rechaz")) return "rechazado";
  if (normalized.includes("proceso")) return "en-proceso";
  if (normalized.includes("valid")) return "valido";
  if (normalized.includes("pend")) return "pendiente";
  if (normalized.includes("no deducible")) return "prohibido";
  if (normalized.includes("sin factura")) return "sin-factura";
  return normalized ? "actualizado" : "pendiente";
}

const usePettyCashHistory = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const hasIdParam =
    typeof (searchParams as any)?.has === "function"
      ? (searchParams as any).has("id")
      : new URLSearchParams((searchParams as any) ?? "").has("id");

  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, internalSetSelected] = useState<PettyCashHistoryRow | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const setSelected = useCallback(
    (row: PettyCashHistoryRow | null) => {
      internalSetSelected(row);
      setSelectedVoucherId(row?.id ?? null);
    },
    [internalSetSelected, setSelectedVoucherId]
  );

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const {
    history,
    loading: loadingHistory,
    forceFetchBillingHistory,
  } = useBillingHistoryStore(
    (s) => ({
      history: s.history,
      loading: s.loading,
      forceFetchBillingHistory: s.forceFetchBillingHistory,
    }),
    shallow
  );

  const { successPut } = useBillingDocumentsStore(
    (s) => ({
      successPut: s.successPut,
    }),
    shallow
  );

  const { successPut: successPutImages } = useBillingImagesStore(
    (s) => ({
      successPut: s.successPut,
    }),
    shallow
  );

  function formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }

  const {
    vouchersFull,
    loading: loadingPetty,
    error: pettyError,
    fetchPettyCashVouchersByIdEmployee,
    fetchPettyCashVoucherById,
    pettyCashVoucherFull,
    deletePettyCashVoucher,
    removing,
    successDeleteVoucher,
    resetFlags,
  } = useBillingPettyCash(
    (state) => ({
      vouchersFull: state.vouchersFull,
      loading: state.loading,
      error: state.error,
      fetchPettyCashVouchersByIdEmployee: state.fetchPettyCashVouchersByIdEmployee,
      fetchPettyCashVoucherById: state.fetchPettyCashVoucherById,
      pettyCashVoucherFull: state.pettyCashVoucherFull,
      deletePettyCashVoucher: state.deletePettyCashVoucher,
      removing: state.removing,
      successDeleteVoucher: state.successDeleteVoucher,
      resetFlags: state.resetFlags,
    }),
    shallow
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<PettyCashHistoryRow | null>(null);
  const [rowPendingDelete, setRowPendingDelete] = useState<PettyCashHistoryRow | null>(null);

  useEffect(() => {
    if (!user?.idEmployee) return;
    try {
      forceFetchBillingHistory(user.idEmployee);
    } catch {
      // No hacer nada
    }
    fetchPettyCashVouchersByIdEmployee(user.idEmployee);
  }, [user?.idEmployee, forceFetchBillingHistory, fetchPettyCashVouchersByIdEmployee]);

  useEffect(() => {
    if (!selectedVoucherId) return;
    fetchPettyCashVoucherById(selectedVoucherId);
  }, [selectedVoucherId, fetchPettyCashVoucherById]);

  useEffect(() => {
    const isLoading = loadingHistory || loadingPetty || removing;
    if (isLoading) {
      showSpinner({
        message: removing
          ? "Espera un momento, el vale se está eliminando..."
          : "Obteniendo vales de caja chica...",
      });
      return;
    }
    if (successPut) setPanelOpen(false);
    if (successPutImages) setPanelOpen(false);
    hideSpinner();
  }, [
    loadingHistory,
    loadingPetty,
    removing,
    successPut,
    successPutImages,
    hideSpinner,
    showSpinner,
  ]);

  useEffect(() => {
    if (!rowPendingDelete) return;

    if (successDeleteVoucher) {
      if (user?.idEmployee) {
        fetchPettyCashVouchersByIdEmployee(user.idEmployee);
      }

      if (selected?.id === rowPendingDelete.id) {
        setSelected(null);
        setPanelOpen(false);
      }

      showAlert({
        type: "warning",
        variant: "filled",
        title: "Vale cancelado",
        description:
          rowPendingDelete.description?.name
            ? `${rowPendingDelete.description.name} fue eliminado correctamente.`
            : "El vale fue eliminado correctamente.",
        autoCloseMs: 1800,
        showPrimaryButton: false,
        showSecondaryButton: false,
        onClose: hideAlert,
      });

      setRowPendingDelete(null);
      resetFlags();
      return;
    }

    if (!removing && pettyError) {
      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo cancelar el vale",
        description: pettyError,
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: "Reintentar",
        onSecondaryClick: () => {
          hideAlert();
          setConfirmOpen(true);
          setRowToDelete(rowPendingDelete);
        },
      });

      setRowPendingDelete(null);
      resetFlags();
    }
  }, [
    fetchPettyCashVouchersByIdEmployee,
    hideAlert,
    pettyError,
    removing,
    resetFlags,
    rowPendingDelete,
    selected,
    setPanelOpen,
    setSelected,
    showAlert,
    successDeleteVoucher,
    user?.idEmployee,
  ]);

  const rejected = history.filter((r) => {
    const s = (r.status || "").toLowerCase();
    return s === "valido" || s === "en-proceso" || s === "rechazado";
  });

  const pettyCashAsHistoryRows = useMemo<PettyCashHistoryRow[]>(
    () =>
      (vouchersFull ?? []).map((v) => {
        const total =
          typeof v.total === "number" && !Number.isNaN(v.total)
            ? v.total
            : typeof v.amount === "number" && !Number.isNaN(v.amount)
            ? v.amount
            : 0;

        const voucherType = v.voucher_type ?? "";

        return {
          id: v.id,
          status: v.status ?? "",
          statusLabelType: statusToLabelType(v.status),
          billing_image_id: "",
          billingdocument_id: v.uuid ?? v.id,
          project: {
            id: v.project?.id ?? "",
            name: v.project?.name ?? "",
            proyectKey: v.project?.proyectkey ?? "",
            client: v.project?.client ?? "",
          },
          requisitionkey: v.project?.proyectkey ?? "",
          xml: v.xml ?? "",
          pdf: v.pdf ?? "",
          image: "",
          comments: v.comments ?? "",
          dateCreate: formatDate(v.application_date),
          certificationDate: formatDate(v.application_date),
          uuid: v.uuid ?? "",
          description: {
            id_billingdescription: "",
            name: v.concept ?? "",
          },
          category: {
            id_billingcategory: "",
            name: v.voucher_type ?? "",
          },
          numpersons: 0,
          numnights: 0,
          amount: v.amount,
          voucherType,
          voucherLabelType: voucherTypeToLabelType(voucherType),
          date: formatDate(v.application_date),
          dateValue: v.application_date ?? '',
          total,
          subtotal:
            typeof v.subtotal === "number" && !Number.isNaN(v.subtotal)
              ? v.subtotal
              : 0,
          iva: typeof v.iva === "number" && !Number.isNaN(v.iva) ? v.iva : 0,
          employeeName: v.employeename ?? "",
        } satisfies PettyCashHistoryRow;
      }),
    [vouchersFull]
  );

  const filteredPettyCashRows = useMemo(() => {
    if (activeFilter === 'all') return pettyCashAsHistoryRows;

    return pettyCashAsHistoryRows.filter((row) => {
      const voucher = (row.voucherType ?? '').toLowerCase();
      const status = (row.status ?? '').toLowerCase();

      switch (activeFilter) {
        case 'voucher:rosa':
          return voucher.includes('rosa');
        case 'voucher:azul':
          return voucher.includes('azul');
        case 'status:validado':
          return status.includes('valid');
        case 'status:rechazado':
          return status.includes('rechaz');
        case 'status:proceso':
          return status.includes('proceso');
        default:
          return true;
      }
    });
  }, [pettyCashAsHistoryRows, activeFilter]);

  const loading = loadingPetty || loadingHistory;
  const detailLoading = loadingPetty && !!selectedVoucherId;

  // ======= NUEVAS FUNCIONES INTEGRADAS =======

  const onEdit = (row: PettyCashHistoryRow) => {
    setSelected(row);
    setPanelOpen(true);
  };

  const onDelete = (row: PettyCashHistoryRow) => {
    setRowToDelete(row);
    setConfirmOpen(true);
    setRowPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    const current = rowToDelete
    if (!current) return
    setConfirmOpen(false)

    showSpinner({ message: 'Espera un momento, el documento se está eliminando' })
    const ok = await deletePettyCashVoucher(current.id)
    hideSpinner()
    setRowToDelete(null)

    if (ok) {
      showAlert({
        type: 'warning',
        variant: 'filled',
        title: 'Requisición eliminada',
        description: `Fue eliminada correctamente.`,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
        onClose: hideAlert,
      })
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
        onSecondaryClick: () => { hideAlert(); onDelete(current) },
      })
    }
  }

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setRowToDelete(null);
    setRowPendingDelete(null);
  };

  const refresh = () => {
    if (!user?.idEmployee) return;
    fetchPettyCashVouchersByIdEmployee(user.idEmployee);
  };

  const handleFilterChange = useCallback((value: string) => {
    setActiveFilter(value || 'all');
  }, []);

  // ======= RETURN =======
  return {
    panelOpen,
    setPanelOpen,
    selected,
    setSelected,
    onEdit,
    onDelete,
    handleCancelDelete,
    confirmOpen,
    rowToDelete,
    handleConfirmDelete,
    removing,
    refresh,
    history,
    rejected,
    pettyCash: vouchersFull,
    pettyCashAsHistoryRows,
    filteredPettyCashRows,
    handleFilterChange,
    activeFilter,
    selectedDetail: pettyCashVoucherFull ?? null,
    detailLoading,
    pettyError,
    loading,
    hasIdParam
  };
};

export default usePettyCashHistory;
