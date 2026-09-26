# InsureFlow — Insurance & Claims Platform

**InsureFlow** is a full-stack insurance operations platform for carriers, MGAs and brokers. It unifies the entire policy lifecycle — quoting, binding, underwriting, claims, renewals, premiums, reserves, commissions and analytics — behind a single modern Next.js application with a polished, themeable UI and realistic mock data, so you can run the whole demo end-to-end without a backend.

> **Insurance operations, unified.** One source of truth for every policy, claim, adjuster and payment.

---

## Overview

| | |
|---|---|
| **App name** | InsureFlow |
| **Repo** | `github.com/KhalidKhan541/insureflow` |
| **Stack** | Next.js 14 (App Router) · TypeScript · Tailwind CSS · framer-motion |
| **Data** | Rich in-memory mock dataset (`src/lib/mock-data.ts`) — no DB required |
| **License** | MIT |

InsureFlow ships two experiences:

1. **Marketing site** — a conversion-focused landing page (hero, feature grid, pricing, testimonials, CTA band, footer) with framer-motion scroll reveals.
2. **Operations dashboard** — policy, claims, underwriting, renewals, agent, payment, fraud and analytics views driven by realistic mock data.

---

## Features

| Module | What it does |
|---|---|
| **Policies** | Quote, bind, endorse, cancel and renew policies with full version history and on-demand document generation. |
| **Claims** | FNOL intake, adjuster assignment, reserves, settlements and payment runs on one claim timeline. |
| **Underwriting** | Appetite rules, risk scoring and referral workflows that keep underwriters in control of submissions. |
| **Renewals** | Prioritised renewal queue with lapse-risk scoring, re-rating and one-click re-quote. |
| **Agents** | Appointments, books of business, commission plans, production goals and leaderboards. |
| **Payments** | Premium billing, instalments, refunds and reconciliation across card, ACH and cheque. |
| **Fraud** | Rules and anomaly scoring that flag suspicious claims and provider patterns early. |
| **Analytics** | Live loss ratio, combined ratio, reserve adequacy and leakage dashboards with charts. |
| **Platform** | Sticky nav landing page, dark/light theming, toast notifications, health endpoint, 404 handling. |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 14.2](https://nextjs.org/) (App Router, React 18, TypeScript 5.5) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com/) with design tokens (`--if-*` CSS variables), `darkMode: 'class'` |
| Motion | [framer-motion 11](https://www.framer.com/motion/) inside a `MotionConfig` (`reducedMotion="user"`) |
| Charts | [Recharts 2.12](https://recharts.org/) |
| Notifications | [react-hot-toast](https://react-hot-toast.com/) |
| Validation | [Zod 3.23](https://zod.dev/) |
| Utilities | `clsx`, `tailwind-merge`, `date-fns` |
| Tooling | ESLint (`eslint-config-next`), `tsc --noEmit` typecheck |

---

## Quick start

**Prerequisites:** Node.js 18.17+ and npm 9+.

```bash
git clone https://github.com/KhalidKhan541/insureflow.git
cd insureflow
npm install
cp .env.example .env.local   # optional — the app runs on mock data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and
[http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the operations dashboard.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking (`tsc --noEmit`) |

---

## Project structure

```
insureflow/
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  └─ health/
│  │  │     └─ route.ts        # Health check endpoint (force-dynamic, no-store)
│  │  ├─ dashboard/
│  │  │  ├─ analytics/
│  │  │  │  └─ page.tsx        # Analytics & reporting
│  │  │  └─ page.tsx           # Operations overview
│  │  ├─ layout.tsx            # Root layout: providers, Inter font, metadata, theme script
│  │  ├─ not-found.tsx         # 404 page (self-contained gradient text)
│  │  └─ page.tsx              # Landing page (hero, features, pricing, testimonials, footer)
│  ├─ components/
│  │  └─ ui/                   # Reusable UI primitives (Badge, Card, MetricCard, …)
│  ├─ contexts/                # ThemeProvider, SidebarProvider, NotificationProvider
│  └─ lib/
│     ├─ mock-data.ts          # Realistic insurance dataset used across all screens
│     └─ utils.ts              # cn() helper + formatters (currency, number, percent, dates)
├─ .env.example
├─ .gitignore
├─ next.config.js
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts          # `if-*` design tokens, animations, z-index scale
├─ tsconfig.json               # `@/*` path alias → `./src/*`
└─ LICENSE
```

---

## Routes

### Pages

| Route | Description |
|---|---|
| `/` | Marketing landing page — hero, 8-feature grid, pricing, testimonials, CTA, footer |
| `/dashboard` | Operations overview — KPIs, open claims, policy status, premium vs. claims, top agents |
| `/dashboard/analytics` | Analytics & reporting — trend charts and breakdowns |

Dashboard sub-modules (policies, claims, underwriting, renewals, agents, payments, fraud) live under `/dashboard/*`.

### API

| Route | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check — `{ status, service, version, uptime, timestamp }`. Declared `force-dynamic` with `Cache-Control: no-store`, so it is never cached or prerendered. `HEAD` is also supported. |

Unknown routes render `src/app/not-found.tsx`.

---

## Theming

InsureFlow is token-driven and ships with light + dark themes:

- **Theme class** — the active theme is applied as a class on `<html>` (`dark` / `light`). `tailwind.config.ts` uses `darkMode: 'class'`.
- **Pre-hydration script** — an inline script in the root layout reads the stored `if-theme` value from `localStorage` and applies the class *before* React hydrates, so there is no flash of the wrong theme.
- **Design tokens** — all colors map to CSS variables in `src/app/globals.css`, namespaced `--if-*` (e.g. `--if-background`, `--if-primary`, `--if-border`), exposed through Tailwind as `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc.
- **Brand scale** — a custom teal `if-*` palette anchored on `#0d9488` plus an `if-sky` accent scale for charts and highlights.
- **Motion & effects** — named `if-*` keyframes/animations (fade, slide, shimmer, count-up, glow), `shadow-if*` elevation levels and an `if-*` z-index scale (`sidebar`, `header`, `dropdown`, `modal`, `toast`).
- **Font** — Inter loaded via `next/font` and exposed as `--if-font-sans`.

To change the look, edit the `--if-*` variables and the `if` palette in `tailwind.config.ts`; every screen picks the change up automatically.

---

## Mock data

There is no database or external API dependency. `src/lib/mock-data.ts` contains a realistic, type-safe insurance dataset shared by every dashboard screen:

- Policy book with statuses (Active, Pending Renewal, In Underwriting, Lapsed, …)
- Claims with severity, reserves, assigned adjusters and SLA states
- Agents with books of business and production targets
- Premium vs. claims paid time series, policy status mix, activity feed
- Dashboard KPIs (total premium, open claims, loss ratio, renewal rate)

`src/lib/utils.ts` provides `cn()` (className merge) plus `formatCurrency`, `formatNumber`, `formatPercent` and date helpers so every screen renders numbers consistently.

To swap in a real backend, replace the mock imports with fetches from your API — the components already consume plain, serializable objects.

---

## License

MIT © 2026 [KhalidKhan541](https://github.com/KhalidKhan541)

See [LICENSE](./LICENSE) for the full text.
