import React, { Children, ReactNode } from "react";
import clsx from "clsx";

import { Button } from "../Button/Button";
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection";
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";
type FormsLayoutProps = {
  title: string;
  /** Texto del boton primario (derecha) */
  primaryLabel: string;
  /** Accion del boton primario */
  onPrimaryClick?: () => void;
  /** Deshabilita el boton primario */
  primaryDisabled?: boolean;

  startCollaps?: boolean;
  /** Muestra el boton secundario (izquierda) */
  showSecondaryButton?: boolean;
  /** Texto del boton secundario */
  secondaryLabel?: string;
  /** Accion del boton secundario (p.ej. Cancelar) */
  onSecondaryClick?: () => void;
  /** Deshabilita el boton secundario */
  secondaryDisabled?: boolean;
  showPrimaryButton?: boolean;
  /** Data-tour para boton primario */
  primaryButtonDataTour?: string;
  /** Data-tour para boton secundario */
  secondaryButtonDataTour?: string;
  children: ReactNode;
  enableCollapse?: boolean;
  showDivider?: boolean;
  showBackground?: boolean;
  cardClassName?: string;
};

/**
 * Contenedor de formularios que muestra cabecera con acciones y envuelve cada children
 * en tarjetas independientes. Ideal para composiciones donde se apilan secciones (steps,
 * formularios parciales, botones externos, etc.) conservando la misma estructura visual.
 */
const FormsLayout = ({
  title,
  showPrimaryButton = true,
  primaryLabel,
  onPrimaryClick,
  primaryDisabled = false,
  showSecondaryButton = false,
  secondaryLabel = "Cancelar",
  onSecondaryClick,
  secondaryDisabled = false,
  startCollaps = false,
  enableCollapse = true,
  showDivider = true,
  showBackground = true,
  cardClassName,
  primaryButtonDataTour,
  secondaryButtonDataTour,
  children,
}: FormsLayoutProps) => {
  const isMobile = useIsMobile();
  const childArray = Children.toArray(children).filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection
        title={title}
        enableCollapse={enableCollapse}
        showDivider={showDivider}
        defaultOpen={!startCollaps}
        rightContent={
          <div
            className={clsx(
              "flex",
              isMobile
                ? "w-full flex-col gap-2"
                : "flex-row items-center gap-3",
            )}
          >
            {showSecondaryButton && (
              <Button
                variant="outline"
                hideIcon
                onClick={onSecondaryClick}
                disabled={secondaryDisabled}
                className={clsx(isMobile && "w-full")}
                data-tour={secondaryButtonDataTour}
              >
                {secondaryLabel}
              </Button>
            )}
            {showPrimaryButton && (
              <Button
                hideIcon
                onClick={onPrimaryClick}
                disabled={primaryDisabled}
                className={clsx(isMobile && "mt-5 w-full")}
                data-tour={primaryButtonDataTour}
              >
                {primaryLabel}
              </Button>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          {childArray.map((child, index) => {
            const key = (child as any)?.key ?? index;
            return (
              <div
                key={key}
                className={clsx(
                  "flex gap-6 rounded-lg p-6",
                  showBackground && "bg-white-100 shadow-md",
                  cardClassName
                )}
              >
                {child}
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default FormsLayout;
