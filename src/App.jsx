import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fontsource/sora';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard'; 
import './index.css';

// Placeholder Pages for demonstration
const TransactionsPage = () => <div className="font-sora text-2xl font-bold">Transactions Module</div>;
const InsightsPage = () => <div className="font-sora text-2xl font-bold">Insights Engine</div>;

function App() {
  return (
    <BrowserRouter>
       <Routes>
          <Route path="/" element={<AppLayout />}>
             <Route index element={<Dashboard />} />
             <Route path="transactions" element={<TransactionsPage />} />
             <Route path="insights" element={<InsightsPage />} />
          </Route>
       </Routes>
    </BrowserRouter>
  );
}

export default App;
