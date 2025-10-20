"use client"

import { useTranslations } from "next-intl"
import { BannersTable } from "@/components/admin/banners-table"
import { CreateBannerDialog } from "@/components/admin/create-banner-dialog"
import { useState } from "react"

export default function BannersPage() {
  const t = useTranslations("admin.banners")
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("manage")}</p>
        </div>
        <CreateBannerDialog onSuccess={() => setRefreshKey((k) => k + 1)} />
      </div>

      <BannersTable key={refreshKey} />
    </div>
  )
}
