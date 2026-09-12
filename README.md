# The Posy 🌸

A multi-vendor online flower marketplace connecting independent Belgian florists with customers. Built as a full-stack MERN application.

## Features

- **Vendor portal** — florists register, manage a shop profile (with map location), and list bouquets with prices in EUR, inventory, and images.
- **Customer experience** — browse bouquets, find nearby florists on an interactive map of Belgium, and check out as a guest or registered user.
- **Checkout & invoicing** — Stripe-powered payments, mandatory email on every order, automatic PDF invoice generation and delivery by email.
- **Order tracking** — live status updates (Received → Preparing → Out for Delivery → Delivered) pushed to the customer in real time.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Leaflet |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB / Mongoose |
| Payments | Stripe (Payment Intents + Elements) |
| Email/PDF | Nodemailer, PDFKit |
| Auth | JWT (httpOnly cookies), bcrypt |

## Project Structure

```
theposy.be/
├── client/    # React frontend
├── server/    # Express API + Socket.IO
└── docker-compose.yml  # local MongoDB
```

## Getting Started

> Full setup instructions (env vars, seeding demo data, running both apps) are documented as the project is built out.

```bash
# start local MongoDB
docker compose up -d

# backend
cd server && npm install && npm run dev

# frontend
cd client && npm install && npm run dev
```

## Status

🚧 Actively being built in structured, incremental commits.
