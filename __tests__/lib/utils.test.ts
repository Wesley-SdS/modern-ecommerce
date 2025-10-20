import { formatCurrency } from "@/lib/utils"

describe("formatCurrency", () => {
  it("should format currency in BRL", () => {
    expect(formatCurrency(100, "pt-BR")).toBe("R$ 100,00")
  })

  it("should format decimal values correctly", () => {
    expect(formatCurrency(99.99, "pt-BR")).toBe("R$ 99,99")
  })

  it("should handle zero", () => {
    expect(formatCurrency(0, "pt-BR")).toBe("R$ 0,00")
  })
})
