"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  // เพิ่มรูปสินค้าหลายมุมจาก Unsplash ในฟังก์ชัน ProductDetailClient
  const images = [
    product.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&h=500&fit=crop&auto=format&q=80",
  ]

  const handleAddToCart = () => {
    addToCart(product, quantity)
    alert("เพิ่มสินค้าในตะกร้าแล้ว!")
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square relative">
          <Image src={images[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover rounded-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-muted-foreground text-lg mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-primary">฿{product.price.toLocaleString()}</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">จำนวน</label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      aria-label="decrement quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      aria-label="increment quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  สินค้าคงเหลือ: {product.stock} ชิ้น
                  {product.stock <= 5 && product.stock > 0 && <span className="text-orange-500 ml-2">(เหลือน้อย!)</span>}
                  {product.stock === 0 && <span className="text-red-500 ml-2">(สินค้าหมด)</span>}
                </div>

                <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
