"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

interface CreateOrderData {
  items: OrderItem[]
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
}

export async function createOrder(orderData: CreateOrderData) {
  const supabase = createServerClient()

  try {
    // เริ่ม transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        total_amount: orderData.totalAmount,
        status: "pending",
        shipping_address: `${orderData.customerInfo.address}, ${orderData.customerInfo.city} ${orderData.customerInfo.postalCode}`,
        payment_method: orderData.paymentMethod,
        user_id: null, // จะอัปเดตเมื่อมีระบบ auth
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // สร้าง order items และตัดสต็อก
    for (const item of orderData.items) {
      // ตรวจสอบสต็อกก่อน
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock, name")
        .eq("id", item.productId)
        .single()

      if (productError) {
        throw new Error(`Product not found: ${productError.message}`)
      }

      if (product.stock < item.quantity) {
        throw new Error(`สินค้า ${product.name} มีสต็อกไม่เพียงพอ (เหลือ ${product.stock} ชิ้น)`)
      }

      // สร้าง order item
      const { error: orderItemError } = await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })

      if (orderItemError) {
        throw new Error(`Failed to create order item: ${orderItemError.message}`)
      }

      // ตัดสต็อกสินค้า
      const { error: updateStockError } = await supabase
        .from("products")
        .update({
          stock: product.stock - item.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.productId)

      if (updateStockError) {
        throw new Error(`Failed to update stock: ${updateStockError.message}`)
      }
    }

    // สร้างการแจ้งเตือน
    await supabase.from("notifications").insert({
      user_id: null, // จะอัปเดตเมื่อมีระบบ auth
      title: "คำสั่งซื้อสำเร็จ",
      message: `คำสั่งซื้อ #${order.id.slice(0, 8)} ได้รับการยืนยันแล้ว`,
      type: "success",
    })

    revalidatePath("/")
    revalidatePath("/product")

    return {
      success: true,
      orderId: order.id,
      message: "สั่งซื้อสำเร็จ! คำสั่งซื้อของคุณได้รับการยืนยันแล้ว",
    }
  } catch (error) {
    console.error("Order creation failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการสั่งซื้อ",
    }
  }
}

export async function getProductStock(productId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("products").select("stock, name").eq("id", productId).single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, stock: data.stock, name: data.name }
}
