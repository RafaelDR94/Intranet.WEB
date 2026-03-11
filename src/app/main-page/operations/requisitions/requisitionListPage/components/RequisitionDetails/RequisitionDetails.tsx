import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";

import PerDiemBalanceCard from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
import useRequisitionsDetails from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/hooks/useRequisitionsDetails";
import RequisitionDetailsTable from "./components/RequisitionsDetailsTable";

import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { Button } from "@/app/components/Button/Button";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { SelectOption } from "@/app/components/Select/types";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { PostAuthorization } from "@/app/mappings/authorizations/authorizations.types";
import { useAuthorizationsStore } from "@/app/stores/useAuthorizationsStore/useAuthorizationsStore";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingRequisitionImageUrlStore } from "@/app/stores/useBillingRequisitionImageUrlStore/useBillingRequisitionImageUrlStore";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";
import { useTutorials } from "@/tutorials/engine/TutorialProvider";
/**
 * Muestra el formulario de requisición junto con información adicional como
 * el balance de viáticos y los documentos relacionados. Renderiza secciones
 * según los permisos del usuario actual.
 */
const RequisitionDetails: React.FC = () => {
  const { currentRequisition } = useRequisitionsDetails();
  const { currentPagePermissions, user } = useAuth();
  const isMobile = useIsMobile();
  const { activeTutorialId } = useTutorials();
  const isTutorialActive = activeTutorialId === "operations-requisitions:detail";
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shouldNotifyImageErrorRef = useRef(false);
  const { firebasestorage } = useFirebase();
  const { usePrincipalAlert, usePrincipalLoading, usePrincipalImage } =
    usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showImage } = usePrincipalImage;
  const [authorizerPopUpOpen, setAuthorizerPopUpOpen] = useState(false);
  const [authorizerSelected, setAuthorizerSelected] = useState("");
  const [authorizerError, setAuthorizerError] = useState<string | null>(null);
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

  const { employees, employeesError, fetchEmployees } = useEmployeesStore(
    (s) => ({
      employees: s.employees,
      employeesError: s.error,
      fetchEmployees: s.fetchEmployees,
    }),
    shallow,
  );

  const { createAuthorization } = useAuthorizationsStore(
    (s) => ({
      createAuthorization: s.createAuthorization,
    }),
    shallow,
  );

  const { billingDocuments, fetchBillingDocumentByIdRequisition } = useBillingDocumentsStore(
    (s) => ({
      billingDocuments: s.billingDocuments,
      fetchBillingDocumentByIdRequisition: s.fetchBillingDocumentByIdRequisition,
    }),
    shallow,
  );

  const { fetchCurrentRequisition } = useRequisitionsStore(
    (s) => ({
      fetchCurrentRequisition: s.fetchCurrentRequisition,
    }),
    shallow,
  );

  const {
    getAuthorizations,
    authorizationHistory,
    getRequisitionAuthorizationsHistory,
  } = useAuthorizationsStore(
    (s) => ({
      authorizations: s.authorizations,
      getAuthorizations: s.getAuthorizations,
      authorizationHistory: s.authorizationHistory,
      getRequisitionAuthorizationsHistory: s.getRequisitionAuthorizationsHistory,
    }),
    shallow,
  );

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (!currentRequisition?.billingrequisition_id) return;
    getAuthorizations();
  }, [currentRequisition?.billingrequisition_id, getAuthorizations]);

  useEffect(() => {
    if (!currentRequisition?.billingrequisition_id) return;
    getRequisitionAuthorizationsHistory(currentRequisition.billingrequisition_id);
  }, [currentRequisition?.billingrequisition_id, getRequisitionAuthorizationsHistory]);

  useEffect(() => {
    if (!employeesError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar la lista de empleados",
      description: String(employeesError) || "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
    });
  }, [employeesError, hideAlert, showAlert]);

  const authorizerOptions = useMemo<SelectOption[]>(
    () =>
      (employees ?? []).map((employee) => ({
        label: employee.fullname,
        value: employee.employee_id,
      })),
    [employees],
  );

  useEffect(() => {
    if (authorizerSelected) return;
    if (!authorizerOptions.length) return;
    setAuthorizerSelected(authorizerOptions[0].value);
  }, [authorizerOptions, authorizerSelected]);

  useEffect(() => {
    if (authorizerSelected && authorizerError) {
      setAuthorizerError(null);
    }
  }, [authorizerError, authorizerSelected]);

  const handleOpenAuthorizer = useCallback(() => {
    setAuthorizerError(null);
    setAuthorizerPopUpOpen(true);
  }, []);

  const handleOpenHistory = useCallback(() => {
    if (!currentRequisition?.billingrequisition_id) return;
    const query = new URLSearchParams(searchParams.toString());
    query.set("id", currentRequisition.billingrequisition_id);
    if (!query.get("label")) {
      query.set("label", "Detalle Requisicion");
    }
    query.set("view", "history");
    query.set("historyLabel", "Historial Aprobaciones");
    router.push(`${pathname}?${query.toString()}`);
  }, [currentRequisition?.billingrequisition_id, pathname, router, searchParams]);






  const hasPendingAuthorization = useMemo(
    () => (billingDocuments ?? []).some((doc) => !doc.authorization),
    [billingDocuments],
  );

  const allPendingAuthorizations = useMemo(() => {
    if (!billingDocuments || billingDocuments.length === 0) return false;
    return billingDocuments.every((doc) => !doc.authorization);
  }, [billingDocuments]);

  const hasHistory = Boolean(authorizationHistory?.length);

  const shouldShowRequestButton = isTutorialActive
    ? true
    : !hasHistory || (hasPendingAuthorization && !allPendingAuthorizations);

  const shouldShowHistoryButton = isTutorialActive ? true : hasHistory;


  const handleCancelAuthorizer = useCallback(() => {
    setAuthorizerPopUpOpen(false);
    setAuthorizerError(null);
  }, []);

  const refreshAuthorizationState = useCallback(async () => {
    const requisitionId = currentRequisition?.billingrequisition_id;
    if (!requisitionId) return;

    await Promise.all([
      fetchCurrentRequisition(requisitionId, true),
      fetchBillingDocumentByIdRequisition(requisitionId, true),
      getRequisitionAuthorizationsHistory(requisitionId, true),
      getAuthorizations(true),
    ]);
  }, [
    currentRequisition?.billingrequisition_id,
    fetchBillingDocumentByIdRequisition,
    fetchCurrentRequisition,
    getAuthorizations,
    getRequisitionAuthorizationsHistory,
  ]);

  const handleConfirmAuthorizer = useCallback(async () => {
    if (!currentRequisition?.billingrequisition_id) {
      setAuthorizerPopUpOpen(false);
      return;
    }

    if (!authorizerSelected) {
      setAuthorizerError("Selecciona un autorizador.");
      return;
    }

    showSpinner({ message: "Enviando solicitud de autorizacion..." });
    try {
      const applicantId = currentRequisition.id_Employee ?? "";
      const applicant = (employees ?? []).find(
        (employee: EmployeeType) => employee.employee_id === applicantId,
      );
      const payload: PostAuthorization = {
        authorization_id: "",
        applicant_id: applicantId,
        authorizer_id: authorizerSelected,
        enterprise_id:
          applicant?.department?.enterprise_id ?? user?.idEnterprise ?? "",
        department_id:
          applicant?.department?.department_id ?? user?.idDepartment ?? "",
        kind: "Requisición",
        proyect_id: currentRequisition.idProject ?? undefined,
        event_id: currentRequisition.billingrequisition_id,
      };

      const created = await createAuthorization(payload);
      if (!created) {
        throw new Error(
          useAuthorizationsStore.getState().error ||
          "No se pudo crear la autorizacion.",
        );
      }

      showAlert({
        type: "success",
        variant: "filled",
        title: "Solicitud enviada",
        description: "La autorizacion fue enviada correctamente.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      await refreshAuthorizationState();
      setAuthorizerPopUpOpen(false);
    } catch (error) {
      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo enviar la solicitud",
        description: String(error) || "Ocurrio un error al crear la autorizacion.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
      });
    } finally {
      hideSpinner();
    }
  }, [
    authorizerSelected,
    createAuthorization,
    currentRequisition?.billingrequisition_id,
    currentRequisition?.idProject,
    currentRequisition?.id_Employee,
    employees,
    hideAlert,
    hideSpinner,
    showAlert,
    showSpinner,
    user?.idDepartment,
    user?.idEnterprise,
    refreshAuthorizationState,
  ]);

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
          description: "No se encontró³ evidencia para esta requisición.",
          showPrimaryButton: true,
          primaryLabel: "Entendido",
          onPrimaryClick: hideAlert,
        });
        shouldNotifyImageErrorRef.current = false;
        return;
      }
      showImage({
        src: evidence.imageUrl,
        alt: "Evidencia de aprobación",
      });
    } catch (error) {
      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo cargar la evidencia",
        description: String(error) || "Ocurrió un error al obtener la evidencia.",
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
        description: String(error) || "Ocurrió³ un error al subir la imagen.",
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
        description: "La evidencia se guardó³ correctamente.",
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
            {currentPagePermissions?.showDetails && (
              <div data-tour="requisitions-detail-form">
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
              </div>
            )}
          </div>
          {!isMobile && (
            <div className="basis-1/3">
              <div>
                {(currentPagePermissions?.showBalance || isTutorialActive) && (
                  <PerDiemBalanceCard
                    data-tour="requisitions-detail-balance"
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
                <div
                  className="w-full rounded-lg bg-white-70 p-6 shadow-md h-auto mt-3"
                  data-tour="requisitions-detail-approval-card"
                >
                  <p className="text-label text-gray-70 mb-1">Solicitar aprobación de las facturas generadas en
                    el balance de viáticos.</p>
                  {requisitionImage?.imageUrl && !isTutorialActive ? (
                    <Button onClick={handleViewEvidence} data-tour="requisitions-detail-evidence">
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
                      <div className="flex flex-wrap items-center gap-2">
                        {shouldShowRequestButton ? (
                          <Button
                            variant="solid"
                            className={clsx(
                              "border-teal-70 text-teal-70",
                              !shouldShowHistoryButton && "w-full justify-center",
                            )}
                            onClick={handleOpenAuthorizer}
                            data-tour="requisitions-detail-request"
                          >
                            Solicitar autorizacion
                          </Button>
                        ) : null}
                        {shouldShowHistoryButton ? (
                          <Button
                            variant="outline"
                            className={clsx(
                              "border-teal-70 text-teal-70",
                              !shouldShowRequestButton && "w-full justify-center",
                            )}
                            onClick={handleOpenHistory}
                            data-tour="requisitions-detail-history"
                          >
                            Historial
                          </Button>
                        ) : null}
                      </div>
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
            {(currentPagePermissions?.showBalance || isTutorialActive) && (
              <PerDiemBalanceCard
                data-tour="requisitions-detail-balance"
                startDate={currentRequisition.assignmentdate}
                endDate={currentRequisition.endDate}
                requestedAmount={Number(currentRequisition.amountdeposited)}
                verifiedAmount={Number(currentRequisition.provenamount)}
              />
            )}
          </CollapsibleSection>
        )}
        {currentPagePermissions?.showDocuments && (
          <div data-tour="requisitions-detail-documents">
            <RequisitionDetailsTable />
          </div>
        )}

        <PopUp
          open={authorizerPopUpOpen}
          onClose={handleCancelAuthorizer}
          title="Solicitud de requisicion"
          content="Selecciona al responsable de la aprobacion de tu solicitud."
          showSecondaryButton
          secondaryButtonText="Cancelar"
          onSecondaryButtonClick={handleCancelAuthorizer}
          showPrimaryButton
          primaryButtonText="Enviar solicitud"
          onPrimaryButtonClick={handleConfirmAuthorizer}
        >
          <Select
            label="Autorizador"
            placeholder="Selecciona una opcion"
            options={authorizerOptions}
            selected={authorizerSelected ? [authorizerSelected] : []}
            onChange={(values) => {
              const next = Array.isArray(values) ? values[0] ?? "" : "";
              setAuthorizerSelected(next);
            }}
          />
          {authorizerError ? (
            <p className="mt-2 text-b4 text-alert-red-100">{authorizerError}</p>
          ) : null}
        </PopUp>
      </>
    );
};
export default RequisitionDetails;
