
import { ReactNode, Suspense } from 'react';

import MainLayoutClient from './components/MainLayoutClient/MainLayoutClient';

/**
 * Componente de layout principal de la aplicación (lado servidor).
 *
 * @remarks
 * Este componente actúa como wrapper para delegar al `MainLayoutClient`,
 * permitiendo prerenderizado en el servidor y mejor rendimiento.
 *
 * @param children - Contenido de la página a renderizar dentro del layout
 * @returns Componente cliente `MainLayoutClient` con la UI completa
 */

export default function MainLayout({ children }: { readonly children: ReactNode }) {
  return (
    <Suspense>
      <MainLayoutClient>{children}</MainLayoutClient>
    </Suspense>
  );
}
