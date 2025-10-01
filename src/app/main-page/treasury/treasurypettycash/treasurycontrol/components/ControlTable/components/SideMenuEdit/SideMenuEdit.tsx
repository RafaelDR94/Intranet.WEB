"use client";

import React from "react";

import type { ControlSideMenuProps } from "../../types";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { Input } from "@/app/components/Input/Input";
import Label from "@/app/components/Label/Label";
import type { LabelType } from "@/app/components/Label/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("rechaz")) return "rechazado";
  if (normalized.includes("proceso")) return "en-proceso";
  if (normalized.includes("valid")) return "valido";
  if (normalized.includes("pend")) return "pendiente";
  if (normalized.includes("no deducible")) return "prohibido";
  if (normalized.includes("sin factura")) return "sin-factura";
  return normalized ? "actualizado" : "pendiente";
};

const SideMenuEdit: React.FC<ControlSideMenuProps> = ({
  panelOpen,
  setPanelOpen,
  selected,
  detail,
  isDetailLoading,
  formatDate,
  formatMoney,
  onReject,
  isRejecting = false,
  isEditingAmount = false,
  onEditModeChange,
  onSaveAmount,
  isSavingAmount = false,
}) => {
  const [isRejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectComment, setRejectComment] = React.useState("");
  const [rejectError, setRejectError] = React.useState<string | null>(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [amountValue, setAmountValue] = React.useState<string>("");
  const [amountError, setAmountError] = React.useState<string | null>(null);
  const [amountTouched, setAmountTouched] = React.useState(false);
  const [pendingAmount, setPendingAmount] = React.useState<number | null>(null);

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
  const voucherStatus = detail?.status || selected?.status || "";
  const voucherTypeLabel =
    voucherType === "Vale rosa" ? "vale-rosa" : "vale-azul";
  const voucherStatusLabel = statusToLabelType(voucherStatus);
  const uuid = detail?.uuid || "";
  const rfcReceptor = detail?.rfc_receptor || "";
  const xmlUrl = detail?.xml || "";
  const pdfUrl = detail?.pdf || "";
  const requestedAmount = React.useMemo(() => {
    const candidates = [detail?.amount, detail?.total, selected?.total];
    for (const candidate of candidates) {
      if (typeof candidate === "number" && !Number.isNaN(candidate)) {
        return candidate;
      }
    }
    return undefined;
  }, [detail?.amount, detail?.total, selected?.total]);
  const formattedPendingAmount = formatMoney(pendingAmount ?? requestedAmount);

  React.useEffect(() => {
    if (!isEditingAmount) {
      setAmountValue("");
      setAmountError(null);
      setAmountTouched(false);
      setPendingAmount(null);
      setConfirmModalOpen(false);
      return;
    }

    if (amountTouched) return;

    if (typeof requestedAmount === "number" && !Number.isNaN(requestedAmount)) {
      setAmountValue(requestedAmount.toFixed(2));
    } else {
      setAmountValue("");
    }
    setAmountError(null);
  }, [amountTouched, isEditingAmount, requestedAmount]);

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

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setPendingAmount(null);
  };

  const handleStartEditing = () => {
    if (!selected || isDetailLoading) return;
    setAmountTouched(false);
    setAmountError(null);
    onEditModeChange?.(true);
  };

  const handleCancelEditing = () => {
    setAmountTouched(false);
    setAmountError(null);
    setPendingAmount(null);
    setConfirmModalOpen(false);
    onEditModeChange?.(false);
  };

  const handleAmountInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setAmountTouched(true);
    setAmountValue(event.target.value);
    if (amountError) setAmountError(null);
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

  const handleConfirmSaveAmount = async () => {
    if (pendingAmount === null || !onSaveAmount || isSavingAmount) {
      handleCloseConfirmModal();
      return;
    }

    try {
      await onSaveAmount(pendingAmount);
    } finally {
      handleCloseConfirmModal();
      setAmountTouched(false);
    }
  };

  return (
    <div className="m-0">
      <PopUp
        open={isRejectModalOpen}
        onClose={handleCloseRejectModal}
        title="Rechazar Factura"
        content="Deja aquí un comentario para que tu compañero sepa la razón del rechazo de la factura."
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

      <PopUp
        open={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        title="Guardar monto"
        content={`Confirma que deseas actualizar el monto solicitado a ${formattedPendingAmount}.`}
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCloseConfirmModal}
        showPrimaryButton
        primaryButtonText={isSavingAmount ? "Guardando…" : "Guardar"}
        onPrimaryButtonClick={handleConfirmSaveAmount}
      />

      <DetailsPanelLayout
        open={panelOpen}
        withinContainer
        zIndex={80}
        onClose={() => {
          setPanelOpen(false);
          onEditModeChange?.(false);
        }}
        leftLabel={employeeName ? `Colaborador: ${employeeName}` : undefined}
        rightLabel={projectCode ? `Proyecto: ${projectCode}` : undefined}
        label={() =>
          voucherType || voucherStatus ? (
            <>
              {voucherType ? (
                <Label type={voucherTypeLabel} text={voucherType} />
              ) : null}
              {voucherStatus ? (
                <Label type={voucherStatusLabel} text={voucherStatus} />
              ) : null}
            </>
          ) : null
        }
        actionButton={
          <div className="flex flex-row items-center gap-3">
            {isEditingAmount ? (
              <>
                <Button
                  size="medium"
                  variant="solid"
                  hideIcon
                  disabled={!selected || isDetailLoading || isSavingAmount}
                  onClick={handleSaveAmount}
                >
                  {isSavingAmount ? "Guardando…" : "Guardar Monto"}
                </Button>
                <Button
                  size="medium"
                  variant="outline"
                  hideIcon
                  disabled={isSavingAmount}
                  onClick={handleCancelEditing}
                >
                  Cancelar
                </Button>
              </>
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
        }
      >
        {selected ? (
          <div className="space-y-4">
            {isDetailLoading && (
              <div className="text-gray-70 text-b4">Cargando detalle...</div>
            )}

            {/* Archivos enviados */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-gray-90 text-b4 font-medium">
                  Archivos Enviados:
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
              <div>
                <Button
                  size="small"
                  variant="outline"
                  onClick={handleOpenRejectModal}
                  hideIcon
                >
                  Rechazar Factura
                </Button>
              </div>
            </div>

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
              CONCEPTO:&nbsp;
              <span className="text-gray-90 text-b3 font-regular">
                {concept || "—"}
              </span>
            </div>

            <div className="text-gray-90 text-b4 font-medium mb-0">
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

            {isEditingAmount ? (
              <div className="rounded-lg border border-green-90 bg-green-10 p-4">
                <Input
                  label="Monto solicitado"
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
                {requestedAmount !== undefined ? (
                  <p className="mt-2 text-gray-70 text-b4">
                    Monto actual:&nbsp;
                    <span className="text-gray-90 font-medium">
                      {formatMoney(requestedAmount)}
                    </span>
                  </p>
                ) : null}
              </div>
            ) : null}

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
    </div>
  );
};

export default SideMenuEdit;
