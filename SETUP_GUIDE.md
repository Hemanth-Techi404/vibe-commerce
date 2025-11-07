# Vibe Commerce - Full Setup Guide

A complete e-commerce shopping cart application with React frontend and Node/Express backend.

## Project Structure

\`\`\`
vibe-commerce/
├── frontend/                  # React Next.js app
│   ├── app/
│   ├── components/
│   ├── .env.local
│   └── package.json
│
└── backend/                   # Node/Express server
    ├── server.js
    ├── package.json
    ├── .env
    └── SETUP.md
\`\`\`

## Prerequisites

- **Node.js** v16+ and npm
- **MongoDB** (local or Atlas cloud)
- **Git**
- Two terminal windows/tabs

## Quick Start (5 minutes)

### Step 1: Setup MongoDB

**Option A: Local MongoDB**
\`\`\`bash
# Make sure MongoDB is running
mongod
\`\`\`

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string

### Step 2: Setup Backend

\`\`\`bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your MongoDB URI to .env:
# MONGODB_URI=mongodb://localhost:27017/vibe-commerce
# or
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibe-commerce

# Start backend server
npm start
# Server runs on http://localhost:5000
\`\`\`

### Step 3: Setup Frontend

\`\`\`bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies (already included as per v0 setup)

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start dev server
npm run dev
# Frontend runs on http://localhost:3000
\`\`\`

### Step 4: Open in Browser

Visit: **http://localhost:3000**

## Features

✓ Browse 8 mock products with real-time data  
✓ Add/remove items from shopping cart  
✓ Real-time cart total calculation  
✓ Mock checkout with receipt generation  
✓ Order confirmation with timestamp  
✓ Responsive design (mobile, tablet, desktop)  
✓ Clean, modern UI  

## API Endpoints

### Products
- `GET /api/products` - Get all products

### Cart
- `POST /api/cart` - Add item to cart
  \`\`\`json
  { "sessionId": "session-xxx", "productId": "1", "qty": 1 }
  \`\`\`
- `GET /api/cart/:sessionId` - Get cart items and total
- `DELETE /api/cart/:sessionId/:productId` - Remove item

### Checkout
- `POST /api/checkout` - Process mock checkout
  \`\`\`json
  { "sessionId": "session-xxx" }
  \`\`\`

## Testing the App

### Add to Cart Flow
1. Browse products on home page
2. Select quantity and click "Add" button
3. See cart count increase in header
4. Click cart icon to view sidebar

### Cart Management
1. View items in sidebar
2. See real-time totals
3. Remove items with trash icon
4. Cart updates instantly

### Checkout Flow
1. Click "Checkout" button in cart
2. Enter email address
3. Click "Place Order"
4. See mock receipt with:
   - Order ID
   - Items purchased
   - Total amount
   - Timestamp

### Data Verification
- **MongoDB Atlas**: Check orders/carts in database collections
- **Backend Logs**: Watch terminal for API requests
- **Network Tab**: Open DevTools to see API calls

## Troubleshooting

### "Cannot connect to backend"
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check CORS is enabled in backend
- Ensure MongoDB is connected

### "MongoDB connection error"
- Verify MongoDB is running locally: `mongod`
- Or check MongoDB Atlas connection string
- Ensure IP is whitelisted (Atlas only)

### "Products not loading"
- Backend must be running
- Check browser console for API errors
- Verify products seeded in MongoDB

### Products added but not showing in cart
- Refresh page and try again
- Check browser console for errors
- Verify sessionId is consistent

## Deployment

### Deploy Backend (Heroku/Railway/Render)
1. Add MongoDB Atlas connection string
2. Deploy backend server
3. Update frontend `NEXT_PUBLIC_API_URL` to production URL

### Deploy Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

## Development Tips

- Backend auto-restarts with `npm run dev` (requires nodemon)
- Frontend hot-reloads on save
- Use browser DevTools Network tab to debug API
- Check MongoDB collections for data verification
- Session ID regenerates on page refresh (for testing)

## Next Steps

- Add user authentication
- Implement real payment processing (Stripe)
- Add product search/filtering
- Implement order history
- Add inventory management
- Deploy to production

---

Built with React, Node/Express, and MongoDB for Vibe Commerce
