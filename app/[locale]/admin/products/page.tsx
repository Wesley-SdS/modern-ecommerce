"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/admin/products-table"

export default function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = useTranslations("admin.products")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("list")}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/products/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t("create")}
          </Link>
        </Button>
      </div>

      <ProductsTable />
    </div>
  )
}
