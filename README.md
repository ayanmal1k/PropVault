# PropVault — Enterprise Real Estate Marketplace

**PropVault** is an original, production-ready real estate platform inspired by modern property portals. It uses a unique brand and UI — not a copy of [Zameen](https://www.zameen.com/) or any third-party site.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Cache | Redis |
| Search | Elasticsearch 8 |
| Media | Cloudinary |
| Maps | Google Maps Embed API |
| Auth | JWT + refresh tokens, SMS OTP (Twilio) |
| Payments | Stripe subscriptions |
| Real-time | Socket.io (chat) |
| AI | OpenAI (recommendations, price prediction) |
| Deploy | Docker Compose |

## Project Structure

```
propvault/
├── frontend/          # Next.js 15 app
│   └── src/
│       ├── app/       # Pages (App Router)
│       ├── components/
│       ├── lib/
│       └── store/
├── backend/           # Express API
│   ├── prisma/        # Schema + seed
│   └── src/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       └── lib/
├── packages/shared/   # Shared types & enums
├── docker-compose.yml
├── DEPLOYMENT.md
└── .env.example
```

## Quick Start (Local)

### 1. Infrastructure

```bash
docker compose up -d postgres redis elasticsearch
```

### 2. Environment

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` — at minimum set `DATABASE_URL` and `JWT_SECRET`.

### 3. Install & Database

```bash
npm install
cd backend && npx prisma migrate dev --name init
npm run db:seed -w backend
```

### 4. Run

```bash
npm run dev
```

- **Web:** http://localhost:3000  
- **API:** http://localhost:4000/api  

### Demo Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@propvault.com | Admin@123 |
| Agent | agent@propvault.com | Admin@123 |

## Core Features

- Buy / Rent / Commercial / Plots / New Projects
- Advanced search (Elasticsearch + PostgreSQL fallback)
- Property detail: gallery, 360/video tours, maps, amenities, nearby places
- Agencies & agents, verification badges
- User dashboard, favorites, saved searches
- Admin: approve listings, analytics, reports
- Mortgage & ROI calculators, area guides, blog CMS
- WhatsApp inquiry, AI recommendations, price prediction
- Stripe agency subscriptions, Cloudinary uploads
- Dark mode, responsive glassmorphism UI

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Email registration |
| `POST /api/auth/login` | Email login |
| `POST /api/auth/otp/send` | SMS OTP |
| `GET /api/properties/search` | Search with filters |
| `GET /api/properties/:slug` | Property detail |
| `GET /api/admin/dashboard` | Admin stats |
| `POST /api/calculators/mortgage` | Mortgage calc |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup.

## License

MIT — for educational and commercial use. Ensure compliance with local real estate regulations when going live.
