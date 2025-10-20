"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchSuggestion {
  id: string
  type: "product" | "category" | "search"
  title: string
  url?: string
  count?: number
}

interface SearchBarProps {
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  autoFocus?: boolean
}

export function SearchBar({ 
  placeholder = "Buscar produtos...", 
  className,
  showSuggestions = true,
  autoFocus = false
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/v1/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
          setIsOpen(true)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (showSuggestions) {
      fetchSuggestions()
    }
  }, [debouncedQuery, showSuggestions])

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return

    // Add to recent searches
    const newRecentSearches = [
      finalQuery,
      ...recentSearches.filter(s => s !== finalQuery)
    ].slice(0, 5)
    
    setRecentSearches(newRecentSearches)
    localStorage.setItem("recent-searches", JSON.stringify(newRecentSearches))

    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(finalQuery)}`)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.url) {
      router.push(suggestion.url)
    } else {
      handleSearch(suggestion.title)
    }
    setIsOpen(false)
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
    handleSearch(search)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length >= 2 || recentSearches.length > 0) {
              setIsOpen(true)
            }
          }}
          onBlur={() => {
            // Delayed close to allow click events on suggestions
            setTimeout(() => setIsOpen(false), 150)
          }}
          className="pl-10 pr-4"
          autoFocus={autoFocus}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setQuery("")}
          >
            ×
          </Button>
        )}
      </form>

      {showSuggestions && isOpen && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start" sideOffset={4}>
            <Command className="w-full border-0 shadow-lg">
              <CommandList className="max-h-80">
                {isLoading && (
                  <div className="p-4 text-sm text-muted-foreground">
                    Buscando sugestões...
                  </div>
                )}

                {!isLoading && recentSearches.length > 0 && query.length < 2 && (
                  <CommandGroup heading="Buscas Recentes">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-xs text-muted-foreground">Recentes</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs"
                        onClick={clearRecentSearches}
                      >
                        Limpar
                      </Button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <CommandItem
                        key={`recent-${index}`}
                        onSelect={() => handleRecentSearchClick(search)}
                      >
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {search}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {!isLoading && suggestions.length > 0 && (
                  <>
                    {suggestions.filter(s => s.type === "product").length > 0 && (
                      <CommandGroup heading="Produtos">
                        {suggestions
                          .filter(s => s.type === "product")
                          .map((suggestion) => (
                            <CommandItem
                              key={suggestion.id}
                              onSelect={() => handleSuggestionClick(suggestion)}
                            >
                              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                              {suggestion.title}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}

                    {suggestions.filter(s => s.type === "category").length > 0 && (
                      <CommandGroup heading="Categorias">
                        {suggestions
                          .filter(s => s.type === "category")
                          .map((suggestion) => (
                            <CommandItem
                              key={suggestion.id}
                              onSelect={() => handleSuggestionClick(suggestion)}
                            >
                              <Badge variant="secondary" className="mr-2">
                                {suggestion.count || 0}
                              </Badge>
                              {suggestion.title}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}

                    {suggestions.filter(s => s.type === "search").length > 0 && (
                      <CommandGroup heading="Sugestões">
                        {suggestions
                          .filter(s => s.type === "search")
                          .map((suggestion) => (
                            <CommandItem
                              key={suggestion.id}
                              onSelect={() => handleSuggestionClick(suggestion)}
                            >
                              <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                              {suggestion.title}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    )}
                  </>
                )}

                {!isLoading && suggestions.length === 0 && query.length >= 2 && (
                  <CommandEmpty>
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Nenhum resultado encontrado
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearch()}
                      >
                        Buscar &quot;{query}&quot;
                      </Button>
                    </div>
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}