"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface HeroAction {
  label: string
  href?: string
  onClick?: () => void
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary"
}

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  actions?: HeroAction[]
  backgroundImage?: string
  featuredImage?: string
  variant?: "default" | "minimal" | "centered" | "split"
  className?: string
  children?: React.ReactNode
}

export function Hero({
  title,
  subtitle,
  description,
  actions = [],
  backgroundImage,
  featuredImage,
  variant = "default",
  className,
  children,
}: HeroProps) {
  const isMinimal = variant === "minimal"
  const isCentered = variant === "centered"
  const isSplit = variant === "split"

  const containerClasses = cn(
    "relative overflow-hidden",
    isCentered ? "text-center" : "text-left",
    isMinimal ? "py-12 md:py-16" : "py-16 md:py-24 lg:py-32",
    className
  )

  const backgroundClasses = cn(
    "absolute inset-0",
    backgroundImage
      ? "bg-cover bg-center bg-no-repeat"
      : "bg-gradient-to-br from-primary/10 via-background to-secondary/10"
  )

  const contentClasses = cn(
    "relative z-10 container mx-auto px-4",
    isSplit ? "grid lg:grid-cols-2 gap-12 items-center" : "max-w-4xl",
    isCentered && "mx-auto text-center"
  )

  const titleClasses = cn(
    "font-bold tracking-tight",
    isMinimal
      ? "text-3xl md:text-4xl"
      : "text-4xl md:text-5xl lg:text-6xl",
    "mb-4 text-balance"
  )

  const subtitleClasses = cn(
    "text-muted-foreground mb-6",
    isMinimal ? "text-lg" : "text-xl md:text-2xl",
    "text-pretty max-w-2xl",
    !isCentered && "mx-0",
    isCentered && "mx-auto"
  )

  const actionsClasses = cn(
    "flex gap-4",
    isCentered ? "justify-center" : "justify-start",
    "flex-wrap"
  )

  return (
    <section className={containerClasses}>
      {/* Background */}
      <div
        className={backgroundClasses}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      >
        {backgroundImage && (
          <div className="absolute inset-0 bg-black/20" />
        )}
      </div>

      <div className={contentClasses}>
        {/* Content */}
        <div className={isSplit ? "lg:order-1" : ""}>
          {subtitle && (
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
              {subtitle}
            </p>
          )}

          <h1 className={titleClasses}>
            {title}
          </h1>

          {description && (
            <p className={subtitleClasses}>
              {description}
            </p>
          )}

          {actions.length > 0 && (
            <div className={actionsClasses}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || (index === 0 ? "default" : "outline")}
                  size="lg"
                  asChild={!!action.href}
                  onClick={action.onClick}
                >
                  {action.href ? (
                    <Link href={action.href}>{action.label}</Link>
                  ) : (
                    action.label
                  )}
                </Button>
              ))}
            </div>
          )}

          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>

        {/* Featured Image for split layout */}
        {isSplit && featuredImage && (
          <div className="lg:order-2 relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Specialized Hero variants for common use cases
export function HomeHero(props: Omit<HeroProps, "variant">) {
  return <Hero {...props} variant="split" />
}

export function PageHero(props: Omit<HeroProps, "variant">) {
  return <Hero {...props} variant="minimal" />
}

export function LandingHero(props: Omit<HeroProps, "variant">) {
  return <Hero {...props} variant="centered" />
}