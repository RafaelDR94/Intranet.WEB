import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";

import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingHistoryStore } from "@/app/stores/useBillingHistoryStore/useBillingHistoryStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";

import { useBillingPettyCash } from "../../../../../stores/useBillingPettyCash/useBillingPettyCash";
import { PettyCashVoucherFull } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";

const usePettyCashHistory = () => {
  const { user } = useAuth();
  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<HistoryRow | null>(null);

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
  const {
    vouchersFull,
    loading: loadingPetty,
    error: pettyError,
    fetchPettyCashVouchersByIdEmployee,
  } = useBillingPettyCash() as {
    vouchersFull: PettyCashVoucherFull[];
    loading: boolean;
    error?: string;
    fetchPettyCashVouchersByIdEmployee: (idEmployee: string) => Promise<PettyCashVoucherFull[] | null>;
  };

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
  const pettyCashAsHistoryRows: HistoryRow[] = (vouchersFull ?? []).map((v) => {
    const row: any = {
      id: v.id,
      // Fecha del vale
      date: v.application_date,
      // En caso de que tu DataTable aún use "dateCreate" como sortKey por default
      dateCreate: v.application_date,

      // Texto y montos
      concept: v.concept,
      voucherType: v.voucher_type,
      amount: typeof v.total === "number" ? v.total : v.amount,

      // Estatus (ajusta si el backend te regresa uno real)
      status: "registrado",

      // Datos de proyecto/empleado útiles en detalle
      projectKey: v.project?.proyectkey ?? "",
      projectName: v.project?.name ?? "",
      employeeName: v.employeename ?? "",

      // Extras por si tu SideMenu los requiere
      xml: v.xml,
      pdf: v.pdf,
      uuid: v.uuid,
      rfc_emisor: v.rfc_emisor,
      rfc_receptor: v.rfc_receptor,
      subtotal: v.subtotal,
      iva: v.iva,
      total: v.total,
    };
    return row as HistoryRow;
  });

  const loading = loadingPetty || loadingHistory;

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

    pettyError,
    loading,
  };
};

export default usePettyCashHistory;
