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

  return normalized.includes("valid");
};

const isInvoiceRejected = (status?: string): boolean => {
  if (!status) return false;

  const normalized = normalizeStatus(status);

  if (!normalized.includes("factura")) return false;

  return normalized.includes("rechaz");
};

const isNoInvoice = (status?: string): boolean => {
  const n = normalizeStatus(status);
  if (!n) return false;
  return n.includes("sin factura") || n.replace(/\s+/g, "") === "sinfactura";
};

const isVoucherRejectedStatus = (status?: string): boolean => {
  // Rechazado del VALE (no la factura)
  const n = normalizeStatus(status);
  if (!n) return false;
  return n.includes("rechaz") && !n.includes("factura");
};

const isPendingOrInvoiceSent = (status?: string): boolean => {
  const n = normalizeStatus(status);
  if (!n) return false;
  return n.includes("pendiente") || n.includes("factura enviada");
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
  onEditModeChange,
  onSaveAmount,
  isSavingAmount = false,
  amountHistory = [],
  isHistoryLoading = false,
}) => {
  const [voucherRejectModalOpen, setVoucherRejectModalOpen] =
    React.useState(false);
  const [voucherRejectComment, setVoucherRejectComment] = React.useState("");
  const [voucherRejectError, setVoucherRejectError] = React.useState<
    string | null
  >(null);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [amountValue, setAmountValue] = React.useState<string>("");
  const [amountError, setAmountError] = React.useState<string | null>(null);
  const [amountTouched, setAmountTouched] = React.useState(false);
  const [pendingAmount, setPendingAmount] = React.useState<number | null>(null);
  const historyEntries = React.useMemo(() => {
    if (!Array.isArray(amountHistory)) return [];

    return [...amountHistory].sort((a, b) => {
      const aTime = new Date(a?.date ?? "").getTime();
      const bTime = new Date(b?.date ?? "").getTime();

      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    });
  }, [amountHistory]);
  

  

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
  const uuid = detail?.uuid || "";
  const rfcReceptor = detail?.rfc_receptor || "";
  const xmlUrl = detail?.xml || "";
  const pdfUrl = detail?.pdf || "";
  const amount = detail?.amount ?? selected?.amount;

  const isAlreadyValid = isVoucherValid(status);
  const invoiceRejected = isInvoiceRejected(status);
  const voucherTypeLabel =
    voucherType === "Vale rosa" ? "vale-rosa" : "vale-azul";

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
    const isBlue = isBlueVoucher(voucherType);
    const candidates = isBlue
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

    return pickFirstNumber(candidates, { allowZero: !isBlue });
  }, [detail?.amount, detail?.total, selected?.total, voucherType]);

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

  const handleOpenVoucherRejectModal = () => {
    if (!selected || isDetailLoading || !onReject) return;
    setVoucherRejectComment("");
    setVoucherRejectError(null);
    setVoucherRejectModalOpen(true);
  };

  const handleCloseVoucherRejectModal = () => {
    setVoucherRejectModalOpen(false);
    setVoucherRejectComment("");
    setVoucherRejectError(null);
  };

  const handleVoucherRejectSubmit = () => {
    if (!selected || !onReject || isRejecting) return;

    const trimmed = voucherRejectComment.trim();
    if (!trimmed) {
      setVoucherRejectError("Agrega un comentario para continuar.");
      return;
    }

    onReject(selected, trimmed);
    setVoucherRejectModalOpen(false);
    setVoucherRejectComment("");
    setVoucherRejectError(null);
  };

  const handleVoucherCommentChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setVoucherRejectComment(event.target.value);
    if (voucherRejectError) setVoucherRejectError(null);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
    setPendingAmount(null);
  };

  const handleStartEditing = () => {
    if (!selected || isDetailLoading || invoiceRejected) return;
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

  const handlePanelClose = () => {
    setPanelOpen(false);
    setVoucherRejectModalOpen(false);
    handleCancelEditing();
  };

  // ¿Se deben mostrar los botones?
  const showActionButtons = Boolean(selected && !isNoInvoice(status));

  // ¿El estado de negocio exige deshabilitar (validado o rechazado)?
  const disableByBusinessStatus =
    isVoucherValid(status) || isVoucherRejectedStatus(status);

  // ¿El estado de negocio permite habilitar (pendiente o factura enviada)?
  const enableByBusinessStatus = isPendingOrInvoiceSent(status);

  // Reglas finales para el "disabled"
  const disableActions =
    !enableByBusinessStatus || // no es pendiente / factura enviada
    disableByBusinessStatus || // validado / rechazado
    isDetailLoading || // estados de carga
    isValidating ||
    isRejecting || // en proceso
    invoiceRejected; // factura rechazada (tu regla actual)

  // NUEVO: bandera para vista mínima cuando el estatus es "sin factura"
  const showMinimalSinFactura = isNoInvoice(status);

  return (
    <div className="m-0">
      <PopUp
        open={voucherRejectModalOpen}
        onClose={handleCloseVoucherRejectModal}
        title="Rechazar Vale"
        content="Deja aquí un comentario para que tu compañero sepa la razón del rechazo de su vale."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCloseVoucherRejectModal}
        showPrimaryButton
        primaryButtonText={isRejecting ? "Rechazando…" : "Enviar Comentario"}
        onPrimaryButtonClick={handleVoucherRejectSubmit}
      >
        <Input
          as="textarea"
          placeholder="Escribir comentario"
          value={voucherRejectComment}
          onChange={handleVoucherCommentChange}
          disabled={isRejecting}
          variant={voucherRejectError ? "error" : "default"}
          helperText={voucherRejectError ?? undefined}
          dataTestId="reject-comment"
          rows={4}
        />
      </PopUp>

      <PopUp
        open={confirmModalOpen}
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
        onClose={handlePanelClose}
        leftLabel={employeeName ? `Colaborador: ${employeeName}` : undefined}
        rightLabel={projectCode ? `Proyecto: ${projectCode}` : undefined}
        renderActions={() => (
          <div className="flex items-center gap-2">
            {voucherType ? (
              <Label type={voucherTypeLabel} text={voucherType} />
            ) : null}
            {/* NUEVO: mostrar Label de estatus SOLO cuando es "sin factura" */}
            {showMinimalSinFactura && status ? (
              <Label type="sin-factura" text={status} />
            ) : null}
            {xmlUrl ? (
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                disabled={!xmlUrl}
                onClick={() => window.open(xmlUrl, "_blank")}
              />
            ) : null}
            {pdfUrl ? (
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                disabled={!pdfUrl}
                onClick={() => window.open(pdfUrl, "_blank")}
              />
            ) : null}
          </div>
        )}
        actionButton={
          showActionButtons ? (
            <div className="flex flex-row items-center gap-3">
              <Button
                size="medium"
                variant="solid"
                hideIcon
                disabled={disableActions}
                onClick={() => {
                  if (!disableActions && onValidate && selected) {
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
                disabled={disableActions}
                onClick={() => {
                  if (!disableActions) handleOpenVoucherRejectModal();
                }}
              >
                {isRejecting ? "Rechazando…" : "Rechazar"}
              </Button>
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            {isDetailLoading ? (
              <div className="text-gray-70 text-b4">Cargando detalle...</div>
            ) : null}

            {/* VISTA MÍNIMA CUANDO EL ESTATUS ES "SIN FACTURA" */}
            {showMinimalSinFactura ? (
              <div className="space-y-3" data-testid="minimal-sin-factura">
                <div className="text-gray-90 text-b4 font-medium">
                  Fecha:&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    {formatDate(applicationDate) || "—"}
                  </span>
                </div>
                <div className="text-gray-90 text-b4 font-medium">
                  Monto Solicitado:&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    {amount}
                  </span>
                </div>
                <div className="text-gray-90 text-b4 font-medium">
                  Concepto:&nbsp;
                  <span className="text-gray-90 text-b3 font-regular">
                    {concept || "—"}
                  </span>
                </div>
              </div>
            ) : (
              // VISTA COMPLETA (estatus distinto de "sin factura")
              <>
                {uuid ? (
                  <div className="text-gray-90 text-s1 font-semibold">
                    {uuid}
                  </div>
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

                {showActionButtons && (
                  <div>
                    <div className="mt-10 mb-5 h-[0.1px] w-[auto] bg-green-100"></div>
                    <Button
                      size="medium"
                      variant={isEditingAmount ? "outline" : "outline"}
                      hideIcon
                      disabled={disableActions}
                      onClick={
                        isEditingAmount
                          ? handleCancelEditing
                          : handleStartEditing
                      }
                    >
                      Editar Monto
                    </Button>
                  </div>
                )}

                {isEditingAmount ? (
                  <div>
                    {requestedAmount !== undefined ? (
                      <p className="text-gray-70 text-b4 mt-2">
                        MONTO SOLICITADO :&nbsp;
                        <span className="text-gray-90 font-medium">
                          {amount}
                        </span>
                      </p>
                    ) : null}
                    <p className="text-b4 text-gray-90 my-2">
                      Ingresa aquí el nuevo monto:
                    </p>
                    <p className="text-b4 text-gray-90 my-1">Monto:</p>
                    <div className="flex items-center justify-between gap-4">
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
                          isSavingAmount ||
                          isDetailLoading ||
                          !selected ||
                          !amountValue
                        }
                      >
                        {isSavingAmount ? "Guardando…" : "Guardar Monto"}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {isAlreadyValid ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-90 text-b4 font-medium">
                        MONTO SOLICITADO:{" "}
                        <span>
                          {amount}
                        </span>
                      </p>
                      {isHistoryLoading ? (
                        <span className="text-gray-70 text-b5">Cargando…</span>
                      ) : null}
                    </div>
                    {historyEntries.length ? (
                      <ul className="" data-testid="amount-history">
                        {historyEntries.map((entry, index) => (
                          <li
                            key={`${entry.date}-${index}`}
                            className="text-b3 text-gray-90"
                          >
                            {" "}
                            • Monto Editado &nbsp;
                            <span>
                              {formatDate(entry.date) || entry.date || "—"}:
                              &nbsp;
                            </span>
                            <span className="font-medium">
                              {formatMoney(entry.amount)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-70 text-b4">
                        Sin cambios registrados.
                      </p>
                    )}
                  </div>
                ) : null}

                {!isDetailLoading && !detail ? (
                  <div className="text-gray-70 text-b3">
                    No se encontró información adicional del vale.
                  </div>
                ) : null}
              </>
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
