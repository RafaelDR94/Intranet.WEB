import clsx from "clsx";
import React from "react";

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";
import PerDiemBalanceCard from "./components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
import RequisitionDetailsDocument from "./components/RequisitionDetailsDocuments/RequisitionDetailsDocument";
import useRequisitionsDetails from "./hooks/useRequisitionsDetails";

import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
/**
 * Muestra el formulario de requisición junto con información adicional como
 * el balance de viáticos y los documentos relacionados. Renderiza secciones
 * según los permisos del usuario actual.
 */
const RequisitionDetails: React.FC = () => {
  const { currentRequisition } = useRequisitionsDetails();
  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();
  const isSapProfile = Boolean(currentPagePermissions?.sapprofile);
  const canShowDetails = currentPagePermissions?.showDetails !== false;
  const canShowBalance = currentPagePermissions?.showBalance !== false;
  const canShowDocuments = currentPagePermissions?.showDocuments !== false;
  if (currentRequisition)
    return (
      <>
        {isSapProfile ? (
          <CollapsibleSection
            enableCollapse
            defaultOpen={true}
            title="Solicitud de Requisición"
          >
            <div className="flex w-full">
              {!isMobile && (
                <div className="mr-4 basis-2/4">
                  {canShowBalance && (
                    <PerDiemBalanceCard
                      startDate={currentRequisition.assignmentdate}
                      endDate={currentRequisition.endDate}
                      requestedAmount={Number(
                        currentRequisition.amountdeposited,
                      )}
                      verifiedAmount={Number(currentRequisition.provenamount)}
                    />
                  )}
                </div>
              )}
              <div className={clsx(isMobile ? "basis-3/3" : "basis-2/4")}>
                {canShowDetails && (
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
            <div className={clsx(isMobile ? "basis-3/3" : "basis-2/4")}>
              {canShowDetails && (
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
              <div className="basis-2/4">
                {canShowBalance && (
                  <PerDiemBalanceCard
                    startDate={currentRequisition.assignmentdate}
                    endDate={currentRequisition.endDate}
                    requestedAmount={Number(currentRequisition.amountdeposited)}
                    verifiedAmount={Number(currentRequisition.provenamount)}
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
            {canShowBalance && (
              <PerDiemBalanceCard
                startDate={currentRequisition.assignmentdate}
                endDate={currentRequisition.endDate}
                requestedAmount={Number(currentRequisition.amountdeposited)}
                verifiedAmount={Number(currentRequisition.provenamount)}
              />
            )}
          </CollapsibleSection>
        )}
        {canShowDocuments && (
          <RequisitionDetailsDocument />
        )}
      </>
    );
};
export default RequisitionDetails;
