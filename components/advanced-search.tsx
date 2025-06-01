"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, SlidersHorizontal } from "lucide-react"

interface AdvancedSearchProps {
  categories: Array<{ id: string; name: string }>
}

export default function AdvancedSearch({ categories }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "name",
  })
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (filters.query) params.set("q", filters.query)
    if (filters.category) params.set("category", filters.category)
    if (filters.minPrice) params.set("minPrice", filters.minPrice)
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice)
    if (filters.sortBy) params.set("sort", filters.sortBy)

    router.push(`/search?${params.toString()}`)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name",
    })
  }

  return (
    <div className="w-full">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full md:w-auto">
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        ค้นหาขั้นสูง
      </Button>

      {isOpen && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              ค้นหาขั้นสูง
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search-query">ชื่อสินค้า</Label>
              <Input
                id="search-query"
                placeholder="ค้นหาสินค้า..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="category">หมวดหมู่</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-price">ราคาต่ำสุด</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="max-price">ราคาสูงสุด</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="999999"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sort-by">เรียงลำดับตาม</Label>
              <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">ชื่อสินค้า</SelectItem>
                  <SelectItem value="price-asc">ราคา: ต่ำ → สูง</SelectItem>
                  <SelectItem value="price-desc">ราคา: สูง → ต่ำ</SelectItem>
                  <SelectItem value="newest">ใหม่ล่าสุด</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                ค้นหา
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                ล้างตัวกรอง
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
