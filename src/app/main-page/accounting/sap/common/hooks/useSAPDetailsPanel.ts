import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { useDetailsPanel } from "@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/hooks/useDetailsPanel";
import type { DetailsPanelProps } from "@/app/main-page/accounting/invoices/validateinvoices/components/DetailsPanel/types";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useBillingCompleteProcessToSAPStore } from "@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore";

type UseSAPDetailsPanelParams = Pick<
  DetailsPanelProps,
  "selected" | "rejectType" | "setPanelOpen" | "operations" | "reqisition"
>;

export const useSAPDetailsPanel = ({
  selected,
  rejectType,
  setPanelOpen,
  operations,
  reqisition,
}: UseSAPDetailsPanelParams) => {
  const detailsPanelState = useDetailsPanel({
    selected,
    rejectType,
    setPanelOpen,
    operations,
    reqisition,
  });

  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();

  const { completeProcessToSAP } = useBillingCompleteProcessToSAPStore(
    (state) => ({
      completeProcessToSAP: state.completeProcessToSAP,
    }),
    shallow,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    subtotal: selected?.subtotal || "",
    iva: selected?.iva || "",
    total: selected?.total || "",
  });
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);

  useEffect(() => {
    setFormValues({
      subtotal: selected?.subtotal || "",
      iva: selected?.iva || "",
      total: selected?.total || "",
    });
  }, [selected]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(() => {
    console.log("Información guardada:", formValues);
    setIsEditing(false);
  }, [formValues]);

  const handleCancel = useCallback(() => {
    setFormValues({
      subtotal: selected?.subtotal || "",
      iva: selected?.iva || "",
      total: selected?.total || "",
    });
    setIsEditing(false);
  }, [selected]);

  const handleSendToSap = useCallback(() => {
    if (!selected?.id) {
      return;
    }

    const ids = [String(selected.id)];
    completeProcessToSAP(ids);
  }, [completeProcessToSAP, selected]);

  return {
    ...detailsPanelState,
    currentPagePermissions,
    isMobile,
    isEditing,
    setIsEditing,
    formValues,
    handleChange,
    handleSave,
    handleCancel,
    showEditConfirmation,
    setShowEditConfirmation,
    handleSendToSap,
  };
};

export type UseSAPDetailsPanelReturn = ReturnType<typeof useSAPDetailsPanel>;
