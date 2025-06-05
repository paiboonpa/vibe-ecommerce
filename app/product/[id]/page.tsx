import { notFound } from "next/navigation"
import { getProductById } from "@/lib/products"
import ProductDetailClient from "./product-detail-client"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await getProductById(params.id)

    if (!product) {
      notFound()
    }

    return <ProductDetailClient product={product} />
  } catch (error) {
    // If getProductById throws (e.g., database error), also call notFound.
    // Optional: log the error if the environment supports server-side logging.
    // console.error("Failed to fetch product:", error);
    notFound()
  }
}
