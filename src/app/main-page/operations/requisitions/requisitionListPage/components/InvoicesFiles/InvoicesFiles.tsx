import React from "react";

import { DataTable } from "@/app/components/DataTable/DataTable";
import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import { InvoicesProvider } from "@/app/main-page/accounting/personalInvoices/invoices/context/InvoicesContext";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useInvoicesFiles from "./useInvoicesFiles";
import { PopUp } from "@/app/components/PopUp/PopUp";
import DynamicForm from "@/app/components/DynamicForm/DynamicForm";

const InvoicesFiles = ({ forceVisible: _forceVisible = false }) => {
  const {
    columns,
    rows,
    filterOptions,
    filterValue,
    setFilterValue,
    refresh,
    detailOpen,
    detailRow,
    closeDetails,
    openValidInvoice,
    openRejectInvoice,
    setOpenValidInvoice,
    setOpenRejectInvoice,
    handleSubmitValid,
    handleSubmitReject,
    isStatusLocked,
  } = useInvoicesFiles();
  const { currentPagePermissions } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const submitRef = React.useRef<(() => void | Promise<void>) | null>(null);
  const [isResubmitFormValid, setIsResubmitFormValid] = React.useState(false);
  const requisitionId =
    searchParams.get("idRequisition") ?? searchParams.get("id");
  const employeeId = searchParams.get("idEmployee");
  const canResubmitInvoice = Boolean(
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
        id: detailRow.source.id ?? detailRow.id,
        billing_image_id: detailRow.source.billingimages_id ?? "",
        billingdocument_id: detailRow.source.billingdocument_id ?? detailRow.id,
        billingrequisition_id: detailRow.requisitionId ?? "",
        project: projectFallback,
        requisitionkey: detailRow.requisitionKey ?? "",
        status:
          (detailRow.status?.toLowerCase() as HistoryRow["status"]) ??
          "pendiente",
        xml: detailRow.xmlUrl ?? "",
        pdf: detailRow.pdfUrl ?? "",
        image: detailRow.imageUrl ?? "",
        comments: detailRow.comments ?? "",
        dateCreate: detailRow.source.date_created ?? detailRow.date,
        certificationDate: detailRow.certificationDate ?? detailRow.date,
        uuid: detailRow.uuid,
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
  const currency = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });

  const formatDateTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const handleUploadBillableFiles = () => {
    if (!requisitionId) return;

    const query = new URLSearchParams(searchParams.toString());
    query.set("idRequisition", requisitionId);
    if (employeeId) {
      query.set("idEmployee", employeeId);
    }
    const label = searchParams.get("label");
    if (label) {
      query.set("label", label);
    }
    query.set("view", "billablefiles");
    query.set("uploadSection", "invoice");

    router.push(`${pathname}?${query.toString()}`);
  };

  return (
    <div>
      <div data-tour="requisitions-invoices-table">
        <DataTable
          showCalendar={true}
          showDownloadTable={false}
          actionLabel="Subir una Factura"
          showFilter
          showRefresh
          filterOptions={filterOptions}
          filterValue={filterValue}
          filterTitle="Estatus"
          onFilterChange={(value) => setFilterValue(value)}
          onRefreshPage={refresh}
          onTableActionClick={handleUploadBillableFiles}
          actionButtonDataTour="requisitions-upload-invoice"
          textSize={{ mobile: "text-c3", desktop: "text-c2" }}
          tables={[
            {
              data: rows,
              columns: columns,
              title: "Facturas",
              enableCollaps: true,
              enableSelection: false,
            },
          ]}
        />
      </div>
      <DetailsPanelLayout
        open={detailOpen}
        onClose={closeDetails}
        closeButtonDataTour="requisitions-invoice-close"
        leftLabel={
          detailRow?.employeeName
            ? `Nombre: ${detailRow.employeeName}`
            : undefined
        }
        rightLabel={
          detailRow?.requisitionKey
            ? `Código de Solicitud: ${detailRow.requisitionKey}`
            : undefined
        }
        actionButton={
          canResubmitInvoice ? (
            <Button
              size="large"
              variant="solid"
              hideIcon
              onClick={() => submitRef.current?.()}
              disabled={!isResubmitFormValid}
            >
              Reenviar
            </Button>
          ) : (
            <>
              <Button
                size="large"
                variant="solid"
                hideIcon
                className="mr-2"
                onClick={() => setOpenValidInvoice(true)}
                disabled={isStatusLocked}
                data-tour="requisitions-invoice-validate"
              >
                Validar
              </Button>
              <Button
                size="large"
                variant="outline"
                hideIcon={true}
                onClick={() => setOpenRejectInvoice(true)}
                disabled={isStatusLocked}
                data-tour="requisitions-invoice-reject"
              >
                Rechazar
              </Button>
            </>
          )
        }
        renderActions={() => (
          <div className="flex items-center gap-2">
            {detailRow?.xmlUrl && (
              <Button
                iconOnly
                size="small"
                variant="ghost"
                icon={XMLIcon}
                onClick={() =>
                  window.open(detailRow.xmlUrl ?? undefined, "_blank")
                }
                aria-label="Abrir XML"
              />
            )}
            {detailRow?.pdfUrl && (
              <Button
                iconOnly
                size="small"
                variant="ghost"
                icon={PDFIcon}
                onClick={() =>
                  window.open(detailRow.pdfUrl ?? undefined, "_blank")
                }
                aria-label="Abrir PDF"
              />
            )}
            {detailRow?.imageUrl && (
              <Button
                iconOnly
                size="small"
                variant="ghost"
                icon={ImageIcon}
                onClick={() =>
                  window.open(detailRow.imageUrl ?? undefined, "_blank")
                }
                aria-label="Abrir Imagen"
              />
            )}
          </div>
        )}
      >
        {detailRow ? (
          <div className="flex h-full flex-col gap-4">
            <div className="space-y-2">
              <div className="text-gray-90 text-s1 font-semibold">
                {detailRow.uuid}
              </div>
              {!detailRow.certificationDate?.includes("NaN-NaN") && (
                <div className="text-gray-90 text-b4 font-medium">
                  FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    {formatDateTime(detailRow.certificationDate)}
                  </span>
                </div>
              )}

              <div className="text-gray-90 text-b4 font-medium">
                RFC EMISOR:&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  {detailRow.rfcEmisor || "-"}
                </span>
              </div>
              <div className="text-gray-90 text-b4 font-medium">
                RFC RECEPTOR:&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  {detailRow.rfcReceptor || "-"}
                </span>
              </div>

              <div className="text-gray-90 text-b4 font-medium">
                DESCRIPCIÓN:&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  {detailRow.description || "-"}
                </span>
              </div>
              {(detailRow.comments || detailRow.userComments) && (
                <div className="space-y-1">
                  <div className="text-gray-90 text-b4 font-medium">
                    Comentarios:
                  </div>
                  <p className="text-b4 p-2 font-medium text-gray-50">
                    {detailRow.comments?.trim() ||
                      detailRow.userComments?.trim()}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex content-center justify-end">
                <div className="text-gray-70 text-b4 text-gray-90 mr-5 font-medium uppercase">
                  Subtotal:
                </div>
                <div className="text-gray-90 text-b3 text-gray-90">
                  {currency.format(detailRow.subtotal ?? 0)}
                </div>
              </div>
              <div className="flex content-center justify-end">
                <div className="text-gray-70 text-b4 text-gray-90 mr-12 font-medium uppercase">
                  IVA(16%):
                </div>
                <div className="text-gray-90 text-b3 text-gray-90">
                  {currency.format(detailRow.iva ?? 0)}
                </div>
              </div>
              <div className="flex content-center justify-end">
                <div className="text-gray-70 text-b4 text-gray-90 mr-12 font-medium uppercase">
                  Total:
                </div>
                <div className="text-gray-90 text-b3 text-gray-90">
                  {currency.format(detailRow.total ?? 0)}
                </div>
              </div>
            </div>
            {canResubmitInvoice && dataEdit && (
              <InvoicesProvider>
                <InvoicesForm
                  dataEdit={dataEdit}
                  externalSubmitRef={submitRef}
                  onValidChange={setIsResubmitFormValid}
                  onSubmitSuccess={handleResubmitSuccess}
                  refreshRequisitionId={detailRow.requisitionId}
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
      <PopUp
        title={"Rechazar Factura"}
        content={
          "Deja aqui un comentario para que tu companero sepa la razon del rechazo de su factura"
        }
        open={openRejectInvoice}
        onClose={() => setOpenRejectInvoice(false)}
      >
        <div>
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
            onSecondaryButtonClick={() => setOpenRejectInvoice(false)}
          />
        </div>
      </PopUp>
    </div>
  );
};
export default InvoicesFiles;
