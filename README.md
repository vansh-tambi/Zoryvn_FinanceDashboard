# FinSight — Behavior-Aware Finance Dashboard

## Problem
Most finance dashboards show you data. FinSight tells you what it means.

## Approach
Built a "behavior-aware" layer on top of transaction data — the app 
detects patterns, flags anomalies, and gives actionable suggestions, 
not just charts.

## Key Differentiators
- **Personality Engine** — classifies spending behavior dynamically
- **Suspicious Activity Detector** — flags bursts, duplicates, time patterns
- **Financial Health Score** — composite 0–100 score with sub-metrics
- **Actionable Suggestions** — "do this to save ₹X/month"
- **Story Mode** — narrative insights, not raw numbers

## Tech Decisions
- Zustand over Redux → 55 lines vs 400 lines for same outcome
- Recharts → lightweight, animates well, no D3 overhead
- derive.js separation → all analytics logic isolated and testable

## Tradeoffs
- Mock data instead of live API (by design for this scope)
- Client-side analytics (would move to backend at scale)

## Future Scope
- Bank API integration (Plaid/Setu)
- ML-based spending predictions
- Budget goal-setting with progress tracking
- Multi-currency support