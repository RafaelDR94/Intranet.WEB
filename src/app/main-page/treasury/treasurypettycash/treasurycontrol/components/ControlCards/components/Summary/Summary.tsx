"use client";

import React from "react";
import { shallow } from "zustand/shallow";

import { Button } from "@/app/components/Button/Button";
import Donut from "@/app/components/Donut/Donut";
import { Input } from "@/app/components/Input/Input";
import { useIntranetGatewayStore } from "@/app/stores/system/useIntranetGatewayStore";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

type SummaryProps = {
  title?: string;
  date?: Date | string | null;
  assigned?: number;
  available?: number;
  percent?: number;
  className?: string;
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

/**
 * Tarjeta estilo "Control de Fondo Fijo de Caja Chica".
 */
export default function Summary({
  title = "Control de Fondo Fijo de Caja Chica",
  date = null,
  assigned = 0,
  available = 0,
  percent = 0,
  className = "",
}: SummaryProps) {
  const [isCreating, setIsCreating] = React.useState(false);
  const [assignedInput, setAssignedInput] = React.useState("");
  const [inputError, setInputError] = React.useState<string | null>(null);

  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);

  const { createPettyCashFund, creating, error } = useBillingPettyCash(
    (state) => ({
      createPettyCashFund: state.createPettyCashFund,
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
  }, [isGatewayReady]);

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
  }, [creating]);

  const handleSave = React.useCallback(async () => {
    if (!isCreating || creating) return;

    const parsed = Number.parseFloat(assignedInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setInputError("Ingresa un monto mayor a 0");
      return;
    }

    const normalized = Math.round(parsed * 100) / 100;

    const result = await createPettyCashFund({
      year_month: yearMonth,
      assigned_amount: normalized,
      verified_amount: 0,
      cash_on_hand: 0,
      unverified_amount: 0,
      pending_verification: 0,
      available_amount: normalized,
    });

    if (result) {
      setIsCreating(false);
      setAssignedInput("");
      setInputError(null);
    }
  }, [assignedInput, createPettyCashFund, creating, isCreating, yearMonth]);

  const showInput = isCreating;
  const parsedAmount = Number.parseFloat(assignedInput);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const headerDisabled = !isGatewayReady || creating;
  const helperMessage = inputError ?? (showInput ? error : undefined);
  const canSave = showInput && !headerDisabled && isAmountValid;
  const containerHeight = showInput ? "h-[230px]" : "h-[184px]";

  const { currentPagePermissions } = useAuth();
  const canCreate = Boolean(currentPagePermissions?.createfound);

  return (
    <div className={containerHeight}>
      <div className="mb-3 flex items-center justify-between gap-3">
        {canCreate && !showInput && (
          <div className="flex items-center gap-3">
            <p className="text-b4 text-blue-60">Control de Fondo</p>
            <div className="h-[1px] w-[26px] bg-blue-60" />
          </div>
        )}

        <div className="flex items-center gap-2">
          {canCreate && !showInput && (
            <Button
              hideIcon
              variant="outline"
              onClick={handleCreateClick}
              disabled={headerDisabled}
            >
              Crear
            </Button>
          )}

          {showInput && (
            <>
              <Button
                hideIcon
                variant="outline"
                onClick={handleCancel}
                disabled={creating}
              >
                Cancelar
              </Button>

              {canCreate && (
                <Button
                  hideIcon
                  variant="outline"
                  onClick={handleSave}
                  disabled={!canSave || creating}
                >
                  Guardar Ajustes
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className={`flex h-full flex-col rounded-lg bg-white p-2 ${className}`}>
        <h2 className="text-s1 font-semibold text-green-100">{title}</h2>

        <div className="mt-1 flex flex-1 items-start justify-between gap-6">
          <div>
            <p className="mt-3 text-d3 text-gray-90">
              <span className="text-d3 font-medium">Fecha:</span>{" "}
              {formattedDate}
            </p>

            <div className="mt-5 space-y-2">
              <div>
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
                    step="0.01"
                    variant={helperMessage ? "error" : "default"}
                    helperText={helperMessage ?? undefined}
                  />
                ) : (
                  <p className="text-s1 font-semibold text-green-100">
                    {formatCurrency(assigned)}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-1 text-alert-green-100">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 5l9 14H3z" />
                </svg>
                <span className="text-s1 font-semibold text-alert-green-100">
                  {formatCurrency(available)}
                </span>
              </div>
              <p className="-mt-1 text-d3 font-medium text-gray-90">Disponibles</p>
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
