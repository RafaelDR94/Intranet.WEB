import React from "react";

import { Button } from "@/app/components/Button/Button";
import { Input } from "@/app/components/Input/Input";
import Ellipse from "@/assets/icons/acciones/Ellipse.svg";
import VectorDown from "@/assets/icons/acciones/VectorDown.svg";
import VectorUp from "@/assets/icons/acciones/VectorUp.svg";

/** Pequeño ícono de lápiz inline para evitar dependencias */
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M14.06 6.19l3.75 3.75" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

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

  /** === NUEVO: edición del monto === */
  editable?: boolean; // controla la visibilidad del lápiz
  onEditSubmit?: (value: number) => void; // callback cuando se guarda
};

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const TrendIcon = ({ type }: { type: "up" | "down" | "dot" }) => {
  if (type === "up") return <VectorUp />;
  if (type === "down") return <VectorDown />;
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
  editable = false,
  onEditSubmit,
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

  /** ---- Estado/handlers de edición ---- */
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>(
    amountNum.toFixed(amountDigits),
  );

  React.useEffect(() => {
    // Si cambia el monto externo, refresca el input cuando NO se está editando
    if (!isEditing) setInputValue(amountNum.toFixed(amountDigits));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountNum]);

  const step = React.useMemo(
    () => (amountDigits > 0 ? Number(`0.${"0".repeat(amountDigits - 1)}1`) : 1),
    [amountDigits],
  );

  const handleSave = () => {
    const parsed = Number(inputValue.replace(/,/g, "."));
    const safe = Number.isFinite(parsed) ? parsed : 0;
    onEditSubmit?.(safe);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(amountNum.toFixed(amountDigits));
    setIsEditing(false);
  };

  return (
    <article
      className={cx(
        "relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow",
        "mb-2 ml-4 h-[120px] w-[380px]",
        className,
      )}
      role="region"
      aria-label={title}
    >
      {/* decorativos */}
      {SvgIcon && (
        <div
          className={cx(
            "pointer-events-none absolute -right-8 -bottom-0 flex rotate-0",
            palette.deco,
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
            "pointer-events-none absolute -right-0 -bottom-10 flex rotate-[-15deg]",
            palette.deco,
          )}
          aria-hidden="true"
        >
          <div>
            <SvgSecondIcon className="h-[110px] w-[100px] opacity-60" />
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-6">
        <header className="mb-3 flex items-center">
          <div>
            <div className="flex">
              <h3 className="text-b2 font-medium text-green-100">{title}</h3>
              {/* LÁPIZ: visible solo con permiso */}
              {editable && !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="ml-2 rounded-md text-blue-600"
                  aria-label="Editar monto"
                  title="Editar monto"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            {subtitle && (
              <p className="text-d3 text-gray-90 font-medium">{subtitle}</p>
            )}
          </div>
        </header>

        {/* Monto / Editor */}
        {!isEditing ? (
          <div className="mt-2 flex items-center gap-2">
            <span className={cx("flex items-center", palette.text)}>
              <TrendIcon type={trend} />
            </span>
            <p className={cx("text-s1 font-semibold", palette.text)}>
              {amountStr}
            </p>
            {statusLabel && (
              <p className="text-d3 text-gray-90 mx-2 font-medium">
                {statusLabel}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-2">
            <span className={cx("flex items-center", palette.text)}>
              <TrendIcon type={trend} />
            </span>

            {/* Campo numérico ocupando el lugar del monto */}
            <div className="flex items-center gap-1">
              <span className={cx("text-s1 font-semibold", palette.text)}>
                {currency}
              </span>
              <Input
                type="number"
                step={step}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            {/* Acciones */}
            <div className="ml-1 flex items-center gap-2">
              <Button
                hideIcon
                variant="outline"
                size="small"
                onClick={handleSave}
              >
                Guardar
              </Button>
              
              <Button
                hideIcon
                variant="outline"
                size="small"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>

            {statusLabel && (
              <p className="text-d3 text-gray-90 mx-2 font-medium">
                {statusLabel}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
