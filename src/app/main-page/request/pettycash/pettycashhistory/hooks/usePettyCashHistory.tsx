'use client';
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { shallow } from "zustand/shallow";

import { useBillingPettyCash } from "../../../../../stores/useBillingPettyCash/useBillingPettyCash";
import { PettyCashHistoryRow } from "../types";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingHistoryStore } from "@/app/stores/useBillingHistoryStore/useBillingHistoryStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";
import type { LabelType } from "@/app/components/Label/types";

/** Mapea el texto de voucher a un LabelType mostrado por <Label /> */
function voucherTypeToLabelType(voucher?: string): LabelType {
  const v = (voucher ?? "").toLowerCase();
  if (v.includes("rosa")) return "vale-rosa";
  if (v.includes("azul")) return "vale-azul";
  return "restringido";
}

const usePettyCashHistory = () => {
  const { user } = useAuth();
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasIdParam =
    typeof (searchParams as any)?.has === "function"
      ? (searchParams as any).has("id")
      : new URLSearchParams((searchParams as any) ?? "").has("id");

  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, internalSetSelected] = useState<PettyCashHistoryRow | null>(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  const { usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;

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
  } = useBillingPettyCash(
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

  useEffect(() => {
    if (!user?.idEmployee) return;
    try {
      forceFetchBillingHistory(user.idEmployee);
    } catch {}
    fetchPettyCashVouchersByIdEmployee(user.idEmployee);
  }, [user?.idEmployee, forceFetchBillingHistory, fetchPettyCashVouchersByIdEmployee]);

  useEffect(() => {
    if (!selectedVoucherId) return;
    fetchPettyCashVoucherById(selectedVoucherId);
  }, [selectedVoucherId, fetchPettyCashVoucherById]);

  useEffect(() => {
    const isLoading = loadingHistory || loadingPetty;
    if (isLoading) {
      showSpinner({ message: "Obteniendo vales de caja chica..." });
      return;
    }
    if (successPut) setPanelOpen(false);
    if (successPutImages) setPanelOpen(false);
    hideSpinner();
  }, [
    loadingHistory,
    loadingPetty,
    successPut,
    successPutImages,
    hideSpinner,
    showSpinner,
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
          billing_image_id: "",
          billingdocument_id: v.uuid ?? v.id,
          project: {
            id: v.project?.id ?? "",
            name: v.project?.name ?? "",
            proyectKey: v.project?.proyectkey ?? "",
            client: v.project?.client ?? "",
          },
          requisitionkey: v.project?.proyectkey ?? "",
          status: "rechazado",
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

  const setSelected = useCallback(
    (row: PettyCashHistoryRow | null) => {
      internalSetSelected(row);
      setSelectedVoucherId(row?.id ?? null);
    },
    [setSelectedVoucherId]
  );

  const loading = loadingPetty || loadingHistory;
  const detailLoading = loadingPetty && !!selectedVoucherId;

  // ======= NUEVAS FUNCIONES INTEGRADAS =======

  const onEdit = (row: PettyCashHistoryRow) => {
    const clean = path.endsWith('/') ? path.slice(0, -1) : path;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("id", row.id);
    router.push(`${clean}?${qs.toString()}`);
  };

  const onDelete = (row: PettyCashHistoryRow) => {
    setSelected(row);
    setPanelOpen(true); // podría abrir confirmación aquí si lo implementas
  };

  const refresh = () => {
    if (!user?.idEmployee) return;
    fetchPettyCashVouchersByIdEmployee(user.idEmployee);
  };

  // ======= RETURN =======
  return {
    panelOpen,
    setPanelOpen,
    selected,
    setSelected,
    onEdit,
    onDelete,
    refresh,
    history,
    rejected,
    pettyCash: vouchersFull,
    pettyCashAsHistoryRows,
    selectedDetail: pettyCashVoucherFull ?? null,
    detailLoading,
    pettyError,
    loading,
    hasIdParam
  };
};

export default usePettyCashHistory;
