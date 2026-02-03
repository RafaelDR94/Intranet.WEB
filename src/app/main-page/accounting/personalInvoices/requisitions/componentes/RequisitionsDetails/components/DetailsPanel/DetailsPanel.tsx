// File: /app/components/DetailsPanel/DetailsPanel.tsx
import clsx from "clsx";
import React from "react";

import { useDetailsPanel } from "./hooks/useDetailsPanel";
import { classes as s, mobileclasses as ms } from "./styles";
import { DetailsPanelProps } from "./types";
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import TicketForm from "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm";
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext";
import Label from "@/app/components/Label/Label";
import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";

import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { Proyect } from "@/app/mappings/proyects/proyects.types";
import { DownloadFile } from "@/app/utilities/FilesHelper/FilesHelper";
const DetailsPanel: React.FC<DetailsPanelProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  validInvoice = true,
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
    handleSubmitReject,
    handleSubmitValid,
    submitRef
  } = useDetailsPanel({
    selected,
    rejectType,
    setPanelOpen,
    operations,
    reqisition,
  });
  const { currentPagePermissions } = useAuth();
  const isMobile = useIsMobile();
  const isTicket = Boolean(
    selected?.billingdocument_id?.startsWith("ticket-"),
  );
  const hasInvoiceFiles = Boolean(!isTicket && (selected?.xml || selected?.pdf));
  const resendDisabled = Boolean(
    !selected?.status?.toLowerCase().includes("rechaz") ||
      (operations && selected?.validatedbyoperations),
  );
  const projectFallback: Proyect = {
    id: selected?.requisition?.idProject ?? "",
    name: selected?.requisition?.projectname ?? "",
    proyectKey: selected?.requisition?.projectname ?? "",
    client: "",
    manager: {} as any,
    collaborators: [],
  };
  const dataEdit: HistoryRow | null = selected
    ? {
        id: selected.id,
        billing_image_id: selected.billingimages_id,
        billingdocument_id: selected.billingdocument_id,
        project: projectFallback,
        requisitionkey: selected.requisition?.requisitionkey ?? "",
        status:
          (selected.status?.toLowerCase() as HistoryRow["status"]) ??
          "pendiente",
        xml: selected.xml,
        pdf: selected.pdf,
        image: selected.image,
        comments: selected.comments,
        dateCreate: selected.date_created,
        certificationDate: selected.fecha,
        uuid: selected.uuid,
        description: selected.description,
        category: selected.category,
        numpersons: selected.numpersons,
        numnights: selected.numnights,
      }
    : null;
  console.log("selected ", selected);

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={isMobile ? "" : labels?.left}
      rightLabel={isMobile ? "" : labels?.right}
      actionButton={
        isTicket ? (
          <div
            className={clsx(
              "flex",
              isMobile ? "w-full flex-col gap-2" : "flex-row items-center gap-3",
            )}
          >
            <Button
              size="medium"
              variant="solid"
              hideIcon
              onClick={() => submitRef.current?.()}
              disabled={resendDisabled}
            >
              Reenviar
            </Button>
          </div>
        ) : (
          <div
            className={clsx(
              "flex",
              isMobile ? "w-full flex-col gap-2" : "flex-row items-center gap-3",
            )}
          >
            {!currentPagePermissions?.canValidInvoice && validInvoice && (
              <Button
                size="medium"
                variant="solid"
                hideIcon
                onClick={() => setOpenValidInvoice(true)}
                disabled={resendDisabled}

              >
                Reenviar
              </Button>
            )}
          </div>
        )
      }
      renderActions={() => (
        <div className={s.actionsRow}>
          {selected && (
            <Label
              type={selected.status.toLocaleLowerCase() as any}
              text={(selected?.status ?? "").toUpperCase()}
            />
          )}
          {isTicket ? (
            <>
              {selected?.image && (
                <Button
                  size="xsmall"
                  variant="ghost"
                  icon={ImageIcon}
                  disabled={!selected.image}
                  onClick={() => window.open(selected?.image, "_blank")}
                />
              )}
              {selected?.image && (
                <Button
                  size="xsmall"
                  variant="ghost"
                  icon={DownloadIcon}
                  onClick={() =>
                    DownloadFile(
                      selected.image,
                      `ticket-${selected?.billingimages_id ?? "imagen"}.jpg`
                    )
                  }
                  aria-label="Descargar imagen"
                />
              )}
            </>
          ) : (
            <>
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
                  onClick={() => window.open(selected?.image, "_blank")}
                />
              )}
            </>
          )}
        </div>
      )}
    >
      {selected && isTicket && (
        <div className={isMobile ? ms.container : s.container}>
          <div className="text-gray-90 text-b4 font-medium">
            Nombre:{" "}
            <span className="text-gray-70 font-regular">
              {selected?.requisition?.employeename ?? "-"}
            </span>
          </div>
          <div className="text-gray-90 text-b4 font-medium">Comentarios:</div>
          {(selected?.user_comments || selected?.comments) && (
            <div className="space-y-1">
              <p className="text-b4 p-0 font-medium text-gray-50">
                {selected.user_comments ?? selected.comments}
              </p>
            </div>
          )}
          <InvoicesProvider>
            <TicketForm
              dataEdit={dataEdit}
              externalSubmitRef={submitRef}
              disabled={resendDisabled}
              suppressInitialTicketImage
              responsiveLayoutMatrix={{
                sm: [[10], [10]],
                md: [[10], [10]],
                lg: [[10], [10]],
              }}
            />
          </InvoicesProvider>
        </div>
      )}

      {selected && !isTicket && (
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

          {/* Fecha y hora de certificacion */}
          <div className={isMobile ? ms.labelLine : s.labelLine}>
            FECHA Y HORA DE CERTIFICACION:&nbsp;
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
                  DESCRIPCION:&nbsp;
                  <span className={isMobile ? ms.valueText : s.valueText}>
                    {concept?.clavesat_description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desglose */}
          <div className={isMobile ? ms.breakdownBox : s.breakdownBox}>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                SUBTOTAL:
              </span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                {selected?.subtotal}
              </span>
            </div>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                TRASLADOS <br /> 002 (IVA 16%):
              </span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                {selected?.iva}
              </span>
            </div>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                OTROS IMPUESTOS:
              </span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                {selected?.otherinvoices}
              </span>
            </div>
            <div className={s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                TOTAL:
              </span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                {selected?.total}
              </span>
            </div>
          </div>
          <div>
            <div className="text-gray-90 text-b4 font-medium">Comentarios:</div>
            {selected.user_comments && (
              <div className="space-y-1">
                <p className="text-b4 p-2 font-medium text-gray-50">
                  {selected.user_comments || ""}
                </p>
              </div>
            )}
            <InvoicesProvider>
              {hasInvoiceFiles ? (
                <InvoicesForm
                  dataEdit={dataEdit}
                  externalSubmitRef={submitRef}
                  disabled={resendDisabled}
                  responsiveLayoutMatrix={{
                    sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    md: [
                      [5, 5],
                      [3.3, 3.3, 3.3],
                      [2, 2, 3, 3],
                    ],
                    lg: [[10], [10], [10], [10], [10], [10], [10], [5, 5]],
                  }}
                />
              ) : (
                <TicketForm
                  dataEdit={dataEdit}
                  externalSubmitRef={submitRef}
                  disabled={resendDisabled}
                  suppressInitialTicketImage
                  responsiveLayoutMatrix={{
                    sm: [[10], [10]],
                    md: [[10], [10]],
                    lg: [[10], [10]],
                  }}
                />
              )}
            </InvoicesProvider>
          </div>
        </div>
      )}

      {!selected && (
        <div className={s.emptyState}>
          Selecciona un registro para ver el detalle.
        </div>
      )}

      {/* PopUp: Validar */}
      {!isTicket && (
        <PopUp
          open={openValidInvoice}
          title={"Desea validar la factura seleccionada?"}
          content="Esta accion confirmara la validez de los documentos marcados. Una vez validadas, no podras revertir el cambio."
          onClose={() => setOpenValidInvoice(false)}
          primaryButtonText="Validar"
          secondaryButtonText="Cancelar"
          onPrimaryButtonClick={handleSubmitValid}
          onSecondaryButtonClick={() => setOpenValidInvoice(false)}
          showPrimaryButton
          showSecondaryButton
        />
      )}

      {/* PopUp: Rechazar */}
      {!isTicket && (
        <PopUp
          title={"Rechazar Factura"}
          content={
            "Deja aqui un comentario para que tu companero sepa la razon del rechazo de su factura"
          }
          open={openRejectInvoice}
          onClose={() => setOpenRejectInvoice(false)}
        >
          <div className={s.commentBoxPadding}>
            <DynamicForm
              // initialValues={{ comments: selected?.comments ?? "" }}
              fields={[
                {
                  type: "textarea",
                  name: "comments",
                  label: "Comentarios:",
                  value: "",
                  placeholder: "Agregar comentario",
                  validations: [{ type: "required" }],
                  className: "bg-white-40",
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
      )}
    </DetailsPanelLayout>
  );
};

export default DetailsPanel;
