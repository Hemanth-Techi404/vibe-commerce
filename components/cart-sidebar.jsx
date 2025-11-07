"use client"

import { useState } from "react"
import { X } from "lucide-react"
import CartItemComponent from "./cart-item"
import CheckoutModal from "./checkout-modal"

export default function CartSidebar({
  isOpen,
  onClose,
  items,
  total,
  sessionId,
  onRemoveItem,
  onItemsUpdate,
}) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const handleCheckout = (checkoutReceipt) => {
    setReceipt(checkoutReceipt)
  }

  const handleCloseReceipt = () => {
    setReceipt(null)
    setShowCheckout(false)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemComponent key={item.productId} item={item} onRemove={onRemoveItem} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">Total:</span>
              <span className="text-2xl font-bold text-primary">${total}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          sessionId={sessionId}
          total={total}
          itemsCount={items.length}
          onCheckout={handleCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* Receipt Modal */}
      {receipt && <ReceiptModal receipt={receipt} onClose={handleCloseReceipt} />}
    </>
  )
}

function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Order Confirmed!</h2>

        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Order ID</p>
          <p className="font-mono font-bold text-foreground">{receipt.orderId}</p>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-foreground">Order Items:</h3>
          {receipt.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm text-muted-foreground">
              <span>
                {item.name} x{item.qty}
              </span>
              <span className="font-semibold text-foreground">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">${receipt.total}</span>
          </div>
          <p className="text-xs text-muted-foreground">Ordered at: {new Date(receipt.timestamp).toLocaleString()}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
