"use client"

import { useState, useMemo } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ProductVariant } from "@/types/product"

interface VariantSelectorProps {
  variants: ProductVariant[]
  onVariantChange?: (variant: ProductVariant) => void
  className?: string
}

interface AttributeConfig {
  [key: string]: {
    type: "color" | "size" | "text"
    options: string[]
  }
}

export function VariantSelector({ 
  variants, 
  onVariantChange, 
  className 
}: VariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  
  const attributeConfig = useMemo((): AttributeConfig => {
    const config: AttributeConfig = {}
    
    variants.forEach(variant => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!config[key]) {
          config[key] = {
            type: key.toLowerCase().includes("color") || key.toLowerCase().includes("cor") ? "color" :
                  key.toLowerCase().includes("size") || key.toLowerCase().includes("tamanho") ? "size" : "text",
            options: []
          }
        }
        
        if (!config[key].options.includes(String(value))) {
          config[key].options.push(String(value))
        }
      })
    })
    
    return config
  }, [variants])

  const availableVariants = useMemo(() => {
    return variants.filter(variant => {
      return Object.entries(selectedAttributes).every(([key, value]) => 
        String(variant.attributes[key]) === value
      )
    })
  }, [variants, selectedAttributes])

  const currentVariant = useMemo(() => {
    return availableVariants.find(variant => 
      Object.entries(selectedAttributes).every(([key, value]) => 
        String(variant.attributes[key]) === value
      )
    )
  }, [availableVariants, selectedAttributes])

  const isAttributeAvailable = (attribute: string, value: string) => {
    const testAttributes = { ...selectedAttributes, [attribute]: value }
    
    return variants.some(variant => 
      Object.entries(testAttributes).every(([key, val]) => 
        String(variant.attributes[key]) === val
      )
    )
  }

  const handleAttributeChange = (attribute: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attribute]: value }
    setSelectedAttributes(newAttributes)
    
    const variant = variants.find(v => 
      Object.entries(newAttributes).every(([key, val]) => 
        String(v.attributes[key]) === val
      )
    )
    
    if (variant) {
      onVariantChange?.(variant)
    }
  }

  const renderColorSwatch = (color: string, isSelected: boolean, isAvailable: boolean) => {
    const isValidColor = /^#[0-9A-F]{6}$/i.test(color)
    
    if (!isValidColor) {
      return (
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          disabled={!isAvailable}
          className={cn(
            "h-8 w-8 p-0 text-xs",
            !isAvailable && "opacity-50 cursor-not-allowed"
          )}
        >
          {color.slice(0, 2)}
        </Button>
      )
    }
    
    return (
      <button
        className={cn(
          "h-8 w-8 rounded-full border-2 transition-all relative",
          isSelected ? "border-primary ring-2 ring-primary/20" : "border-muted-foreground/20",
          !isAvailable && "opacity-50 cursor-not-allowed",
          "hover:scale-110"
        )}
        style={{ backgroundColor: color }}
        disabled={!isAvailable}
      >
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check className="h-4 w-4 text-white drop-shadow-md" />
          </div>
        )}
      </button>
    )
  }

  const renderSizeButton = (size: string, isSelected: boolean, isAvailable: boolean) => (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      disabled={!isAvailable}
      className={cn(
        "min-w-[48px]",
        !isAvailable && "opacity-50 cursor-not-allowed"
      )}
    >
      {size}
    </Button>
  )

  const renderTextOption = (value: string, isSelected: boolean, isAvailable: boolean) => (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      disabled={!isAvailable}
      className={cn(
        !isAvailable && "opacity-50 cursor-not-allowed"
      )}
    >
      {value}
    </Button>
  )

  if (variants.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(attributeConfig).map(([attributeName, config]) => (
        <div key={attributeName} className="space-y-3">
          <h4 className="font-medium capitalize">
            {attributeName.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {config.options.map((option) => {
              const isSelected = selectedAttributes[attributeName] === option
              const isAvailable = isAttributeAvailable(attributeName, option)
              
              return (
                <div key={option} className="flex items-center">
                  {config.type === "color" && renderColorSwatch(option, isSelected, isAvailable)}
                  {config.type === "size" && renderSizeButton(option, isSelected, isAvailable)}
                  {config.type === "text" && renderTextOption(option, isSelected, isAvailable)}
                  
                  <input
                    type="radio"
                    name={attributeName}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleAttributeChange(attributeName, option)}
                    className="sr-only"
                    disabled={!isAvailable}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
      
      {currentVariant && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">SKU: {currentVariant.sku}</span>
            <span className="text-sm text-muted-foreground">
              Estoque: {currentVariant.stock} unidade{currentVariant.stock !== 1 ? "s" : ""}
            </span>
          </div>
          
          {currentVariant.stock === 0 && (
            <p className="text-sm text-destructive mt-1">
              Esta combinação não está disponível no momento.
            </p>
          )}
        </div>
      )}
    </div>
  )
}