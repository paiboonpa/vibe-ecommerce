import { supabase } from "./supabase"
import type { Product, Category } from "./types"

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data.map((product) => ({
    ...product,
    image: product.image_url || "/placeholder.svg?height=400&width=400",
    category: product.categories?.name || "ไม่ระบุหมวดหมู่",
  }))
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return {
    ...data,
    image: data.image_url || "/placeholder.svg?height=400&width=400",
    category: data.categories?.name || "ไม่ระบุหมวดหมู่",
  }
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products by category:", error)
    return []
  }

  return data.map((product) => ({
    ...product,
    image: product.image_url || "/placeholder.svg?height=400&width=400",
    category: product.categories?.name || "ไม่ระบุหมวดหมู่",
  }))
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name
      )
    `)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching products:", error)
    return []
  }

  return data.map((product) => ({
    ...product,
    image: product.image_url || "/placeholder.svg?height=400&width=400",
    category: product.categories?.name || "ไม่ระบุหมวดหมู่",
  }))
}
