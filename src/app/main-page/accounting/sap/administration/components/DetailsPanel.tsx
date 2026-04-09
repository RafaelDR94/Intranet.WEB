import React from "react";

import clsx from "clsx";
import {
  classes as s,
  mobileclasses as ms,
} from "../../../invoices/validateinvoices/components/DetailsPanel/styles";
import { DetailsPanelProps } from "../../../invoices/validateinvoices/components/DetailsPanel/types";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { PopUp } from "@/app/components/PopUp/PopUp";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";

import { useSAPDetailsPanel } from "../../common/hooks/useSAPDetailsPanel";

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  operations = false,
  rejectType = true,
  reqisition,
  closeButtonDataTour,
}) => {
  const {
    labels,
    isMobile,
    isEditing,
    showEditConfirmation,
    setShowEditConfirmation,
    handleSave,
  } = useSAPDetailsPanel({
    selected,
    rejectType,
    setPanelOpen,
    operations,
    reqisition,
  });
  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      closeButtonDataTour={closeButtonDataTour}
      leftLabel={isMobile ? "" : labels?.left}
      rightLabel={isMobile ? "" : labels?.right}
      actionButton={
        <div
          className={clsx(
            "flex",
            isMobile ? "w-full flex-col gap-2" : "flex-row items-center gap-3",
          )}
        >
          {/* {currentPagePermissions?.canSendToSap && sendInvoiceToSap && (
            <Button
              size="small"
              variant="solid"
              hideIcon
              onClick={handleSendToSap}
            >
              Subir a SAP
            </Button>
          )} */}
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
              data-tour="requisitions-detail-panel-xml"
            />
          )}
          {selected?.pdf && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={PDFIcon}
              disabled={!selected.pdf}
              onClick={() => window.open(selected.pdf!, "_blank")}
              data-tour="requisitions-detail-panel-pdf"
            />
          )}
          {selected?.image && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={ImageIcon}
              disabled={!selected.image}
              onClick={() => window.open(selected.image!, "_blank")}
              data-tour="requisitions-detail-panel-image"
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
          {/* <div className={s.editInformationBox}>
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
                  <div className="flex items-center justify-between">
                    <label className={s.breakdownLabel}>SUBTOTAL:</label>
                    <input
                      type="text"
                      name="subtotal"
                      value={formValues.subtotal}
                      onChange={handleChange}
                      className="w-[200px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>

                  <div className="align-center flex items-center justify-between">
                    <label className={s.breakdownLabel}>IVA:</label>
                    <input
                      type="text"
                      name="iva"
                      value={formValues.iva}
                      onChange={handleChange}
                      className="w-[200px] rounded-md border border-gray-300 px-2 py-1"
                    />
                  </div>

                  <div className="align-center flex items-center justify-between">
                    <label className={s.breakdownLabel}>TOTAL:</label>
                    <input
                      type="text"
                      name="total"
                      value={formValues.total}
                      onChange={handleChange}
                      className="w-[200px] rounded-md border border-gray-300 px-2 py-1"
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
                    onClick={() => setShowEditConfirmation(true)}
                  >
                    Guardar Información
                  </Button>
                </div>
              </div>
            )}
          </div> */}
        </div>
      ) : (
        <div className={s.emptyState}>
          Selecciona un registro para ver el detalle.
        </div>
      )}

      {/* PopUp: Validar */}
      <PopUp
        open={showEditConfirmation}
        title="Monto Editado"
        content="Desea confirmar el nuevo monto"
        onClose={() => setShowEditConfirmation(false)}
        primaryButtonText="Confirmar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={() => {
          handleSave();
          setShowEditConfirmation(false);
        }}
        onSecondaryButtonClick={() => setShowEditConfirmation(false)}
        showPrimaryButton
        showSecondaryButton
      />
    </DetailsPanelLayout>
  );
};

export default DetailsPanel;
