import clsx from "clsx";
import React from "react";

import RequisitionsForm from "../../../components/RequisitionsForm/RequisitionsForm";

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
  if (currentRequisition)
    return (
      <>
        {currentPagePermissions?.sapprofile ? (
          <CollapsibleSection
            enableCollapse
            defaultOpen={true}
            title="Información de Viáticos"
          >
            <div className="flex w-full">
              {!isMobile && (
                <div className="mr-4 basis-2/4">
                  {currentPagePermissions?.showBalance && (
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
                {currentPagePermissions?.showDetails && (
                  <RequisitionsForm
                    mode="edit"
                    startDisabled
                    startCollaps={isMobile}
                    enableCollaps
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
            <div className={clsx(isMobile ? "basis-3/3" : "basis-2/3")}>
              {currentPagePermissions?.showDetails && (
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
                {currentPagePermissions?.showBalance && (
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
          <RequisitionDetailsDocument />
        )}
      </>
    );
};
export default RequisitionDetails;
