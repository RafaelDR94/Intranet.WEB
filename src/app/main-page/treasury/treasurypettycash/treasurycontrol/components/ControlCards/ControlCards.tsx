"use client";

import React from "react";
import { shallow } from "zustand/shallow";

import Summary from "./components/Summary/Summary";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";

import { BillingPettyCashFund } from "@/app/configurations/Axios/urls";
import type { PettyCashFundData } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import { PettyCashFundsMap } from "@/app/mappings/billingPettyCash/billingPettyCash.mapper";
import { useIntranetGatewayStore } from "@/app/stores/system/useIntranetGatewayStore";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";
import { normalizeApiError } from "@/app/utilities/Http/normalizeApiError";
import { pGet } from "@/app/utilities/Http/promisifyIntranet";
import { requireGateway } from "@/app/utilities/Http/requireGateway";
import SecTicketBlue from "@/assets/svgs/secondTicketB.svg";
import SecTicketGreen from "@/assets/svgs/secondTicketG.svg";
import SecTicketPink from "@/assets/svgs/secondTicketP.svg";
import SecTicketYellow from "@/assets/svgs/secondTicketY.svg";
import TicketBlue from "@/assets/svgs/ticket-blue.svg";
import TicketGreen from "@/assets/svgs/ticket-green.svg";
import TicketPink from "@/assets/svgs/ticket-pink.svg";
import TicketYellow from "@/assets/svgs/ticket-yellow.svg";

const parseYearMonthToDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const [year, month] = value.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return undefined;
  const parsed = new Date(year, month - 1, 1);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const formatDateToYearMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const getLatestFund = (funds: PettyCashFundData[]): PettyCashFundData | null => {
  if (!Array.isArray(funds) || funds.length === 0) {
    return null;
  }

  let latest: PettyCashFundData | null = null;
  let latestTime = -Infinity;

  funds.forEach((fund) => {
    const parsed = parseYearMonthToDate(fund.year_month);
    if (!parsed) return;
    const time = parsed.getTime();
    if (time >= latestTime) {
      latestTime = time;
      latest = fund;
    }
  });

  return latest;
};

const buildDateParam = (fund: PettyCashFundData | null): string => {
  const fallback = formatDateToYearMonth(new Date());
  const yearMonth = fund?.year_month?.trim();

  if (!yearMonth) {
    return fallback;
  }

  if (/^\d{4}-\d{2}$/.test(yearMonth)) {
    return yearMonth;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(yearMonth)) {
    return yearMonth.slice(0, 7);
  }

  const parsed = parseYearMonthToDate(yearMonth);
  if (parsed) {
    return formatDateToYearMonth(parsed);
  }

  return fallback;
};

const ControlCards = () => {
  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);

  const { pettyCashFunds, pettyCashFund, fetchPettyCashFunds, fetchPettyCashFundById } =
    useBillingPettyCash(
      (state) => ({
        pettyCashFunds: state.pettyCashFunds,
        pettyCashFund: state.pettyCashFund,
        fetchPettyCashFunds: state.fetchPettyCashFunds,
        fetchPettyCashFundById: state.fetchPettyCashFundById,
      }),
      shallow,
    );

  React.useEffect(() => {
    if (!isGatewayReady) return;
    fetchPettyCashFunds();
  }, [isGatewayReady, fetchPettyCashFunds]);

  const latestFundFromList = React.useMemo(
    () => getLatestFund(pettyCashFunds),
    [pettyCashFunds],
  );

  React.useEffect(() => {
    if (!isGatewayReady) return undefined;

    let cancelled = false;

    const loadLatestFund = async () => {
      try {
        const candidateDate = buildDateParam(latestFundFromList);
        const getFn = requireGateway("get");
        const getReq = pGet(getFn);
        const response = await getReq(
          `${BillingPettyCashFund}ByDate?date=${encodeURIComponent(candidateDate)}`,
        );
        if (cancelled) return;

        const funds = PettyCashFundsMap(response.data?.data ?? []);
        const newestFund = getLatestFund(funds) ?? latestFundFromList;

        if (!newestFund?.id) {
          return;
        }

        await fetchPettyCashFundById(newestFund.id, true);
      } catch (error) {
        const normalized = normalizeApiError(error);
        if (process.env.NODE_ENV !== "production") {
          console.error(
            "No se pudo obtener el fondo de caja chica más reciente:",
            normalized?.message ?? error,
          );
        }
      }
    };

    void loadLatestFund();

    return () => {
      cancelled = true;
    };
  }, [fetchPettyCashFundById, isGatewayReady, latestFundFromList]);

  const activeFund = pettyCashFund ?? latestFundFromList;

  const assignedAmount = activeFund?.assigned_amount ?? 0;
  const availableAmount = activeFund?.available_amount ?? 0;
  const verifiedAmount = activeFund?.verified_amount ?? 0;
  const cashAmount = activeFund?.cash_on_hand ?? 0;
  const unverifiedAmount = activeFund?.unverified_amount ?? 0;
  const pendingAmount = activeFund?.pending_verification ?? 0;

  const summaryDate = React.useMemo(
    () => parseYearMonthToDate(activeFund?.year_month),
    [activeFund?.year_month],
  );

  const percent = React.useMemo(() => {
    if (assignedAmount <= 0) return 0;
    return (availableAmount / assignedAmount) * 100;
  }, [assignedAmount, availableAmount]);

  const assignedSubtitle = React.useMemo(() => {
    if (assignedAmount <= 0) return undefined;
    return `Fijo asignado: ${formatCurrency(assignedAmount)}`;
  }, [assignedAmount]);

  return (
    <div className="flex justify-between">
      <div className="w-[36%] rounded-lg">
        <Summary
          date={summaryDate ?? null}
          assigned={assignedAmount}
          available={availableAmount}
          percent={percent}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <SummaryCard
            title="Monto comprobado"
            amount={verifiedAmount}
            statusLabel="Comprobados"
            SvgIcon={TicketPink}
            SvgSecondIcon={SecTicketPink}
            trend="up"
            accent="green"
            amountDigits={2}
          />

          <SummaryCard
            title="Efectivo"
            subtitle={assignedSubtitle}
            amount={cashAmount}
            statusLabel="Utilizados"
            SvgIcon={TicketGreen}
            SvgSecondIcon={SecTicketGreen}
            trend="down"
            accent="green"
            amountDigits={2}
          />
        </div>
        <div className="flex">
          <SummaryCard
            title="Monto no comprobado"
            amount={unverifiedAmount}
            statusLabel="No deducibles"
            SvgIcon={TicketBlue}
            SvgSecondIcon={SecTicketBlue}
            trend="down"
            accent="red"
            amountDigits={2}
          />

          <SummaryCard
            title="Pendientes por comprobar"
            amount={pendingAmount}
            statusLabel="Pendientes"
            SvgIcon={TicketYellow}
            SvgSecondIcon={SecTicketYellow}
            trend="dot"
            accent="yellow"
            amountDigits={2}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlCards;
