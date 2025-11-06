"use client";

import React from "react";
import { shallow } from "zustand/shallow";

import Summary from "./components/Summary/Summary";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";
import CollapsibleSection from "./components/CollapsibleSection/CollapsibleSection";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import type { PettyCashFundData } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
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
import { useBreakpoint } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";

// utilidades
const parseDateString = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseYearMonthToDate = (value?: string): Date | null => {
  if (!value) return null;
  const [year, month] = value.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
  const parsed = new Date(year, month - 1, 1);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getFundDate = (fund?: PettyCashFundData | null): Date | null => {
  if (!fund) return null;
  return parseDateString(fund.date_created) ?? parseYearMonthToDate(fund.year_month);
};

const getMostRecentFund = (funds: PettyCashFundData[]): PettyCashFundData | null => {
  if (!Array.isArray(funds) || funds.length === 0) return null;

  const sorted = [...funds].sort((a, b) => {
    const dateA = getFundDate(a)?.getTime() ?? 0;
    const dateB = getFundDate(b)?.getTime() ?? 0;
    return dateB - dateA;
  });

  return sorted[0] ?? null;
};

const ControlCards = () => {
  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);
  const { isMobile, isTablet } = useBreakpoint();
  const {
    pettyCashFunds,
    fetchPettyCashFunds,
    fetchPettyCashVouchers,
    updateCashOnHand,
  } = useBillingPettyCash(
    (state) => ({
      pettyCashFunds: state.pettyCashFunds,
      pettyCashFund: state.pettyCashFund,
      pettyCashVouchers: state.pettyCashVouchers,
      fetchPettyCashFunds: state.fetchPettyCashFunds,
      fetchPettyCashVouchers: state.fetchPettyCashVouchers,
      updateCashOnHand: state.updateCashOnHand,
    }),
    shallow,
  );

  React.useEffect(() => {
    if (isGatewayReady) fetchPettyCashFunds();
  }, [isGatewayReady, fetchPettyCashFunds]);

  React.useEffect(() => {
    if (isGatewayReady) fetchPettyCashVouchers();
  }, [isGatewayReady, fetchPettyCashVouchers]);

  const mostRecentFund = React.useMemo(
    () => getMostRecentFund(pettyCashFunds),
    [pettyCashFunds]
  );

  const assignedAmount = mostRecentFund?.assigned_amount ?? 0;
  const availableAmount = mostRecentFund?.available_amount ?? 0;
  const verifiedAmount = mostRecentFund?.verified_amount ?? 0;
  const cashAmount = mostRecentFund?.cash_on_hand ?? 0;
  const unverifiedAmount = mostRecentFund?.unverified_amount ?? 0;
  const pendingAmount = mostRecentFund?.pending_verification ?? 0;
  const mostRecentFundId = mostRecentFund?.id;

  const summaryDate = React.useMemo(() => getFundDate(mostRecentFund), [mostRecentFund]);

  const percent = React.useMemo(() => {
    if (assignedAmount <= 0) return 0;
    return (availableAmount / assignedAmount) * 100;
  }, [assignedAmount, availableAmount]);

  const assignedSubtitle = `Fijo asignado: 625.00`;
  const totalVoucherP = ` vales Rosas`;
  const totalVoucherB = ` vales Azules`;
  const totalVouchersPending = ` vales Pendientes`;

  const { currentPagePermissions } = useAuth();

  const handleCashOnHandSubmit = React.useCallback(
    async (nuevoValor: number) => {
      if (!mostRecentFundId) return;

      const success = await updateCashOnHand({
        id_petty_cash_found: mostRecentFundId,
        cash_on_hand: nuevoValor,
      });

      if (success) {
        await fetchPettyCashFunds(true);
      }
    },
    [fetchPettyCashFunds, mostRecentFundId, updateCashOnHand]
  );

  return (
    <CollapsibleSection
      title="Control de Fondo"
      storageKey="pettycash-collapsible"
      defaultOpen={true}
      className="mb-4"
    >
      <div className={`flex justify-between ${isMobile || isTablet ? "flex-col" : ""}`}>
        <div className={`w-[36%] h-[250px] ${isMobile || isTablet ? "w-full mb-2" : ""}`}>
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
              subtitle={totalVoucherP}
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
              statusLabel=""
              SvgIcon={TicketGreen}
              SvgSecondIcon={SecTicketGreen}
              trend="down"
              accent="green"
              amountDigits={2}
              editable={currentPagePermissions?.editMoney}
              onEditSubmit={handleCashOnHandSubmit}
            />
          </div>

          <div className="flex">
            <SummaryCard
              title="Monto no comprobado"
              subtitle={totalVoucherB}
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
              subtitle={totalVouchersPending}
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
    </CollapsibleSection>
  );
};

export default ControlCards;
