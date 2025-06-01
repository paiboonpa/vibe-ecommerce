import { getProducts, getCategories } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import SearchBar from "@/components/search-bar"

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">สินค้าทั้งหมด</h1>
        <p className="text-muted-foreground">เลือกซื้อสินค้าเทคโนโลยีคุณภาพสูงจากร้านของเรา</p>
      </div>

      {/* Search Section */}
      <div className="mb-8 md:hidden">
        <SearchBar />
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">หมวดหมู่สินค้า</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">{category.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">ไม่พบสินค้า</p>
        </div>
      )}
    </div>
  )
}
