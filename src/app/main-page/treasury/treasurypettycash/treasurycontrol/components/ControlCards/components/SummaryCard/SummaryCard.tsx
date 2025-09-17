import React from "react";

import Ellipse from "@/assets/icons/acciones/Ellipse.svg"
import VectorUp from "@/assets/icons/acciones/VectorUp.svg"
import VectorDown from "@/assets/icons/acciones/VectorDown.svg"

export type SummaryCardProps = {
  title: string;
  subtitle?: string;
  amount: string | number;
  currency?: string;
  statusLabel?: string;
  SvgIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  SvgSecondIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  trend?: "up" | "down" | "dot";
  /** Paleta principal del monto/íconos */
  accent?: "green" | "red" | "sky" | "yellow" | "blue";
  /** Opacidad/tinte de fondo para el decorativo */
  tintClassName?: string;
  /** Dígitos decimales del monto, por ej. 2 => 250.00 */
  amountDigits?: number;
  className?: string;
};

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const TrendIcon = ({ type }: { type: "up" | "down" | "dot" }) => {
  if (type === "up") {
    return <VectorUp />;
  }
  if (type === "down") {
    return <VectorDown />;
  }
  return <Ellipse />;
};

const PALETTE: Record<
  NonNullable<SummaryCardProps["accent"]>,
  { text: string; deco: string }
> = {
  green: { text: "text-alert-green-100", deco: "text-emerald-300/25" },
  red: { text: "text-alert-red-100", deco: "text-rose-300/25" },
  sky: { text: "text-sky-600", deco: "text-sky-300/25" },
  yellow: { text: "text-alert-yellow-100", deco: "text-yellow-100/25" },
  blue: { text: "text-blue-600", deco: "text-blue-300/25" },
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  subtitle,
  amount,
  currency = "$",
  statusLabel,
  SvgIcon,
  SvgSecondIcon,
  trend = "dot",
  accent = "green",
  amountDigits = 0,
  className,
}) => {
  const palette = PALETTE[accent] ?? PALETTE.green;

  const amountNum =
    typeof amount === "number"
      ? amount
      : Number(String(amount).replace(/[^0-9.-]/g, "")) || 0;

  const amountStr =
    typeof amount === "number" || !String(amount).startsWith("$")
      ? `${currency}${amountNum.toLocaleString("es-MX", {
          minimumFractionDigits: amountDigits,
          maximumFractionDigits: amountDigits,
        })}`
      : String(amount);

  return (
    <article
      className={cx(
        "relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow",
        "h-[110px] w-[380px] mb-2 ml-4",
        className
      )}
      role="region"
      aria-label={title}
    >
      {/* decorativo grande */}
      {SvgIcon && (
        <div
          className={cx(
            "pointer-events-none absolute -right-8 -bottom-0 rotate-0 flex",
            palette.deco
          )}
          aria-hidden="true"
        >
          <div>
            <SvgIcon className="h-[95px] w-[100px] opacity-60" />
          </div>
        </div>
      )}
      {SvgSecondIcon && (
        <div
          className={cx(
            "pointer-events-none absolute -right-0 -bottom-10 rotate-[-15deg] flex",
            palette.deco
          )}
          aria-hidden="true"
        >
          <div>
            <SvgSecondIcon className="h-[110px] w-[100px] opacity-60" />
          </div>
        </div>
      )}
      {/** Cards **/}
      <div className="p-6">
        <header className="mb-3">
          <h3 className="text-b2 font-medium text-green-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-d3 font-medium text-gray-90">{subtitle}</p>
          )}
        </header>

        <div className="mt-2 flex items-center gap-2">
          <span className={cx("flex items-center", palette.text)}>
            <TrendIcon type={trend} />
          </span>
          <p
            className={cx(
              "text-s1 font-semibold",
              palette.text
            )}
          >
            {amountStr}
          </p>
        </div>

        {statusLabel && (
          <p className="mt-4 text-sm font-medium text-slate-500">
            {statusLabel}
          </p>
        )}
      </div>
    </article>
  );
};
