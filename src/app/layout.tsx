// app/layout.tsx
import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from './context/ThemeContext/ThemeContext'
import ThemeInitializer from './context/ThemeContext/ThemeInitializet'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

const nulshock = localFont({
  src: [
    {
      path: '/fonts/Nulshock-Regular.ttf',
      weight: '600',
      style: 'normal',
    },
    // si tienes otros pesos de Nulshock, añádelos aquí
  ],
  variable: '--font-nulshock',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${nulshock.variable}`}>
        <ThemeProvider>
          {/* Sincroniza el atributo data-theme en <html> */}
          <ThemeInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
