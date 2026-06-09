import React from "react";

import { DataTable } from "@/app/components/DataTable/DataTable";
import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { ToggleButton } from "@/app/components/ToogleButton/ToogleButton";
import TicketForm from "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm";
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { DownloadFile } from "@/app/utilities/FilesHelper/FilesHelper";
import type { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { BillingImagesTableMap } from "@/app/mappings/billingimages/billingimages.mapper";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import CancelIcon from "@/assets/icons/acciones/cancel.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";

import useTicketsFiles from "./hooks/useTicketsFiles";
import { TicketRow, TicketsFilesProps } from "./types";

const TicketsFiles = ({
  onSelectedTicketChange,
  selectedTicketId,
  eneableSelection = false,
}: TicketsFilesProps) => {
  const {
    columns,
    rows,
    isTutorialActive,
    tutorialMockRow,
    filterOptions,
    filterValue,
    setFilterValue,
    refresh,
    previewSrc,
    previewIndex,
    previewTotal,
    closePreview,
    nextPreview,
    prevPreview,
    detailOpen,
    detailRow,
    closeDetails,
    openPreview,
    openReject,
    openValidateTicket,
    setOpenValidateTicket,
    openRejectTicket,
    setOpenRejectTicket,
    handleSubmitReject,
    handleValidateClick,
    handleConfirmValidate,
    validationFields,
    validationFormVersion,
    setValidationValues,
    showValidationForm,
    markAsNotDeductible,
    handleToggleNotDeductible,
    isValidateLocked,
    isToggleLocked,
    rejecting,
    notDeducting,
  } = useTicketsFiles();
  const { currentPagePermissions } = useAuth();
  const submitRef = React.useRef<(() => void | Promise<void>) | null>(null);
  const [isResubmitFormValid, setIsResubmitFormValid] = React.useState(false);
  const canResubmitTicket = Boolean(
    currentPagePermissions?.canResubmitForms &&
      detailRow?.status?.toLowerCase().includes("rechaz"),
  );
  const projectFallback: Proyect = {
    id: detailRow?.source.requisition?.idProject ?? "",
    name: detailRow?.source.requisition?.projectname ?? "",
    proyectKey: detailRow?.source.requisition?.projectname ?? "",
    client: "",
    manager: {} as Proyect["manager"],
    collaborators: [],
  };
  const dataEdit: HistoryRow | null = detailRow
    ? {
        id: detailRow.source.billing_image_id ?? detailRow.id,
        billing_image_id: detailRow.source.billing_image_id ?? detailRow.id,
        billingdocument_id: "",
        billingrequisition_id:
          detailRow.source.requisition?.billingrequisition_id ?? "",
        project: projectFallback,
        requisitionkey: detailRow.source.requisition?.requisitionkey ?? "",
        status:
          (detailRow.status?.toLowerCase() as HistoryRow["status"]) ??
          "pendiente",
        xml: "",
        pdf: "",
        image: detailRow.imageUrls[0] ?? "",
        comments: detailRow.comments ?? "",
        dateCreate: detailRow.source.dateCreate ?? detailRow.date,
        certificationDate: detailRow.source.dateCreate ?? detailRow.date,
        uuid: "",
        description: detailRow.source.description,
        category: detailRow.source.category,
        numpersons: detailRow.source.numpersons ?? null,
        numnights: detailRow.source.numnights ?? null,
      }
    : null;

  React.useEffect(() => {
    setIsResubmitFormValid(false);
  }, [detailRow?.id]);

  const handleResubmitSuccess = React.useCallback(() => {
    setIsResubmitFormValid(false);
    refresh();
  }, [refresh]);

  const handleSelectedChange = (_index: number, selectedRows: TicketRow[]) => {
    if (!onSelectedTicketChange) return;
    const selected = selectedRows[0];
    if (!selected) {
      onSelectedTicketChange(null);
      return;
    }
    const mapped = BillingImagesTableMap([selected.source])[0] ?? null;
    onSelectedTicketChange(mapped);
  };

  return (
    <div>
      <div data-tour="requisitions-tickets-table">
        <DataTable
          showCalendar={true}
          showDownloadTable={false}
          showButton={false}
          showFilter
          showRefresh
          filterOptions={filterOptions}
          filterValue={filterValue}
          filterTitle="Estatus"
          onFilterChange={(value) => setFilterValue(value)}
          onRefreshPage={refresh}
          textSize={{ mobile: "text-c3", desktop: "text-c2" }}
          tables={[
            {
              data: rows,
              columns: columns,
              title: "Tickets",
              enableCollaps: true,
              enableSelection: eneableSelection,
              selectionMode: "single",
              initialSelectedRowIds: selectedTicketId ? [selectedTicketId] : [],
              selectionDataTour: (row, index) =>
                isTutorialActive &&
                tutorialMockRow &&
                row.id === tutorialMockRow.id &&
                index === 0
                  ? "requisitions-ticket-select"
                  : undefined,
            },
          ]}
          onSelectedChange={handleSelectedChange}
        />
      </div>
      <DetailsPanelLayout
        open={detailOpen}
        onClose={closeDetails}
        closeButtonDataTour="requisitions-ticket-close"
        actionButton={
          canResubmitTicket ? (
            <div className="flex items-center gap-2">
              <Button
                size="large"
                variant="solid"
                hideIcon
                onClick={() => submitRef.current?.()}
                disabled={!isResubmitFormValid}
              >
                Reenviar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="large"
                variant="solid"
                hideIcon
                onClick={handleValidateClick}
                disabled={isValidateLocked}
                data-tour="requisitions-ticket-validate"
              >
                Validar
              </Button>
              <Button
                size="large"
                variant="outline"
                hideIcon
                onClick={openReject}
                disabled={
                  detailRow?.status.toLocaleLowerCase() === "validado" ||
                  detailRow?.status.toLocaleLowerCase() === "rechazado" ||
                  rejecting ||
                  notDeducting
                }
                data-tour="requisitions-ticket-reject"
              >
                Rechazar
              </Button>
            </div>
          )
        }
        renderActions={() => {
          if (!detailRow) return null;
          const imageUrl = detailRow.imageUrls?.[0];
          return (
            <div className="flex items-center gap-2">
              {imageUrl && (
                <Button
                  iconOnly
                  size="small"
                  variant="ghost"
                  icon={ImageIcon}
                  onClick={() => window.open(imageUrl, "_blank")}
                  aria-label="Abrir imagen"
                  data-tour="requisitions-ticket-open-image"
                />
              )}
              {imageUrl && (
                <Button
                  iconOnly
                  size="small"
                  variant="ghost"
                  icon={DownloadIcon}
                  onClick={() =>
                    DownloadFile(imageUrl, `ticket-${detailRow.id}.jpg`)
                  }
                  aria-label="Descargar imagen"
                  data-tour="requisitions-ticket-download-image"
                />
              )}
            </div>
          );
        }}
      >
        {detailRow ? (
          <div className="space-y-4">
            {detailRow.source.requisition?.employeename && (
              <div className="flex items-baseline gap-2">
                <span className="text-gray-90 text-b4 font-medium">
                  Nombre:
                </span>
                <span className="text-gray-90 text-b3 font-regular">
                  {detailRow.source.requisition.employeename}
                </span>
              </div>
            )}

            {!canResubmitTicket && (
              <ToggleButton
                checked={markAsNotDeductible}
                onChange={handleToggleNotDeductible}
                disabled={isToggleLocked}
                label="Marcar como no deducible"
                dataTour="requisitions-ticket-not-deductible"
                className="w-fit"
              />
            )}

            <div className="flex items-baseline gap-2">
              <span className="text-gray-90 text-b4 font-medium">Fecha:</span>
              <span className="text-gray-90 text-b3 font-regular">
                {detailRow.date}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-90 text-b4 font-medium">
                Categoría:
              </span>
              <span className="text-gray-90 text-b3 font-regular">
                {detailRow.category}
              </span>
            </div>
            {(detailRow.comments || detailRow.userComments) && (
              <div className="space-y-1">
                <div className="text-gray-90 text-b4 font-medium">
                  Comentarios:
                </div>
                <p className="text-b4 p-2 font-medium text-gray-50">
                  {detailRow.comments?.trim() || detailRow.userComments?.trim()}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {detailRow.imageUrls.map((url, index) => (
                  <button
                    key={`ticket-preview-${detailRow.id}-${index}`}
                    type="button"
                    onClick={() => openPreview(detailRow.imageUrls, index)}
                    className="border-gray-20 shadow-200 mt-5 h-70 w-60 overflow-hidden rounded-md border hover:opacity-90"
                    aria-label={`Abrir imagen ${index + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {!canResubmitTicket &&
              showValidationForm &&
              markAsNotDeductible && (
                <div className="pt-2">
                  <DynamicForm
                    fields={validationFields}
                    valuesVersion={validationFormVersion}
                    valuesVersionActive
                    onSubmit={() => undefined}
                    onValuesChange={(values) =>
                      setValidationValues({
                        requisition_id: String(values.requisition_id ?? ""),
                        numpersons: Number(values.numpersons ?? 0),
                        total: Number(values.total ?? 0),
                      })
                    }
                    showSubmitIf={() => false}
                    showSecondaryButtonIf={() => false}
                  />
                </div>
              )}

            {canResubmitTicket && dataEdit && (
              <InvoicesProvider>
                <TicketForm
                  dataEdit={dataEdit}
                  externalSubmitRef={submitRef}
                  onValidChange={setIsResubmitFormValid}
                  onSubmitSuccess={handleResubmitSuccess}
                  responsiveLayoutMatrix={{
                    sm: [[10], [10]],
                    md: [[10], [10]],
                    lg: [[10], [10]],
                  }}
                />
              </InvoicesProvider>
            )}
          </div>
        ) : (
          <div className="text-gray-70 text-b3">
            Selecciona un registro para ver el detalle.
          </div>
        )}
      </DetailsPanelLayout>
      <PopUp
        open={openValidateTicket}
        title="Gasto no deducible"
        content="Esta seguro de marcar esta imagen como un gasto no deducible"
        onClose={() => setOpenValidateTicket(false)}
        primaryButtonText="Aceptar"
        secondaryButtonText="Cancelar"
        onPrimaryButtonClick={handleConfirmValidate}
        onSecondaryButtonClick={() => setOpenValidateTicket(false)}
        showPrimaryButton
        showSecondaryButton
      />
      <PopUp
        title={"Rechazar Ticket"}
        content={
          "Deja aqui un comentario para que tu compañero sepa la razon del rechazo de su ticket"
        }
        open={openRejectTicket.state}
        onClose={() => setOpenRejectTicket({ state: false, row: null })}
      >
        <DynamicForm
          fields={[
            {
              type: "textarea",
              name: "comments",
              label: "Comentarios:",
              value: "",
              placeholder: "Agregar comentario",
              validations: [{ type: "required" }],
              className: "bg-white-100",
              rows: 2,
            },
          ]}
          submitLabel="Rechazar"
          secondaryButtonLabel="Cancelar"
          onSubmit={handleSubmitReject}
          onSecondaryButtonClick={() =>
            setOpenRejectTicket({ state: false, row: null })
          }
        />
      </PopUp>
      {previewSrc && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(75,75,75,0.6)] backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-[min(90vw,560px)] outline-none">
            <button
              aria-label="Cerrar visor"
              className="bg-gray-10 shadow-300 absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full hover:opacity-90 focus:outline-none"
              onClick={closePreview}
            >
              <CancelIcon />
            </button>
            <div className="flex w-full items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewSrc}
                alt="Ticket"
                className="shadow-500 max-h-[70vh] w-auto rounded-md"
              />
            </div>
            {previewTotal > 1 && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <Button
                  size="small"
                  variant="ghost"
                  hideIcon
                  onClick={prevPreview}
                >
                  Anterior
                </Button>
                <span className="text-c3 text-white-10">
                  {previewIndex + 1} / {previewTotal}
                </span>
                <Button
                  size="small"
                  variant="ghost"
                  hideIcon
                  onClick={nextPreview}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsFiles;
