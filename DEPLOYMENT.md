# PropVault Deployment Guide

## Prerequisites

- Node.js 20+
- Docker & Docker Compose (recommended)
- Domain + SSL (production)
- Accounts: Cloudinary, Google Maps, Stripe, Twilio, Resend/OpenAI (optional)

---

## Option A: Docker Compose (Full Stack)

1. Copy environment files:

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

2. Set production secrets in `backend/.env` (never commit real secrets).

3. Build and start:

```bash
docker compose up -d --build
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run db:seed
```

4. Verify:
   - `curl http://localhost:4000/api/health`
   - Open `http://localhost:3000`

---

## Option B: Manual Production Deploy

### PostgreSQL

Use managed Postgres (AWS RDS, Supabase, Neon). Set:

```
DATABASE_URL=postgresql://user:pass@host:5432/propvault?sslmode=require
```

Run migrations:

```bash
cd backend && npx prisma migrate deploy
```

### Redis

```
REDIS_URL=rediss://default:password@redis-host:6379
```

### Elasticsearch

- Elastic Cloud or self-hosted cluster
- Set `ELASTICSEARCH_NODE` and ensure index is created on API boot

### Backend (Express)

Deploy to Railway, Render, AWS ECS, or VPS:

```bash
cd backend
npm ci
npx prisma generate
npm run build
NODE_ENV=production node dist/index.js
```

**Environment variables (required):**

- `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `CORS_ORIGIN` = your frontend URL
- `REDIS_URL`, `ELASTICSEARCH_NODE`

**Stripe webhook:** Point to `https://api.yourdomain.com/api/stripe/webhook` (requires raw body — configure reverse proxy accordingly).

### Frontend (Next.js)

Deploy to Vercel or container:

```bash
cd frontend
npm ci
npm run build
npm start
```

Set:

- `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api`
- `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## Security Checklist

- [ ] Rotate `JWT_SECRET` / `JWT_REFRESH_SECRET` (32+ chars)
- [ ] Enable HTTPS everywhere
- [ ] Restrict CORS to production domain
- [ ] Rate limiting enabled (default 100 req / 15 min)
- [ ] Prisma parameterized queries (SQL injection protection)
- [ ] Helmet headers + input validation (Zod)
- [ ] Image upload MIME validation
- [ ] Role-based access on admin routes
- [ ] Store secrets in vault (not git)

---

## Scaling Architecture

```
                    ┌─────────────┐
                    │   CDN / LB  │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  Next.js   │  │  Express   │  │  Socket.io │
    │  (SSR/ISR) │  │  API x N   │  │  (chat)    │
    └────────────┘  └─────┬──────┘  └────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  ┌───────────┐    ┌────────────┐    ┌──────────────┐
  │ PostgreSQL│    │   Redis    │    │ Elasticsearch│
  └───────────┘    └────────────┘    └──────────────┘
```

- **Horizontal scaling:** Stateless API instances behind load balancer
- **Cache:** Redis for search results, featured listings
- **Search:** Elasticsearch for keyword/geo/polygon queries
- **Media:** Cloudinary CDN for property images
- **DB:** Read replicas for heavy listing queries

---

## Post-Deploy

1. Seed or import cities/areas data
2. Create admin user or use seed account (change password immediately)
3. Configure Stripe products for agency plans
4. Submit sitemap (`/sitemap.xml` — add via Next.js metadata routes)
5. Monitor: API health, ES cluster, Redis memory

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Empty homepage listings | Run `npm run db:seed -w backend`, ensure API is up |
| Search returns DB only | Start Elasticsearch; set `useElasticsearch=true` |
| OTP not received | Check Twilio creds; dev mode logs OTP to console |
| Maps blank | Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| Upload fails | Configure Cloudinary or use dev placeholder |

---

## CI/CD Suggestion

```yaml
# .github/workflows/deploy.yml (outline)
- npm ci && npm run build
- prisma migrate deploy
- docker build & push
- deploy to staging → smoke test → production
```

For questions or extensions (voice search, push notifications, heatmaps), extend services in `backend/src/services/` and matching frontend routes.
