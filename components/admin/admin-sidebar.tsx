"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { LayoutDashboard, Package, Warehouse, DollarSign, ImageIcon, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  locale: string
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname()
  const t = useTranslations("admin.nav")

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: t("dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/admin/products`,
      label: t("products"),
      icon: Package,
    },
    {
      href: `/${locale}/admin/inventory`,
      label: t("inventory"),
      icon: Warehouse,
    },
    {
      href: `/${locale}/admin/finance`,
      label: t("finance"),
      icon: DollarSign,
    },
    {
      href: `/${locale}/admin/banners`,
      label: t("banners"),
      icon: ImageIcon,
    },
    {
      href: `/${locale}/admin/users`,
      label: t("users"),
      icon: Users,
    },
    {
      href: `/${locale}/admin/settings`,
      label: t("settings"),
      icon: Settings,
    },
  ]

  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
