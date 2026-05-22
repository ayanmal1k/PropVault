# PropVault Architecture

## Design Principles

- **Monorepo** with shared types (`@propvault/shared`)
- **API-first** — Next.js consumes REST; mobile apps can reuse APIs
- **Graceful degradation** — Elasticsearch, Redis, Cloudinary, Twilio optional in dev
- **Security by default** — Helmet, rate limits, Zod validation, Prisma ORM, RBAC

## Data Model (Core Tables)

| Table | Purpose |
|-------|---------|
| users | Accounts, roles, OTP, preferences |
| properties | Listings with geo, pricing, status workflow |
| agencies / agents | B2B brokerage network |
| cities / areas | Location hierarchy |
| property_types / amenities | Taxonomy |
| projects | Off-plan developments |
| subscriptions | Stripe-linked agency plans |
| favorites / saved_searches | User engagement |
| messages / leads | CRM pipeline |
| reviews / reports | Trust & safety |
| blog_posts / area_guides | SEO content |
| analytics_events | Product analytics |
| chat_rooms / chat_messages | Real-time chat |

## Request Flow

```
Browser → Next.js (SSR/RSC) → Express API → Prisma → PostgreSQL
                              ↘ Redis (cache)
                              ↘ Elasticsearch (search)
                              ↘ Cloudinary (media)
```

## Authentication

- Access JWT (15m) + refresh token (7d)
- Roles: USER, AGENT, AGENCY_ADMIN, ADMIN
- SMS OTP via Twilio for passwordless login

## Property Lifecycle

```
DRAFT → PENDING → ACTIVE (admin approve) → SOLD/RENTED/EXPIRED
```

Verified listings sync to Elasticsearch index on approval.

## Extension Points (Bonus Features)

| Feature | Location |
|---------|----------|
| AI price prediction | `backend/src/services/ai.service.ts` |
| AI recommendations | Same + `/properties/recommendations/me` |
| Real-time chat | Socket.io in `backend/src/index.ts` |
| Voice search | Add `/api/search/voice` + Web Speech API on frontend |
| Saved searches | `saved_searches` table — wire CRUD in user routes |
| Push notifications | FCM + `notifications` table |
| Property heatmaps | Geo aggregation on ES + map layer component |
| Property comparison | Frontend `/compare` with query param IDs |

## Frontend Route Map

| Route | Page |
|-------|------|
| `/` | Home (hero search, featured, cities, projects) |
| `/search` | Listings + filters |
| `/property/[slug]` | Detail + inquiry + mortgage |
| `/buy`, `/rent`, `/plots`, `/commercial` | Filter redirects |
| `/auth/login`, `/auth/register` | Auth |
| `/dashboard` | User hub |
| `/admin` | Admin panel |
| `/tools/mortgage`, `/tools/roi` | Calculators |
