import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

/**
 * Hook that fetches and exposes the current requisition details based on the
 * `id` query parameter. It also handles loading and error feedback through the
 * {@link usePrincipal} helpers.
 */
const useRequisitionsDetails = () => {
  const {
    successPut,
    currentRequisition,
    gettincurrentReq,
    error,
    fetchCurrentRequisition,
    resetCurrentReq,
    resetFlags,
  } = useRequisitionsStore(
    (s) => ({
      currentRequisition: s.currentRequisition,
      gettincurrentReq: s.gettincurrentReq,
      successPut: s.successPut,
      error: s.error,
      fetchCurrentRequisition: s.fetchCurrentRequisition,
      resetCurrentReq: s.resetCurrentReq,
      resetFlags: s.resetFlags,
    }),
    shallow
  );
  const { succesReject } = useBillingDocumentsStore(
    (s) => ({ succesReject: s.succesReject }),
    shallow
  );

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  useEffect(() => {
    if (gettincurrentReq) {
      showSpinner({ message: "Obteniendo detalles de requisición" });
      return;
    }
    hideSpinner();
    resetFlags();
    if (error)
      showAlert({
        type: "error",
        variant: "subtle",
        title: "Error",
        primaryLabel: "Cerrar",
        secondaryLabel: "Reintentar",
        description: "No se pudo obtener el detalle de tu requisición",
        onPrimaryClick: hideAlert,
        onSecondaryClick: () => {
          if (id) fetchCurrentRequisition(id);
        },
      });
    if (successPut && id) {
      fetchCurrentRequisition(id, true);
    }
  }, [gettincurrentReq, error, successPut, succesReject]);

  useEffect(() => {
    if (succesReject && id) fetchCurrentRequisition(id, true);
  }, [succesReject]);

  useEffect(() => {
    if (id) fetchCurrentRequisition(id);
    else resetCurrentReq();
  }, [id]);

  return { currentRequisition };
};

export default useRequisitionsDetails;