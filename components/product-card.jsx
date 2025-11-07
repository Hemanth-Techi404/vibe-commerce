"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    setAdding(true)
    await onAddToCart(product.id, quantity)
    setQuantity(1)
    setAdding(false)
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-br from-accent to-accent/50 h-40 flex items-center justify-center">
        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
          <span className="text-2xl">📦</span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-2 border border-border rounded text-center text-sm bg-background text-foreground"
          />
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}
