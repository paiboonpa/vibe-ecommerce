"use client"

import Link from "next/link"
import { ShoppingCart, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import SearchBar from "./search-bar"

export default function Header() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Store className="h-6 w-6" />
          TechStore
        </Link>

        <div className="flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-primary transition-colors">
            สินค้าทั้งหมด
          </Link>
          <Link href="/cart" className="hover:text-primary transition-colors">
            ตะกร้าสินค้า
          </Link>
        </nav>

        <Link href="/cart">
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4 mr-2" />
            ตะกร้า
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
