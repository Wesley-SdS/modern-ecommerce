import type React from "react"
import { requireAdmin } from "@/lib/auth-utils"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  await requireAdmin()
  const { locale } = await params

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar locale={locale} />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
