"use client";

import React from "react";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/components/Button/Button";
import Donut from "@/app/components/Donut/Donut";
import { Input } from "@/app/components/Input/Input";
import { PopUp } from "@/app/components/PopUp/PopUp";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useIntranetGatewayStore } from "@/app/stores/system/useIntranetGatewayStore";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";

type SummaryProps = {
  title?: string;
  date?: Date | string | null;
  assigned?: number;
  available?: number;
  percent?: number;
  className?: string;
  onShowInputChange?: (show: boolean) => void;
};

const fallbackYearMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const toYearMonth = (value: SummaryProps["date"]) => {
  if (!value) return fallbackYearMonth();
  const parsed = typeof value === "string" ? new Date(value) : value;
  if (!(parsed instanceof Date) || Number.isNaN(parsed.getTime())) {
    return fallbackYearMonth();
  }
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

const formatCurrency = (n?: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(typeof n === "number" && !Number.isNaN(n) ? n : 0);


const capitalize = (s?: string) =>
  (s?.charAt(0)?.toUpperCase() || "") + (s?.slice(1) || "");

const formatDateEs = (value: SummaryProps["date"]) => {
  if (!value) return "—";
  const parsed = typeof value === "string" ? new Date(value) : value;
  if (!(parsed instanceof Date) || Number.isNaN(parsed.getTime())) {
    return "—";
  }
  const day = parsed.getDate();
  const month = parsed.toLocaleString("es-MX", { month: "long" });
  return `${day} de ${capitalize(month)}`;
};

export default function Summary({
  title = "Control de Fondo Fijo de Caja Chica",
  date = null,
  assigned = 0,
  available = 0,
  percent = 0,
  className = "",
  onShowInputChange,
}: SummaryProps) {
  const [isCreating, setIsCreating] = React.useState(false);
  const [assignedInput, setAssignedInput] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingAmount, setPendingAmount] = React.useState<number | null>(null);

  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);

  const { createPettyCashFund, fetchPettyCashVouchers, creating, error } =
    useBillingPettyCash(
      (state) => ({
        createPettyCashFund: state.createPettyCashFund,
        fetchPettyCashVouchers: state.fetchPettyCashVouchers,
        creating: state.creating,
        error: state.error,
      }),
      shallow,
    );

  const percentValue =
    typeof percent === "number" && !Number.isNaN(percent) ? percent : 0;
  const percentClamped = Math.max(0, Math.min(100, percentValue));

  const yearMonth = React.useMemo(() => toYearMonth(date), [date]);
  const formattedDate = React.useMemo(() => formatDateEs(date), [date]);

  const handleCreateClick = React.useCallback(() => {
    if (!isGatewayReady) return;
    setIsCreating(true);
    setAssignedInput("");
    setInputError(null);
    onShowInputChange?.(true);
  }, [isGatewayReady, onShowInputChange]);

  const handleAssignedChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAssignedInput(event.target.value);
      if (inputError) {
        setInputError(null);
      }
    },
    [inputError],
  );

  const handleCancel = React.useCallback(() => {
    if (creating) return;
    setIsCreating(false);
    setAssignedInput("");
    setInputError(null);
    setConfirmOpen(false);
    setPendingAmount(null);
    onShowInputChange?.(false);
  }, [creating, onShowInputChange]);

  const handleSaveRequest = React.useCallback(() => {
    if (!isCreating || creating) return;

    const parsed = Number.parseFloat(assignedInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setInputError("Ingresa un monto mayor a 0");
      return;
    }

    const normalized = Math.round(parsed * 100) / 100;
    setPendingAmount(normalized);
    setConfirmOpen(true);
  }, [assignedInput, creating, isCreating]);

  const closeConfirm = React.useCallback(() => {
    if (creating) return;
    setConfirmOpen(false);
    setPendingAmount(null);
  }, [creating]);

  const handleConfirmSave = React.useCallback(async () => {
    if (!isCreating || creating) return;
    if (pendingAmount == null) return;

    const result = await createPettyCashFund({
      year_month: yearMonth,
      assigned_amount: pendingAmount,
      verified_amount: 0,
      cash_on_hand: 0,
      unverified_amount: 0,
      pending_verification: 0,
      available_amount: pendingAmount,
    });

    if (result) {
      setIsCreating(false);
      setAssignedInput("");
      setInputError(null);
      setPendingAmount(null);
      setConfirmOpen(false);
      await fetchPettyCashVouchers(true);
      onShowInputChange?.(false);
    }
  }, [
    createPettyCashFund,
    creating,
    fetchPettyCashVouchers,
    isCreating,
    pendingAmount,
    yearMonth,
    onShowInputChange,
  ]);

  const showInput = isCreating;
  const parsedAmount = Number.parseFloat(assignedInput);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const headerDisabled = !isGatewayReady || creating;
  const helperMessage = inputError ?? (showInput ? error : undefined);
  const canSave = showInput && !headerDisabled && isAmountValid;

  const { currentPagePermissions } = useAuth();
  const canCreate = Boolean(currentPagePermissions?.createfound);

  // ---------- Lógica de sumatoria ----------
  const parseAmount = (v: string) => {
    if (!v) return 0;
    const n = Number.parseFloat(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const liveAssignedAmount = React.useMemo(
    () => (showInput ? parseAmount(assignedInput) : 0),
    [assignedInput, showInput],
  );

  const sumatoria = React.useMemo(
    () => (available || 0) + liveAssignedAmount,
    [available, liveAssignedAmount],
  );
  // ----------------------------------------

  return (
    <div>
      <PopUp
        open={confirmOpen}
        onClose={closeConfirm}
        title="¿Desea guardar los cambios realizados?"
        showPrimaryButton
        showSecondaryButton
        primaryButtonText={creating ? "Guardando..." : "Guardar"}
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={closeConfirm}
        onPrimaryButtonClick={handleConfirmSave}
      />

      <div
        className={`mb-${canCreate ? "6" : "0"} flex items-center justify-between gap-3`}
      >
        <div className="flex justify-between gap-3">
          {canCreate && !showInput && (
            <>
              <Button
                hideIcon
                variant="outline"
                size="small"
                onClick={handleCreateClick}
                disabled={headerDisabled}
              >
                Crear
              </Button>
              <Button
                hideIcon
                variant="outline"
                onClick={handleSaveRequest}
                disabled={!canSave || creating}
              >
                Guardar Ajustes
              </Button>
            </>
          )}

          {showInput && (
            <>
              <Button
                hideIcon
                variant="outline"
                size="small"
                onClick={handleCancel}
                disabled={creating}
              >
                Cancelar
              </Button>

              {canCreate && (
                <Button
                  hideIcon
                  variant="outline"
                  onClick={handleSaveRequest}
                  disabled={!canSave || creating}
                >
                  Guardar Ajustes
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className={`flex flex-col rounded-lg bg-white p-2 shadow-sm transition-shadow ${className} h-${canCreate ? "[205px]" : "[250px]"}`}
      >
        <h2 className="text-s1 font-semibold text-green-100">{title}</h2>

        <div className="mt-1 flex flex-1 items-start justify-between gap-6">
          <div>
            <p className="text-d3 text-gray-90 mt-3">
              <span className="text-d3 font-medium">Fecha:</span>{" "}
              {formattedDate}
            </p>

            <div className="mt-3 space-y-2">
              <div className="mb-0">
                <p className="text-d3 text-gray-90">Fondo fijo asignado:</p>
                {showInput ? (
                  <Input
                    dataTestId="summary-assigned-input"
                    type="number"
                    inputMode="decimal"
                    inputSize="sm"
                    value={assignedInput}
                    onChange={handleAssignedChange}
                    placeholder="0.00"
                    min={0}
                    step="1"
                    variant={helperMessage ? "error" : "default"}
                    helperText={helperMessage ?? undefined}
                    className="m-0"
                  />
                ) : (
                  <p className="text-s1 font-semibold text-green-100">
                    {formatCurrency(assigned)}
                  </p>
                )}
              </div>

              {/* DISPONIBLES */}
              <div className="flex">
                <div className="mr-5">
                  <div className="text-alert-green-100 flex items-baseline gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 5l9 14H3z" />
                  </svg>
                  <span className="text-s1 text-alert-green-100 font-semibold">
                    {formatCurrency(available)}
                  </span>
                </div>
                <p className="text-d3 text-gray-90 -mt-1 font-medium">
                  Disponibles
                </p>
                </div>
                {/* SUMATORIA solo si hay input */}
                {showInput && (
                  <div>
                  <div className="text-alert-yellow-100 flex items-baseline gap-1">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 5l9 14H3z" />
                  </svg>
                  <span className="text-s1 text-alert-yellow-100 font-semibold">
                    {formatCurrency(sumatoria)}
                  </span>
                </div>
                <p className="text-d3 text-gray-90 -mt-1 font-medium">
                  Sumatoria
                </p>
                </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative shrink-0" aria-label="Porcentaje disponible">
            <Donut
              percentage={percentClamped}
              size={140}
              thickness={30}
              innerRadius={40}
              showLabel
              sizeLabel="text-s1"
              colorLabel="text-green-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
