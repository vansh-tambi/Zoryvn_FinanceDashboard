# Zoryvn Finance Dashboard

A premium, interactive, and visually stunning financial tracking application. Built natively with React and Vite, the dashboard features a sleek glassmorphic dark-mode aesthetic alongside powerful predictive analytics.

## ✨ Key Features

- **Advanced Analytics Engine**: Natively tracks running balances, categorizes multi-variable spending, computes zero-spend streaks, and flags suspicious or out-of-character transaction clusters using time-of-day mathematical derivation.
- **Financial Health Score**: Natively computes a unified score (out of 100) dynamically mapping your savings rate, the coefficient of variation (consistency) of your spending, and category balance limits across an animated circular SVG.
- **Actionable AI-like Insights**: Offers tailored tracking advice—such as identifying duplicate subscriptions, detecting 3x historical spending spikes, or alerting you if your food expenditure exceeds 30% of your outbound cash.
- **Interactive Visualizations**: Includes `Recharts` synced custom dual-tone area charts, category specific pie donuts, and 3-month stacked chronological bar charts.
- **Premium Animations**: Powered by `Framer Motion`, executing smooth cross-fade page transitions, modal slide-ups, SVG path traces, scale boundaries, and reactive hover/tap states on all critical components.
- **Bulletproof State Management**: Secured entirely within your browser via `localStorage` hooked seamlessly into a `Zustand` global cache, verifying payloads via real-time UI logging badges and structural edge case formatting.

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) bundled via [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Deep `#030712` Slate Base & Custom Glassmorphism boundaries)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Fontsource Sora](https://fontsource.org/fonts/sora)

## 📁 Project Structure

```text
src/
├── components/          # Scalable UI elements (Sidebar, AddTransactionModal, Charts, Badges, Globals)
├── data/                # Initial Mock payload mapping 55 historic transaction constraints
├── pages/               # Core routing layout (Overview [Dashboard], Transactions, Insights)
├── store/               # Zustand `useFinanceStore` managing state, persistence, and filter caches
├── utils/               # Intensive analytical derivations (`derive.js`)
├── App.jsx              # React Router mapping bindings
└── index.css            # Tailwind configurations alongside strict `::-webkit-scrollbar` UI overrides
```

## 🛠️ Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Launch the environment:**
   ```bash
   npm run dev
   ```

3. Navigate to the local host URL output in your terminal to explore the dashboard. All transactions you track via the generic floating `+` button on the ledger will save seamlessly to your locally scaled storage!