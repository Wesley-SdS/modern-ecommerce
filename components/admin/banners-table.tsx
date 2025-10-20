"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Power } from "lucide-react"
import { toast } from "sonner"

interface Banner {
  id: string
  imageUrl: string
  targetUrl?: string
  position: number
  active: boolean
}

export function BannersTable() {
  const t = useTranslations("common")
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    try {
      const response = await fetch("/api/v1/admin/banners")
      const data = await response.json()
      if (data.success) {
        setBanners(data.data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(id: string) {
    try {
      const response = await fetch(`/api/v1/admin/banners/${id}/toggle`, {
        method: "POST",
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Banner status updated")
        fetchBanners()
      }
    } catch (error) {
      toast.error("Failed to update banner")
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      const response = await fetch(`/api/v1/admin/banners/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Banner deleted")
        fetchBanners()
      }
    } catch (error) {
      toast.error("Failed to delete banner")
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
            <TableHead>Image</TableHead>
            <TableHead>Target URL</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <Image
                  src={banner.imageUrl || "/placeholder.svg"}
                  alt="Banner"
                  width={96}
                  height={48}
                  className="h-12 w-24 object-cover rounded"
                />
              </TableCell>
              <TableCell>{banner.targetUrl || "-"}</TableCell>
              <TableCell>{banner.position}</TableCell>
              <TableCell>
                <Badge variant={banner.active ? "default" : "secondary"}>{banner.active ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => toggleActive(banner.id)}>
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteBanner(banner.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
