import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockData } from '../data/mockData';

export const useFinanceStore = create(
  persist(
    (set, get) => ({
      transactions: mockData,
      role: 'viewer', // 'viewer' | 'admin'
      filters: {
        search: '',
        category: 'all',
        type: 'all',
        sortBy: 'date_desc'
      },
      
      // Actions
      setRole: (role) => set({ role }),
      
      setFilter: (key, value) => 
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value
          }
        })),
        
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions]
        })),
        
      editTransaction: (id, updatedDetails) =>
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...t, ...updatedDetails } : t
          )
        })),

      // Computed metrics (preserving legacy helpers)
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
    }),
    {
      name: 'finance-dashboard-storage', // name of the item in localStorage
    }
  )
);
