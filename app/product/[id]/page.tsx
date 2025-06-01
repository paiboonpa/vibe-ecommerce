"use client"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/products"
import ProductDetailClient from "./product-detail-client"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
