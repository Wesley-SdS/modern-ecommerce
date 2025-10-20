"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Product, ProductFilters, PaginationResult } from "@/types/product"

const API_BASE = "/api/v1"

async function fetchProducts(filters?: ProductFilters): Promise<PaginationResult<Product>> {
  const params = new URLSearchParams()
  
  if (filters?.search) params.append("search", filters.search)
  if (filters?.category) params.append("category", filters.category)
  if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString())
  if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
  if (filters?.rating) params.append("rating", filters.rating.toString())
  if (filters?.inStock) params.append("inStock", "true")
  if (filters?.sortBy) params.append("sortBy", filters.sortBy)
  if (filters?.page) params.append("page", filters.page.toString())
  if (filters?.limit) params.append("limit", filters.limit.toString())

  const response = await fetch(`${API_BASE}/products?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }
  
  return response.json()
}

async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }
  return response.json()
}

async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const response = await fetch(`${API_BASE}/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to create product")
  }
  return response.json()
}

async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update product")
  }
  return response.json()
}

async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete product")
  }
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 30 * 1000,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}