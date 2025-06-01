import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square relative">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <p className="text-lg font-bold text-primary">฿{product.price.toLocaleString()}</p>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <span className="text-xs text-muted-foreground">(4.0)</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">จัดส่งจาก: กรุงเทพมหานคร</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product.id}`} className="w-full">
          <Button className="w-full">ดูรายละเอียด</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
