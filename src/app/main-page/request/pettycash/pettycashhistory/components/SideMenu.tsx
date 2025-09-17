import { useMemo, useRef } from "react";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import Label from "@/app/components/Label/Label";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import TicketForm from "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm";
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";

import { SideMenuProps } from "./types";




const SideMenu = ({ panelOpen, setPanelOpen, selected, detail, isDetailLoading }: SideMenuProps) => {
  const submitRef = useRef<() => void | Promise<void>>(null);
  const { user, currentPagePermissions } = useAuth();

  const projectCode = detail?.project?.proyectkey ?? selected?.project?.proyectKey ?? "";
  const employeeName = detail?.employeename ?? selected?.employeeName ?? user?.fullName ?? "";
  const certificationDate = detail?.application_date ?? selected?.dateCreate ?? "";
  const voucherUuid = detail?.uuid ?? selected?.billingdocument_id ?? "";
  const xmlUrl = detail?.xml ?? selected?.xml ?? "";
  const pdfUrl = detail?.pdf ?? selected?.pdf ?? "";
  const imageUrl = selected?.image ?? "";
  const comments = detail?.comments ?? selected?.comments ?? "";

  const amountValue = detail?.total ?? detail?.amount ?? selected?.total ?? selected?.amount ?? 0;

  const formattedAmount = useMemo(() => {
    if (typeof amountValue !== "number") return "—";
    if (Number.isNaN(amountValue)) return "—";
    return amountValue.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  }, [amountValue]);

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={selected ? `Usuario: ${employeeName}` : undefined}
      rightLabel={selected ? `Proyecto: ${projectCode}` : undefined}
      actionButton={
        <>
          {(currentPagePermissions?.canAddPicture || currentPagePermissions?.canAddDocuments) && (
            <Button
              size="large"
              variant="solid"
              hideIcon
              onClick={() => submitRef.current?.()}
              disabled={selected?.status?.toLocaleLowerCase() !== "rechazado"}
            >
              Reenviar
            </Button>
          )}
        </>


      }
      renderActions={() =>
        selected && (
          <Label type={selected?.status?.toLocaleLowerCase() as any} text={(selected?.status ?? "").toUpperCase()} />
        )
      }
    >
      {selected ? (
        <div className="space-y-4">
          {isDetailLoading && (
            <div className="text-gray-70 text-b4">Cargando detalle...</div>
          )}

          {/* Código de Solicitud */}
          <div className="flex items-baseline gap-2">
            <span className="text-gray-90 text-b4 font-medium">Proyecto:</span>
            <span className="text-gray-90 text-b3 font-regular">{projectCode || "—"}</span>
          </div>

          {/* UUID */}
          <div className="text-gray-90 text-s1 font-semibold ">
            {voucherUuid || "—"}
          </div>

          {/* Fecha */}
          <div className="text-gray-90 text-b4 font-medium">
            FECHA DEL VALE:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">{certificationDate || "—"}</span>
          </div>

          {/* Concepto */}
          <div className="text-gray-90 text-b4 font-medium">
            CONCEPTO:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">
              {detail?.concept ?? selected.description.name ?? "—"}
            </span>
          </div>

          {/* Monto */}
          <div className="text-gray-90 text-b4 font-medium">
            MONTO:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">{formattedAmount}</span>
          </div>

          {/* Archivos enviados */}
          <div className="flex items-center justify-between">
            <span className="text-gray-90 text-b4 font-medium">Archivos Enviados</span>
            <div className="flex items-center gap-2">
              {xmlUrl && <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                disabled={!xmlUrl}
                onClick={() => window.open(xmlUrl, '_blank')}
              />}
              {pdfUrl && <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                disabled={!pdfUrl}
                onClick={() => window.open(pdfUrl, '_blank')}
              />}
              {imageUrl && (
                <Button size="xsmall" variant="ghost" icon={ImageIcon} onClick={() => window.open(imageUrl, '_blank')} />
              )}

            </div>
          </div>

          {/* Comentarios */}
          {comments &&
            <div className="space-y-1">
              <div className="text-gray-90 text-b4 font-medium">Comentarios en Factura:</div>
              <p className="text-gray-50 text-b4 font-medium p-2">
                {comments || "—"}
              </p>
            </div>
          }
          {/* Editar Documento (como en la maqueta) */}

          {selected.status?.toLocaleLowerCase() == "rechazado" && <>
            <div className="text-gray-90 text-b4 font-medium">Editar documento:</div>

            {/* Formulario */}
            {(selected.xml || selected.pdf) ?
              <div id="ticket-form">
                <InvoicesForm
                  responsiveLayoutMatrix={{
                    sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    md: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    lg: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                  }}
                  dataEdit={selected}
                  externalSubmitRef={submitRef}
                />
              </div> :
              <div id="ticket-form">
                <TicketForm
                  responsiveLayoutMatrix={{
                    sm: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    md: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                    lg: [[10], [10], [10], [10], [10], [10], [10], [10], [10]],
                  }}
                  dataEdit={selected}
                  externalSubmitRef={submitRef}
                />
              </div>}
          </>}


        </div>
      ) : (
        <div className="text-gray-70 text-b3">Selecciona un registro para ver el detalle.</div>
      )}
    </DetailsPanelLayout>
  );
};

export default SideMenu;
