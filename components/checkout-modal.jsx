"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"

export default function CheckoutModal({ sessionId, total, itemsCount, onCheckout, onClose }) {
  const [processing, setProcessing] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  const handleCheckout = async () => {
    if (!email.trim()) {
      setError("Please enter your email")
      return
    }

    setProcessing(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed")
      }

      onCheckout(data.receipt)
    } catch (err) {
      setError(err.message || "Checkout failed. Please try again.")
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-accent/10 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Order Summary</p>
            <p className="text-sm text-muted-foreground mt-1">Items: {itemsCount}</p>
            <p className="text-2xl font-bold text-primary mt-2">${total}</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={processing}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-border text-foreground font-semibold py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This is a mock checkout. No real payment will be processed.
          </p>
        </div>
      </div>
    </div>
  )
}
