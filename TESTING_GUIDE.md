# Testing Guide - Vibe Commerce

Complete testing checklist for the e-commerce shopping cart application.

## Pre-Testing Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB connected (check backend logs)
- [ ] Products loaded (check in DevTools Network tab)
- [ ] No console errors in browser

## Unit Testing: Frontend

### Header Component
- [ ] Cart icon displays correctly
- [ ] Cart count badge shows correct number
- [ ] Cart opens when icon clicked
- [ ] Cart count updates when items added

### Product Grid
- [ ] All 8 products display
- [ ] Product prices show correctly
- [ ] Product images/placeholders load
- [ ] Quantity input works (1-10)
- [ ] "Add" buttons are clickable

### Add to Cart Flow
\`\`\`
Test Case: Add single item to cart
1. Select product "Wireless Headphones"
2. Quantity: 1
3. Click "Add"
4. Verify: Cart count = 1, no errors in console
\`\`\`

\`\`\`
Test Case: Add multiple items of same product
1. Add "Wireless Headphones" qty 1
2. Add "Wireless Headphones" qty 2 again
3. Verify: Cart shows qty 3 for same product
\`\`\`

\`\`\`
Test Case: Add different products
1. Add "Wireless Headphones" qty 1
2. Add "USB-C Cable" qty 1
3. Verify: Cart shows 2 items, 2 different products
\`\`\`

### Cart Sidebar
- [ ] Sidebar opens from right
- [ ] Close button (X) works
- [ ] Overlay background visible
- [ ] All cart items display
- [ ] Item quantities correct
- [ ] Item prices calculated correctly
- [ ] Total updates in real-time

### Remove from Cart
\`\`\`
Test Case: Remove item from cart
1. Add 3 items to cart
2. Click trash icon on one item
3. Verify: Item removed, count decreases, total updates
\`\`\`

### Checkout Flow
\`\`\`
Test Case: Checkout without email
1. Add items to cart
2. Click "Checkout"
3. Click "Place Order" without email
4. Verify: Error message appears
\`\`\`

\`\`\`
Test Case: Successful checkout
1. Add items to cart ($10 + $20 = $30)
2. Click "Checkout"
3. Enter email: test@example.com
4. Click "Place Order"
5. Verify: Receipt displays with:
   - Unique Order ID
   - Correct items and quantities
   - Correct total ($30)
   - Current timestamp
\`\`\`

\`\`\`
Test Case: Post-checkout
1. Complete checkout
2. Click "Continue Shopping"
3. Verify: Cart empties, can add new items
\`\`\`

## API Testing

### GET /api/products
\`\`\`bash
curl http://localhost:5000/api/products
\`\`\`
Should return array of 8 products with id, name, price, description, category.

### POST /api/cart
\`\`\`bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session",
    "productId": "1",
    "qty": 2
  }'
\`\`\`
Should return cart with added item.

### GET /api/cart/:sessionId
\`\`\`bash
curl http://localhost:5000/api/cart/test-session
\`\`\`
Should return cart items and calculated total.

### DELETE /api/cart/:sessionId/:productId
\`\`\`bash
curl -X DELETE http://localhost:5000/api/cart/test-session/1
\`\`\`
Should return updated cart without that item.

### POST /api/checkout
\`\`\`bash
curl -X POST http://localhost:5000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test-session"}'
\`\`\`
Should return receipt with orderId, items, total, timestamp.

## Data Validation Tests

### Cart Total Calculation
\`\`\`
Test Case: Verify total calculation
Product 1: $10 x 2 = $20
Product 2: $25 x 1 = $25
Product 3: $5 x 3 = $15
Expected Total: $60
\`\`\`

### Order Receipt Data
\`\`\`
Test Case: Verify receipt contains
- orderId (format: ORD-timestamp)
- items array with all products
- Each item: name, price, qty, calculated subtotal
- Total matches sum of subtotals
- Timestamp in ISO format
\`\`\`

## UI Responsiveness Tests

### Mobile (375px width)
- [ ] Header fits without overflow
- [ ] Product grid shows 1 column
- [ ] Cart sidebar works on mobile
- [ ] Buttons are tap-friendly (min 44px height)
- [ ] Text readable without zoom

### Tablet (768px width)
- [ ] Product grid shows 2 columns
- [ ] Header layout balanced
- [ ] Cart sidebar usable

### Desktop (1200px+ width)
- [ ] Product grid shows 4 columns
- [ ] All spacing proportional
- [ ] Hover effects work
- [ ] Cart sidebar width appropriate

## Edge Cases

\`\`\`
Test Case: Empty Cart
1. Remove all items from cart
2. Verify: "Cart is empty" message displays
3. Verify: Checkout button not visible
\`\`\`

\`\`\`
Test Case: High Quantities
1. Add product with qty 99
2. Verify: Still adds successfully
3. Verify: Total calculates correctly
\`\`\`

\`\`\`
Test Case: Rapid Clicks
1. Rapidly click "Add" multiple times
2. Verify: All requests processed
3. Verify: Cart state consistent
\`\`\`

\`\`\`
Test Case: Session Persistence
1. Add items to cart
2. Refresh page (F5)
3. Verify: Same sessionId
4. Verify: Cart items still there
\`\`\`

## Error Handling

- [ ] Handle network errors gracefully
- [ ] Show error messages for API failures
- [ ] Retry mechanism for failed requests
- [ ] Invalid email validation in checkout
- [ ] Empty cart checkout prevention

## Performance Tests

- [ ] Products load within 2 seconds
- [ ] Cart updates instantly
- [ ] Checkout completes within 3 seconds
- [ ] No memory leaks on cart operations
- [ ] Smooth animations and transitions

## Browser Compatibility

- [ ] Chrome/Chromium latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

## Accessibility Tests

- [ ] Tab navigation works
- [ ] Keyboard shortcuts functional
- [ ] Color contrast adequate
- [ ] Screen reader compatible
- [ ] Form labels present

---

Use this checklist before deploying to production.
