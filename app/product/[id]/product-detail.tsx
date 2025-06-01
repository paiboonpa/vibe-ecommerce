"use client"

// app/product/[id]/product-detail.tsx

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseKey = "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

const ProductDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId) => {
    const { data, error } = await supabase.from("products").select("*").eq("id", productId).single()

    if (error) {
      console.error("Error fetching product:", error)
    } else {
      setProduct(data)
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  )
}

export default ProductDetail
