import { DataTable } from "@/app/components/DataTable/DataTable";
import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const requisitionId = searchParams.get("id");
  const employeeId = searchParams.get("idEmployee");
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
    query.set("id", requisitionId);
    if (employeeId) {
      query.set("idEmployee", employeeId);
    }
    if (employeeId) {
      query.set("idEmployee", employeeId);
    }
    const label = searchParams.get("label");
    if (label) {
      query.set("label", label);
    }
    query.set("view", "billablefiles");

    router.push(`${pathname}?${query.toString()}`);
  };

  return (
    <div>
      <DataTable
        showCalendar={true}
        showDownloadTable={false}
        actionLabel="Subir Factura"
        showFilter
        showRefresh
        filterOptions={filterOptions}
        filterValue={filterValue}
        filterTitle="Estatus"
        onFilterChange={(value) => setFilterValue(value)}
        onRefreshPage={refresh}
        onTableActionClick={handleUploadBillableFiles}
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
      <DetailsPanelLayout
        open={detailOpen}
        onClose={closeDetails}
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
          <>
            <Button
              size="large"
              variant="solid"
              hideIcon
              className="mr-2"
              onClick={() => setOpenValidInvoice(true)}
              disabled={isStatusLocked}
            >
              Validar
            </Button>
            <Button
              size="large"
              variant="outline"
              hideIcon={true}
              onClick={() => setOpenRejectInvoice(true)}
              disabled={isStatusLocked}
            >
              Rechazar
            </Button>
          </>
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
          </div>
        )}
      >
        {detailRow ? (
          <div className="flex h-full flex-col gap-4">
            <div className="space-y-2">
              <div className="text-gray-90 text-s1 font-semibold">
                {detailRow.uuid}
              </div>
              <div className="text-gray-90 text-b4 font-medium">
                FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  {formatDateTime(detailRow.certificationDate)}
                </span>
              </div>
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
                    {detailRow.comments?.trim() || detailRow.userComments?.trim()}
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
    </div>
  );
};
export default InvoicesFiles;
