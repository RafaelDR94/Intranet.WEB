import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";

import PerDiemBalanceCard from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
import useRequisitionsDetails from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/hooks/useRequisitionsDetails";
import RequisitionDetailsTable from "./components/RequisitionsDetailsTable";

import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { Button } from "@/app/components/Button/Button";
import Label from "@/app/components/Label/Label";
import type { LabelType } from "@/app/components/Label/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { SelectOption } from "@/app/components/Select/types";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { PostAuthorization } from "@/app/mappings/authorizations/authorizations.types";
import { useAuthorizationsStore } from "@/app/stores/useAuthorizationsStore/useAuthorizationsStore";
import { useBillingRequisitionImageUrlStore } from "@/app/stores/useBillingRequisitionImageUrlStore/useBillingRequisitionImageUrlStore";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
/**
 * Muestra el formulario de requisición junto con información adicional como
 * el balance de viáticos y los documentos relacionados. Renderiza secciones
 * según los permisos del usuario actual.
 */
const RequisitionDetails: React.FC = () => {
  const { currentRequisition } = useRequisitionsDetails();
  const { currentPagePermissions, user } = useAuth();
  const isMobile = useIsMobile();
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

  const { authorizations, getAuthorizations } = useAuthorizationsStore(
    (s) => ({
      authorizations: s.authorizations,
      getAuthorizations: s.getAuthorizations,
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

  const normalizeText = (value: string) =>
    value
      .toLocaleLowerCase("es-MX")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const coerceStatusText = (status?: unknown): string => {
    if (typeof status === "string") return status;
    if (status && typeof status === "object") {
      const s = status as { name?: string; status?: string };
      if (typeof s.name === "string") return s.name;
      if (typeof s.status === "string") return s.status;
    }
    return "";
  };

  const statusToLabelType = (status?: unknown): LabelType => {
    const normalized = coerceStatusText(status).toLowerCase();
    if (normalized.includes("aprob")) return "valido";
    if (normalized.includes("rechaz")) return "rechazado";
    if (normalized.includes("cancel")) return "restringido";
    if (normalized.includes("pend")) return "pendiente";
    return "actualizado";
  };

  const buildEmployeeName = (employee?: EmployeeType | null): string => {
    if (!employee) return "";
    if (employee.fullname?.trim()) return employee.fullname;
    return [
      employee.firstname,
      employee.secondname,
      employee.lastname,
      employee.motherlast_name,
    ]
      .filter((part) => part && String(part).trim() !== "")
      .join(" ");
  };

  const requisitionAuthorization = useMemo(() => {
    const eventId = currentRequisition?.billingrequisition_id;
    if (!eventId) return null;

    const matches = (authorizations ?? []).filter(
      (authorization) => String(authorization.event_id ?? "") === String(eventId),
    );
    if (!matches.length) return null;

    const requisitionMatches = matches.filter((authorization) =>
      normalizeText(authorization.kind?.name ?? "").includes("requis"),
    );
    const candidates = requisitionMatches.length ? requisitionMatches : matches;

    const sorted = [...candidates].sort((a, b) => {
      const aTime = new Date(a.dateCreated ?? "").getTime();
      const bTime = new Date(b.dateCreated ?? "").getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
      return bTime - aTime;
    });
    return sorted[0] ?? null;
  }, [authorizations, currentRequisition?.billingrequisition_id]);

  const authorizerName = useMemo(() => {
    if (!requisitionAuthorization) return "";
    const byAuthorization = buildEmployeeName(requisitionAuthorization.authorizer);
    if (byAuthorization) return byAuthorization;
    const authorizerId =
      requisitionAuthorization.authorizer?.employee_id ??
      requisitionAuthorization.authorizer?.id ??
      "";
    if (!authorizerId) return "";
    return (
      (employees ?? []).find((employee) => employee.employee_id === authorizerId)
        ?.fullname ?? ""
    );
  }, [employees, requisitionAuthorization]);

  const handleCancelAuthorizer = useCallback(() => {
    setAuthorizerPopUpOpen(false);
    setAuthorizerError(null);
  }, []);

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
      getAuthorizations(true);
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
    getAuthorizations,
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
                  <p className="text-label text-gray-70 mb-1">Aprobación</p>
                  {requisitionAuthorization ? (
                    <div className="mb-3 bg-white p-3">
                      <p className="text-label text-gray-70">Autorizador</p>
                      <p className="text-b4 text-gray-100">
                        {authorizerName || "Sin autorizador"}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-label text-gray-70">Estatus</span>
                        <Label
                          type={statusToLabelType(
                            requisitionAuthorization.status ?? "Pendiente",
                          )}
                          text={
                            coerceStatusText(
                              requisitionAuthorization.status ?? "Pendiente",
                            ) || "Pendiente"
                          }
                        />
                      </div>
                    </div>
                  ) : null}
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
                      <div className="flex flex-wrap items-center gap-2">
                        {!requisitionAuthorization ? (
                          <Button variant="outline" onClick={handleOpenAuthorizer}>
                            Solicitar autorizacion
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
