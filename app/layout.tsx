import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tracker de Mangás e Quadrinhos",
  description: "Acompanhe sua leitura de mangás e quadrinhos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto py-4 px-4">
                <Link href="/" className="text-xl font-bold">
                  Manga Tracker - Kalebe
                </Link>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-4">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                Manga Tracker &copy; {new Date().getFullYear()}
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
