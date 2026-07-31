# Black Ridge Realty Terminal

**Buyer Operations Intelligence** — see buyer readiness, financing gaps, target markets, and pipeline movement in one
private command center.

Black Ridge Realty Terminal is a real-estate operations adaptation of the original Black Ridge Terminal. It preserves
the same institutional dashboard aesthetic while replacing wealth-modeling workflows with durable buyer records,
intake-gap monitoring, financing readiness, target-market intelligence, and a live purchase pipeline.

## What it does

- Stores buyer and household records in a durable Cloudflare D1 database
- Tracks target market, purchase budget, down payment, credit band, financing status, and timeline
- Makes missing documents and intake details visible
- Supports live pipeline-stage updates from inquiry through closing
- Summarizes active households, represented buying power, financing readiness, and open gaps
- Ranks target markets by household count and represented buying power
- Keeps the operations workspace private when deployed through Sites access controls

## Product structure

The primary workspace lives at `/dashboard/real-estate`. The existing dashboard shell, themes, responsive layout, and
component system remain intact so the product still feels like Black Ridge rather than a generic CRM.

Buyer records are available through:

- `GET /api/buyers`
- `POST /api/buyers`
- `PATCH /api/buyers/:id`

Inputs are validated before writes, and database access is kept behind a small server-side helper.

## Tech stack

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v4
- shadcn/ui (`radix-nova`)
- Cloudflare D1 for structured persistent data
- OpenNext Cloudflare adapter for production runtime compatibility
- Drizzle schema and generated SQL migrations

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The app redirects to the Realty Terminal.

## Validate and package

```bash
npm run db:generate
npm run build
npm run build:cloudflare
```

## Data responsibility

This workspace is intended for authorized real-estate operations. Only collect and store information you are permitted
to manage, and apply any brokerage, lender, privacy, retention, and security requirements that govern your work.

## License and attribution

This project remains MIT-licensed. It is derived from the original Black Ridge Terminal created and customized by Cody
Hatfield, which was built on the open-source `next-shadcn-admin-dashboard` scaffolding.
