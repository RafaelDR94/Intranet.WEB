'use client'
import clsx from 'clsx'
import React from 'react'

import { useAlertComponent } from './hooks/useAlert'
import * as styles from './styles'
import { AlertProps, AlertType } from './types'

import InfoIcon from '@/assets/icons/acciones/info-empty.svg'
import WarningIcon from '@/assets/icons/bussines/high-priority.svg'
import SuccessIcon from '@/assets/icons/organization/star.svg'

/**
 * Componente de **alerta** para mostrar mensajes de retroalimentación.
 *
 * Soporta tipos (`default`, `success`, `info`, `warning`, `error`, `notification`),
 * variantes visuales (`filled`, `subtle`), acciones primarias/secundarias y
 * cierre automático vía `autoCloseMs`.
 *
 * @remarks
 * - El hook `useAlertComponent` maneja el **autocierre** cuando `autoCloseMs` está definido
 *   y dispara `onClose` al terminar.
 * - Este componente es presentacional: usa `<button>` nativos para acciones y
 *   no controla estado externo.
 *
 * @accessibility
 * - Para `warning`/`error` usa `role="alert"` (canal **assertive**).
 * - Para `default`/`info`/`success`/`notification` usa `role="status"` (canal **polite**).
 * - Añade textos de botones claros (`primaryLabel`, `secondaryLabel`) para contexto.
 *
 * @example
 * ```tsx
 * <Alert
 *   type="success"
 *   variant="filled"
 *   title="Guardado"
 *   description="Los cambios se guardaron correctamente."
 *   showPrimaryButton
 *   primaryLabel="Ver detalle"
 *   onPrimaryClick={() => router.push('/detalle')}
 *   autoCloseMs={3000}
 *   onClose={() => console.log('cerrado')}
 * />
 * ```
 */

export const Alert: React.FC<AlertProps> = ({
  type = 'default',
  variant = 'subtle',
  title,
  description,
  showPrimaryButton = true,
  showSecondaryButton = true,
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel = 'Button',
  secondaryLabel = 'Button',
  autoCloseMs,
  onClose,
  closeOnClick,
}) => {
 useAlertComponent({ title, description, type, variant, autoCloseMs, onClose })
  const icons: Record<AlertType, React.ReactNode> = {
    default: <InfoIcon />,
    success: <SuccessIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
    error: <WarningIcon />,
    notification: <>🔔</>,
  }

  const handleRootClick = () => {
    if (closeOnClick) {
      onClose?.()
    }
  }

  return (
    <div
      className={clsx(styles.containerClasses, styles.getBgClasses(type, variant))}
      onClick={handleRootClick}
    >
      <div className={styles.headerClasses}>
        <div className={clsx(styles.iconContainerClasses, styles.getIconClasses(type, variant))}>
          {icons[type]}
        </div>
        <div className={styles.textContainerClasses}>
          <h4 className={styles.getTitleClasses(type, variant)}>{title}</h4>
          <p className={styles.getTextClasses(type, variant)}>{description}</p>
        </div>
      </div>
      <div className={styles.buttonsContainerClasses}>
        {showPrimaryButton && (
          <button onClick={onPrimaryClick} className={styles.getButtonClasses(type, variant)}>
            {primaryLabel}
          </button>
        )}
        {showSecondaryButton && (
          <button onClick={onSecondaryClick} className={styles.getButtonClasses(type, variant, true)}>
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  )
}
