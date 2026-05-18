import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Marco Fitness",
  description: "Sistema de seguimiento de pérdida de peso",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Marco Fitness" },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full dark`} suppressHydrationWarning>
      <body className="min-h-full bg-zinc-950 text-zinc-50 antialiased" style={{ fontFamily: 'var(--font-geist-sans)' }}>
        {children}
      </body>
    </html>
  )
}
