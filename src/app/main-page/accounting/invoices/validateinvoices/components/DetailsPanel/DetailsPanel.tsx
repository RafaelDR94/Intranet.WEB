// File: /app/components/DetailsPanel/DetailsPanel.tsx
import React from "react";
import { DetailsPanelProps } from "./types";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { Button } from "@/app/components/Button/Button";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import ImageIcon from '@/assets/icons/Fotos y Videos/media-image.svg'
import CollapsibleSection from "@/app/components/CollapsibleSection/CollapsibleSection";
import { classes as s } from "./styles";
import { useDetailsPanel } from "./hooks/useDetailsPanel";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { PopUp } from "@/app/components/PopUp/PopUp";

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  onlyText = false,
  validInvoice = true,
  rejectInvoice = true,
  sendInvoiceToSap = false,
  rejectType = true, }) => {
  const {
    labels,
    money,
    openValidInvoice,
    openRejectInvoice,
    setOpenValidInvoice,
    setOpenRejectInvoice,
    handleSubmitComment,
    handleSubmitReject,
    handleSubmitValid,
  } = useDetailsPanel({ selected, rejectType,setPanelOpen });

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={labels.left}
      rightLabel={labels.right}
      actionButton={
        <>
          {validInvoice && <Button size="small" variant="solid" hideIcon onClick={() => setOpenValidInvoice(true)}>
            Validar Factura
          </Button>}
          {sendInvoiceToSap && <Button size="small" variant="solid" hideIcon onClick={() => {/**To Do enviar a SAP */ }}>
            Enviar a SAP
          </Button>}
          {rejectInvoice && <Button size="small" variant="outline" hideIcon onClick={() => setOpenRejectInvoice(true)}>
            Rechazar Factura
          </Button>}


        </>
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
          {selected?.image && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={ImageIcon}
              disabled={!selected.pdf}
              onClick={() => window.open(selected?.image!, "_blank")}
            />
          )}
        </div>
      )}
    >
      {selected ? (
        <div className={s.container}>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-90 text-b4 font-medium">Código de Solicitud:</span>
            <span className="text-gray-90 text-b3 font-regular">
              {selected?.requisition?.requisitionkey}
            </span>
          </div>
          {/* UUID */}
          <div className={s.uuid}>{selected?.uuid}</div>

          {/* Fecha y hora de certificación */}
          <div className={s.labelLine}>
            FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
            <span className={s.valueText}>{selected?.fecha}</span>
          </div>

          {/* RFCs */}
          <div className={s.sectionTopMargin}>
            <div className={s.labelLine}>
              RFC EMISOR:&nbsp;
              <span className={s.valueText}>{String(selected?.rfc_emisor)}</span>
            </div>
            <div className={s.labelLine}>
              RFC RECEPTOR:&nbsp;
              <span className={s.valueText}>{String(selected?.rfc_receptor)}</span>
            </div>
          </div>

          {/* Conceptos */}
          <div className={s.conceptsScroller}>
            {selected.conceptos.map((concept: any, idx: number) => (
              <div key={`${concept.clave_sat}-${idx}`} className={s.conceptItem}>
                <div className={s.labelLine}>
                  CLAVE SAT:&nbsp;
                  <span className={s.valueText}>{concept?.clave_sat}</span>
                </div>
                <div className={s.labelLine}>
                  DESCRIPCIÓN:&nbsp;
                  <span className={s.valueText}>{concept?.clavesat_description}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className={s.divider} />

          {/* Desglose */}
          <div className={s.breakdownBox}>
            <div className={s.breakdownRow}>
              <span className={s.breakdownLabel}>SUBTOTAL:</span>
              <span className={s.breakdownValue}>{money.subtotal}</span>
            </div>
            <div className={s.breakdownRow}>
              <span className={s.breakdownLabel}>TRASLADOS 002 (IVA 16%):</span>
              <span className={s.breakdownValue}>{money.iva}</span>
            </div>
            <div className={s.breakdownRow}>
              <span className={s.breakdownLabel}>TOTAL:</span>
              <span className={s.breakdownValue}>{money.total}</span>
            </div>
          </div>
          {selected.user_comments &&
            <div className="space-y-1">
              <div className="text-gray-90 text-b4 font-medium">Comentarios en Factura:</div>
              <p className="text-gray-50 text-b4 font-medium p-2">
                {selected.user_comments || "—"}
              </p>
            </div>
          }
          {/* Comentarios */}
          <CollapsibleSection title={onlyText ? "Comentario" : "Deja un comentario"} defaultOpen={true} showDivider={false} enableCollapse={!onlyText}>
            <div className={s.commentBoxPadding}>
              <DynamicForm

                fields={[
                  {
                    type: "textarea",
                    name: "comments",
                    label: "Comentarios:",
                    value: selected?.comments,
                    placeholder: "Agregar comentario",
                    validations: [{ type: "required" }],
                    className: "bg-white",
                    onlyText: onlyText
                  },
                ]}
                showSubmitIf={() => !onlyText}
                submitLabel="Guardar Comentario"
                onSubmit={handleSubmitComment}
              />
            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <div className={s.emptyState}>Selecciona un registro para ver el detalle.</div>
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

      {/* PopUp: Rechazar */}
      <PopUp
        title={"Rechazar Factura"}
        content={"Deja aquí un comentario para que tu compañero sepa la razón del rechazo de su factura"}
        open={openRejectInvoice}
        onClose={() => setOpenRejectInvoice(false)}
      >
        <div className={s.commentBoxPadding}>
          <DynamicForm
            // @ts-ignore — adapta el nombre del prop si tu DynamicForm usa externalSubmitRef
            initialValues={{ comments: selected?.comments ?? "" }}
            fields={[
              {
                type: "textarea",
                name: "comments",
                label: "Comentarios:",
                value: "",
                placeholder: "Agregar comentario",
                validations: [{ type: "required" }],
                className: "bg-white",
                rows: 2,
              },
            ]}
            submitLabel="Rechazar"
            secondaryButtonLabel="Cancelar"
            onSubmit={handleSubmitReject}
            onSecondaryButtonClick={() => setOpenRejectInvoice(false)}
          />
        </div>
      </PopUp>
    </DetailsPanelLayout>
  );
};

export default DetailsPanel;

