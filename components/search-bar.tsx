"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { searchProducts } from "@/lib/products"
import type { Product } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch(query)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const products = await searchProducts(searchQuery)
      setResults(products)
      setShowResults(true)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowResults(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">กำลังค้นหา...</div>
            ) : results.length > 0 ? (
              <>
                <div className="space-y-2">
                  {results.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
                      onClick={() => setShowResults(false)}
                    >
                      <div className="w-10 h-10 relative flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">฿{product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {results.length > 5 && (
                  <div className="border-t mt-2 pt-2">
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="block text-center text-sm text-primary hover:underline"
                      onClick={() => setShowResults(false)}
                    >
                      ดูผลการค้นหาทั้งหมด ({results.length} รายการ)
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">ไม่พบสินค้าที่ค้นหา</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
