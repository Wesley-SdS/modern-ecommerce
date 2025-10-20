"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Generic API fetch function
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Products API hooks
export function useProducts(params?: {
  search?: string
  category?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (params?.search) queryParams.set("search", params.search)
  if (params?.category) queryParams.set("category", params.category)
  if (params?.page) queryParams.set("page", params.page.toString())
  if (params?.limit) queryParams.set("limit", params.limit.toString())

  return useQuery({
    queryKey: ["products", params],
    queryFn: () => apiFetch(`/v1/products?${queryParams.toString()}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => apiFetch(`/v1/products/${id}`),
    enabled: !!id,
  })
}

// Cart API hooks
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      productId: string
      quantity: number
    }) => apiFetch("/v1/cart/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast.success("Product added to cart")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Admin API hooks
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => apiFetch("/v1/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiFetch(`/v1/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product", id] })
      toast.success("Product updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiFetch(`/v1/admin/products/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Banners API hooks
export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => apiFetch("/v1/banners"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Financial API hooks
export function useAccountEntries(type?: "RECEIVABLE" | "PAYABLE") {
  return useQuery({
    queryKey: ["account-entries", type],
    queryFn: () => {
      const endpoint = type
        ? `/v1/admin/finance/accounts-${type.toLowerCase()}`
        : "/v1/admin/finance/accounts"
      return apiFetch(endpoint)
    },
  })
}

export function useMarkAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiFetch(`/v1/admin/finance/${id}/mark-paid`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-entries"] })
      toast.success("Marked as paid successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

// Dashboard/Analytics hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => apiFetch("/v1/admin/dashboard/stats"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Generic hooks for reusability
export function useApiQuery<T>(
  key: string[],
  endpoint: string,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: key,
    queryFn: () => apiFetch<T>(endpoint),
    enabled: options?.enabled,
    staleTime: options?.staleTime || 5 * 60 * 1000,
  })
}

export function useApiMutation<T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    invalidateQueries?: string[][]
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data?: any) => apiFetch<T>(endpoint, {
      method,
      body: data ? JSON.stringify(data) : undefined,
    }),
    onSuccess: (data) => {
      options?.invalidateQueries?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}