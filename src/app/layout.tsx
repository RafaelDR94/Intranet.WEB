

import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { PrincipalProvider } from './context/PrincipalContext/PrincipalContext'
import ThemeInitializer from './context/PrincipalContext/utilities/ThemeInitializer'
import ServiceWorkerRegister from './components/ServiceWorkerRegister/ServiceWorkerRegister'
import type { Metadata } from 'next'
import { AuthProvider } from './context/AuthContext/AuthContext'
import { FirebaseProvider } from './context/FirebaseContext/FirebaseContext'
import IntranetGatewayInit from './components/IntranetGatewayInit/IntranetGatewatInit'
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

const nulshock = localFont({
  src: [
    {
      path: '../assets/fonts/Nulshock-Regular.ttf',
      weight: '600',
      style: 'normal',
    },
    // si tienes otros pesos de Nulshock, añádelos aquí
  ],
  variable: '--font-nulshock',
})
export const metadata: Metadata = {
  title: 'Intranet DR',
  description: 'Esta es la intranet de DR',
  manifest: '/manifest.webmanifest',
  icons: [
    { rel: 'icon', url: '/DRUso2.png' },
    { rel: 'apple-touch-icon', url: '/DRUso2.png' },
  ],
}
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${nulshock.variable} h-screen overflow-hidden`}
      >
        <PrincipalProvider>
          <AuthProvider>
            <FirebaseProvider>
              <ThemeInitializer />
              <ServiceWorkerRegister />
               <IntranetGatewayInit />
              {/* Sincroniza el atributo data-theme en <html> */}
              {children}
            </FirebaseProvider>
          </AuthProvider>
        </PrincipalProvider>
      </body>
    </html>
  )
}
