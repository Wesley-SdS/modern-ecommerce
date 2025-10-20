"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { CreateAccountEntryDialog } from "./create-account-entry-dialog"

interface AccountEntry {
  id: string
  amountCents: number
  dueDate: string
  paidDate?: string
  status: string
  description: string
}

export function AccountsReceivableTable() {
  const t = useTranslations("common")
  const [entries, setEntries] = useState<AccountEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    try {
      const response = await fetch("/api/v1/admin/finance/accounts-receivable")
      const data = await response.json()
      if (data.success) {
        setEntries(data.data.entries)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  async function markAsPaid(id: string) {
    try {
      const response = await fetch(`/api/v1/admin/finance/${id}/mark-paid`, {
        method: "POST",
      })
      const data = await response.json()
      if (data.success) {
        fetchEntries()
      }
    } catch (error) {
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t("loading")}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateAccountEntryDialog type="RECEIVABLE" onSuccess={fetchEntries} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.description}</TableCell>
                <TableCell>{formatCurrency(entry.amountCents / 100, "pt-BR")}</TableCell>
                <TableCell>{format(new Date(entry.dueDate), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <Badge variant={entry.status === "PAID" ? "default" : "secondary"}>{entry.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {entry.status !== "PAID" && (
                    <Button variant="ghost" size="sm" onClick={() => markAsPaid(entry.id)}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
