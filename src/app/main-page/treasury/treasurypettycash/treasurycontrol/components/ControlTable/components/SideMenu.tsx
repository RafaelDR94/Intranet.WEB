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

const toValidNumber = (value: unknown): number | undefined =>
  typeof value === "number" && !Number.isNaN(value) ? value : undefined;

const pickFirstNumber = (
  ...values: Array<number | undefined>
): number | undefined => {
  for (const value of values) {
    if (value !== undefined) return value;
  }

  return undefined;
};

const isBlueVoucher = (voucherType?: string): boolean => {
  const normalized = (voucherType ?? "")
    .trim()
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!normalized) return false;
  if (normalized.length === 1) return normalized === "a";

  return normalized.includes("azul");
};

const normalizeStatus = (status?: string): string =>
  (status ?? "")
    .toLocaleLowerCase("es-MX")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isVoucherValid = (status?: string): boolean => {
  if (!status) return false;

  const normalized = normalizeStatus(status);

  return normalized.includes("valido");
};

const isInvoiceRejected = (status?: string): boolean => {
  if (!status) return false;

  const normalized = normalizeStatus(status);

  if (!normalized.includes("factura")) return false;

  return normalized.includes("rechaz");
};

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
  isEditingAmount = false,
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
  const voucherType = detail?.voucher_type || selected?.voucherType || "";
  const status = detail?.status || selected?.status;
  const isAlreadyValid = isVoucherValid(status);
  const invoiceRejected = isInvoiceRejected(status);
  const detailTotal = toValidNumber(detail?.total);
  const detailAmount = toValidNumber(detail?.amount);
  const selectedTotal = toValidNumber(selected?.total);
  const total = isBlueVoucher(voucherType)
    ? pickFirstNumber(detailAmount, selectedTotal, detailTotal)
    : pickFirstNumber(detailTotal, detailAmount, selectedTotal);
  const uuid = detail?.uuid || "";
  const rfcReceptor = detail?.rfc_receptor || "";

  const handleOpenRejectModal = () => {
    if (!selected || isDetailLoading || !onReject) return;
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

  const handleSaveAmount = () => {
    if (isDetailLoading || isSavingAmount) return;

    const normalized = amountValue.replace(/,/g, "").trim();
    const parsed = Number.parseFloat(normalized);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      setAmountError("Ingresa un monto válido.");
      return;
    }

    setAmountError(null);
    setPendingAmount(parsed);
    setConfirmModalOpen(true);
  };

  const handleStartEditing = () => {
    if (!selected || isDetailLoading) return;
    setAmountTouched(false);
    setAmountError(null);
    onEditModeChange?.(true);
  };

  return (
    <div className="m-0">
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
        renderActions={() => (
          <div className="flex">
            {voucherType ? (
              <Label
                type={voucherType === "Vale rosa" ? "vale-rosa" : "vale-azul"}
                text={voucherType}
              />
            ) : null}
            {detail?.xml && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                disabled={!detail.xml}
                onClick={() => window.open(detail.xml!, "_blank")}
              />
            )}
            {detail?.pdf && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                disabled={!detail.pdf}
                onClick={() => window.open(detail.pdf!, "_blank")}
              />
            )}
          </div>
        )}
        actionButton={
          <div className="flex flex-row items-center gap-3">
            <Button
              size="medium"
              variant="solid"
              hideIcon
              disabled={
                !selected ||
                isDetailLoading ||
                isValidating ||
                isAlreadyValid ||
                invoiceRejected
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
                !selected ||
                isDetailLoading ||
                isRejecting ||
                isAlreadyValid ||
                invoiceRejected
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

            <div className="mt-40 h-[0.1px] w-[auto] bg-green-100"></div>

            <div className="flex flex-row items-center gap-3">
              {isEditingAmount ? (
                <Button
                  size="medium"
                  variant="outline"
                  hideIcon
                  disabled={true}
                  onClick={handleCancelEditing}
                >
                  Editar Monto
                </Button>
              ) : (
                <Button
                  size="medium"
                  variant="solid"
                  hideIcon
                  disabled={!selected || isDetailLoading}
                  onClick={handleStartEditing}
                >
                  Editar Monto
                </Button>
              )}
            </div>

            {isEditingAmount ? (
              <div className="">
                <div className="mt-10 mb-10 h-[0.1px] w-[auto] bg-green-100"></div>
                {requestedAmount !== undefined ? (
                  <p className="text-gray-70 text-b4 mt-2">
                    MONTO SOLICITADO :&nbsp;
                    <span className="text-gray-90 font-medium">
                      {formatMoney(requestedAmount)}
                    </span>
                  </p>
                ) : null}
                <p className="text-b4 text-gray-90 my-2">
                  Ingresa aquí el nuevo monto:
                </p>
                <p className="text-b4 text-gray-90 my-1">Monto:</p>
                <div className="align-center flex justify-between">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amountValue}
                    onChange={handleAmountInputChange}
                    disabled={isSavingAmount || isDetailLoading}
                    variant={amountError ? "error" : "default"}
                    helperText={amountError ?? undefined}
                    dataTestId="requested-amount-input"
                  />
                  <Button
                    size="medium"
                    hideIcon
                    onClick={handleSaveAmount}
                    disabled={isSavingAmount || isDetailLoading || !selected}
                  >
                    {isSavingAmount ? "Guardando…" : "Guardar Monto"}
                  </Button>
                </div>
              </div>
            ) : null}

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
    </div>
  );
};

export default SideMenu;
