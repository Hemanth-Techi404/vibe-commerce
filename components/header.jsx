"use client"

import { ShoppingCart } from "lucide-react"

export default function Header({ cartItemsCount, onCartClick }) {
  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Vibe Commerce</h1>
        </div>

        <button onClick={onCartClick} className="relative p-2 hover:bg-accent rounded-lg transition-colors">
          <ShoppingCart className="w-6 h-6 text-foreground" />
          {cartItemsCount > 0 && (
            <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
