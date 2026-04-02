import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import AdminPanel from './pages/AdminPanel';
import CustomCursor from './components/CustomCursor';
import './index.css';

const NOISE_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E";

const NoiseTex = () => (
  <div
    id="noise"
    aria-hidden="true"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9997,
      pointerEvents: 'none',
      opacity: 0.035,
      backgroundImage: 'url("' + NOISE_SVG + '")',
    }}
  />
);

function App() {
  return (
    <>
      <NoiseTex />
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="insights" element={<InsightsPage />} />
          </Route>
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
