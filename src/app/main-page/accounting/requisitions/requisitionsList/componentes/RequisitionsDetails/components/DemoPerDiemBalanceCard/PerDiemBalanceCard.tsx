import React from "react";
import { PerDiemBalanceCardProps } from "./types";
import { formatCurrency } from "@/app/utilities/FormatHelpers/FormatHelpets";
import Donut from "@/app/components/Donut/Donut";
import { perDiemBalanceCardStyles as s } from "./styles";

const PerDiemBalanceCard: React.FC<PerDiemBalanceCardProps> = ({
  startDate,
  endDate,
  requestedAmount,
  verifiedAmount,
  elapsedDays,
  totalDays,
  percentage,
  enterpriseAmount,
  employeeAmount
}) => {
  const verifiedPct = Math.round(Math.max(0, Math.min(100, percentage)));
  const pendingPct = 100 - verifiedPct;

  return (
    <div className={s.root}>
      <div className={s.card}>
        <div className="col-span-2">
          <h3 className={s.title}>Balance de viáticos</h3>
          <p className={s.period}>Periodo {startDate} - {endDate}</p>

          <p className={s.amountLine}>
            Importe Solicitado: <span className={s.amountValue}>{formatCurrency(requestedAmount)}</span>
          </p>
          <p className={s.amountLine}>
            Monto Comprobado: <span className={s.amountValue}>{formatCurrency(verifiedAmount)}</span>
          </p>
        </div>

        <div className={s.body}>
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
              <span className={s.legendDot} style={{ backgroundColor: "#FFBB00" }} />
              <div className="leading-5">
                <div className={s.legendPctYellow}>{pendingPct}%</div>
                <div className={s.legendText}>Pendiente</div>
              </div>
            </div>
          </div>

          {/* Donut */}
          <div className={s.donutWrap}>
            <Donut percentage={verifiedPct} />
          </div>
        </div>

        {/* Footer */}
        <div className={s.footer}>
          <p>
            Monto a favor de la empresa : <span className={s.footerValue}>{formatCurrency(enterpriseAmount)}</span>
          </p>
          <p>
            Monto a favor del colaborador: <span className={s.footerValue}>{formatCurrency(employeeAmount)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerDiemBalanceCard;
