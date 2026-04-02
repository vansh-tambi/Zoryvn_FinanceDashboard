# Zoryvn Finance Dashboard ✦

A highly premium, deeply interactive, and visually stunning personal finance tracking application. Engineered natively with **React** and **Vite**, Zoryvn abandons generic layouts for a bespoke, glassmorphic `#030712` dark-mode aesthetic with human-centric design.

The dashboard isn't just a ledger — it's a predictive analytics engine powered by mathematically dense derivations, robust edge-casing, and a world-class micro-animation physics system built to react to every user interaction naturally.

---

## ✨ Exhaustive Feature Overview

### 🎨 State-of-the-Art Aesthetic & Typography
- **Strict Typographic Hierarchy**: Every UI label, description, and copy element runs on **Sora** (`uppercase`, wide-tracking for labels). Every single financial amount and data point runs on **DM Mono** (`tabular-nums`) natively aligning numbers perfectly across all lists and charts.
- **Subconscious Tactile Noise Texture**: A global fixed procedural SVG `<feTurbulence>` filter coats the entire application at `3%` opacity, destroying the generic "digital flat" feel and rendering the dashboard with a physical, grain-like tactility.
- **Bespoke Recharts Overrides**: Recharts' default structures are fully dismantled. Floating custom dark-card tooltips feature `#0d1f3c` backgrounds, precise DM Mono readouts, explicit color-dot mapping, and soft `0 4px 20px #00000060` shadows perfectly matching the global interface layer.
- **Humanized UI Text**: We audited every single string in the interface. Away with "Transaction Added Successfully" — in with *"Got it — transaction saved."* System prompts are replaced with specific, opinionated human language (e.g., *"Technically perfect — but start tracking outflows and we'll show you where things actually go"*).

### 🕹️ World-Class Micro-Interaction Physics
- **4-State Spring Custom Cursor**: The native cursor is dead. We implemented an absolute physics-based cursor running via `requestAnimationFrame` and linear interpolation (`lerp`). The cursor intelligently identifies 4 distinct DOM states:
  - `Default`: Precise 32px contrasting ring.
  - `Content`: Enlarges to 50px teal ring across all cards and text.
  - `Interactive`: Spin animations lock onto native buttons & links.
  - `Data`: Snaps into a 28px crosshair over raw `.font-mono` numbers.
- **Zero Native Scrollbars**: Seamless `cursor: none !important` coverage with forced `::-webkit-scrollbar { display: none; }` means the custom tracker never breaks, even while scrubbing through overflow tracks.
- **Native Easing & Spring Physics**: Explicit tracking mechanics enforcing CSS defaults into dynamic Framer hooks (`stiffness: 200`/`damping: 20` native mousedown springs mapped seamlessly).
- **Scale Bounding & Stagger Loops**: Render arrays intelligently initiate sequentially staggered lists capped to prevent load lag, throwing cascading origin boundaries masking standard `<div/>` layouts seamlessly.

### 🧠 Deep Analytics & Intelligence Engine
- **Financial Health Scoring Engine**: Computes a dynamic 100-point grade recursively weighing your active Savings Ratio (40%), Standard Deviation structural consistency (30%), and individual Category concentration limits (30%).
- **Actionable AI-like Insights**: Flags distinct spending vulnerabilities — predicting duplicate active subscriptions, targeting sub-20% savings gaps, and suggesting realistic constraint drops.
- **Suspicious Pattern Mapping**: Built-in array aggregators detect anomalous bursts grouped natively by aggressive 48-hour arrays, unusual single expenditures, and localized time-of-day behavioral clusters.
- **Algorithmic Personality Tagging**: Assigns dynamic spending personas (e.g. *Night Owl Shopper*, *Weekend Warrior*, *Foodie*) based directly on your precise transaction footprint.

### 🛡️ Robust State & Absolute Edge Casing
- **Absolute 0-Transaction Overrides**: Highly-stylized, hand-crafted SVG Empty States (like the minimal line-art sad wallet) dynamically capture and guide users when no metrics exist.
- **"100% Savings" Pure-Income Checks**: Intelligently overrides Insights tables directly preventing division faults whenever localized users cast Income without touching absolute Outbound channels.
- **Live Local Storage Persistence**: Handled locally via `localStorage` arrays mounted onto the `Zustand` global cache parsing live DOM boundaries immediately shifting charts visually on edit.

---

## 🚀 Technical Stack

- **Core Framework**: [React 18](https://react.dev/) bundled via [Vite](https://vitejs.dev/)
- **Aesthetic Boundaries**: [Tailwind CSS v4](https://tailwindcss.com/) (Deep `#030712` slate palettes & Custom glassmorphic borders)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animation Physics**: [Framer Motion](https://www.framer.com/motion/)
- **Data Plotting**: [Recharts](https://recharts.org/)
- **Vector Iconography**: [Lucide React](https://lucide.dev/)
- **Master Typography**: [Fontsource Sora](https://fontsource.org/fonts/sora) & [Fontsource DM Mono](https://fontsource.org/fonts/dm-mono)

---

## 📁 System Architecture

```text
src/
├── components/          # Scalable interactive UI mounts (CategoryPieChart, SummaryCards, CustomCursor)
├── data/                # Mock array schemas loaded with highly-realistic, human-sounding UPI data
├── pages/               # Primary layout instances (Overview, Transactions, Insights)
├── store/               # Zustand hooks orchestrating persistence loops and active filters
├── utils/               # Intensive analytical derivation formulas (`derive.js`)
├── AppLayout.jsx        # Root layout parsing explicit Framer navigation paths & toast portals
└── index.css            # Global visual resets (Scrollbar obliteration, strict cursor defaults)
```

---

## 🛠️ Local Environment Boot

1. **Pull Dependencies:**
   ```bash
   npm install
   ```

2. **Launch the Environment Interface:**
   ```bash
   npm run dev
   ```

3. Fire open the port in your browser. All interactions scale completely bound to your browser's persistent `localStorage`. Add new records out of the ledger dashboard via the tracking button to instantly see global metrics mathematically offset themselves across all charts, widgets, and suggestions natively!