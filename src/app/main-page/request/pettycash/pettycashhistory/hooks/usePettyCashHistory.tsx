import { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";

import { useBillingPettyCash } from "../../../../../stores/useBillingPettyCash/useBillingPettyCash";
import { PettyCashHistoryRow } from "../types";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingHistoryStore } from "@/app/stores/useBillingHistoryStore/useBillingHistoryStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";

const usePettyCashHistory = () => {
  const { user } = useAuth();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, internalSetSelected] = useState<PettyCashHistoryRow | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  // Spinner global
  const { usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;

  // Mantén el history clásico si aún lo usas en otras vistas
  const { history, loading: loadingHistory, forceFetchBillingHistory } = useBillingHistoryStore(
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

  // ======== PETTY CASH: vouchers por empleado (FULL) ========
  const { vouchersFull, loading: loadingPetty, error: pettyError, fetchPettyCashVouchersByIdEmployee, fetchPettyCashVoucherById, pettyCashVoucherFull } =
    useBillingPettyCash(
      (state) => ({
        vouchersFull: state.vouchersFull,
        loading: state.loading,
        error: state.error,
        fetchPettyCashVouchersByIdEmployee: state.fetchPettyCashVouchersByIdEmployee,
        fetchPettyCashVoucherById: state.fetchPettyCashVoucherById,
        pettyCashVoucherFull: state.pettyCashVoucherFull,
      }),
      shallow
    );

  // Disparo de datos
  useEffect(() => {
    if (!user?.idEmployee) return;

    // Si aún necesitas el historial general, mantenlo
    try {
      forceFetchBillingHistory(user.idEmployee);
    } catch {
      // no-op si no aplica
    }

    // Historial de vales por empleado (endpoint ByIdEmployee/{idEmployee})
    fetchPettyCashVouchersByIdEmployee(user.idEmployee);
  }, [user?.idEmployee, forceFetchBillingHistory, fetchPettyCashVouchersByIdEmployee]);

  useEffect(() => {
    if (!selectedVoucherId) return;
    fetchPettyCashVoucherById(selectedVoucherId);
  }, [selectedVoucherId, fetchPettyCashVoucherById]);

  // Spinners + cierre de panel por éxito
  useEffect(() => {
    const isLoading = loadingHistory || loadingPetty;
    if (isLoading) {
      showSpinner({ message: "Obteniendo vales de caja chica..." });
      return;
    }
    if (successPut) setPanelOpen(false);
    if (successPutImages) setPanelOpen(false);
    hideSpinner();
  }, [loadingHistory, loadingPetty, successPut, successPutImages, hideSpinner, showSpinner]);

  // Rechazados del history clásico (si lo sigues mostrando en otra sección)
  const rejected = history.filter((r) => {
    const s = (r.status || "").toLowerCase();
    return s === "prohibido" || s === "invalido" || s === "rechazado" || s === "restringido";
  });

  // Proyección de vouchers Full -> filas HistoryRow para la tabla
  const pettyCashAsHistoryRows = useMemo<PettyCashHistoryRow[]>(
    () =>
      (vouchersFull ?? []).map((v) => {
        const total =
          typeof v.total === "number" && !Number.isNaN(v.total)
            ? v.total
            : typeof v.amount === "number" && !Number.isNaN(v.amount)
            ? v.amount
            : 0;

        return {
          id: v.id,
          billing_image_id: "",
          billingdocument_id: v.uuid ?? v.id,
          project: {
            id: v.project?.id ?? "",
            name: v.project?.name ?? "",
            proyectKey: v.project?.proyectkey ?? "",
            client: v.project?.client ?? "",
          },
          requisitionkey: v.project?.proyectkey ?? "",
          status: "valido",
          xml: v.xml ?? "",
          pdf: v.pdf ?? "",
          image: "",
          comments: v.comments ?? "",
          dateCreate: v.application_date ?? "",
          certificationDate: v.application_date ?? "",
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
          amount: total,
          voucherType: v.voucher_type ?? "",
          date: v.application_date ?? "",
          total,
          subtotal:
            typeof v.subtotal === "number" && !Number.isNaN(v.subtotal) ? v.subtotal : 0,
          iva: typeof v.iva === "number" && !Number.isNaN(v.iva) ? v.iva : 0,
          employeeName: v.employeename ?? "",
        } satisfies PettyCashHistoryRow;
      }),
    [vouchersFull]
  );

  const setSelected = useCallback(
    (row: PettyCashHistoryRow | null) => {
      internalSetSelected(row);
      setSelectedVoucherId(row?.id ?? null);
    },
    [setSelectedVoucherId]
  );

  const loading = loadingPetty || loadingHistory;
  const detailLoading = loadingPetty && !!selectedVoucherId;

  return {
    panelOpen,
    setPanelOpen,
    selected,
    setSelected,

    // Historial clásico (si aún lo usas en otra vista)
    history,
    rejected,

    // Vales (FULL) y proyección para la tabla
    pettyCash: vouchersFull,
    pettyCashAsHistoryRows,
    selectedDetail: pettyCashVoucherFull ?? null,
    detailLoading,

    pettyError,
    loading,
  };
};

export default usePettyCashHistory;
