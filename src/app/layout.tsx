import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

import GeneralErrorBundary from './components/GeneralErrorBundary/GeneralErrorBundary'
import IntranetGatewayInit from './components/IntranetGatewayInit/IntranetGatewatInit'
import ServiceWorkerRegister from './components/ServiceWorkerRegister/ServiceWorkerRegister'
import { AuthProvider } from './context/AuthContext/AuthContext'
import { FirebaseProvider } from './context/FirebaseContext/FirebaseContext'
import { PrincipalProvider } from './context/PrincipalContext/PrincipalContext'
import ThemeInitializer from './context/PrincipalContext/utilities/ThemeInitializer'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

const nulshock = localFont({
  src: [{ path: '../assets/fonts/Nulshock-Regular.ttf', weight: '600', style: 'normal' }],
  variable: '--font-nulshock',
})

/** iOS + PWA via Metadata API */
export const metadata: Metadata = {
  title: 'Intranet DR',
  description: 'Esta es la intranet de DR',
  manifest: '/manifest.webmanifest',
  icons: {
    // Usa solo lo que SÍ tienes en /public/icons
    icon: [
      { url: '/icons/manifest-icon-192.maskable.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/manifest-icon-512.maskable.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Intranet DR',
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: { telephone: false, date: false, address: false, email: false, url: false },
}

/** Viewport para notch */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-640-1136.jpg"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-750-1334.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-828-1792.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1170-2532.jpg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1179-2556.jpg"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1242-2688.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1284-2778.jpg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/splash/apple-splash-1290-2796.jpg"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/*
          Si también tienes landscape, duplica las líneas cambiando a (orientation: landscape)
          y usando el archivo correspondiente (dimensiones invertidas).
        */}
      </head>
      <body className={`${montserrat.variable} ${nulshock.variable} h-screen overflow-hidden`}>
        <GeneralErrorBundary>
          <PrincipalProvider>
            <AuthProvider>
              <FirebaseProvider>
                <ThemeInitializer />
                <ServiceWorkerRegister />
                <IntranetGatewayInit />

                {children}

              </FirebaseProvider>
            </AuthProvider>
          </PrincipalProvider>
        </GeneralErrorBundary>
      </body>
    </html>
  )
}
