"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const totalPrice = getTotalPrice()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-4">ตะกร้าสินค้าว่างเปล่า</h2>
          <p className="text-muted-foreground mb-6">ยังไม่มีสินค้าในตะกร้า เริ่มช้อปปิ้งกันเลย!</p>
          <Link href="/">
            <Button>เลือกซื้อสินค้า</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ตะกร้าสินค้า</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.product.description}</p>
                    <p className="font-bold text-primary">฿{item.product.price.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearCart}>
              ล้างตะกร้า
            </Button>
            <Link href="/">
              <Button variant="outline">เลือกซื้อสินค้าเพิ่ม</Button>
            </Link>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>ยอดรวม</span>
                <span className="font-bold">฿{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span>ฟรี</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>รวมทั้งสิ้น</span>
                <span className="text-primary">฿{totalPrice.toLocaleString()}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  ดำเนินการชำระเงิน
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
