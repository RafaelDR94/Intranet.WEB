"use client";

import React from "react";

import type { ControlSideMenuProps } from "../types";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { Input } from "@/app/components/Input/Input";
import Label from "@/app/components/Label/Label";
import { PopUp } from "@/app/components/PopUp/PopUp";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";

const SideMenu: React.FC<ControlSideMenuProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  detail,
  isDetailLoading,
  formatDate,
  formatMoney,
  onValidate,
  onReject,
  isValidating = false,
  isRejecting = false,
}) => {
  const [isRejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectComment, setRejectComment] = React.useState("");
  const [rejectError, setRejectError] = React.useState<string | null>(null);

  const employeeName = detail?.employeename || selected?.employeeName || "";
  const projectCode =
    detail?.project?.proyectkey || detail?.petty_cash_funds?.year_month || "";
  const applicationDate = detail?.application_date || selected?.applicationDate;
  const provider =
    detail?.rfc_emisor || selected?.provider || selected?.rfcEmisor || "";
  const concept = detail?.concept || selected?.concept || "";
  const subtotal = detail?.subtotal ?? selected?.subtotal;
  const iva = detail?.iva ?? selected?.iva;
  const total = detail?.total ?? detail?.amount ?? selected?.total;
  const voucherType = detail?.voucher_type || selected?.voucherType || "";
  const voucherStatus = (detail?.status ?? selected?.status ?? "").toLowerCase();
  const isVoucherValid = voucherStatus === "valido";
  const uuid = detail?.uuid || "";
  const rfcReceptor = detail?.rfc_receptor || "";
  const xmlUrl = detail?.xml || "";
  const pdfUrl = detail?.pdf || "";

  const handleOpenRejectModal = () => {
    if (!selected || isDetailLoading || !onReject || isVoucherValid) return;
    setRejectComment("");
    setRejectError(null);
    setRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
    setRejectComment("");
    setRejectError(null);
  };

  const handleRejectSubmit = () => {
    if (!selected || !onReject || isRejecting) return;

    const trimmed = rejectComment.trim();
    if (!trimmed) {
      setRejectError("Agrega un comentario para continuar.");
      return;
    }

    onReject(selected, trimmed);
    setRejectModalOpen(false);
    setRejectComment("");
    setRejectError(null);
  };

  const handleCommentChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setRejectComment(event.target.value);
    if (rejectError) setRejectError(null);
  };

  return (
    <>
      <PopUp
        open={isRejectModalOpen}
        onClose={handleCloseRejectModal}
        title="Rechazar Vale"
        content="Deja aquí un comentario para que tu compañero sepa la razón del rechazo de su vale."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCloseRejectModal}
        showPrimaryButton
        primaryButtonText={isRejecting ? "Rechazando…" : "Enviar Comentario"}
        onPrimaryButtonClick={handleRejectSubmit}
      >
        <Input
          as="textarea"
          placeholder="Escribir comentario"
          value={rejectComment}
          onChange={handleCommentChange}
          disabled={isRejecting}
          variant={rejectError ? "error" : "default"}
          helperText={rejectError ?? undefined}
          dataTestId="reject-comment"
          rows={4}
        />
      </PopUp>

      <DetailsPanelLayout
        open={panelOpen}
        withinContainer
        zIndex={80}
        onClose={() => setPanelOpen(false)}
        leftLabel={employeeName ? `Colaborador: ${employeeName}` : undefined}
        rightLabel={projectCode ? `Proyecto: ${projectCode}` : undefined}
        label={() =>
          voucherType ? (
            <Label
              type={voucherType === "Vale rosa" ? "vale-rosa" : "vale-azul"}
              text={voucherType}
            />
          ) : null
        }
        actionButton={
          <div className="flex flex-row items-center gap-3">
            <Button
              size="medium"
              variant="solid"
              hideIcon
              disabled={
                !selected || isDetailLoading || isValidating || isVoucherValid
              }
              onClick={() => {
                if (onValidate) {
                  onValidate(selected);
                }
              }}
            >
              {isValidating ? "Validando…" : "Validar"}
            </Button>
            <Button
              size="medium"
              variant="outline"
              hideIcon
              disabled={
                !selected || isDetailLoading || isRejecting || isVoucherValid
              }
              onClick={handleOpenRejectModal}
            >
              {isRejecting ? "Rechazando…" : "Rechazar"}
            </Button>
          </div>
        }
      >
        {selected ? (
          <div className="space-y-4">
            {isDetailLoading && (
              <div className="text-gray-70 text-b4">Cargando detalle...</div>
            )}

            {uuid ? (
              <div className="text-gray-90 text-s1 font-semibold">{uuid}</div>
            ) : null}

            <div className="text-gray-90 text-b4 font-medium">
              FECHA DE CERTIFICACIÓN:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {formatDate(applicationDate) || "—"}
              </span>
            </div>

            <div className="text-gray-90 text-b4 font-medium">
              RFC EMISOR:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {provider || "—"}
              </span>
            </div>

            {rfcReceptor ? (
              <div className="text-gray-90 text-b4 font-medium">
                RFC RECEPTOR:&nbsp;
                <span className="text-gray-90 text-b3 font-regular">
                  {rfcReceptor}
                </span>
              </div>
            ) : null}

            <div className="text-gray-90 text-b4 font-medium">
              CONCEPTO:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {concept || "—"}
              </span>
            </div>

            {/* Archivos enviados */}
            <div className="flex items-center justify-between">
              <span className="text-gray-90 text-b4 font-medium">
                Archivos Enviados
              </span>
              <div className="flex items-center gap-2">
                {xmlUrl && (
                  <Button
                    size="xsmall"
                    variant="ghost"
                    icon={XMLIcon}
                    // disabled={!isEditableStatus || !xmlUrl}
                    onClick={() => window.open(xmlUrl, "_blank")}
                  />
                )}
                {pdfUrl && (
                  <Button
                    size="xsmall"
                    variant="ghost"
                    icon={PDFIcon}
                    // disabled={!isEditableStatus || !pdfUrl}
                    onClick={() => window.open(pdfUrl, "_blank")}
                  />
                )}
              </div>
            </div>

            <div className="mt-40 h-[0.1px] w-[auto] bg-green-100"></div>

            <div className="flex flex-col">
              <div className="flex content-center justify-end">
                <div className="text-gray-70 text-b4 text-gray-90 mr-5 font-medium uppercase">
                  Subtotal:
                </div>
                <div className="text-gray-90 text-b3 text-gray-90">
                  {formatMoney(subtotal)}
                </div>
              </div>
              <div className="flex content-center justify-end">
                <div className="text-gray-70 text-b4 text-gray-90 mr-12 font-medium uppercase">
                  IVA(16%):
                </div>
                <div className="text-gray-90 text-b3 text-gray-90">
                  {formatMoney(iva)}
                </div>
              </div>
              <div className="flex content-center justify-end">
                <div className="text-gray-70 text-b4 text-gray-90 mr-12 font-medium uppercase">
                  Total:
                </div>
                <div className="text-gray-90 text-b3 text-gray-90">
                  {formatMoney(total)}
                </div>
              </div>
            </div>

            {!isDetailLoading && !detail && (
              <div className="text-gray-70 text-b3">
                No se encontró información adicional del vale.
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-70 text-b3">
            Selecciona un vale para ver su detalle.
          </div>
        )}
      </DetailsPanelLayout>
    </>
  );
};

export default SideMenu;
