import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  sku: string
  slug: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  incrementQuantity: (productId: string) => void
  decrementQuantity: (productId: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getSubtotalPrice: () => number
  getTaxPrice: () => number
  getShippingPrice: () => number
  getItemQuantity: (productId: string) => number
  isInCart: (productId: string) => boolean
}

const TAX_RATE = 0.1
const SHIPPING_THRESHOLD = 10000
const SHIPPING_COST = 1500

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId 
                  ? { ...i, quantity: i.quantity + quantity } 
                  : i,
              ),
            }
          }
          return { 
            items: [...state.items, { 
              ...item, 
              id: `${item.productId}-${Date.now()}`, 
              quantity 
            }] 
          }
        }),
        
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
        
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => 
            i.productId === productId ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter((i) => i.quantity > 0),
        })),
        
      incrementQuantity: (productId) => {
        const state = get()
        const currentItem = state.items.find((i) => i.productId === productId)
        if (currentItem) {
          state.updateQuantity(productId, currentItem.quantity + 1)
        }
      },
      
      decrementQuantity: (productId) => {
        const state = get()
        const currentItem = state.items.find((i) => i.productId === productId)
        if (currentItem && currentItem.quantity > 1) {
          state.updateQuantity(productId, currentItem.quantity - 1)
        } else {
          state.removeItem(productId)
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        const state = get()
        const subtotal = state.getSubtotalPrice()
        const tax = state.getTaxPrice()
        const shipping = state.getShippingPrice()
        return subtotal + tax + shipping
      },
      
      getSubtotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getTaxPrice: () => {
        const state = get()
        const subtotal = state.getSubtotalPrice()
        return Math.round(subtotal * TAX_RATE)
      },
      
      getShippingPrice: () => {
        const state = get()
        const subtotal = state.getSubtotalPrice()
        return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      },
      
      getItemQuantity: (productId) => {
        const state = get()
        const item = state.items.find((i) => i.productId === productId)
        return item ? item.quantity : 0
      },
      
      isInCart: (productId) => {
        const state = get()
        return state.items.some((i) => i.productId === productId)
      },
    }),
    {
      name: "cart-storage",
      version: 1,
    },
  ),
)
