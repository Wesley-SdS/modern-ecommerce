"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface InventoryMovement {
  id: string
  type: string
  quantity: number
  note?: string
  createdAt: string
  product: {
    title: string
    sku: string
  }
}

export function InventoryTable() {
  const t = useTranslations("common")
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovements()
  }, [])

  async function fetchMovements() {
    try {
      const response = await fetch("/api/v1/admin/inventory")
      const data = await response.json()
      if (data.success) {
        setMovements(data.data.movements)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ADD":
        return "default"
      case "REMOVE":
        return "destructive"
      case "SALE":
        return "secondary"
      case "ADJUST":
        return "outline"
      default:
        return "default"
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t("loading")}</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell className="font-medium">{movement.product.title}</TableCell>
              <TableCell>{movement.product.sku}</TableCell>
              <TableCell>
                <Badge variant={getTypeColor(movement.type)}>{movement.type}</Badge>
              </TableCell>
              <TableCell>{movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}</TableCell>
              <TableCell>{movement.note || "-"}</TableCell>
              <TableCell>{format(new Date(movement.createdAt), "dd/MM/yyyy HH:mm")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
