// File: /app/components/DetailsPanel/DetailsPanel.tsx
import React, { useState } from "react";

import clsx from "clsx";

import { useDetailsPanel } from "../../../invoices/validateinvoices/components/DetailsPanel/hooks/useDetailsPanel";
import {
  classes as s,
  mobileclasses as ms,
} from "../../../invoices/validateinvoices/components/DetailsPanel/styles";
import { DetailsPanelProps } from "../../../invoices/validateinvoices/components/DetailsPanel/types";

import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
const DetailsPanel: React.FC<DetailsPanelProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  onlyText = false,
  validInvoice = true,
  rejectInvoice = true,
  sendInvoiceToSap = false,
  operations = false,
  rejectType = true,
  reqisition,
}) => {
  const {
    labels,
    openValidInvoice,
    openRejectInvoice,
    setOpenValidInvoice,
    setOpenRejectInvoice,
    handleSubmitComment,
    handleSubmitReject,
    handleSubmitValid,
  } = useDetailsPanel({
    selected,
    rejectType,
    setPanelOpen,
    operations,
    reqisition,
  });
  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    subtotal: selected?.subtotal || "",
    iva: selected?.iva || "",
    total: selected?.total || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleSave = () => {
    console.log("Información guardada:", formValues);
    setIsEditing(false);
    // Aquí puedes llamar a tu API o actualizar estado global
  };

  const handleCancel = () => {
    setFormValues({
      subtotal: selected?.subtotal || "",
      iva: selected?.iva || "",
      total: selected?.total || "",
    });
    setIsEditing(false);
  };
  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={isMobile ? "" : labels?.left}
      rightLabel={isMobile ? "" : labels?.right}
      actionButton={
        <div
          className={clsx(
            "flex",
            isMobile ? "w-full flex-col gap-2" : "flex-row items-center gap-3",
          )}
        >
          {currentPagePermissions?.canValidInvoice && validInvoice && (
            <Button
              size="small"
              variant="solid"
              hideIcon
              onClick={() => setOpenValidInvoice(true)}
              disabled={
                (operations && selected?.validatedbyoperations) ||
                selected?.status?.toUpperCase() == "RECHAZADO"
              }
            >
              Validar Factura
            </Button>
          )}
          {currentPagePermissions?.canSendToSap && sendInvoiceToSap && (
            <Button
              size="small"
              variant="solid"
              hideIcon
              onClick={() => {
                /**To Do enviar a SAP */
              }}
            >
              Enviar a SAP
            </Button>
          )}
          {currentPagePermissions?.canRejectInvoice && rejectInvoice && (
            <Button
              size="small"
              variant="outline"
              hideIcon
              onClick={() => setOpenRejectInvoice(true)}
              disabled={
                (operations && selected?.validatedbyoperations) ||
                selected?.status?.toUpperCase() == "RECHAZADO"
              }
            >
              Rechazar Factura
            </Button>
          )}
        </div>
      }
      renderActions={() => (
        <div className={s.actionsRow}>
          {selected?.xml && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={XMLIcon}
              disabled={!selected.xml}
              onClick={() => window.open(selected.xml!, "_blank")}
            />
          )}
          {selected?.pdf && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={PDFIcon}
              disabled={!selected.pdf}
              onClick={() => window.open(selected.pdf!, "_blank")}
            />
          )}
        </div>
      )}
    >
      {selected ? (
        <div className={isMobile ? ms.container : s.container}>
          {isMobile && (
            <div className="flex items-baseline gap-2">
              <span className={isMobile ? ms.requisitionkey : s.requisitionkey}>
                Nombre:
              </span>
              <span
                className={
                  isMobile ? ms.requisitionkeyspan : s.requisitionkeyspan
                }
              >
                {labels?.left}
              </span>
            </div>
          )}

          {/* UUID */}
          <div className={isMobile ? ms.uuid : s.uuid}>{selected?.uuid}</div>

          {/* Fecha y hora de certificación */}
          <div className={isMobile ? ms.labelLine : s.labelLine}>
            FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
            <span className={isMobile ? ms.valueText : s.valueText}>
              {selected?.fecha}
            </span>
          </div>

          {/* RFCs */}
          <div className={s.sectionTopMargin}>
            <div className={isMobile ? ms.labelLine : s.labelLine}>
              RFC EMISOR:&nbsp;
              <span className={isMobile ? ms.valueText : s.valueText}>
                {String(selected?.rfc_emisor)}
              </span>
            </div>
            <div className={isMobile ? ms.labelLine : s.labelLine}>
              RFC RECEPTOR:&nbsp;
              <span className={isMobile ? ms.valueText : s.valueText}>
                {String(selected?.rfc_receptor)}
              </span>
            </div>
          </div>

          {/* Conceptos */}
          <div className={s.conceptsScroller}>
            {selected.conceptos.map((concept: any, idx: number) => (
              <div
                key={`${concept.clave_sat}-${idx}`}
                className={s.conceptItem}
              >
                <div className={isMobile ? ms.labelLine : s.labelLine}>
                  CLAVE SAT:&nbsp;
                  <span className={isMobile ? ms.valueText : s.valueText}>
                    {concept?.clave_sat}
                  </span>
                </div>
                <div className={isMobile ? ms.labelLine : s.labelLine}>
                  DESCRIPCIÓN:&nbsp;
                  <span className={isMobile ? ms.valueText : s.valueText}>
                    {concept?.clavesat_description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className={s.divider} />

          {/* Desglose */}
          {!isEditing ? (
            <div className={isMobile ? ms.breakdownBox : s.breakdownBox}>
              <div className={s.breakdownRow}>
                <span
                  className={isMobile ? ms.breakdownLabel : s.breakdownLabel}
                >
                  SUBTOTAL:
                </span>
                <span
                  className={isMobile ? ms.breakdownValue : s.breakdownValue}
                >
                  {selected?.subtotal}
                </span>
              </div>
              <div className={s.breakdownRow}>
                <span
                  className={isMobile ? ms.breakdownLabel : s.breakdownLabel}
                >
                  TRASLADOS <br /> (IVA 16%):
                </span>
                <span
                  className={isMobile ? ms.breakdownValue : s.breakdownValue}
                >
                  {selected?.iva}
                </span>
              </div>
              <div className={s.breakdownRow}>
                <span
                  className={isMobile ? ms.breakdownLabel : s.breakdownLabel}
                >
                  TOTAL:
                </span>
                <span
                  className={isMobile ? ms.breakdownValue : s.breakdownValue}
                >
                  {selected?.total}
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* Editar Información */}
          <div className={s.editInformationBox}>
            {!isEditing ? (
              <Button
                hideIcon
                size="medium"
                variant="solid"
                onClick={() => setIsEditing(true)}
              >
                Editar Información
              </Button>
            ) : (
              <div className={clsx("flex flex-col")}>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className={s.breakdownLabel}>SUBTOTAL:</label>
                    <input
                      type="text"
                      name="subtotal"
                      value={formValues.subtotal}
                      onChange={handleChange}
                      className="w-[150px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>

                  <div className="align-center flex justify-between items-center">
                    <label className={s.breakdownLabel}>IVA:</label>
                    <input
                      type="text"
                      name="iva"
                      value={formValues.iva}
                      onChange={handleChange}
                      className="w-[150px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>

                  <div className="align-center flex justify-between items-center">
                    <label className={s.breakdownLabel}>TOTAL:</label>
                    <input
                      type="text"
                      name="total"
                      value={formValues.total}
                      onChange={handleChange}
                      className="w-[150px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    hideIcon
                    size="medium"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    hideIcon
                    size="medium"
                    variant="solid"
                    onClick={handleSave}
                  >
                    Guardar Información
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={s.emptyState}>
          Selecciona un registro para ver el detalle.
        </div>
      )}

      {/* PopUp: Validar */}
      <PopUp
        open={openValidInvoice}
        title={"¿Desea validar la factura seleccionada?"}
        content="Esta acción confirmará la validez de los documentos marcados. Una vez validadas, no podrás revertir el cambio."
        onClose={() => setOpenValidInvoice(false)}
        primaryButtonText="Validar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleSubmitValid}
        onSecondaryButtonClick={() => setOpenValidInvoice(false)}
        showPrimaryButton
        showSecondaryButton
      />
    </DetailsPanelLayout>
  );
};

export default DetailsPanel;
