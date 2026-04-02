import { create } from 'zustand';
import { mockData } from '../data/mockData';

export const useFinanceStore = create((set, get) => ({
  transactions: mockData,
  
  getMetrics: () => {
    const txns = get().transactions;
    const income = txns.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = txns.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  },
  
  getRecentTransactions: (limit = 15) => {
    return [...get().transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  }
}));
