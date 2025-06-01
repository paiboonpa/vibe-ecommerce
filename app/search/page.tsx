import { searchProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const products = query ? await searchProducts(query) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับหน้าหลัก
          </Button>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold">ผลการค้นหา</h1>
        </div>

        {query ? (
          <p className="text-muted-foreground">
            ผลการค้นหาสำหรับ: <span className="font-semibold text-foreground">"{query}"</span>
            {products.length > 0 && <span className="ml-2">({products.length} รายการ)</span>}
          </p>
        ) : (
          <p className="text-muted-foreground">กรุณาใส่คำค้นหา</p>
        )}
      </div>

      {query && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">ไม่พบสินค้าที่ค้นหา</h2>
          <p className="text-muted-foreground mb-6">ลองค้นหาด้วยคำอื่น หรือดูสินค้าทั้งหมด</p>
          <Link href="/">
            <Button>ดูสินค้าทั้งหมด</Button>
          </Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">เริ่มค้นหาสินค้า</h2>
          <p className="text-muted-foreground">ใส่ชื่อสินค้าที่ต้องการค้นหาในช่องค้นหาด้านบน</p>
        </div>
      )}
    </div>
  )
}
