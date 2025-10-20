"use client"

import { useTranslations } from "next-intl"
import { InventoryTable } from "@/components/admin/inventory-table"
import { AdjustStockDialog } from "@/components/admin/adjust-stock-dialog"

export default function InventoryPage() {
  const t = useTranslations("admin.inventory")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("movements")}</p>
        </div>
        <AdjustStockDialog />
      </div>

      <InventoryTable />
    </div>
  )
}
