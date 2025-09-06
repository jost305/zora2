import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import localFont from "next/font/local"
import { Providers } from "./providers"
import "./globals.css"
import { Suspense } from "react"

const poppinsRounded = localFont({
  src: "../public/fonts/PoppinsRounded-Rounded.ttf",
  variable: "--font-poppins-rounded",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Zora Clone - Content Coin Trading",
  description: "Mint and trade Content Coins with bonding curve mechanics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${poppinsRounded.variable}`}>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  )
}
