"use client";

import VehicleRegistryListView from "../../generalservices/vehicleregist/vehicleregistrylist/VehicleRegistryListView";
import useVehicleAssignamentPage from "./hooks/useVehicleAssignamentPage";
import { PopUp } from "@/app/components/PopUp/PopUp";
import SignaturePopUp from "@/app/components/SignaturePopUp/SignaturePopUp";
import VehicleReassignmentTrackingForm from "./components/VehicleReassignmentTrackingForm";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

const VehicleAssignamentPage = () => {
  const state = useVehicleAssignamentPage();
  const { user } = useAuth();
  const employeeId = user?.idEmployee ?? "";
  const listViewProps = {
    inTransitRows: state.inTransitRows,
    otherRows: state.otherRows,
    handleRefresh: state.handleRefresh,
    handleCreate: undefined,
    handleArrive: undefined,
    searchableKeys: state.searchableKeys,
    handleCloseDetails: state.handleCloseDetails,
    openDetailsPanel: state.openDetailsPanel,
    handleOpenDetails: state.handleOpenDetails,
  } as const;

  return (
    <>
      {state.trackingForm ? (
        <VehicleReassignmentTrackingForm
          assignmentId={state.trackingForm.assignmentId}
          signature={state.trackingForm.signature}
          reassignmentId={state.trackingForm.reassignmentId}
          onClose={state.handleCloseTrackingForm}
        />
      ) : (
        <VehicleRegistryListView
          {...listViewProps}
          canCreate={false}
          canRegisterArrive={false}
          enableTutorial={false}
        />
      )}

      <PopUp
        open={state.pendingPopUpOpen}
        onClose={state.handleClosePendingPopUp}
        title={state.pendingPopUpText?.title ?? ""}
        content={state.pendingPopUpText?.content ?? ""}
        showSecondaryButton
        secondaryButtonText="Rechazar"
        onSecondaryButtonClick={state.handlePendingReject}
        showPrimaryButton
        primaryButtonText="Confirmar"
        onPrimaryButtonClick={state.handlePendingApprove}
      />

      <SignaturePopUp
        open={state.signatureOpen}
        onClose={state.handleCloseSignature}
        onAuthorization={state.handleSignatureAuthorization}
        responsibleGuid={employeeId}
      />

    </>
  );
};

export default VehicleAssignamentPage;

