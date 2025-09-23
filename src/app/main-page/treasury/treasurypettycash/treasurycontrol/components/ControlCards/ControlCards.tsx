"use client";

import React from "react";
import { shallow } from "zustand/shallow";

import Summary from "./components/Summary/Summary";
import { SummaryCard } from "./components/SummaryCard/SummaryCard";

import type {
  PettyCashFundData,
  PettyCashVoucherData,
} from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
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
import { useAuth } from "@/app/context/AuthContext/AuthContext";

const parseYearMonthToDate = (value?: string): Date | null => {
  if (!value) return null;
  const [year, month] = value.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
  const parsed = new Date(year, month - 1, 1);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseDateString = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const getFundDate = (fund?: PettyCashFundData | null): Date | null => {
  if (!fund) return null;
  return parseDateString(fund.date_created) ?? parseYearMonthToDate(fund.year_month);
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const getLatestFund = (
  funds: PettyCashFundData[],
): PettyCashFundData | null => {
  if (!Array.isArray(funds) || funds.length === 0) {
    return null;
  }

  let latest: PettyCashFundData | null = null;
  let latestTime = -Infinity;
  let fallback: PettyCashFundData | null = null;

  funds.forEach((fund) => {
    const parsed = getFundDate(fund);
    if (!parsed) {
      if (!fallback) {
        fallback = fund;
      }
      return;
    }
    const time = parsed.getTime();
    if (time >= latestTime) {
      latestTime = time;
      latest = fund;
    }
  });

  return latest ?? fallback;
};

const getLatestFundFromVouchers = (
  vouchers: PettyCashVoucherData[],
): { fundId: string; date: Date } | null => {
  if (!Array.isArray(vouchers) || vouchers.length === 0) {
    return null;
  }

  let latest: { fundId: string; date: Date } | null = null;

  vouchers.forEach((voucher) => {
    const fundId = voucher.petty_cash_funds_id;
    if (!fundId) return;

    const parsed =
      parseDateString(voucher.fund_date_created) ??
      parseDateString(voucher.date_created) ??
      parseDateString(voucher.application_date);
    if (!parsed) return;

    if (!latest || parsed.getTime() >= latest.date.getTime()) {
      latest = { fundId, date: parsed };
    }
  });

  return latest;
};

const ControlCards = () => {
  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady);

  const {
    pettyCashFunds,
    pettyCashFund,
    pettyCashVouchers,
    fetchPettyCashFunds,
    fetchPettyCashVouchers,
  } = useBillingPettyCash(
    (state) => ({
      pettyCashFunds: state.pettyCashFunds,
      pettyCashFund: state.pettyCashFund,
      pettyCashVouchers: state.pettyCashVouchers,
      fetchPettyCashFunds: state.fetchPettyCashFunds,
      fetchPettyCashVouchers: state.fetchPettyCashVouchers,
    }),
    shallow,
  );

  React.useEffect(() => {
    if (!isGatewayReady) return;
    fetchPettyCashFunds();
  }, [isGatewayReady, fetchPettyCashFunds]);

  React.useEffect(() => {
    if (!isGatewayReady) return;
    fetchPettyCashVouchers();
  }, [isGatewayReady, fetchPettyCashVouchers]);

  const latestFundFromList = React.useMemo(
    () => getLatestFund(pettyCashFunds),
    [pettyCashFunds],
  );

  const latestVoucherFund = React.useMemo(
    () => getLatestFundFromVouchers(pettyCashVouchers),
    [pettyCashVouchers],
  );

  const fundFromLatestVoucher = React.useMemo(() => {
    const fundId = latestVoucherFund?.fundId;
    if (!fundId) return null;

    if (pettyCashFund?.id === fundId) {
      return pettyCashFund;
    }

    return pettyCashFunds.find((fund) => fund.id === fundId) ?? null;
  }, [latestVoucherFund?.fundId, pettyCashFund, pettyCashFunds]);

  const candidateFunds = React.useMemo(() => {
    const map = new Map<string, PettyCashFundData>();

    [fundFromLatestVoucher, pettyCashFund, latestFundFromList]
      .filter((fund): fund is PettyCashFundData => Boolean(fund))
      .forEach((fund) => {
        map.set(fund.id, fund);
      });

    return Array.from(map.values());
  }, [fundFromLatestVoucher, pettyCashFund, latestFundFromList]);

  const activeFund = React.useMemo(() => {
    if (candidateFunds.length === 0) return null;

    let latest: PettyCashFundData | null = null;
    let latestTime = -Infinity;

    candidateFunds.forEach((fund) => {
      const parsed = getFundDate(fund);
      if (!parsed) {
        if (!latest) {
          latest = fund;
        }
        return;
      }

      const time = parsed.getTime();
      if (time >= latestTime) {
        latestTime = time;
        latest = fund;
      }
    });

    return latest;
  }, [candidateFunds]);

  const assignedAmount = activeFund?.assigned_amount ?? 0;
  const availableAmount = activeFund?.available_amount ?? 0;
  const verifiedAmount = activeFund?.verified_amount ?? 0;
  const cashAmount = activeFund?.cash_on_hand ?? 0;
  const unverifiedAmount = activeFund?.unverified_amount ?? 0;
  const pendingAmount = activeFund?.pending_verification ?? 0;

  const summaryDate = React.useMemo(
    () => getFundDate(activeFund) ?? latestVoucherFund?.date ?? null,
    [activeFund, latestVoucherFund?.date],
  );

  const percent = React.useMemo(() => {
    if (assignedAmount <= 0) return 0;
    return (availableAmount / assignedAmount) * 100;
  }, [assignedAmount, availableAmount]);

  const assignedSubtitle = React.useMemo(() => {
    if (assignedAmount <= 0) return undefined;
    return `Fijo asignado: ${formatCurrency(assignedAmount)}`;
  }, [assignedAmount]);

  const { currentPagePermissions } = useAuth();

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
            editable={currentPagePermissions?.editMoney} // ← muestra u oculta el lápiz según permiso
            onEditSubmit={(nuevoValor) => {
              // Aquí harás el POST más tarde
              // Por ahora, solo deja un log o integra tu store para refrescar
              console.log("Nuevo efectivo capturado:", nuevoValor);

              // (Opcional) si quieres reflejarlo en UI sin recargar:
              // Si tienes un setter en el store, podrías actualizarlo aquí.
              // updatePettyCashFund({ cash_on_hand: nuevoValor });
            }}
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
