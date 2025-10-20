import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Wishlist } from "@/types/product"

interface WishlistStore {
  items: Wishlist[]
  isLoading: boolean
  
  // Actions
  addToWishlist: (productId: string, product: any) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  setWishlist: (items: Wishlist[]) => void
  
  // Sync actions
  syncWithServer: () => Promise<void>
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addToWishlist: async (productId: string, product: any) => {
        set({ isLoading: true })
        try {
          const existingItem = get().items.find(item => item.productId === productId)
          
          if (existingItem) {
            return
          }

          const newItem: Wishlist = {
            id: `local-${Date.now()}`,
            userId: "local",
            productId,
            product,
            createdAt: new Date(),
          }

          const response = await fetch("/api/v1/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          })

          if (response.ok) {
            const serverItem = await response.json()
            set(state => ({
              items: [...state.items, serverItem],
              isLoading: false,
            }))
          } else {
            // Add locally if server fails (fallback)
            set(state => ({
              items: [...state.items, newItem],
              isLoading: false,
            }))
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to add to wishlist:", error)
          // Add locally on error
          const newItem: Wishlist = {
            id: `local-${Date.now()}`,
            userId: "local", 
            productId,
            product,
            createdAt: new Date(),
          }
          set(state => ({
            items: [...state.items, newItem],
            isLoading: false,
          }))
        }
      },

      removeFromWishlist: async (productId: string) => {
        set({ isLoading: true })
        try {
          const item = get().items.find(item => item.productId === productId)
          
          if (item?.id.startsWith("local-")) {
            // Remove local item
            set(state => ({
              items: state.items.filter(i => i.productId !== productId),
              isLoading: false,
            }))
            return
          }

          const response = await fetch(`/api/v1/wishlist/${productId}`, {
            method: "DELETE",
          })

          if (response.ok) {
            set(state => ({
              items: state.items.filter(i => i.productId !== productId),
              isLoading: false,
            }))
          } else {
            set({ isLoading: false })
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to remove from wishlist:", error)
          // Remove locally on error
          set(state => ({
            items: state.items.filter(i => i.productId !== productId),
            isLoading: false,
          }))
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some(item => item.productId === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      setWishlist: (items: Wishlist[]) => {
        set({ items })
      },

      syncWithServer: async () => {
        try {
          const response = await fetch("/api/v1/wishlist")
          if (response.ok) {
            const serverItems = await response.json()
            set({ items: serverItems })
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Failed to sync wishlist:", error)
        }
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ 
        items: state.items.filter(item => item.id.startsWith("local-"))
      }),
    }
  )
)