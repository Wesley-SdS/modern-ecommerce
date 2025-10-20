"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard")

  const stats = [
    {
      title: t("totalSales"),
      value: "R$ 45.231,89",
      icon: DollarSign,
      trend: "+20.1%",
    },
    {
      title: t("totalOrders"),
      value: "234",
      icon: ShoppingCart,
      trend: "+12.5%",
    },
    {
      title: t("lowStock"),
      value: "12",
      icon: AlertTriangle,
      trend: "-5.2%",
    },
    {
      title: t("pendingPayments"),
      value: "R$ 8.432,00",
      icon: Package,
      trend: "+8.3%",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("overview")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend} from last month</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
