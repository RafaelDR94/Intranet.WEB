import React, { Children, ReactNode } from "react";
import clsx from "clsx";

import { Button } from "../Button/Button"
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection"
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";
type FormsLayoutProps = {
  title: string
  /** Texto del boton primario (derecha) */
  primaryLabel: string
  /** Accion del boton primario */
  onPrimaryClick?: () => void
  /** Deshabilita el boton primario */
  primaryDisabled?: boolean
  
  startCollaps?:boolean
  /** Muestra el boton secundario (izquierda) */
  showSecondaryButton?: boolean
  /** Texto del boton secundario */
  secondaryLabel?: string
  /** Accion del boton secundario (p.ej. Cancelar) */
  onSecondaryClick?: () => void
  /** Deshabilita el boton secundario */
  secondaryDisabled?: boolean

  children: ReactNode
  enableCollapse?: boolean
  showDivider?: boolean
}

/**
 * Contenedor de formularios que muestra cabecera con acciones y envuelve cada children
 * en tarjetas independientes. Ideal para composiciones donde se apilan secciones (steps,
 * formularios parciales, botones externos, etc.) conservando la misma estructura visual.
 */
const FormsLayout = ({
  title,
  primaryLabel,
  onPrimaryClick,
  primaryDisabled = false,
  showSecondaryButton = false,
  secondaryLabel = "Cancelar",
  onSecondaryClick,
  secondaryDisabled = false,
  startCollaps=false,
  enableCollapse = true,
  showDivider = true,
  children
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
              isMobile ? "flex-col w-full gap-2" : "flex-row items-center gap-3"
            )}
          >
            {showSecondaryButton && (
              <Button
                variant="outline"
                hideIcon
                onClick={onSecondaryClick}
                disabled={secondaryDisabled}
                className={clsx(isMobile && "w-full")}
              >
                {secondaryLabel}
              </Button>
            )}
            <Button
              hideIcon
              onClick={onPrimaryClick}
              disabled={primaryDisabled}
              className={clsx(isMobile && "w-full mt-5")}
            >
              {primaryLabel}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          {childArray.map((child, index) => {
            const key = (child as any)?.key ?? index;
            return (
              <div key={key} className="flex bg-white-100 p-6 rounded-lg shadow-md gap-6">
                {child}
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default FormsLayout
