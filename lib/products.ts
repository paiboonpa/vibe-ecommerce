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

  // รูปสินค้าจาก Unsplash
  const productImages = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop", // iPhone
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop", // Laptop
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", // Sneakers
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", // Watch
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", // Sunglasses
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", // Headphones 2
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop", // Camera
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop", // T-shirt
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop", // Bag
  ]

  return data.map((product, index) => ({
    ...product,
    image: product.image_url || productImages[index % productImages.length],
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

  // เลือกรูปตาม category หรือใช้รูป default
  let productImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"

  if (data.categories?.name) {
    const categoryImages: { [key: string]: string } = {
      สมาร์ทโฟน: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      แล็ปท็อป: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
      หูฟัง: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      รองเท้า: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      นาฬิกา: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      แว่นตา: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      กล้อง: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
      เสื้อผ้า: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
      กระเป๋า: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    }
    productImage = categoryImages[data.categories.name] || productImage
  }

  return {
    ...data,
    image: data.image_url || productImage,
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

  const productImages = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
  ]

  return data.map((product, index) => ({
    ...product,
    image: product.image_url || productImages[index % productImages.length],
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

  const productImages = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
  ]

  return data.map((product, index) => ({
    ...product,
    image: product.image_url || productImages[index % productImages.length],
    category: product.categories?.name || "ไม่ระบุหมวดหมู่",
  }))
}
