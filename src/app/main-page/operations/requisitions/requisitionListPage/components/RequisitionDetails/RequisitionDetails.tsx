import clsx from "clsx";
import React from "react";

import RequisitionsForm from "@/app/main-page/accounting/requisitions/components/RequisitionsForm/RequisitionsForm";

import PerDiemBalanceCard from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
import RequisitionDetailsDocument from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/components/RequisitionDetailsDocuments/RequisitionDetailsDocument";
import useRequisitionsDetails from "@/app/main-page/accounting/personalInvoices/requisitions/componentes/RequisitionsDetails/hooks/useRequisitionsDetails";

import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { Button } from "@/app/components/Button/Button";
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
              <div>
                {currentPagePermissions?.showBalance && (
                <PerDiemBalanceCard
                  startDate={currentRequisition.assignmentdate}
                  endDate={currentRequisition.endDate}
                  requestedAmount={Number(currentRequisition.amountdeposited)}
                  verifiedAmount={Number(currentRequisition.provenamount)}
                  bodyClassName="flex justify-between"
                  donutSize={150}
                />
              )}
              </div>
              <div>
                <div className="w-full rounded-lg bg-white-70 p-6 shadow-md h-auto mt-3">
                    <p className="text-label text-gray-70 mb-1">Sube aquí la imagen de la evidencia de aprobación</p>
                    <Button>Seleccionar documento</Button>
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
          <RequisitionDetailsDocument />
        )}
      </>
    );
};
export default RequisitionDetails;
