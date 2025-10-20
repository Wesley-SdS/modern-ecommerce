import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Hero } from "@/components/shared/hero"

describe("Hero", () => {
  it("renders title and subtitle correctly", () => {
    render(
      <Hero
        title="Test Title"
        subtitle="Test Subtitle"
        description="Test description"
      />
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
  })

  it("renders actions", () => {
    render(
      <Hero
        title="Test Title"
        actions={[
          { label: "Primary", href: "/primary" },
          { label: "Secondary", href: "/secondary", variant: "outline" }
        ]}
      />
    )

    expect(screen.getByRole("link", { name: "Primary" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Secondary" })).toBeInTheDocument()
  })

  it("applies correct variant classes", () => {
    const { container } = render(
      <Hero
        title="Test Title"
        variant="centered"
      />
    )

    const title = screen.getByText("Test Title")
    expect(title.closest("div")).toHaveClass("text-center")
  })

  it("renders background image when provided", () => {
    const { container } = render(
      <Hero
        title="Test Title"
        backgroundImage="/test-bg.jpg"
      />
    )

    const heroSection = container.querySelector("section")
    const bgDiv = heroSection?.querySelector("div[style*='background-image']")
    expect(bgDiv).toBeInTheDocument()
    expect(bgDiv).toHaveStyle("background-image: url(/test-bg.jpg)")
  })

  it("doesn't render actions when not provided", () => {
    render(<Hero title="Test Title" />)

    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})