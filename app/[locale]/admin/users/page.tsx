"use client"

import { useTranslations } from "next-intl"
import { UsersTable } from "@/components/admin/users-table"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { useState } from "react"

export default function UsersPage() {
  const t = useTranslations("admin.users")
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("manage")}</p>
        </div>
        <CreateUserDialog onSuccess={() => setRefreshKey((k) => k + 1)} />
      </div>

      <UsersTable key={refreshKey} />
    </div>
  )
}
