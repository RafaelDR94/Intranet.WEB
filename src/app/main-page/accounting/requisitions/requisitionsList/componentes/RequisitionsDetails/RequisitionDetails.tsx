import PerDiemBalanceCard from "./components/DemoPerDiemBalanceCard/PerDiemBalanceCard";
import RequisitionsForm from "../../../components/RequisitionsForm/RequisitionsForm";
import useRequisitionsDetails from "./hooks/useRequisitionsDetails";
import RequisitionDetailsDocument from "./components/RequisitionDetailsDocuments/RequisitionDetailsDocument";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
const RequisitionDetails = () => {
    const { currentRequisition } = useRequisitionsDetails();
    const { currentPagePermissions } = useAuth();
    if (currentRequisition) return (
        <>
            <div className="flex gap-6 w-full">
                <div className="basis-2/3">
                    {currentPagePermissions?.showDetails && <RequisitionsForm
                        mode="edit"
                        startDisabled
                        layoutMatrix={[[5, 5], [5, 5], [5, 5], [5, 5]]}
                        initialValues={currentRequisition}
                    />}

                </div>

                <div className="basis-1/3">
                    {currentPagePermissions?.showBalance && <PerDiemBalanceCard
                        startDate={currentRequisition.assignmentdate}
                        endDate={currentRequisition.endDate}
                        requestedAmount={Number(currentRequisition.amountdeposited)}
                        verifiedAmount={Number(currentRequisition.provenamount)}

                    />}

                </div>

            </div>
            {currentPagePermissions?.showDocuments &&  <RequisitionDetailsDocument />}
           
        </>

    );
}
export default RequisitionDetails;
