import React, { useRef } from "react";

import InvoicesForm from "@/app/main-page/accounting/personalInvoices/invoices/components/InvoicesForm/InvoicesForm";
import TicketForm from "@/app/main-page/accounting/personalInvoices/invoices/components/TicketForm/TicketForm";

import { SideMenuProps } from "./types";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import Label from "@/app/components/Label/Label";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import PDFIcon from '@/assets/icons/Docs/page.svg'
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import ImageIcon from '@/assets/icons/Fotos y Videos/media-image.svg'




const SideMenu: React.FC<SideMenuProps> = ({ panelOpen, setPanelOpen, selected }) => {
  const submitRef = useRef<() => void | Promise<void>>(null);
  const { user, currentPagePermissions } = useAuth();

  return (
    <DetailsPanelLayout
      open={panelOpen}
      withinContainer
      onClose={() => setPanelOpen(false)}
      leftLabel={selected ? `Usuario: ${user?.fullName}` : undefined}
      rightLabel={selected ? `Código: ${selected.project.name}` : undefined}
      actionButton={
        <>
          {(currentPagePermissions?.canAddPicture || currentPagePermissions?.canAddDocuments) && <Button size="large" variant="solid" hideIcon onClick={() => submitRef.current?.()} disabled={(selected?.status.toLocaleLowerCase() != "rechazado")}>
            Reenviar
          </Button>}
        </>


      }
      renderActions={() =>
        selected && <Label type={selected?.status?.toLocaleLowerCase() as any} text={selected.status.toUpperCase()} />
      }
    >
      {selected ? (
        <div className="space-y-4">

          {/* Código de Solicitud (label claro, valor oscuro) */}
          <div className="flex items-baseline gap-2">
            <span className="text-gray-90 text-b4 font-medium">Código de Solicitud:</span>
            <span className="text-gray-90 text-b3 font-regular">
              {selected.requisitionkey}
            </span>
          </div>

          {/* UUID (billingdocument_id) */}
          <div className="text-gray-90 text-s1 font-semibold ">
            {selected.billingdocument_id}
          </div>

          {/* Fecha y hora de certificación */}
          <div className="text-gray-90 text-b4 font-medium">
            FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
            <span className="text-gray-90 text-b3 font-regular">{selected.dateCreate}</span>
          </div>

          {/* Archivos enviados (label izquierda, iconos derecha) */}
          <div className="flex items-center justify-between">
            <span className="text-gray-90 text-b4 font-medium">Archivos Enviados</span>
            <div className="flex items-center gap-2">
              {selected.xml && <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                disabled={!selected.xml}
                onClick={() => window.open(selected.xml, '_blank')}
              />}
              {selected.pdf && <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                disabled={!selected.pdf}
                onClick={() => window.open(selected.pdf, '_blank')}
              />}
              {selected.image && (
                <Button size="xsmall" variant="ghost" icon={ImageIcon} onClick={() => window.open(selected.image, '_blank')} />
              )}

            </div>
          </div>


          {/* Comentarios */}
          {selected.comments &&
            <div className="space-y-1">
              <div className="text-gray-90 text-b4 font-medium">Comentarios en Factura:</div>
              <p className="text-gray-50 text-b4 font-medium p-2">
                {selected.comments || "—"}
              </p>
            </div>
          }
          {/* Editar Documento (como en la maqueta) */}

          {selected.status.toLocaleLowerCase() == "rechazado" && <>
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
