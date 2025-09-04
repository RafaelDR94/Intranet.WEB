import { ReactNode } from "react"
import { Button } from "../Button/Button"
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection"
import clsx from "clsx";
import { useIsMobile } from "../DataTable/components/DataTableLayout/hooks/useMediaQuery";
type FormsLayoutProps = {
  title: string
  /** Texto del botón primario (derecha) */
  primaryLabel: string
  /** Acción del botón primario */
  onPrimaryClick?: () => void
  /** Deshabilita el botón primario */
  primaryDisabled?: boolean
  
  startCollaps?:boolean
  /** Muestra el botón secundario (izquierda) */
  showSecondaryButton?: boolean
  /** Texto del botón secundario */
  secondaryLabel?: string
  /** Acción del botón secundario (p.ej. Cancelar) */
  onSecondaryClick?: () => void
  /** Deshabilita el botón secundario */
  secondaryDisabled?: boolean

  children: ReactNode
  enableCollapse?: boolean
  showDivider?: boolean
}

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
              className={clsx(isMobile && "w-full")}
            >
              {primaryLabel}
            </Button>
          </div>
        }
      >
        <div className="flex bg-white-100 p-6 rounded-lg shadow-md gap-6">
          {children}
        </div>
      </CollapsibleSection>
    </div>
  )
}

export default FormsLayout
