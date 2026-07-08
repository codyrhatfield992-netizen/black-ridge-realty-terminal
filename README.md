# Black Ridge Terminal

**Institutional Wealth Intelligence** — see capital, risk, and opportunity in one command center.

Black Ridge Terminal is a free, browser-based institutional finance tool for modeling capital, risk, valuation, allocation, and wealth strategy. It was built and customized by **Cody Hatfield** (Finance, Risk Management & Insurance, and Marketing student, Eastern Kentucky University) as a portfolio project, inspired by institutional platforms like Bloomberg Terminal, BlackRock Aladdin, and Addepar. Edit a set of assumptions and watch net worth, valuation, risk, and scenario outcomes recalculate instantly — entirely in your browser, for free, with no account required.

> **Live tool:** open `/dashboard/terminal` after running the project locally (see [Getting Started](#getting-started)). This is also the site's landing route — opening the app at `/` redirects straight into the Terminal.

Black Ridge Terminal was built/customized by Cody Hatfield as a finance, risk management, and fintech portfolio project.

## 1. Project Overview

Black Ridge Terminal models a capital position the way a private wealth analyst or investment banking associate would: assets and liabilities, liquidity and savings rate, portfolio allocation, a discounted cash flow valuation, scenario comparisons, risk exposure, a cash flow forecast, and a sensitivity matrix — all driven from one editable assumptions panel and summarized in an auto-generated advisor memo. The default model is populated with a sample profile connected to my own academic and career focus (wealth management, risk management, real estate finance, and fintech), including a modeled income stream from an early-stage venture project, **TerraCloud**.

## 2. Problem Solved

Most public "net worth calculator" tools are consumer-grade: a single balance figure, a pie chart, maybe a savings goal. They don't show how capital decisions connect to valuation, risk, or scenario planning the way institutional tools do. Black Ridge Terminal closes that gap with a single-page model that treats personal capital with the same rigor as an enterprise valuation — without requiring a bank login, a paid data feed, or a backend.

## 3. Why I Built It

I wanted a portfolio piece that demonstrates product thinking, financial modeling, and front-end craft together — not another CRUD dashboard. As a business student focused on wealth management, risk, real estate finance, and fintech, I built Black Ridge Terminal to show how those interests come together in a single, polished, public tool that anyone can open and use for free, with no account and no server.

## 4. Key Features

- **Capital Overview** — a compact dashboard header plus a KPI strip (Net Worth, Total Assets, Total Liabilities, Monthly Surplus, Wealth Health Score, Enterprise Value)
- **Quick Controls** — a top-level Scenario selector (Conservative / Base / Growth), Risk Tolerance and Time Horizon pickers, a "Load Example Profile" button, and a Reset button, so a first-time visitor can explore the model without touching a single raw input
- **Portfolio Allocation** — donut chart across five asset classes with weight breakdown
- **Valuation Model** — a simplified discounted cash flow (DCF) engine producing enterprise and equity value
- **Scenario Analysis** — bear / base / bull enterprise value comparison
- **Risk Exposure** — a composite 0–100 risk score with a radial gauge and exposure breakdown
- **Cash Flow Forecast** — projected net worth trajectory over the selected time horizon
- **Market Watchlist** — an illustrative snapshot table (clearly labeled as sample data, not a live feed)
- **Advisor Memo** — an auto-generated, analyst-style memo tied to the modeled profile, with copy and export actions
- **Sensitivity Matrix** — enterprise value across a grid of WACC and terminal growth rate assumptions
- **Editable Assumptions Panel** — every input drives the entire page instantly, including a professional/internship income line and a separate TerraCloud venture income line, with a one-click reset to defaults
- **Dashboard-style navigation** — the sidebar is a short, real dashboard list (Overview, Finance, Analytics, Pipeline, Terminal), not a marketing-page anchor menu; Terminal is the flagship view

## 5. How Anyone Can Use It for Free

Black Ridge Terminal is a public tool — there is nothing to sign up for:

1. Open the app; it lands directly on `/dashboard/terminal`.
2. Use **Quick Controls** to try a Conservative / Base / Growth scenario, change risk tolerance, or pick a time horizon.
3. Scroll down to the **Model Assumptions** panel and replace the sample figures with your own capital, income, and valuation assumptions.
4. Watch every KPI, chart, risk score, and the advisor memo recalculate instantly.
5. Copy or export the generated memo, or hit **Reset** / **Load Example Profile** to start over.

Nothing is saved between visits — refreshing the page returns to the example profile.

## 6. Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (`radix-nova` style)
- **Charts**: Recharts, via the shadcn chart wrapper
- **State**: local React state + context, scoped to the Terminal route — no global store, no server round-trips
- **Tooling**: Biome, Husky

## 7. Data & Privacy

Every calculation runs locally in your browser. There is no login, no database, no bank connection (no Plaid or similar), and no paid API. Nothing you type is uploaded, stored, or sent anywhere — refreshing the page resets the model to the example profile.

## 8. Educational Disclaimer

This project uses model/sample data for educational and portfolio purposes only. It is not a real advisor and does not provide financial, investment, or valuation advice, and it does not use or display real financial, banking, or account data. The Cody Hatfield / TerraCloud profile is an illustrative example, not a disclosure of private financial information. The Market Watchlist is illustrative sample data, not a live market feed.

## 9. Screenshots

_Add screenshots of the Terminal screen here (light and dark, desktop and mobile) before sharing publicly._

## 10. Future Roadmap

- Save/load assumption presets to local storage (still no backend)
- Export the full page as a shareable PDF/image summary
- Additional scenario levers (inflation, tax rate, contribution growth)
- Optional presets for other example profiles (early career, pre-retirement, business owner)

## 11. LinkedIn Project Description

> **Black Ridge Terminal** — a free, browser-based institutional finance tool for modeling capital, risk, valuation, allocation, and wealth strategy. Built and customized by Cody Hatfield (Finance, Risk Management & Insurance, and Marketing, Eastern Kentucky University). Edit capital, valuation, and risk assumptions — including a modeled TerraCloud venture income stream — and watch net worth, enterprise value, scenario outcomes, and an auto-generated advisor memo recalculate instantly. No login, no backend, no data ever leaves the browser. Built with Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, and Recharts.

## 12. License & Attribution

This project is MIT-licensed — see [`LICENSE`](./LICENSE) for the full text and required copyright notice, which must remain intact. Black Ridge Terminal (the `/dashboard/terminal` feature, its calculation engine, branding, and this README) was designed, modeled, and written by Cody Hatfield. It is built on top of the open-source [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) scaffolding (Next.js/shadcn project structure, UI primitives, theming) rather than on top of the original template's own dashboards or branding.

---

## How the Model Works

All calculations live in `src/app/(main)/dashboard/terminal/_components/lib/` and run synchronously in the browser as you edit assumptions:

- **Net worth & liquidity** — total assets minus liabilities; savings rate from combined professional/internship and TerraCloud venture income against expenses; emergency runway in months of cash relative to expenses.
- **Wealth Health Score** — a 0–100 composite of savings rate, cash runway, debt-to-asset ratio, and portfolio diversification (via a Herfindahl-index-based concentration measure).
- **Valuation Model** — a discounted cash flow using EBITDA as a free-cash-flow proxy, discounted at your WACC over your time horizon, plus a Gordon Growth terminal value. This is a deliberate single-page simplification (no capex, tax, or working-capital detail) — not a substitute for a real valuation.
- **Scenario Analysis** — the same DCF re-run with bear/bull deltas applied to growth rate, margin, WACC, and terminal growth; the Quick Controls scenario selector applies a coordinated preset across those same levers.
- **Risk Exposure** — a composite score from growth-asset weighting, leverage, and stated risk tolerance.
- **Cash Flow Forecast** — net worth compounded annually at a risk-tolerance-implied expected return, plus reinvested monthly surplus, over the selected time horizon.
- **Sensitivity Matrix** — enterprise value recomputed across a grid of nearby WACC and terminal growth values.
- **Advisor Memo** — a template-driven narrative built from the same computed figures, in an institutional analyst tone, referencing the modeled client profile.

## Getting Started

This project uses npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects straight to Black Ridge Terminal at `/dashboard/terminal`.

Available commands:

```bash
npm run build
npm run lint
npm run format
npm run check
npm run check:fix
```

There is currently no automated test command.

## Colocation File System Architecture

This project follows a colocation-based architecture: each feature keeps its own pages, components, and logic inside its route folder. Black Ridge Terminal lives entirely under `src/app/(main)/dashboard/terminal/`, with screen-specific components in `_components/` and the calculation engine in `_components/lib/`.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.
