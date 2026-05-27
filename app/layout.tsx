import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Geist_Mono } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Marco Fitness",
  description: "Sistema de seguimiento de pérdida de peso",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Marco Fitness" },
}

export const viewport: Viewport = {
  themeColor: "#0d0b09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full dark`}
      suppressHydrationWarning
      style={{
        backgroundColor: '#0d0b09',
        backgroundImage: `
          radial-gradient(ellipse 140% 80% at 55% -15%,
            rgba(16, 185, 129, 0.28) 0%,
            rgba(16, 185, 129, 0.08) 42%,
            transparent 62%
          ),
          radial-gradient(ellipse 90% 60% at 5% 80%,
            rgba(16, 185, 129, 0.10) 0%,
            transparent 55%
          ),
          radial-gradient(ellipse 80% 55% at 95% 110%,
            rgba(56, 189, 248, 0.12) 0%,
            transparent 58%
          )
        `,
      }}
    >
      <body className="min-h-full text-zinc-50 antialiased font-sans">

        {/* Grain — textura orgánica sutil */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none select-none"
          style={{
            zIndex: -1,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }}
        />

        {children}
      </body>
    </html>
  )
}
