"use client";

import React from "react";
import { shallow } from "zustand/shallow";

import type { ControlSideMenuProps } from "../../types";

import { Button } from "@/app/components/Button/Button";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import { Input } from "@/app/components/Input/Input";
import Label from "@/app/components/Label/Label";
import type { LabelType } from "@/app/components/Label/types";
import { PopUp } from "@/app/components/PopUp/PopUp";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("rechazado")) return "rechazado";
  if (normalized.includes("proceso")) return "en-proceso";
  if (normalized.includes("valid")) return "valido";
  if (normalized.includes("pend")) return "pendiente";
  if (normalized.includes("no deducible")) return "prohibido";
  if (normalized.includes("sin factura")) return "sin-factura";
  if (normalized.includes("factura rechazada")) return "factura-rechazada";
  return normalized ? "actualizado" : "pendiente";
};

const toValidNumber = (value: unknown): number | undefined =>
  typeof value === "number" && !Number.isNaN(value) ? value : undefined;

const pickFirstNumber = (
  values: Array<number | undefined>,
  options: { allowZero?: boolean } = {},
): number | undefined => {
  const { allowZero = true } = options;

  for (const value of values) {
    if (value === undefined) continue;
    if (!allowZero && value === 0) continue;
    return value;
  }

  return undefined;
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
  const { rejectBillingInvoice, rejecting: storeRejecting } =
    useBillingPettyCash(
      (state) => ({
        rejectBillingInvoice: state.rejectBillingInvoice,
        rejecting: state.rejecting,
      }),
      shallow,
    );
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;
  const [isRejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [rejectComment, setRejectComment] = React.useState("");
  const [rejectError, setRejectError] = React.useState<string | null>(null);
  const [isConfirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [amountValue, setAmountValue] = React.useState<string>("");
  const [amountError, setAmountError] = React.useState<string | null>(null);
  const [amountTouched, setAmountTouched] = React.useState(false);
  const [pendingAmount, setPendingAmount] = React.useState<number | null>(null);
  const isInvoiceRejecting = isRejecting || storeRejecting;

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
  const voucherStatus = detail?.status || selected?.status || "";
  const voucherTypeLabel =
    voucherType === "Vale rosa" ? "vale-rosa" : "vale-azul";
  const voucherStatusLabel = statusToLabelType(voucherStatus);
  const uuid = detail?.uuid || "";
  const rfcReceptor = detail?.rfc_receptor || "";
  const xmlUrl = detail?.xml || "";
  const pdfUrl = detail?.pdf || "";
  const normalizedVoucherType = React.useMemo(() => {
    const source = voucherType || "";
    return source.toLocaleLowerCase("es-MX");
  }, [voucherType]);

  const requestedAmount = React.useMemo(() => {
    return pickFirstNumber(
      [
        toValidNumber(detail?.amount),
        toValidNumber(detail?.total),
        toValidNumber(selected?.total),
      ],
      { allowZero: false },
    );
  }, [detail?.amount, detail?.total, selected?.total]);

  const resolvedTotal = React.useMemo(() => {
    const isBlueVoucher = normalizedVoucherType.includes("azul");
    const candidates = isBlueVoucher
      ? [
          toValidNumber(detail?.amount),
          toValidNumber(detail?.total),
          toValidNumber(selected?.total),
        ]
      : [
          toValidNumber(detail?.total),
          toValidNumber(selected?.total),
          toValidNumber(detail?.amount),
        ];

    return pickFirstNumber(candidates, { allowZero: !isBlueVoucher });
  }, [detail?.amount, detail?.total, normalizedVoucherType, selected?.total]);
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

  const handleRejectSubmit = async () => {
    if (!selected || isDetailLoading || isInvoiceRejecting) return;

    const trimmed = rejectComment.trim();
    if (!trimmed) {
      setRejectError("Agrega un comentario para continuar.");
      return;
    }

    const targetId = detail?.id ?? selected.id;
    if (!targetId) {
      setRejectError("No se encontró el identificador de la factura.");
      return;
    }

    const ok = await rejectBillingInvoice({ id: targetId, comments: trimmed });
    if (!ok) {
      showAlert({
        type: "error",
        variant: "filled",
        title: "No se pudo rechazar la factura",
        description: "Intenta de nuevo en unos segundos.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: hideAlert,
      });
      setRejectError("No se pudo rechazar la factura. Intenta nuevamente.");
      return;
    }

    const result = await Promise.resolve(
      onReject?.(selected, trimmed, { skipSuccessAlert: true }),
    );
    const voucherRejected =
      typeof result === "boolean" ? result : result !== false;

    if (!voucherRejected) {
      setRejectError("No se pudo rechazar el vale. Intenta nuevamente.");
      return;
    }

    showAlert({
      type: "warning",
      variant: "filled",
      title: "Factura rechazada",
      description: "Se rechazó la factura y el vale correctamente.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 2000,
      onClose: hideAlert,
    });

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
        primaryButtonText={
          isInvoiceRejecting ? "Rechazando…" : "Enviar Comentario"
        }
        onPrimaryButtonClick={() => {
          void handleRejectSubmit();
        }}
      >
        <Input
          as="textarea"
          placeholder="Escribir comentario"
          value={rejectComment}
          onChange={handleCommentChange}
          disabled={isInvoiceRejecting}
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
                      onClick={() => window.open(xmlUrl, "_blank")}
                    />
                  )}
                  {pdfUrl && (
                    <Button
                      size="xsmall"
                      variant="ghost"
                      icon={PDFIcon}
                      onClick={() => window.open(pdfUrl, "_blank")}
                    />
                  )}
                </div>
              </div>
              <div>
                <Button
                  size="small"
                  variant="outline"
                  disabled={!selected || isDetailLoading || isInvoiceRejecting}
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

            <div className="text-gray-90 text-b4 mb-0 font-medium">
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

            <div className="mt-10 h-[0.1px] w-[auto] bg-green-100"></div>

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
                  {formatMoney(resolvedTotal)}
                </div>
              </div>
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
                <p className="text-b4 text-gray-90 my-1">
                  Monto:
                </p>
                <div className="flex align-center justify-between">
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
                      disabled={
                        isSavingAmount || isDetailLoading || !selected
                      }
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

export default SideMenuEdit;
