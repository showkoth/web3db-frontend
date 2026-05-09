# web3db-frontend-v2

Decentralized SQL workbench. Next 16, React 19, Tailwind v4, shadcn/ui (base-ui), wagmi v2, RainbowKit, TanStack Query, Monaco SQL editor, Serwist PWA.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack dev, webpack build for Serwist)
- **Runtime**: Bun · React 19.2 · TypeScript 5 strict
- **UI**: Tailwind v4 · shadcn/ui (base-ui primitives) · Lucide · Sonner
- **State**: TanStack Query v5 · nuqs (URL state)
- **Web3**: wagmi 2 · viem · RainbowKit
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table + Virtual
- **Editor**: Monaco (lazy-loaded)
- **Graph**: @xyflow/react
- **API client**: Kubb-generated from FastAPI OpenAPI
- **Quality**: oxlint · Biome (format) · Vitest · Playwright · Storybook · size-limit
- **Observability**: Sentry (gated on DSN) · Vercel Analytics · Vercel Speed Insights
- **PWA**: Serwist (offline shell, runtime cache)

## Develop

```bash
bun install
cp .env.example .env.local      # set NEXT_PUBLIC_API_URL etc.
bun run dev                      # http://localhost:3000
```

Backend must be running at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).

## Scripts

| Command | Purpose |
|---|---|
| `bun run dev` | Dev server (Turbopack) |
| `bun run build` | Production build (webpack — Serwist) |
| `bun run start` | Serve production build |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | oxlint |
| `bun run format` | Biome format |
| `bun run test` | Vitest unit + Storybook tests |
| `bun run test:e2e` | Playwright |
| `bun run storybook` | Storybook on :6006 |
| `bun run analyze` | Bundle analyzer |
| `bun run size` | size-limit budget check |
| `bunx kubb generate` | Regenerate API client (backend must be live) |

## Env

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | Backend URL |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | recommended | From cloud.walletconnect.com (free) |
| `NEXT_PUBLIC_SENTRY_DSN` | optional | Errors disabled when unset |

## CI

- `ci.yml` — lint, format, typecheck, unit tests, build, size-limit, Playwright e2e, Lighthouse CI
- `storybook.yml` — Chromatic visual regression (requires `CHROMATIC_PROJECT_TOKEN`)

## Deploy

Designed for Vercel — `@vercel/analytics` and `@vercel/speed-insights` auto-active.
