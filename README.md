# The Posy 🌸

A multi-vendor online flower marketplace connecting independent Belgian florists with customers. Full-stack MERN application built as a portfolio project.

## Features

- **Vendor portal** — florists register, manage a shop profile (with a map location), and list bouquets with titles, descriptions, categories, images, inventory, and EUR prices.
- **Customer experience** — browse and search bouquets, find nearby florists on an interactive map of Belgium, and check out as a guest or registered user.
- **Checkout & invoicing** — Stripe-powered payments (Payment Intents + Elements), a mandatory email on every order, and an automatically generated PDF invoice emailed on payment success.
- **Order tracking** — live status updates (Received → Preparing → Out for Delivery → Delivered) pushed to the customer in real time over Socket.IO, plus estimated delivery time.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Leaflet/react-leaflet, Stripe Elements |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB / Mongoose (2dsphere geo index for vendor locations) |
| Payments | Stripe (Payment Intents + Elements, webhook-driven) |
| Email/PDF | Nodemailer (Ethereal fallback in dev), PDFKit |
| Auth | JWT in httpOnly cookies, bcrypt password hashing |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |

## Project Structure

```
theposy.be/
├── client/                 # React (Vite) frontend
│   src/
│   ├── api/                # axios wrappers per resource
│   ├── components/         # layout, map, product, cart, checkout, vendor, order, common
│   ├── contexts/           # AuthContext, CartContext
│   ├── hooks/               # useAddToCart, useOrderSocket
│   ├── pages/               # customer, vendor, auth pages
│   └── routes/              # ProtectedRoute
├── server/                 # Express API + Socket.IO
│   src/
│   ├── config/              # db, env, stripe, socket
│   ├── models/               # User, Vendor, Category, Product, Order
│   ├── controllers/, routes/, middleware/, validators/
│   ├── services/             # pdfService, emailService
│   └── seed.js               # demo Belgian vendors + products
├── docker-compose.yml       # local MongoDB
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local MongoDB) — or point `MONGODB_URI` at your own instance / MongoDB Atlas

### 1. Start MongoDB

```bash
docker compose up -d
```

### 2. Backend

```bash
cd server
cp .env.example .env     # defaults work out of the box for local dev
npm install
npm run dev               # http://localhost:5000
```

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

### 4. Seed demo data (optional but recommended)

```bash
cd server
npm run seed
```

This creates 5 vendors across Brussels, Antwerp, Ghent, Bruges, and Leuven with realistic bouquets. Every seeded vendor account logs in with password `password123` (e.g. `brussels@theposy.be` / `password123`).

## Environment Variables

### `server/.env`

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Mongo connection string (defaults to the local Docker instance) |
| `JWT_SECRET` | Signing secret for auth cookies — replace for anything beyond local dev |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Required for checkout to actually process payments (see below) |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Real SMTP creds; leave blank to auto-use a free Ethereal test inbox (a preview link is logged to the console for every email) |
| `CLOUDINARY_*` | Optional — image uploads use local disk storage (`server/uploads`) by default; these are unused placeholders for swapping in cloud storage later |

### `client/.env`

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable test key — checkout degrades gracefully with an explanatory message if unset |

## Testing Payments Locally

Checkout, order tracking, the vendor dashboard, and everything else works fully without Stripe configured. To exercise the actual payment step:

1. Create a free [Stripe](https://stripe.com) account and grab your **test mode** keys.
2. Set `STRIPE_SECRET_KEY` in `server/.env` and `VITE_STRIPE_PUBLISHABLE_KEY` in `client/.env`.
3. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward webhooks so payment confirmation (and the invoice email it triggers) reaches your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/orders/webhook
   ```
   Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.
4. Use Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

## Running Tests

```bash
# backend (Jest + Supertest, against a real local MongoDB)
cd server && npm test

# frontend (Vitest + React Testing Library)
cd client && npx vitest run
```

## Design Decisions & Known Limitations

- **Cart is scoped to one vendor per checkout.** Adding a bouquet from a different shop prompts to start a new cart — a common simplification for multi-vendor marketplaces that avoids split-payment complexity (Stripe Connect would be the natural next step).
- **No admin moderation UI.** Vendors auto-approve on registration; the `status` field on `Vendor` still models `pending`/`suspended` for a future review workflow.
- **Vendor location entry is lat/lng inputs**, not a full geocoder or map-click picker — practical for an MVP, with a hint for finding coordinates via Google Maps.
- **Image uploads use local disk storage** by default (zero-config); the upload middleware is isolated so swapping in Cloudinary/S3 only touches one file.
- **Delivery fee is a flat rate** rather than distance-based pricing.

## Status

All core features are implemented and verified against a running instance: vendor auth/catalog/dashboard, customer auth/browsing/cart, the Leaflet map, Stripe-based checkout, PDF invoicing + email, and real-time order tracking via Socket.IO.
