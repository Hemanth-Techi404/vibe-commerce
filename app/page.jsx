"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/components/product-grid"
import CartSidebar from "@/components/cart-sidebar"
import Header from "@/components/header"

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [sessionId] = useState(`session-${Date.now()}`)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products`)
        const data = await response.json()
        setProducts(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${sessionId}`)
      const data = await response.json()
      setCartItems(data.items || [])
      setCartTotal(Number.parseFloat(data.total || 0))
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    }
  }

  // Add to cart
  const handleAddToCart = async (productId, qty = 1) => {
    try {
      await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productId, qty }),
      })
      fetchCart()
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  // Remove from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      await fetch(`${API_URL}/api/cart/${sessionId}/${productId}`, {
        method: "DELETE",
      })
      fetchCart()
    } catch (error) {
      console.error("Failed to remove from cart:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemsCount={cartItems.length} onCartClick={() => setCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">Vibe Commerce</h1>
          <p className="text-lg text-muted-foreground">Discover premium tech products curated for you</p>
        </section>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <ProductGrid products={products} onAddToCart={handleAddToCart} />
        )}
      </main>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        sessionId={sessionId}
        onRemoveItem={handleRemoveFromCart}
        onItemsUpdate={fetchCart}
      />
    </div>
  )
}
