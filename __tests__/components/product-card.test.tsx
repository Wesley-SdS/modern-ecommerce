import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ProductCard } from "@/components/shared/product-card"
import { toast } from "sonner"

const mockProduct = {
  id: "1",
  name: "Test Product",
  price: 99.99,
  description: "Test description",
  imageUrl: "/test-image.jpg",
  stock: 10,
  sku: "TEST-001",
  slug: "test-product",
  category: "electronics",
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

jest.mock("@/store/cart-store", () => ({
  useCartStore: () => ({
    addItem: jest.fn(),
    isInCart: jest.fn(() => false),
  }),
}))

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
  },
}))

jest.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}))

describe("ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders product information correctly", () => {
    renderWithQueryClient(<ProductCard product={mockProduct} />)

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
    expect(screen.getByText("electronics")).toBeInTheDocument()
    expect(screen.getByText("€99.99")).toBeInTheDocument()
  })

  it("shows stock badge when stock is low", () => {
    const lowStockProduct = { ...mockProduct, stock: 5 }
    renderWithQueryClient(<ProductCard product={lowStockProduct} />)

    expect(screen.getByText("5 inStock")).toBeInTheDocument()
  })

  it("shows out of stock badge when stock is 0", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    renderWithQueryClient(<ProductCard product={outOfStockProduct} />)

    expect(screen.getByText("outOfStock")).toBeInTheDocument()
    expect(screen.getByText("outOfStock")).toBeDisabled()
  })

  it("disables add to cart button when out of stock", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    renderWithQueryClient(<ProductCard product={outOfStockProduct} />)

    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent("outOfStock")
  })

  it("shows in cart state when product is in cart", () => {
    const { isInCart } = require("@/store/cart-store").useCartStore()
    isInCart.mockReturnValue(true)

    renderWithQueryClient(<ProductCard product={mockProduct} />)

    expect(screen.getByText("inCart")).toBeInTheDocument()
  })

  it("renders product image with correct src and alt", () => {
    renderWithQueryClient(<ProductCard product={mockProduct} />)

    const image = screen.getByRole("img")
    expect(image).toHaveAttribute("src", "/test-image.jpg")
    expect(image).toHaveAttribute("alt", "Test Product")
  })

  it("displays rating stars correctly", () => {
    renderWithQueryClient(<ProductCard product={mockProduct} />)

    const stars = screen.getAllByTestId("star")
    expect(stars).toHaveLength(5)
    expect(screen.getByText("(4.5)")).toBeInTheDocument()
  })
})