import { ReactNode } from "react"
import { Button } from "../Button/Button"
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection"

type FormsLayoutProps = {
  title: string
  /** Texto del botón primario (derecha) */
  primaryLabel: string
  /** Acción del botón primario */
  onPrimaryClick?: () => void
  /** Deshabilita el botón primario */
  primaryDisabled?: boolean

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

  enableCollapse = true,
  showDivider = true,
  children
}: FormsLayoutProps) => {
  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection
        title={title}
        enableCollapse={enableCollapse}
        showDivider={showDivider}
        rightContent={
          <div className="flex items-center gap-3">
            {showSecondaryButton && (
              <Button
                variant="outline"
                hideIcon
                onClick={onSecondaryClick}
                disabled={secondaryDisabled}
              >
                {secondaryLabel}
              </Button>
            )}
            <Button
              hideIcon
              onClick={onPrimaryClick}
              disabled={primaryDisabled}
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
