import { DataTable } from "@/app/components/DataTable/DataTable";
import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import CancelIcon from "@/assets/icons/acciones/cancel.svg";
import DownloadIcon from "@/assets/icons/acciones/download.svg";
import useTicketsFiles from "./useTicketsFiles";
import type { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";
import Label from "@/app/components/Label/Label";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import { DownloadFile } from "@/app/utilities/FilesHelper/FilesHelper";
import { PopUp } from "@/app/components/PopUp/PopUp";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

type TicketsFilesProps = {
  onSelectTicket?: (ticket: BillingImagesTable | null) => void;
};

const TicketsFiles = ({ onSelectTicket }: TicketsFilesProps) => {
  const {
    columns,
    rows,
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
    openRejectTicket,
    setOpenRejectTicket,
    handleSubmitReject,
    rejecting,
    toBillingImagesTable,
  } = useTicketsFiles();

  return (
    <div>
      <DataTable
        showCalendar={true}
        showDownloadTable={true}
        showButton={false}
        textSize={{ mobile: "text-c3", desktop: "text-c2" }}
        onSelectedChange={(_index, selectedRows) => {
          if (!onSelectTicket) return;
          const first = selectedRows[0];
          onSelectTicket(first ? toBillingImagesTable(first) : null);
        }}
        tables={[
          {
            data: rows,
            columns: columns,
            title: "Tickets",
            enableCollaps: true,
            enableSelection: true,
            selectionMode: "single",
          },
        ]}
      />
      <DetailsPanelLayout
        open={detailOpen}
        leftLabel={`Nombre: ${detailRow?.source.employee?.fullname ?? ""}`}
        onClose={closeDetails}
        actionButton={
          <Button
            size="large"
            variant="solid"
            hideIcon
            onClick={openReject}
            disabled={
              detailRow?.status.toLocaleLowerCase() == "validado" || rejecting
            }
          >
            Rechazar
          </Button>
        }
        renderActions={() => {
          if (!detailRow) return null;
          const imageUrl = detailRow.imageUrls?.[0];
          return (
            <div className="flex items-center gap-2">
              <Label
                type={detailRow?.status?.toLocaleLowerCase() as any}
                text={detailRow.status.toUpperCase()}
              />
              {imageUrl && (
                <Button
                  iconOnly
                  size="small"
                  variant="ghost"
                  icon={ImageIcon}
                  onClick={() => window.open(imageUrl, "_blank")}
                  aria-label="Abrir imagen"
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
                />
              )}
            </div>
          );
        }}
      >
        {detailRow ? (
          <div className="space-y-0">
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
            {detailRow.comments && (
              <div className="space-y-1">
                <div className="text-gray-90 text-b4 font-medium">
                  Comentarios:
                </div>
                <p className="text-b4 p-2 font-medium text-gray-50">
                  {detailRow.comments}
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
          </div>
        ) : (
          <div className="text-gray-70 text-b3">
            Selecciona un registro para ver el detalle.
          </div>
        )}
      </DetailsPanelLayout>
      <PopUp
        title={"Rechazar Ticket"}
        content={
          "Deja aquí un comentario para que tu compañero sepa la razón del rechazo de su ticket"
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
              className: "bg-white",
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
