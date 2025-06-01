import { getProductsByCategory, getCategories } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [products, categories] = await Promise.all([getProductsByCategory(params.id), getCategories()])

  const currentCategory = categories.find((cat) => cat.id === params.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับหน้าหลัก
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-4">{currentCategory?.name || "หมวดหมู่สินค้า"}</h1>
        <p className="text-muted-foreground">{currentCategory?.description || "สินค้าในหมวดหมู่นี้"}</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">ไม่พบสินค้าในหมวดหมู่นี้</p>
          <Link href="/">
            <Button className="mt-4">ดูสินค้าทั้งหมด</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
