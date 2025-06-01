export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category_id: string | null
  stock: number
  is_active: boolean
  created_at: string
  updated_at: string
  // สำหรับ compatibility กับโค้ดเดิม
  image: string
  category: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}
