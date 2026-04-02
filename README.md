# FinSight — Personal Finance Dashboard

> Built for the Zoryvn Frontend Intern Assignment · React + Vite · April 2026

A behavior-aware finance dashboard that tells you what your money is doing — not just how much of it is gone.

Most dashboards show you numbers. FinSight shows you patterns.

---

## Live Demo

https://zoryvn-finance-dashboard.vercel.app

---

## Problem

Standard finance tools dump raw transaction data on you and call it insight. Users don't relate to bar charts — they relate to "you ordered food 9 times in 48 hours." This project bridges that gap.

---

## What I Built

### Dashboard Overview
- 4 animated summary cards — Balance, Income, Expenses, Savings Rate
- Numbers count up from zero on load via Framer Motion springs
- Balance trend (3-month area chart with teal gradient)
- Spending breakdown by category (donut chart, hover to expand)

### Transactions
- Full transaction list with date, amount, category, type
- Search by title, filter by category/type, sort by date or amount
- 800ms skeleton loaders on initial render
- Meaningful empty states when filters return nothing
- **Admin only:** Add transaction via slide-up modal

### Insights Engine
- **Personality tags** — derived from behavior (e.g. "Weekend Warrior", "Late Night Spender")
- **Suspicious activity detection** — flags burst spending, duplicate subscriptions, unusual spikes
- **Actionable suggestions** — "Cut food orders by 20% → save ₹2,000/month"
- **Monthly comparison** — 3-month bar chart by category
- **Category ranking** — animated horizontal progress bars

### Financial Health Score
Score out of 100, computed from three sub-metrics:
- Savings rate (40 pts)
- Spending consistency — standard deviation of monthly expenses (30 pts)
- Category balance — penalizes if one category > 60% of total (30 pts)

### Role-Based UI
| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✓ | ✓ |
| View transactions | ✓ | ✓ |
| View insights | ✓ | ✓ |
| Add transaction | ✗ | ✓ |
| Admin panel | ✗ | ✓ |

Switch roles via the toggle in the sidebar. Role persists across sessions.

### Admin Panel
A dedicated management view (Admin only):
- Full transaction table with edit, delete, bulk actions
- Inline delete confirmation (no accidental deletions)
- Status labels — Verified, Flagged, Duplicate, Normal
- Export transactions as CSV
- Filters + pagination (10 rows per page)

---

## Why These Tech Choices

| Tool | Why |
|---|---|
| **Zustand** | 55 lines to manage all global state vs 400+ with Redux. No boilerplate. |
| **Recharts** | Lightweight, animates cleanly, no D3 overhead for this scope. |
| **Framer Motion** | `AnimatePresence` handles modal exit animations properly — CSS alone can't. |
| **DM Mono** | Monospace font for all numbers — makes financial data feel precise and scannable. |
| **localStorage persist** | Zero backend requirement, data survives refreshes, offline-ready. |

---

## Key Design Decisions

**Behavior over data.** The insights page classifies *how* you spend, not just *what* you spent. Personality tags and suspicious activity detection make patterns visible that raw numbers hide.

**Derived, not hardcoded.** Every insight, tag, suggestion, and alert is computed from `derive.js` at runtime. Change the mock data — the entire insight layer updates automatically.

**Role difference is obvious.** Viewer sees a `👁 Viewer mode` indicator on the dashboard itself. Admin gets a full panel. It's not just a hidden button.

**Empty states have personality.** "Nothing matches those filters." not "No results found." Every system message sounds like a person wrote it.

---

## Tradeoffs

- **Mock data instead of live API** — by design for this scope. The `derive.js` layer is backend-ready; swap `mockData.js` for an API call and nothing else changes.
- **Client-side analytics** — works fine at this scale. At production scale, aggregations would move server-side.
- **No auth system** — role is toggled in UI, not authenticated. A real RBAC system would verify role via JWT claims.

---

## Project Structure

```
src/
├── components/
│   ├── layout/          Sidebar, Topbar, RoleToggle
│   ├── dashboard/       SummaryCards, BalanceTrendChart, SpendingBreakdown
│   ├── transactions/    TransactionList, FilterBar, AddTransactionModal
│   ├── insights/        StoryCards, SuspiciousAlerts, PersonalityCard, HealthScore
│   ├── admin/           AdminPanel, TransactionTable, EditModal
│   └── ui/              Button, Badge, Toast, EmptyState, Skeleton
├── data/
│   └── mockData.js      55 transactions across Aug–Oct 2025
├── pages/
│   ├── Overview.jsx
│   ├── Transactions.jsx
│   ├── Insights.jsx
│   └── AdminPanel.jsx
├── store/
│   └── useFinanceStore.js   Zustand + localStorage persistence
├── utils/
│   └── derive.js            All analytics logic — totals, patterns, insights, score
├── AppLayout.jsx
└── index.css
```

---

## Setup

```bash
git clone <your-repo-url>
cd zoryvn-finance-dashboard
npm install
npm run dev
```

Open at `http://localhost:5173`

No environment variables needed. No backend. Works offline.

---

## Future Scope

- Bank API integration (Setu / Plaid) for real transaction data
- ML-based spending predictions using historical patterns
- Budget goal-setting with progress tracking
- Multi-currency support
- Export to CSV/JSON (partially implemented in Admin panel)
- Advanced date range filtering and grouping

---

## Mock Data Notes

- 55 transactions across August–October 2025
- Includes a 9-order food burst on Oct 14–15 (triggers suspicious activity alert)
- Two active streaming subscriptions — Netflix + Hotstar (triggers duplicate detection)
- Realistic amounts — ₹487 not ₹500, ₹9,200 not ₹9,000
- Transaction titles read like actual UPI history: "Blinkit - Curd + bread", "Mom sent money", "Ola ride to airport"

---

Built by Vansh · IIIT Bhopal
