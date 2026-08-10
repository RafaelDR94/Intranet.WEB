"use client";

import { Button } from "@/app/components/Button/Button";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import FormsLayout from "@/app/components/FormsLayout/FormsLayout";
import { Label } from "@/app/components/Label/Label";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { Select } from "@/app/components/Select/Select";
import type { TravelExpense } from "@/app/mappings/travelExpenses/travelExpenses.types";
import { EditableViaticsTable } from "@/app/sharedComponents/EditableViaticsTable/EditableViaticsTable";

import { useTravelExpenseRequest } from "../hooks/useTravelExpenseRequest";
import { travelExpenseRequestStyles as styles } from "../styles";

type RequisitionEditorViewProps = {
  onCompleted?: () => void | Promise<void>;
  requisitionRequestId?: string;
  travelExpense: TravelExpense;
};

/** Reuses the requisition draft workflow for a detail already loaded elsewhere. */
export const RequisitionEditorView = ({
  onCompleted,
  requisitionRequestId,
  travelExpense,
}: RequisitionEditorViewProps) => {
  const editor = useTravelExpenseRequest({
    requisitionRequestId,
    selectedTravelExpenseOverride: travelExpense,
    viewOverride: "requisition",
  });

  const status =
    travelExpense.status_name || travelExpense.status || "Rechazada";

  return (
    <section className={styles.page}>
      <div className={styles.pageStack}>
        <div className={`${styles.statusBar} ${styles.statusRejected}`}>
          <p className={styles.rejectedComment}>
            {travelExpense.comments || "No se registró comentario de rechazo."}
          </p>
          <Label type="rechazado" text={status} className="min-w-[82px]" />
        </div>
        <FormsLayout
          title="Crea aquí la requisición solicitada"
          primaryLabel={
            editor.sendingAuthorization || editor.savingCalculations
              ? "Enviando..."
              : "Enviar a autorización"
          }
          primaryDisabled={
            !editor.requisitionReadyForAuthorization ||
            editor.requisitionActionsDisabled ||
            editor.sendingAuthorization ||
            editor.savingCalculations
          }
          onPrimaryClick={editor.handleSendRequisitionAuthorization}
          showSecondaryButton
          secondaryLabel={
            editor.updatingTravelExpense || editor.savingCalculations
              ? "Guardando..."
              : "Guardar avance"
          }
          onSecondaryClick={editor.handleSaveRequisitionProgress}
          secondaryDisabled={
            editor.requisitionActionsDisabled ||
            editor.updatingTravelExpense ||
            editor.savingCalculations
          }
          cardClassName={styles.formsCard}
        >
          <DynamicForm
            disabled
            fields={editor.requisitionSummaryFields}
            onSubmit={() => undefined}
            responsiveLayoutMatrix={editor.requisitionSummaryLayout}
            showSubmitIf={() => false}
          />
        </FormsLayout>
        <div className={styles.beneficiaryStack}>
          {editor.requisitionBeneficiaries.map((beneficiary) => (
            <section key={beneficiary.id} className={styles.panel}>
              {editor.requisitionBeneficiaries.length > 1 ? (
                <h2 className={styles.beneficiaryName}>{beneficiary.name}</h2>
              ) : null}
              <div className={styles.tabList}>
                <Button
                  hideIcon
                  variant="ghost"
                  onClick={() => editor.setRequisitionSection("information")}
                >
                  Información
                </Button>
                <Button variant="ghost" className={styles.tabSpacer} />
                <Button
                  hideIcon
                  variant="ghost"
                  onClick={() => editor.setRequisitionSection("viatics")}
                >
                  Cálculo de viáticos
                </Button>
              </div>
              {editor.requisitionSection === "information" ? (
                <DynamicForm
                  fields={editor.buildRequisitionFields(beneficiary)}
                  onSubmit={() => undefined}
                  onValuesChange={(values) =>
                    editor.handleRequisitionValuesChange(beneficiary.id, values)
                  }
                  responsiveLayoutMatrix={editor.requisitionFormLayout}
                  rowClassName={styles.formRow}
                  showSubmitIf={() => false}
                />
              ) : (
                <EditableViaticsTable
                  value={editor.getBeneficiaryViaticsRows(beneficiary.id)}
                  onChange={(rows) =>
                    editor.handleBeneficiaryViaticsChange(beneficiary.id, rows)
                  }
                />
              )}
            </section>
          ))}
        </div>
      </div>
      <PopUp
        open={editor.authorizerPopUpOpen}
        onClose={editor.handleAuthorizerCancel}
        title="Solicitud de aprobación"
        content="Selecciona a quien enviarás tu solicitud de aprobación"
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={editor.handleAuthorizerCancel}
        showPrimaryButton
        primaryButtonText={
          editor.sendingAuthorization ? "Enviando..." : "Enviar solicitud"
        }
        onPrimaryButtonClick={async () => {
          await editor.handleConfirmAuthorizer();
          await onCompleted?.();
        }}
      >
        <Select
          placeholder="Selecciona una opción"
          options={editor.authorizerOptions}
          selected={
            editor.authorizerSelected ? [editor.authorizerSelected] : []
          }
          onChange={editor.handleAuthorizerChange}
        />
        {editor.authorizerError ? (
          <p className="text-b4 text-alert-red-100 mt-2">
            {editor.authorizerError}
          </p>
        ) : null}
      </PopUp>
    </section>
  );
};
