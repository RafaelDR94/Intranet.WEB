import clsx from "clsx";
import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";
import PerDiemBalanceCard from "./components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
import DocumentsByRequisition from "./components/DocumentsByRequisition/DocumentsByRequisition";
import useRequisitionsDetails from "./hooks/useRequisitionsDetails";

import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
/**
 * Muestra el formulario de requisición junto con información adicional como
 * el balance de viáticos y los documentos relacionados. Renderiza secciones
 * según los permisos del usuario actual.
 */
const RequisitionDetails: React.FC = () => {
  const { currentRequisition } = useRequisitionsDetails();
  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();
  const {
    montoComprobado,
    montoAFavorEmpresa,
    montoAFavorColaborador,
    hasPerDiemTotals,
    fetchBillingDocumentByIdRequisition,
  } = useBillingDocumentsStore(
    (s) => ({
      montoComprobado: s.montoComprobado,
      montoAFavorEmpresa: s.montoAFavorEmpresa,
      montoAFavorColaborador: s.montoAFavorColaborador,
      hasPerDiemTotals: s.hasPerDiemTotals,
      fetchBillingDocumentByIdRequisition: s.fetchBillingDocumentByIdRequisition,
    }),
    shallow,
  );

  useEffect(() => {
    if (!currentRequisition?.billingrequisition_id) return;
    fetchBillingDocumentByIdRequisition(
      currentRequisition.billingrequisition_id,
      true,
    );
  }, [currentRequisition?.billingrequisition_id, fetchBillingDocumentByIdRequisition]);

  if (!currentRequisition) {
    return null;
  }

  return (
      <>
        {currentPagePermissions?.sapprofile ? (
          <CollapsibleSection
            enableCollapse
            defaultOpen={true}
            title="Solicitud de Requisición"
          >
            <div className="flex w-full">
              {!isMobile && (
                <div className="mr-4 basis-2/4" data-tour="ownrequisitions-detail-balance">
                  {currentPagePermissions?.showBalance && (
                    <PerDiemBalanceCard
                      startDate={currentRequisition.assignmentdate}
                      endDate={currentRequisition.endDate}
                      requestedAmount={Number(
                        currentRequisition.amountdeposited,
                      )}
                      verifiedAmount={
                        hasPerDiemTotals
                          ? montoComprobado
                          : Number(currentRequisition.provenamount)
                      }
                      enterpriseAmount={hasPerDiemTotals ? montoAFavorEmpresa : undefined}
                      employeeAmount={hasPerDiemTotals ? montoAFavorColaborador : undefined}
                    />
                  )}
                </div>
              )}
              <div
                className={clsx(isMobile ? "basis-3/3" : "basis-2/4")}
                data-tour="ownrequisitions-detail-form"
              >
                {currentPagePermissions?.showDetails && (
                  <RequisitionsForm
                    mode="edit"
                    startDisabled
                    startCollaps={isMobile}
                    enableCollaps
                    showEditForm={false}
                    responsiveLayoutMatrix={{
                      sm: [
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                        [10],
                      ],
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
            </div>
          </CollapsibleSection>
        ) : (
          <div className="flex w-full gap-6">
            <div
              className={clsx(isMobile ? "basis-3/3" : "basis-2/4")}
              data-tour="ownrequisitions-detail-form"
            >
              {currentPagePermissions?.showDetails && (
                <RequisitionsForm
                  mode="edit"
                  startDisabled
                  startCollaps={isMobile}
                  enableCollaps
                  showEditForm={false}
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
              <div className="basis-2/4" data-tour="ownrequisitions-detail-balance">
                {currentPagePermissions?.showBalance && (
                  <PerDiemBalanceCard
                    startDate={currentRequisition.assignmentdate}
                    endDate={currentRequisition.endDate}
                    requestedAmount={Number(currentRequisition.amountdeposited)}
                    verifiedAmount={
                      hasPerDiemTotals
                        ? montoComprobado
                        : Number(currentRequisition.provenamount)
                    }
                    enterpriseAmount={hasPerDiemTotals ? montoAFavorEmpresa : undefined}
                    employeeAmount={hasPerDiemTotals ? montoAFavorColaborador : undefined}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {isMobile && (
          <CollapsibleSection
            enableCollapse
            defaultOpen={true}
            title="Balance de viaticos"
          >
            <div data-tour="ownrequisitions-detail-balance">
              {currentPagePermissions?.showBalance && (
                <PerDiemBalanceCard
                  startDate={currentRequisition.assignmentdate}
                  endDate={currentRequisition.endDate}
                  requestedAmount={Number(currentRequisition.amountdeposited)}
                  verifiedAmount={
                    hasPerDiemTotals
                      ? montoComprobado
                      : Number(currentRequisition.provenamount)
                  }
                  enterpriseAmount={hasPerDiemTotals ? montoAFavorEmpresa : undefined}
                  employeeAmount={hasPerDiemTotals ? montoAFavorColaborador : undefined}
                />
              )}
            </div>
          </CollapsibleSection>
        )}
        {currentPagePermissions?.showDocuments && (
          <div data-tour="ownrequisitions-detail-documents">
            <DocumentsByRequisition />
          </div>
        )}
      </>
    );
};
export default RequisitionDetails;
