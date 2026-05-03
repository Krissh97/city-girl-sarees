# 🥻 City Girl — Saree E-Commerce Website

A modern, full-featured saree shop built with React. Includes product listings, dynamic filtering, cart with localStorage persistence, WhatsApp order notifications, and a clean checkout flow.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Quick Start (Local)](#quick-start-local)
3. [TODO Checklist](#todo-checklist)
4. [Setting Up WhatsApp](#setting-up-whatsapp)
5. [Adding Product Images & Videos (AWS S3)](#adding-product-images--videos-aws-s3)
6. [Deploying to Vercel (Free)](#deploying-to-vercel-free)
7. [Building the Backend (Node.js + Express)](#building-the-backend-nodejs--express)
8. [Setting Up MongoDB Atlas](#setting-up-mongodb-atlas)
9. [Adding a Custom Domain](#adding-a-custom-domain)
10. [Payment Integration (Future)](#payment-integration-future)
11. [Tech Stack](#tech-stack)

---

## Project Structure

```
city-girl/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx          ← Site header with cart button
│   │   ├── Navbar.jsx          ← Navigation links
│   │   ├── ProductList.jsx     ← Grid of product cards
│   │   ├── ProductCard.jsx     ← Single saree card
│   │   ├── Filters.jsx         ← Sidebar filter panel
│   │   ├── Cart.jsx            ← Cart table + summary
│   │   ├── CartItem.jsx        ← Single cart row
│   │   ├── Checkout.jsx        ← Checkout form
│   │   └── VideoModal.jsx      ← Video preview popup
│   ├── pages/
│   │   ├── Home.jsx            ← Landing page
│   │   ├── Shop.jsx            ← Shop page with filters
│   │   ├── CartPage.jsx        ← Cart page
│   │   ├── CheckoutPage.jsx    ← Checkout page
│   │   └── ConfirmationPage.jsx← Order confirmed page
│   ├── context/
│   │   └── CartContext.jsx     ← Global cart state (Context API)
│   ├── data/
│   │   └── sarees.js           ← Mock product data + schema
│   ├── utils/
│   │   └── orderService.js     ← WhatsApp + order submission logic
│   ├── styles/
│   │   ├── global.css
│   │   ├── Header.css
│   │   ├── Navbar.css
│   │   ├── ProductCard.css
│   │   ├── ProductList.css
│   │   ├── Filters.css
│   │   ├── Cart.css
│   │   ├── CartItem.css
│   │   ├── Checkout.css
│   │   ├── VideoModal.css
│   │   ├── Home.css
│   │   ├── Shop.css
│   │   ├── CartPage.css
│   │   ├── CheckoutPage.css
│   │   └── ConfirmationPage.css
│   ├── App.jsx                 ← Router + CartProvider
│   └── index.js
├── .env.example
├── .gitignore
└── package.json
```

---

## Quick Start (Local)

### Step 1 — Install Node.js

Download from https://nodejs.org (choose LTS version, e.g. 20.x).

Verify install:
```bash
node --version   # should show v18 or higher
npm --version
```

### Step 2 — Clone or download this project

If you have git:
```bash
git clone https://github.com/YOUR_USERNAME/city-girl-sarees.git
cd city-girl-sarees
```

Or just unzip the downloaded folder and open a terminal inside it.

### Step 3 — Install dependencies

```bash
npm install
```

This downloads React, React Router, Axios, and all other packages into `node_modules/`.

### Step 4 — Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and edit:
```
REACT_APP_SELLER_WHATSAPP=919876543210
```
Replace `919876543210` with your WhatsApp number:
- Remove the `+` sign
- Include country code (India = 91)
- Example: `+91 98765 43210` → `919876543210`

### Step 5 — Run the app

```bash
npm start
```

Opens automatically at http://localhost:3000

---

## TODO Checklist

These are all the things to complete before the shop is production-ready:

### Immediate (before launch)

- [ ] **Set WhatsApp number** in `.env` → `REACT_APP_SELLER_WHATSAPP`
- [ ] **Add product photos** — upload to AWS S3 and paste URLs into `src/data/sarees.js` → `imageUrl` field
- [ ] **Add product videos** (optional) — upload to S3 and paste URLs into `videoUrl` field
- [ ] **Update product list** in `src/data/sarees.js` — add your real sarees with correct prices and stock
- [ ] **Test WhatsApp** flow end-to-end by placing a test order

### Before scaling up

- [ ] **Set up MongoDB Atlas** (see section below) — to store orders from real customers
- [ ] **Build Node.js backend** — to receive orders, save to DB, send email confirmations
- [ ] **Connect backend** — update `REACT_APP_API_URL` in `.env` and uncomment the axios call in `orderService.js`
- [ ] **Add Razorpay or Stripe** — for online payments (see Payment section)
- [ ] **Add admin panel** — to manage stock, view orders (can use a simple React dashboard)

---

## Setting Up WhatsApp

The app uses WhatsApp's free `wa.me` deep link — no API key or paid subscription needed.

### How it works

When a customer places an order, the app opens a pre-filled WhatsApp message to YOUR number with the full order details.

### Steps

1. Open `.env`
2. Set `REACT_APP_SELLER_WHATSAPP` to your number without `+`
3. Example: your number is `+91 87654 32100` → set `REACT_APP_SELLER_WHATSAPP=918765432100`
4. Save and restart: `npm start`
5. Place a test order → you should see WhatsApp open with a pre-filled message

### Optional: WhatsApp Business API (for automated messages)

If you want the app to automatically send a WhatsApp confirmation to the CUSTOMER (not just the seller), you'll need:

1. Sign up at https://business.whatsapp.com
2. Get API access through Meta or a provider like Twilio/Gupshup
3. Add API calls in `src/utils/orderService.js` inside `submitOrder()`

---

## Adding Product Images & Videos (AWS S3)

AWS S3 is the best place to host saree photos and videos. The free tier gives 5GB storage and 15GB transfer/month.

### Step 1 — Create AWS Account

Go to https://aws.amazon.com → Create a free account.

### Step 2 — Create an S3 Bucket

1. Open the AWS Console → search "S3" → click "Create bucket"
2. Bucket name: `city-girl-sarees` (must be globally unique — try `city-girl-sarees-2024`)
3. Region: `ap-south-1` (Mumbai — fastest for India)
4. Uncheck "Block all public access" → confirm
5. Click "Create bucket"

### Step 3 — Make bucket publicly readable

1. Click your bucket → "Permissions" tab → "Bucket Policy"
2. Paste this policy (replace `city-girl-sarees` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::city-girl-sarees/*"
    }
  ]
}
```

### Step 4 — Upload saree images

1. Click your bucket → "Upload" → drag and drop your `.jpg` or `.webp` photos
2. Recommended naming: `s001.jpg`, `s002.jpg` (matching the `id` in sarees.js)
3. After upload, click any file → copy the "Object URL"
4. Example URL: `https://city-girl-sarees.s3.ap-south-1.amazonaws.com/sarees/s001.jpg`

### Step 5 — Update sarees.js

Open `src/data/sarees.js` and replace `imageUrl: ""` with the S3 URL:

```javascript
{
  id: "s001",
  name: "Kanjivaram Crimson Bridal",
  imageUrl: "https://city-girl-sarees.s3.ap-south-1.amazonaws.com/sarees/s001.jpg",
  videoUrl: "https://city-girl-sarees.s3.ap-south-1.amazonaws.com/sarees/s001.mp4",
  // ... rest of fields
}
```

### Tips for photos

- Use square or portrait (3:4) ratio images — the cards are designed for 3:4
- Compress images to under 200KB using https://squoosh.app (loads much faster)
- Good resolution: 600×800px is plenty

### Tips for videos

- Keep videos under 30 seconds and under 10MB for fast loading
- MP4 format with H.264 encoding works everywhere
- Compress with HandBrake (free) before uploading

---

## Deploying to Vercel (Free)

Vercel is the easiest and best free hosting for React apps. The free "Hobby" plan supports unlimited deployments and is perfect for under 50 visitors/week.

### Step 1 — Push code to GitHub

1. Go to https://github.com → create a new repository called `city-girl-sarees`
2. In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/city-girl-sarees.git
git push -u origin main
```

### Step 2 — Deploy to Vercel

1. Go to https://vercel.com → sign up with your GitHub account
2. Click "Add New Project"
3. Click "Import" next to your `city-girl-sarees` repository
4. Vercel auto-detects React (Create React App) — no config needed
5. Click "Deploy"

Your site will be live at `https://city-girl-sarees.vercel.app` in about 60 seconds.

### Step 3 — Add environment variables on Vercel

1. In Vercel dashboard → your project → "Settings" → "Environment Variables"
2. Add each variable from your `.env` file:
   - Name: `REACT_APP_SELLER_WHATSAPP` → Value: `919876543210`
   - Name: `REACT_APP_API_URL` → Value: `https://your-backend.com` (add later)
3. Click "Save" → go to "Deployments" → click "Redeploy"

### Step 4 — Auto-deploy on every push

Vercel automatically rebuilds and redeploys whenever you push to `main` on GitHub. To update the site:

```bash
git add .
git commit -m "Updated sarees list"
git push
```

Done — live in ~60 seconds.

---

## Building the Backend (Node.js + Express)

You need a backend when you want to: save orders to a database, send email confirmations, or integrate payments.

### Step 1 — Create backend folder

```bash
mkdir city-girl-backend
cd city-girl-backend
npm init -y
npm install express cors mongoose dotenv nodemailer
```

### Step 2 — Create server.js

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: String,
  customer: {
    name: String,
    phone: String,
    address: String,
    notes: String,
  },
  items: [{
    id: String,
    name: String,
    type: String,
    color: String,
    qty: Number,
    price: Number,
    subtotal: Number,
  }],
  grandTotal: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);

// POST /api/orders — receive new order
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // TODO: Send email notification here
    // await sendOrderEmail(order);

    res.json({ success: true, orderId: order.orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders — list all orders (protect with auth later)
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Step 3 — Backend .env file

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/city-girl
FRONTEND_URL=https://city-girl-sarees.vercel.app
PORT=5000
```

### Step 4 — Connect frontend to backend

In `src/utils/orderService.js`, uncomment the axios call:

```javascript
import axios from 'axios';

export async function submitOrder(customer, cart, grandTotal) {
  const orderPayload = { /* ... */ };

  // Replace the console.log with:
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/orders`,
    orderPayload
  );
  return res.data;
}
```

### Step 5 — Deploy backend to Railway (free)

1. Go to https://railway.app → sign up
2. "New Project" → "Deploy from GitHub repo" → select your backend repo
3. Add environment variables (MONGODB_URI, FRONTEND_URL, PORT)
4. Your backend URL will be like `https://city-girl-backend.up.railway.app`
5. Update `REACT_APP_API_URL` on Vercel with this URL

---

## Setting Up MongoDB Atlas

MongoDB Atlas is a free cloud database — no server to manage.

### Step 1 — Create Account

Go to https://mongodb.com/atlas → "Try Free" → sign up.

### Step 2 — Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" (M0 Sandbox) — 512MB storage, always free
3. Provider: AWS, Region: Mumbai (ap-south-1)
4. Cluster Name: `CityGirlCluster`
5. Click "Create"

### Step 3 — Create Database User

1. Security → "Database Access" → "Add New Database User"
2. Username: `citygirl` (or anything)
3. Password: click "Autogenerate Secure Password" → copy it
4. Role: "Read and write to any database"
5. Click "Add User"

### Step 4 — Allow IP Access

1. Security → "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0) for simplicity
3. Click "Confirm"

### Step 5 — Get Connection String

1. Database → "Connect" → "Connect your application"
2. Driver: Node.js, Version: 5.5 or later
3. Copy the connection string — looks like:
   `mongodb+srv://citygirl:<password>@citygircluster.abc123.mongodb.net/`
4. Replace `<password>` with your actual password
5. Add `/city-girl` at the end (your database name):
   `mongodb+srv://citygirl:YOURPASSWORD@citygircluster.abc123.mongodb.net/city-girl`
6. Paste this as `MONGODB_URI` in your backend `.env`

### Step 6 — View Your Orders

1. Atlas dashboard → "Browse Collections"
2. You'll see your `city-girl` database with an `orders` collection
3. Every order placed on the website appears here in real time

---

## Adding a Custom Domain

### Buy a domain

Good registrars for India:
- GoDaddy — often cheapest for `.com`
- Namecheap — good support
- Google Domains (now Squarespace Domains)

Example: `citygirlsarees.com` costs around ₹800–1200/year.

### Connect to Vercel

1. Vercel dashboard → your project → "Settings" → "Domains"
2. Type your domain (e.g., `citygirlsarees.com`) → "Add"
3. Vercel shows you DNS records to add. Two options:

**Option A — Point nameservers to Vercel (easiest):**
Go to your registrar → Nameservers → change to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
Takes 10–60 minutes to activate.

**Option B — Add a CNAME record:**
At your registrar's DNS settings, add:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```
For the root domain (without www), add an A record:
```
Type: A
Name: @
Value: 76.76.21.21
```

4. Back in Vercel — click "Verify" — once DNS propagates, your site is live at your domain with free HTTPS.

---

## Payment Integration (Future)

The checkout page has a placeholder section ready. Here's how to add payments:

### Option 1 — Razorpay (Recommended for India)

1. Sign up at https://razorpay.com → get test API keys
2. Install: `npm install razorpay`
3. In `src/components/Checkout.jsx`, replace the payment placeholder with:

```javascript
// Add this function
async function initiatePayment() {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY,
    amount: grandTotal * 100, // in paise
    currency: 'INR',
    name: 'City Girl Sarees',
    description: 'Saree Order',
    handler: function(response) {
      // Payment successful — place order
      handleSubmit(response.razorpay_payment_id);
    },
    prefill: { name: form.name, contact: form.phone },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
}
```

4. Add Razorpay script in `public/index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

5. Add `.env`: `REACT_APP_RAZORPAY_KEY=rzp_test_XXXXXXXXXX`

### Option 2 — Stripe (International)

1. Sign up at https://stripe.com → get test keys
2. Install: `npm install @stripe/stripe-js @stripe/react-stripe-js`
3. Follow Stripe's React guide: https://stripe.com/docs/stripe-js/react

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| State | Context API + useReducer |
| Styling | Plain CSS (per-component files) |
| HTTP | Axios (wired up, ready to use) |
| Persistence | localStorage (cart) |
| Notifications | WhatsApp wa.me deep link |
| Hosting | Vercel (free) |
| Database (future) | MongoDB Atlas |
| Backend (future) | Node.js + Express |
| Payments (future) | Razorpay / Stripe |
| Media Storage | AWS S3 |

---

## Common Issues

**"npm start" fails with module not found**
Run `npm install` again. If it still fails, delete `node_modules/` and run `npm install`.

**WhatsApp link doesn't open**
Check that `REACT_APP_SELLER_WHATSAPP` in `.env` has no spaces, no `+` sign, and includes the country code.

**Images not showing**
Make sure the S3 bucket has public read access and the URL is correct. Test the URL directly in a browser.

**Changes not showing after deploy**
Clear browser cache (Ctrl+Shift+R). On Vercel, check "Deployments" to confirm the latest push was built.

**Cart items lost on refresh**
This shouldn't happen — the cart uses localStorage. Check that your browser doesn't block localStorage (some privacy modes do).

---

*Built with ❤️ for City Girl Sarees*
