import { renderHook, act } from "@testing-library/react"
import { useCartStore } from "@/store/cart-store"

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it("starts with empty cart", () => {
    const { result } = renderHook(() => useCartStore())
    
    expect(result.current.items).toEqual([])
    expect(result.current.getTotalItems()).toBe(0)
    expect(result.current.getTotalPrice()).toBe(0)
  })

  it("adds item to cart", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    act(() => {
      result.current.addItem(item)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toMatchObject({
      ...item,
      quantity: 1,
    })
    expect(result.current.getTotalItems()).toBe(1)
    expect(result.current.getSubtotalPrice()).toBe(100)
  })

  it("increments quantity when adding existing item", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    act(() => {
      result.current.addItem(item)
      result.current.addItem(item)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]?.quantity).toBe(2)
    expect(result.current.getTotalItems()).toBe(2)
    expect(result.current.getSubtotalPrice()).toBe(200)
  })

  it("removes item from cart", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    act(() => {
      result.current.addItem(item)
      result.current.removeItem("1")
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.getTotalItems()).toBe(0)
  })

  it("updates item quantity", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    act(() => {
      result.current.addItem(item)
      result.current.updateQuantity("1", 5)
    })

    expect(result.current.items[0]?.quantity).toBe(5)
    expect(result.current.getTotalItems()).toBe(5)
  })

  it("removes item when quantity set to 0", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    act(() => {
      result.current.addItem(item)
      result.current.updateQuantity("1", 0)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it("increments and decrements quantity correctly", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    act(() => {
      result.current.addItem(item, 2)
      result.current.incrementQuantity("1")
    })

    expect(result.current.items[0]?.quantity).toBe(3)

    act(() => {
      result.current.decrementQuantity("1")
    })

    expect(result.current.items[0]?.quantity).toBe(2)

    act(() => {
      result.current.decrementQuantity("1")
    })

    expect(result.current.items[0]?.quantity).toBe(1)

    act(() => {
      result.current.decrementQuantity("1")
    })

    expect(result.current.items).toHaveLength(0)
  })

  it("calculates totals correctly", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item1 = {
      productId: "1",
      name: "Test Product 1",
      price: 100,
      imageUrl: "/test1.jpg",
      sku: "TEST-001",
      slug: "test-product-1",
    }

    const item2 = {
      productId: "2",
      name: "Test Product 2",
      price: 50,
      imageUrl: "/test2.jpg",
      sku: "TEST-002",
      slug: "test-product-2",
    }

    act(() => {
      result.current.addItem(item1, 2)
      result.current.addItem(item2, 1)
    })

    expect(result.current.getSubtotalPrice()).toBe(250)
    expect(result.current.getTaxPrice()).toBe(25)
    expect(result.current.getShippingPrice()).toBe(1500)
    expect(result.current.getTotalPrice()).toBe(1775)
  })

  it("provides free shipping when subtotal exceeds threshold", () => {
    const { result } = renderHook(() => useCartStore())
    
    const expensiveItem = {
      productId: "1",
      name: "Expensive Product",
      price: 20000,
      imageUrl: "/expensive.jpg",
      sku: "EXP-001",
      slug: "expensive-product",
    }

    act(() => {
      result.current.addItem(expensiveItem)
    })

    expect(result.current.getSubtotalPrice()).toBe(20000)
    expect(result.current.getShippingPrice()).toBe(0)
  })

  it("checks if item is in cart", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    expect(result.current.isInCart("1")).toBe(false)

    act(() => {
      result.current.addItem(item)
    })

    expect(result.current.isInCart("1")).toBe(true)
    expect(result.current.isInCart("2")).toBe(false)
  })

  it("gets item quantity", () => {
    const { result } = renderHook(() => useCartStore())
    
    const item = {
      productId: "1",
      name: "Test Product",
      price: 100,
      imageUrl: "/test.jpg",
      sku: "TEST-001",
      slug: "test-product",
    }

    expect(result.current.getItemQuantity("1")).toBe(0)

    act(() => {
      result.current.addItem(item, 3)
    })

    expect(result.current.getItemQuantity("1")).toBe(3)
    expect(result.current.getItemQuantity("2")).toBe(0)
  })
})