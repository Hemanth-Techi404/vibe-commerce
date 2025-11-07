"use client"

import { Trash2 } from "lucide-react"

export default function CartItem({ item, onRemove }) {
  return (
    <div className="flex gap-4 pb-4 border-b border-border">
      <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-2xl">📦</span>
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
        <p className="text-sm text-muted-foreground mt-1">Qty: {item.qty}</p>
        <p className="font-bold text-primary mt-1">${(item.price * item.qty).toFixed(2)}</p>
      </div>

      <button
        onClick={() => onRemove(item.productId)}
        className="p-2 hover:bg-accent text-destructive rounded transition-colors flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
