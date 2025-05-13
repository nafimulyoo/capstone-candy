import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Astra Digital - Solusi Digital Terpercaya",
  description:
    "Astra Digital adalah perusahaan layanan digital yang dirintis oleh Grup Astra. Kami ada untuk memberikan ide dan solusi dalam membangun visi, atau tujuan bisnis bagi para entrepreneur maupun perusahaan yang bergerak dalam era digital.",
    generator: 'v0.dev',
    // favicon: '/favicon.ico',
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
