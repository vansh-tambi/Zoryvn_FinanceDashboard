import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fontsource/sora';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard'; 
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import './index.css';

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
