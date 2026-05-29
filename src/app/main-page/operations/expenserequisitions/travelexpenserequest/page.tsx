"use client";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import type { FieldModel } from "@/app/components/DynamicForm/types";
import FileUploaderExpanded from "@/app/components/FileUploaderexpanded/FileUploaderExpanded";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { Input } from "@/app/components/Input/Input";
import { Label } from "@/app/components/Label/Label";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { EditableViaticsTable } from "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable";
import type { EditableViaticsRow } from "@/app/sharedComponents/EditableViaticsTable/types";
import ArrowDownIcon from "@/assets/icons/navegacion/nav-arrow-down.svg";
import ArrowUpIcon from "@/assets/icons/navegacion/nav-arrow-up.svg";
import UserPlus from "@/assets/icons/Users/Users/add-user.svg";

import { TravelExpenseTableSection } from "./components/TravelExpenseTableSection/TravelExpenseTableSection";
import { useTravelExpenseRequest } from "./hooks/useTravelExpenseRequest";
import { travelExpenseRequestStyles as styles } from "./styles";

/**
 * Operations page for travel expense request review and requisition creation.
 */
const TravelExpenseRequest = () => {
  const {
    activeBeneficiaryId,
    approvingTravelExpense,
    buildRequisitionFields,
    createFields,
    createFormLayout,
    creatingTravelExpense,
    departmentsLoading,
    detailStatusType,
    employeesWithActiveUserLoading,
    excelFile,
    fetchTravelExpenses,
    formReady,
    getBeneficiaryViaticsRows,
    handleAddAssignedStaff,
    handleApproveTravelExpense,
    handleBeneficiaryViaticsChange,
    handleCreateClick,
    handleCreateSubmit,
    handleCreateValuesChange,
    handleExcelSubmit,
    handleRejectCommentCancel,
    handleRejectCommentChange,
    handleRejectCommentOpen,
    handleRejectTravelExpense,
    handleRequisitionValuesChange,
    handleSaveRequisitionProgress,
    handleSendRequisitionAuthorization,
    handleToggleBeneficiary,
    handleViewDetails,
    hasCompanions,
    isRequisitionView,
    loadingTravelExpenses,
    proyectsLoading,
    rejectComment,
    rejectCommentError,
    rejectCommentOpen,
    rejectingTravelExpense,
    requisitionBeneficiaries,
    requisitionFields,
    requisitionFormLayout,
    requisitionSection,
    requisitionSummaryFields,
    requisitionSummaryLayout,
    reviewFields,
    reviewFormLayout,
    savingCalculations,
    selectedTravelExpense,
    sendingAuthorization,
    setExcelFile,
    setFormReady,
    setRequisitionSection,
    setViaticsRows,
    showRejectedDetail,
    submitRef,
    travelExpenses,
    updatingTravelExpense,
    valuesVersion,
    viaticsRows,
    view,
  } = useTravelExpenseRequest();

  const renderRequisitionTabs = (
    fields: FieldModel[],
    viaticsValue: EditableViaticsRow[],
    onViaticsChange: (rows: EditableViaticsRow[]) => void,
    dataTestIdPrefix: string,
  ) => (
    <>
      <div className={styles.tabList}>
        <Button
          hideIcon
          variant="ghost"
          onClick={() => setRequisitionSection("information")}
        >
          Informacion
        </Button>
        <Button variant="ghost" className={styles.tabSpacer}></Button>
        <Button
          onClick={() => setRequisitionSection("viatics")}
          variant="ghost"
          hideIcon
        >
          Calculo de viaticos
        </Button>
      </div>
      {requisitionSection === "information" ? (
        <DynamicForm
          fields={fields}
          onSubmit={() => undefined}
          onValuesChange={handleRequisitionValuesChange}
          responsiveLayoutMatrix={requisitionFormLayout}
          rowClassName={styles.formRow}
          showSubmitIf={() => false}
          dataTestId={`${dataTestIdPrefix}-requisition-form`}
        />
      ) : (
        <EditableViaticsTable
          value={viaticsValue}
          onChange={onViaticsChange}
          dataTestId={`${dataTestIdPrefix}-viatics-table`}
        />
      )}
    </>
  );

  if (view === "create") {
    return (
      <section className={styles.page}>
        <div className={styles.pageStack}>
          <FormsLayout
            title="Solicitud de Requisiciones"
            primaryLabel={
              creatingTravelExpense ? "Creando..." : "Crear solicitud"
            }
            primaryDisabled={!formReady || creatingTravelExpense}
            onPrimaryClick={() => submitRef.current?.()}
            cardClassName={styles.formsCard}
          >
            <DynamicForm
              fields={createFields}
              onSubmit={handleCreateSubmit}
              onValidChange={setFormReady}
              onValuesChange={handleCreateValuesChange}
              externalSubmitRef={submitRef}
              showSubmitIf={() => false}
              valuesVersion={valuesVersion}
              valuesVersionActive
              responsiveLayoutMatrix={createFormLayout}
              loadingFormInfo={
                departmentsLoading ||
                employeesWithActiveUserLoading ||
                proyectsLoading
              }
              dataTestId="travel-expense-create-form"
            >
              <Button
                onClick={handleAddAssignedStaff}
                icon={UserPlus}
                variant="ghost"
              >
                Agregar personal
              </Button>
            </DynamicForm>
          </FormsLayout>

          <FormsLayout
            title="Sube aqui tus requisiciones"
            primaryLabel="Subir Archivos"
            primaryDisabled={!excelFile}
            onPrimaryClick={handleExcelSubmit}
            cardClassName={styles.formsCard}
          >
            <FileUploaderExpanded
              accept=".xlsx,.xls"
              label="Selecciona el archivo excel a subir"
              placeholder="Arrastra o selecciona el archivo que deseas subir"
              onFile={setExcelFile}
            />
          </FormsLayout>
        </div>
      </section>
    );
  }

  if (isRequisitionView) {
    return (
      <section className={styles.page}>
        <div className={styles.pageStack}>
          <div
            className={`${styles.statusBar} ${
              showRejectedDetail ? styles.statusRejected : styles.statusDefault
            }`}
          >
            {showRejectedDetail && (
              <p className={styles.rejectedComment}>
                {selectedTravelExpense?.comments ||
                  "No se registro comentario de rechazo."}
              </p>
            )}
            <Label
              type={detailStatusType}
              text={selectedTravelExpense?.status}
              className="min-w-[82px]"
            />
          </div>
          <FormsLayout
            title="Crea aqui la requisicion solicitada"
            primaryLabel={
              sendingAuthorization || savingCalculations
                ? "Enviando..."
                : "Enviar a autorizacion"
            }
            primaryDisabled={
              !selectedTravelExpense ||
              sendingAuthorization ||
              savingCalculations
            }
            onPrimaryClick={handleSendRequisitionAuthorization}
            showSecondaryButton
            secondaryLabel={
              updatingTravelExpense || savingCalculations
                ? "Guardando..."
                : "Guardar avance"
            }
            onSecondaryClick={handleSaveRequisitionProgress}
            secondaryDisabled={
              !selectedTravelExpense ||
              updatingTravelExpense ||
              savingCalculations
            }
            cardClassName={styles.formsCard}
          >
            {selectedTravelExpense ? (
              <DynamicForm
                disabled
                fields={requisitionSummaryFields}
                onSubmit={() => undefined}
                responsiveLayoutMatrix={requisitionSummaryLayout}
                showSubmitIf={() => false}
                dataTestId="travel-expense-requisition-summary-form"
              />
            ) : (
              <p className={styles.emptyText}>
                {loadingTravelExpenses
                  ? "Cargando solicitud de viaticos..."
                  : "No se encontro la solicitud seleccionada."}
              </p>
            )}
          </FormsLayout>

          {selectedTravelExpense && (
            <>
              {hasCompanions ? (
                <div className={styles.beneficiaryStack}>
                  {requisitionBeneficiaries.map((beneficiary) => {
                    const isOpen = activeBeneficiaryId === beneficiary.id;

                    return (
                      <div key={beneficiary.id} className={styles.beneficiaryStack}>
                        <button
                          type="button"
                          className={styles.beneficiaryButton}
                          onClick={() => handleToggleBeneficiary(beneficiary.id)}
                          aria-expanded={isOpen}
                        >
                          <span className="truncate">{beneficiary.name}</span>
                          {isOpen ? (
                            <ArrowUpIcon className={styles.beneficiaryIcon} />
                          ) : (
                            <ArrowDownIcon className={styles.beneficiaryIcon} />
                          )}
                        </button>
                        {isOpen && (
                          <section className={styles.panel}>
                            {renderRequisitionTabs(
                              buildRequisitionFields(beneficiary),
                              getBeneficiaryViaticsRows(beneficiary.id),
                              (rows) =>
                                handleBeneficiaryViaticsChange(
                                  beneficiary.id,
                                  rows,
                                ),
                              `travel-expense-${beneficiary.id}`,
                            )}
                          </section>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <section className={styles.panel}>
                  {renderRequisitionTabs(
                    requisitionFields,
                    viaticsRows,
                    setViaticsRows,
                    "travel-expense",
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </section>
    );
  }

  if (view === "detail") {
    return (
      <section className={styles.page}>
        <div className={styles.pageStack}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>Solicitud de viaticos</h1>
              <div className={styles.divider} />
            </div>
            <div className={styles.actions}>
              <Button
                hideIcon
                type="button"
                variant="outline"
                className={styles.rejectButton}
                disabled={
                  !selectedTravelExpense ||
                  approvingTravelExpense ||
                  rejectingTravelExpense
                }
                onClick={handleRejectCommentOpen}
              >
                Rechazar
              </Button>
              <Button
                hideIcon
                type="button"
                className={styles.actionButton}
                disabled={
                  !selectedTravelExpense ||
                  approvingTravelExpense ||
                  rejectingTravelExpense
                }
                onClick={handleApproveTravelExpense}
              >
                Aceptar
              </Button>
            </div>
          </div>

          <section className={styles.card}>
            {selectedTravelExpense ? (
              <DynamicForm
                disabled
                fields={reviewFields}
                onSubmit={() => undefined}
                responsiveLayoutMatrix={reviewFormLayout}
                rowClassName={styles.formRow}
                showSubmitIf={() => false}
                dataTestId="travel-expense-review-form"
              />
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
    <section className={styles.page}>
      <div className={styles.listStack}>
        <FormsLayout
          title="Nuevas solicitudes"
          primaryLabel="Crear solicitud"
          onPrimaryClick={handleCreateClick}
          cardClassName={styles.tableFormsCard}
          showBackground={false}
        >
          <TravelExpenseTableSection
            rows={travelExpenses}
            onRefresh={() => fetchTravelExpenses(true)}
            onViewDetails={handleViewDetails}
            pagination={false}
          />
        </FormsLayout>
        <FormsLayout
          title="Estatus de solicitudes"
          primaryLabel=""
          showPrimaryButton={false}
          cardClassName={styles.tableFormsCard}
          showBackground={false}
        >
          <TravelExpenseTableSection
            rows={travelExpenses}
            showStatus
            onRefresh={() => fetchTravelExpenses(true)}
            onViewDetails={handleViewDetails}
          />
        </FormsLayout>
      </div>
    </section>
  );
};

export default TravelExpenseRequest;
