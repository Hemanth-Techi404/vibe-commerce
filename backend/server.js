import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/vibe-commerce")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// ==================== SCHEMAS ====================

// Product Schema
const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  description: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.model("Product", productSchema)

// Cart Schema (for demonstration - stores cart sessions)
const cartSchema = new mongoose.Schema({
  sessionId: String,
  items: [
    {
      productId: String,
      qty: Number,
      price: Number,
      name: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Cart = mongoose.model("Cart", cartSchema)

// Order Schema (for checkout receipts)
const orderSchema = new mongoose.Schema({
  orderId: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      qty: Number,
    },
  ],
  total: Number,
  timestamp: { type: Date, default: Date.now },
})

const Order = mongoose.model("Order", orderSchema)

// ==================== SEED MOCK DATA ====================

async function seedProducts() {
  const count = await Product.countDocuments()
  if (count === 0) {
    const mockProducts = [
      {
        id: "1",
        name: "Wireless Headphones",
        price: 89.99,
        description: "Premium sound quality",
        category: "Electronics",
      },
      { id: "2", name: "USB-C Cable", price: 12.99, description: "Fast charging cable", category: "Accessories" },
      { id: "3", name: "Phone Case", price: 24.99, description: "Protective case", category: "Accessories" },
      { id: "4", name: "Screen Protector", price: 9.99, description: "Tempered glass", category: "Accessories" },
      { id: "5", name: "Portable Charger", price: 34.99, description: "10000mAh power bank", category: "Electronics" },
      { id: "6", name: "Bluetooth Speaker", price: 54.99, description: "Portable speaker", category: "Electronics" },
      { id: "7", name: "Desk Lamp", price: 29.99, description: "LED desk lamp", category: "Lighting" },
      { id: "8", name: "Keyboard", price: 79.99, description: "Mechanical keyboard", category: "Electronics" },
    ]
    await Product.insertMany(mockProducts)
    console.log("Products seeded")
  }
}

seedProducts()

// ==================== API ROUTES ====================

// GET /api/products - Get all products
app.get("/api/products", async (req, res) => {
  try {
    // Try to fetch from FakeStore API first
    const response = await fetch(process.env.FAKESTORE_API_URL || "https://fakestoreapi.com/products")
    if (response.ok) {
      const products = await response.json()
      // Transform to match our schema
      const transformedProducts = products.map(product => ({
        id: product.id.toString(),
        name: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        createdAt: new Date()
      }))
      res.json(transformedProducts)
    } else {
      // Fallback to local MongoDB products
      const products = await Product.find({})
      res.json(products)
    }
  } catch (error) {
    // Fallback to local MongoDB products
    const products = await Product.find({})
    res.json(products)
  }
})

// POST /api/cart - Add item to cart
app.post("/api/cart", async (req, res) => {
  try {
    const { sessionId, productId, qty } = req.body

    // Get product details
    const product = await Product.findOne({ id: productId })
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Find or create cart
    let cart = await Cart.findOne({ sessionId })
    if (!cart) {
      cart = new Cart({ sessionId, items: [] })
    }

    // Check if item already in cart
    const existingItem = cart.items.find((item) => item.productId === productId)
    if (existingItem) {
      existingItem.qty += qty
    } else {
      cart.items.push({
        productId,
        qty,
        price: product.price,
        name: product.name,
      })
    }

    cart.updatedAt = new Date()
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET /api/cart/:sessionId - Get cart total
app.get("/api/cart/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params
    const cart = await Cart.findOne({ sessionId })

    if (!cart) {
      return res.json({ items: [], total: 0 })
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    res.json({ items: cart.items, total: total.toFixed(2) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/cart/:sessionId/:productId - Remove item from cart
app.delete("/api/cart/:sessionId/:productId", async (req, res) => {
  try {
    const { sessionId, productId } = req.params
    const cart = await Cart.findOne({ sessionId })

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item.productId !== productId)
    cart.updatedAt = new Date()
    await cart.save()

    const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    res.json({ items: cart.items, total: total.toFixed(2) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/checkout - Mock checkout with receipt
app.post("/api/checkout", async (req, res) => {
  try {
    const { sessionId } = req.body
    const cart = await Cart.findOne({ sessionId })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" })
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const orderId = `ORD-${Date.now()}`

    // Create order
    const order = new Order({
      orderId,
      items: cart.items,
      total: Number.parseFloat(total.toFixed(2)),
      timestamp: new Date(),
    })

    await order.save()

    // Clear cart
    await Cart.deleteOne({ sessionId })

    res.json({
      success: true,
      receipt: {
        orderId,
        items: cart.items,
        total: total.toFixed(2),
        timestamp: order.timestamp.toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
