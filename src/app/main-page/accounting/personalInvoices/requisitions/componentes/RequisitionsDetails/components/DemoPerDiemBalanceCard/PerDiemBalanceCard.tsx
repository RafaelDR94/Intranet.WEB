import React from "react";

import { perDiemBalanceCardStyles as s } from "./styles";
import { PerDiemBalanceCardProps } from "./types";

import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery";
import Donut from "@/app/components/Donut/Donut";
import { formatCurrency } from "@/app/utilities/FormatHelpers/FormatHelpets";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

// 🔹 Helpers internos
function diffInDays(start: string, end: string) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return Math.max(
    0,
    Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function computeBalances(requested: number, verified: number) {
  const diff = requested - verified;
  return {
    enterpriseAmount: diff > 0 ? diff : 0, // sobra dinero → a favor empresa
    employeeAmount: diff < 0 ? Math.abs(diff) : 0, // gastó más → a favor colaborador
  };
}

const PerDiemBalanceCard: React.FC<PerDiemBalanceCardProps> = ({
  startDate,
  endDate,
  requestedAmount,
  verifiedAmount,
  enterpriseAmount: enterpriseAmountOverride,
  employeeAmount: employeeAmountOverride,
  bodyClassName,
  donutSize,
  cardClassName,
}) => {
  // 🔹 calcular días
  const totalDays = diffInDays(startDate, endDate) || 1;
  const elapsedDays = Math.min(
    totalDays,
    diffInDays(startDate, new Date().toISOString()),
  );

  // 🔹 calcular porcentajes
  const verifiedPct = Math.round(
    Math.max(0, Math.min(100, (verifiedAmount / requestedAmount) * 100 || 0)),
  );
  const pendingPct = 100 - verifiedPct;

  // 🔹 calcular saldos
  const computed = computeBalances(requestedAmount, verifiedAmount);
  const enterpriseAmount =
    typeof enterpriseAmountOverride === "number"
      ? enterpriseAmountOverride
      : computed.enterpriseAmount;
  const employeeAmount =
    typeof employeeAmountOverride === "number"
      ? employeeAmountOverride
      : computed.employeeAmount;
  const isMobile = useIsMobile();
  const { currentPagePermissions } = useAuth();

  const defaultSize = isMobile ? 150 : 200;
  const isSapProfile = currentPagePermissions?.sapprofile;
  const baseCardClass = isSapProfile ? s.cardSap : s.card;

  return (
    <div className={s.root}>
      <div className={[baseCardClass, cardClassName].filter(Boolean).join(" ")}>
        <div className="col-span-2">
          <h3 className={s.title}>Balance de viáticos</h3>
          <p className={s.period}>
            Periodo {startDate} - {endDate}
          </p>

          <p className={s.amountLine}>
            Importe Solicitado:{" "}
            <span className={s.amountValue}>
              {formatCurrency(requestedAmount)}
            </span>
          </p>
          <p className={s.amountLine}>
            Monto Comprobado:{" "}
            <span className={s.amountValue}>
              {formatCurrency(verifiedAmount)}
            </span>
          </p>
        </div>

        <div className={bodyClassName || s.body}>
          {/* Columna izquierda */}
          <div className={s.leftCol}>
            <div className={s.dayCounter}>
              <span>{elapsedDays}</span>
              <span className={s.dayCounterSub}>día de {totalDays}</span>
            </div>

            <div className={s.legendRow}>
              <span className={s.legendTriangle} />
              <div className="leading-5">
                <div className={s.legendPctGreen}>{verifiedPct}%</div>
                <div className={s.legendText}>Comprobado</div>
              </div>
            </div>

            <div className={s.legendRow}>
              <span
                className={s.legendDot}
                style={{ backgroundColor: "#FFBB00" }}
              />
              <div className="leading-5">
                <div className={s.legendPctYellow}>{pendingPct}%</div>
                <div className={s.legendText}>Pendiente</div>
              </div>
            </div>
          </div>

          {/* Donut */}
          <div className={s.donutWrap}>
            <Donut
              percentage={verifiedPct}
              size={donutSize || defaultSize}
              thickness={isMobile ? 20 : 30}
              innerRadius={isMobile ? 70 : 40}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={s.footer}>
          <p>
            Monto a favor de la empresa:{" "}
            <span className={s.footerValue}>
              {formatCurrency(enterpriseAmount)}
            </span>
          </p>
          <p>
            Monto a favor del colaborador:{" "}
            <span className={s.footerValue}>
              {formatCurrency(employeeAmount)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerDiemBalanceCard;
