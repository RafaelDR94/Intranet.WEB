"use client";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { Input } from "@/app/components/Input/Input";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { EditableViaticsTable } from "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable";

import { TravelExpenseTableSection } from "./components/TravelExpenseTableSection/TravelExpenseTableSection";
import { RequisitionEvidence } from "@/app/sharedComponents/RequisitionEvidence/RequisitionEvidence";
import { useRequisitionRequestPage } from "./hooks/useRequisitionRequestPage";
import { requisitionRequestStyles as styles } from "./styles";

/**
 * Page for listing and approving travel expense requisition requests.
 */
const RequisitionRequestPage = () => {
  const {
    detailViaticsRows,
    approveActionDisabled,
    fetchRequisitionRequests,
    handleApproveTravelExpense,
    handleCreateClick,
    handleRejectCommentCancel,
    handleRejectCommentChange,
    handleRejectCommentOpen,
    handleRejectTravelExpense,
    handleReviewValuesChange,
    handleViewDetails,
    loadingTravelExpenses,
    rejectComment,
    rejectCommentError,
    rejectCommentOpen,
    rejectingTravelExpense,
    requestActionsDisabled,
    reviewFields,
    reviewFormLayout,
    selectedTravelExpense,
    travelExpenses,
    view,
  } = useRequisitionRequestPage();

  if (view === "detail") {
    const detailTitleCode =
      selectedTravelExpense?.requisition_requests[0]?.requisition_code ||
      selectedTravelExpense?.requisitionkey;
    const requisitionImageUrls = selectedTravelExpense?.requisition_requests[0]
      ?.image_urls?.length
      ? selectedTravelExpense.requisition_requests[0].image_urls
      : selectedTravelExpense?.image_urls || [];

    return (
      <section className={styles.detailPage}>
        <div className={styles.pageStack}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>
                Presupuesto de requisicion
                {detailTitleCode ? ` ${detailTitleCode}` : ""}
              </h1>
              <div className={styles.divider} />
            </div>
            <div className={styles.actions}>
              <Button
                hideIcon
                type="button"
                variant="outline"
                className={styles.rejectButton}
                disabled={requestActionsDisabled}
                onClick={handleRejectCommentOpen}
              >
                Rechazar
              </Button>
              <Button
                hideIcon
                type="button"
                className={styles.actionButton}
                disabled={approveActionDisabled}
                onClick={handleApproveTravelExpense}
              >
                Aprobar
              </Button>
            </div>
          </div>

          <RequisitionEvidence imageUrls={requisitionImageUrls} />

          <section className={styles.detailCard}>
            {selectedTravelExpense ? (
              <>
                <DynamicForm
                  fields={reviewFields}
                  onSubmit={() => undefined}
                  onValuesChange={handleReviewValuesChange}
                  responsiveLayoutMatrix={reviewFormLayout}
                  rowClassName={styles.formRow}
                  showSubmitIf={() => false}
                  dataTestId="travel-expense-review-form"
                />
                <EditableViaticsTable
                  value={detailViaticsRows}
                  onChange={() => undefined}
                  dataTestId="-viatics-table"
                  readOnly
                  allowAddConcept={false}
                />
              </>
            ) : (
              <p className={styles.emptyText}>
                {loadingTravelExpenses
                  ? "Cargando solicitud de viaticos..."
                  : "No se encontro la solicitud seleccionada."}
              </p>
            )}
          </section>

          <PopUp
            open={rejectCommentOpen}
            onClose={handleRejectCommentCancel}
            title="Rechazar solicitud de viaticos"
            content="Deja aqui un comentario para que el solicitante sepa la razon del rechazo."
            showSecondaryButton
            secondaryButtonText="Cancelar"
            onSecondaryButtonClick={handleRejectCommentCancel}
            showPrimaryButton
            primaryButtonText={
              rejectingTravelExpense ? "Rechazando..." : "Enviar Comentario"
            }
            onPrimaryButtonClick={handleRejectTravelExpense}
          >
            <Input
              as="textarea"
              placeholder="Escribir comentario"
              value={rejectComment}
              onChange={(event) =>
                handleRejectCommentChange(event.target.value)
              }
              variant={rejectCommentError ? "error" : "default"}
              helperText={rejectCommentError ?? undefined}
              rows={4}
              dataTestId="travel-expense-reject-comment"
            />
          </PopUp>
        </div>
      </section>
    );
  }

  return (
    <FormsLayout
      title="Solicitudes de requisiciones"
      primaryLabel=""
      showPrimaryButton={false}
      onPrimaryClick={handleCreateClick}
      cardClassName={styles.formsCard}
      showBackground={false}
    >
      <TravelExpenseTableSection
        rows={travelExpenses}
        onRefresh={() => fetchRequisitionRequests()}
        onViewDetails={handleViewDetails}
        pagination={false}
      />
    </FormsLayout>
  );
};

export default RequisitionRequestPage;
