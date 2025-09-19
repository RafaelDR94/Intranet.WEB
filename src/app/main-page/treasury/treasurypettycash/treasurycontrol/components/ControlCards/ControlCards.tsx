"use client";

import React from "react";
import { shallow } from "zustand/shallow";

import Summary from "./components/Summary/Summary";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";

import { useIntranetGatewayStore } from "@/app/stores/system/useIntranetGatewayStore";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";
import SecTicketBlue from "@/assets/svgs/secondTicketB.svg";
import SecTicketGreen from "@/assets/svgs/secondTicketG.svg";
import SecTicketPink from "@/assets/svgs/secondTicketP.svg";
import SecTicketYellow from "@/assets/svgs/secondTicketY.svg";
import TicketBlue from "@/assets/svgs/ticket-blue.svg";
import TicketGreen from "@/assets/svgs/ticket-green.svg";
import TicketPink from "@/assets/svgs/ticket-pink.svg";
import TicketYellow from "@/assets/svgs/ticket-yellow.svg";

type FundTotals = {
  assigned: number;
  verified: number;
  cash: number;
  unverified: number;
  pending: number;
  available: number;
};

const INITIAL_TOTALS: FundTotals = {
  assigned: 0,
  verified: 0,
  cash: 0,
  unverified: 0,
  pending: 0,
  available: 0,
};

const parseYearMonthToDate = (value?: string): Date | undefined => {
  if (!value) return undefined;
  const [year, month] = value.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return undefined;
  const parsed = new Date(year, month - 1, 1);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const ControlCards = () => {
  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);

  const { pettyCashFunds, fetchPettyCashFunds } = useBillingPettyCash(
    (state) => ({
      pettyCashFunds: state.pettyCashFunds,
      fetchPettyCashFunds: state.fetchPettyCashFunds,
    }),
    shallow,
  );

  React.useEffect(() => {
    if (!isGatewayReady) return;
    fetchPettyCashFunds();
  }, [isGatewayReady, fetchPettyCashFunds]);

  const totals = React.useMemo<FundTotals>(() => {
    if (!pettyCashFunds.length) {
      return INITIAL_TOTALS;
    }

    return pettyCashFunds.reduce<FundTotals>(
      (acc, fund) => ({
        assigned: acc.assigned + fund.assigned_amount,
        verified: acc.verified + fund.verified_amount,
        cash: acc.cash + fund.cash_on_hand,
        unverified: acc.unverified + fund.unverified_amount,
        pending: acc.pending + fund.pending_verification,
        available: acc.available + fund.available_amount,
      }),
      INITIAL_TOTALS,
    );
  }, [pettyCashFunds]);

  const latestDate = React.useMemo(() => {
    let latest: Date | undefined;
    pettyCashFunds.forEach((fund) => {
      const parsed = parseYearMonthToDate(fund.year_month);
      if (!parsed) return;
      if (!latest || parsed.getTime() > latest.getTime()) {
        latest = parsed;
      }
    });
    return latest;
  }, [pettyCashFunds]);

  const percent = React.useMemo(() => {
    if (totals.assigned <= 0) return 0;
    return (totals.available / totals.assigned) * 100;
  }, [totals.assigned, totals.available]);

  const assignedSubtitle = React.useMemo(() => {
    if (totals.assigned <= 0) return undefined;
    return `Fijo asignado: ${formatCurrency(totals.assigned)}`;
  }, [totals.assigned]);

  return (
    <div className="flex justify-between">
      <div className="w-[36%] rounded-lg">
        <Summary
          date={latestDate ?? null}
          assigned={totals.assigned}
          available={totals.available}
          percent={percent}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <SummaryCard
            title="Monto comprobado"
            amount={totals.verified}
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
            amount={totals.cash}
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
            amount={totals.unverified}
            statusLabel="No deducibles"
            SvgIcon={TicketBlue}
            SvgSecondIcon={SecTicketBlue}
            trend="down"
            accent="red"
            amountDigits={2}
          />

          <SummaryCard
            title="Pendientes por comprobar"
            amount={totals.pending}
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
