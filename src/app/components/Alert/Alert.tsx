'use client'
import React from 'react'
import clsx from 'clsx'
import { AlertProps, AlertType } from './types'
import * as styles from './styles'
import InfoIcon from '@/assets/icons/acciones/info-empty.svg'
import SuccessIcon from '@/assets/icons/organization/star.svg'
import WarningIcon from '@/assets/icons/bussines/high-priority.svg'

/**
 * Componente de alerta para mostrar mensajes de retroalimentación.
 *
 * @param type Tipo de alerta (`default`, `success`, `info`, `warning`, `error`,`notification`)
 * @param variant Variante de estilo (`filled` o `subtle`)
 * @param title Título de la alerta
 * @param description Descripción opcional
 * @param showPrimaryButton Mostrar botón principal
 * @param showSecondaryButton Mostrar botón secundario
 * @param onPrimaryClick Callback al hacer clic en el botón primario
 * @param onSecondaryClick Callback al hacer clic en el botón secundario
 * @param primaryLabel Etiqueta del botón primario
 * @param secondaryLabel Etiqueta del botón secundario
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
}) => {
  const icons: Record<AlertType, React.ReactNode> = {
    default: <InfoIcon />,
    success: <SuccessIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
    error: <WarningIcon />,
    notification: <>🔔</>,
  }
  return (
    <div className={clsx(styles.containerClasses, styles.getBgClasses(type, variant))}>
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
