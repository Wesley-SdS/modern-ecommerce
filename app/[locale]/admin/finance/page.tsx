"use client"

import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsReceivableTable } from "@/components/admin/accounts-receivable-table"
import { AccountsPayableTable } from "@/components/admin/accounts-payable-table"
import { CashFlowChart } from "@/components/admin/cash-flow-chart"

export default function FinancePage() {
  const t = useTranslations("admin.finance")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">Manage accounts receivable and payable</p>
      </div>

      <CashFlowChart />

      <Tabs defaultValue="receivable" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receivable">{t("receivable")}</TabsTrigger>
          <TabsTrigger value="payable">{t("payable")}</TabsTrigger>
        </TabsList>
        <TabsContent value="receivable" className="space-y-4">
          <AccountsReceivableTable />
        </TabsContent>
        <TabsContent value="payable" className="space-y-4">
          <AccountsPayableTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
