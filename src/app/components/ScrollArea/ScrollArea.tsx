'use client'

import clsx from 'clsx'
import * as React from 'react'

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Altura del contenedor. Por defecto ocupa todo el alto disponible.
   * Ej: 'h-[400px]', 'h-dvh', 'max-h-[60vh]'.
   */
  heightClassName?: string
}

/**
 * ScrollArea – contenedor con scroll vertical “iOS-friendly”
 * - momentum scroll en iOS
 * - sin bounce / pull-to-refresh
 * - respeta safe areas (notch)
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, heightClassName, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        // alto por defecto: ocupa el espacio disponible
        heightClassName ?? 'h-full',
        // scroll vertical
        'overflow-y-auto',
        // evita “bounce” y pull-to-refresh
        'overscroll-none',
        // momentum scroll en iOS
        '[-webkit-overflow-scrolling:touch]',
        // safe areas iOS
        'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
        className
      )}
      {...props}
    />
  )
)

ScrollArea.displayName = 'ScrollArea'
