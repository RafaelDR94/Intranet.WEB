// File: /app/components/DetailsPanel/DetailsPanel.tsx
import React, { useMemo, useState } from "react";

import { useDetailsPanel } from "./hooks/useDetailsPanel";
import { classes as s, mobileclasses as ms } from "./styles";
import { DetailsPanelProps } from "./types";
import { Button } from "@/app/components/Button/Button";
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { PopUp } from "@/app/components/PopUp/PopUp";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import ArrowRightIcon from "@/assets/icons/navegacion/nav-arrow-right.svg";

import { DownloadFile } from "@/app/utilities/FilesHelper/FilesHelper";
import { formatCurrency } from "@/app/utilities/FormatHelpers/FormatHelpets";
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
    handleSubmitComment,
    openValidInvoice,
    openRejectInvoice,
    setOpenValidInvoice,
    setOpenRejectInvoice,
    handleSubmitReject,
    handleSubmitValid,
  } = useDetailsPanel({
    selected,
    rejectType,
    setPanelOpen,
    operations,
    reqisition,
  });
  const isMobile = useIsMobile();
  const [openComment, setOpenComment] = useState(false);

  const firstConcept = useMemo(
    () => selected?.conceptos?.[0] ?? null,
    [selected],
  );
  const claveSat =
    firstConcept?.clave_sat ?? selected?.description?.id_billingdescription ?? "-";
  const descripcion =
    firstConcept?.clavesat_description ?? selected?.description?.name ?? "-";
  const downloadTarget = selected?.pdf || selected?.xml || selected?.image;
  const downloadName = selected?.pdf
    ? `factura-${selected?.billingdocument_id ?? "documento"}.pdf`
    : selected?.xml
      ? `factura-${selected?.billingdocument_id ?? "documento"}.xml`
      : `documento-${selected?.billingimages_id ?? "imagen"}.jpg`;
  const handleCommentSubmit = (values: Record<string, any>) => {
    setOpenComment(false);
    handleSubmitComment(values);
  };

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={labels?.left}
      rightLabel={labels?.right}
      closeButtonDataTour="ownrequisitions-detail-panel-close"
      renderActions={() => (
        <div className={s.actionsRow}>
          {selected?.xml && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={XMLIcon}
              iconOnly
              aria-label="Abrir XML"
              onClick={() => window.open(selected.xml!, "_blank")}
              data-tour="ownrequisitions-detail-panel-xml"
            />
          )}
          {selected?.pdf && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={PDFIcon}
              iconOnly
              aria-label="Abrir PDF"
              onClick={() => window.open(selected.pdf!, "_blank")}
              data-tour="ownrequisitions-detail-panel-pdf"
            />
          )}
          {selected?.image && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={ImageIcon}
              iconOnly
              aria-label="Abrir imagen"
              onClick={() => window.open(selected?.image, "_blank")}
              data-tour="ownrequisitions-detail-panel-image"
            />
          )}
          {downloadTarget && (
            <Button
              size="xsmall"
              variant="ghost"
              icon={DownloadIcon}
              iconOnly
              aria-label="Descargar archivo"
              onClick={() => DownloadFile(downloadTarget, downloadName)}
              data-tour="ownrequisitions-detail-panel-download"
            />
          )}
        </div>
      )}
    >
      {selected && (
        <div className={isMobile ? ms.container : s.container}>
          <div className={isMobile ? ms.uuid : s.uuid}>
            {selected?.uuid ?? "-"}
          </div>

          <div className={isMobile ? ms.metaRow : s.metaRow}>
            FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
            <span className={isMobile ? ms.metaValue : s.metaValue}>
              {selected?.fecha ?? "-"}
            </span>
          </div>

          <div className={isMobile ? ms.metaRow : s.metaRow}>
            RFC EMISOR:&nbsp;
            <span className={isMobile ? ms.metaValue : s.metaValue}>
              {selected?.rfc_emisor ?? "-"}
            </span>
          </div>

          <div className={isMobile ? ms.metaRow : s.metaRow}>
            RFC RECEPTOR:&nbsp;
            <span className={isMobile ? ms.metaValue : s.metaValue}>
              {selected?.rfc_receptor ?? "-"}
            </span>
          </div>

          <div className={isMobile ? ms.metaRow : s.metaRow}>
            CLAVE SAT:&nbsp;
            <span className={isMobile ? ms.metaValue : s.metaValue}>
              {claveSat}
            </span>
          </div>

          <div className={isMobile ? ms.metaRow : s.metaRow}>
            DESCRIPCIÓN:&nbsp;
            <span className={isMobile ? ms.metaValue : s.metaValue}>
              {descripcion}
            </span>
          </div>

          <div className={isMobile ? ms.divider : s.divider} />

          <div className={isMobile ? ms.breakdownBox : s.breakdownBox}>
            <div className={isMobile ? ms.breakdownRow : s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                SUBTOTAL:
              </span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                {formatCurrency(selected?.subtotal ?? 0)}
              </span>
            </div>
            <div className={isMobile ? ms.breakdownRow : s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                TRASLADOS <br /> 002 (IVA 16%):
              </span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                {formatCurrency(selected?.iva ?? 0)}
              </span>
            </div>
            <div className={isMobile ? ms.breakdownRow : s.breakdownRow}>
              <span className={isMobile ? ms.breakdownLabel : s.breakdownLabel}>
                TOTAL:
              </span>
              <span className={isMobile ? ms.breakdownValue : s.breakdownValue}>
                {formatCurrency(selected?.total ?? 0)}
              </span>
            </div>
          </div>

          <button
            type="button"
            className={isMobile ? ms.commentLink : s.commentLink}
            onClick={() => setOpenComment(true)}
          >
            <ArrowRightIcon className={isMobile ? ms.commentIcon : s.commentIcon} />
            Dejar comentario
          </button>
        </div>
      )}

      {!selected && (
        <div className={s.emptyState}>
          Selecciona un registro para ver el detalle.
        </div>
      )}

      {/* PopUp: Validar */}
      {validInvoice && (
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
      {validInvoice && (
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

      {/* PopUp: Dejar comentario */}
      <PopUp
        title="Dejar comentario"
        content="Agrega un comentario para este documento."
        open={openComment}
        onClose={() => setOpenComment(false)}
      >
        <div className={s.commentBoxPadding}>
          <DynamicForm
            fields={[
              {
                type: "textarea",
                name: "comments",
                label: "Comentarios:",
                value: "",
                placeholder: "Agregar comentario",
                validations: [{ type: "required" }],
                className: "bg-white-40",
                rows: 3,
              },
            ]}
            submitLabel="Enviar"
            secondaryButtonLabel="Cancelar"
            onSubmit={handleCommentSubmit}
            onSecondaryButtonClick={() => setOpenComment(false)}
          />
        </div>
      </PopUp>
    </DetailsPanelLayout>
  );
};

export default DetailsPanel;
