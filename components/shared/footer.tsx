"use client"

import { Logo } from "./logo"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("shop.title")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  {t("shop.allProducts")}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  {t("shop.categories")}
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground hover:text-foreground">
                  {t("shop.deals")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("support.title")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  {t("support.contact")}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  {t("support.shipping")}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                  {t("support.returns")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">{t("company.title")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  {t("company.about")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t("company.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {t("company.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  )
}