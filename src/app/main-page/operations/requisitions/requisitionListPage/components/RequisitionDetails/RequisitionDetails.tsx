import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";

import PerDiemBalanceCard from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
import useRequisitionsDetails from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/hooks/useRequisitionsDetails";
import RequisitionDetailsTable from "./components/RequisitionsDetailsTable";

import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { Button } from "@/app/components/Button/Button";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useBillingRequisitionImageUrlStore } from "@/app/stores/useBillingRequisitionImageUrlStore/useBillingRequisitionImageUrlStore";
import UploadIcon from "@/assets/icons/acciones/upload.svg";
/**
 * Muestra el formulario de requisición junto con información adicional como
 * el balance de viáticos y los documentos relacionados. Renderiza secciones
 * según los permisos del usuario actual.
 */
const RequisitionDetails: React.FC = () => {
  const { currentRequisition } = useRequisitionsDetails();
  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shouldNotifyImageErrorRef = useRef(false);
  const { firebasestorage } = useFirebase();
  const { usePrincipalAlert, usePrincipalLoading, usePrincipalImage } =
    usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showImage } = usePrincipalImage;
  const {
    requisitionImage,
    updatingImage,
    imageError,
    successImagePut,
    fetchRequisitionImageUrlById,
    updateRequisitionImageUrl,
    resetImageFlags,
  } = useBillingRequisitionImageUrlStore(
    (s) => ({
      requisitionImage: s.requisitionImage,
      updatingImage: s.updating,
      imageError: s.error,
      successImagePut: s.successPut,
      fetchRequisitionImageUrlById: s.fetchRequisitionImageUrlById,
      updateRequisitionImageUrl: s.updateRequisitionImageUrl,
      resetImageFlags: s.resetFlags,
    }),
    shallow,
  );

  const handleSelectDocument = () => {
    fileInputRef.current?.click();
  };

  const handleViewEvidence = async () => {
    if (!currentRequisition?.billingrequisition_id) return;
    shouldNotifyImageErrorRef.current = true;
    showSpinner({ message: "Cargando evidencia..." });
    try {
      const evidence = await fetchRequisitionImageUrlById(
        currentRequisition.billingrequisition_id,
        true,
      );
      if (!evidence?.imageUrl) {
        showAlert({
          type: "info",
          variant: "filled",
          title: "Sin evidencia",
          description: "No se encontrÃ³ evidencia para esta requisiciÃ³n.",
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
        shouldNotifyImageErrorRef.current = false;
        return;
      }
      showImage({
        src: evidence.imageUrl,
        alt: "Evidencia de aprobaciÃ³n",
      });
    } catch (error) {
      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo cargar la evidencia",
        description: String(error) || "OcurriÃ³ un error al obtener la evidencia.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
      });
    } finally {
      hideSpinner();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !currentRequisition?.billingrequisition_id) return;

    showSpinner({ message: "Subiendo evidencia..." });
    try {
      const extension = file.name.includes(".")
        ? file.name.slice(file.name.lastIndexOf("."))
        : ".jpg";
      const storagePath = `Billings/BillingRequisition/${currentRequisition.billingrequisition_id}/approval${extension}`;
      const imageUrl = await firebasestorage.uploadFile(file, storagePath);

      if (!imageUrl) {
        throw new Error("No se pudo subir la imagen.");
      }

      shouldNotifyImageErrorRef.current = true;
      await updateRequisitionImageUrl({
        idRequisition: currentRequisition.billingrequisition_id,
        imageUrl,
      });
    } catch (error) {
      hideSpinner();
      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo subir la evidencia",
        description: String(error) || "OcurriÃ³ un error al subir la imagen.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
      });
    }
  };

  useEffect(() => {
    if (currentRequisition?.billingrequisition_id) {
      fetchRequisitionImageUrlById(currentRequisition.billingrequisition_id);
    }
  }, [currentRequisition?.billingrequisition_id, fetchRequisitionImageUrlById]);

  useEffect(() => {
    if (updatingImage) {
      showSpinner({ message: "Guardando evidencia..." });
      return;
    }
    hideSpinner();
    if (imageError) {
      if (shouldNotifyImageErrorRef.current) {
        showAlert({
          type: "error",
          variant: "filled",
          title: "No se pudo guardar la evidencia",
          description: imageError,
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
      }
      shouldNotifyImageErrorRef.current = false;
    }
    if (successImagePut) {
      showAlert({
        type: "success",
        variant: "filled",
        title: "Evidencia guardada",
        description: "La evidencia se guardÃ³ correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      shouldNotifyImageErrorRef.current = false;
    }
    if (imageError || successImagePut) resetImageFlags();
  }, [
    hideAlert,
    hideSpinner,
    imageError,
    resetImageFlags,
    showAlert,
    showSpinner,
    successImagePut,
    updatingImage,
  ]);
  if (currentRequisition)
    return (
      <>
        <div className="flex w-full gap-6">
          <div className={clsx(isMobile ? "basis-3/3" : "basis-2/3")}>
            {currentPagePermissions?.showDetails  && (
              <RequisitionsForm
                mode="edit"
                startDisabled
                startCollaps={isMobile}
                enableCollaps
                responsiveLayoutMatrix={{
                  sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                  md: [
                    [5, 5],
                    [5, 5],
                    [5, 5],
                    [5, 5],
                  ],
                  lg: [
                    [5, 5],
                    [5, 5],
                    [5, 5],
                    [5, 5],
                  ],
                }}
                initialValues={currentRequisition}
              />
            )}
          </div>
          {!isMobile && (
            <div className="basis-1/3">
              <div>
                {currentPagePermissions?.showBalance && (
                <PerDiemBalanceCard
                  startDate={currentRequisition.assignmentdate}
                  endDate={currentRequisition.endDate}
                  requestedAmount={Number(currentRequisition.amountdeposited)}
                  verifiedAmount={Number(currentRequisition.provenamount)}
                  bodyClassName="flex justify-between"
                  donutSize={130}
                  cardClassName="!py-[18px]"
                />
              )}
              </div>
              <div>
                <div className="w-full rounded-lg bg-white-70 p-6 shadow-md h-auto mt-3">
                  <p className="text-label text-gray-70 mb-1">
                    Sube aquí la imagen de la evidencia de aprobación
                  </p>
                  {requisitionImage?.imageUrl ? (
                    <Button onClick={handleViewEvidence}>
                      Ver evidencia
                    </Button>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button onClick={handleSelectDocument} icon={UploadIcon}>
                        Seleccionar documento
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {isMobile && (
          <CollapsibleSection
            enableCollapse
            defaultOpen={true}
            title="Balance de viaticos"
          >
            {currentPagePermissions?.showBalance && (
              <PerDiemBalanceCard
                startDate={currentRequisition.assignmentdate}
                endDate={currentRequisition.endDate}
                requestedAmount={Number(currentRequisition.amountdeposited)}
                verifiedAmount={Number(currentRequisition.provenamount)}
              />
            )}
          </CollapsibleSection>
        )}
        {currentPagePermissions?.showDocuments && (
          <RequisitionDetailsTable />
        )}
      </>
    );
};
export default RequisitionDetails;
