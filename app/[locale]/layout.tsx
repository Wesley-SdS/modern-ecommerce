import type { ReactNode } from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Inter } from "next/font/google"
import { QueryProvider } from "@/components/providers/query-provider"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
