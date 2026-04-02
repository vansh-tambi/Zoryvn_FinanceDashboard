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
      toast: null,
      
      // Actions
      setRole: (role) => set({ role }),
      setToast: (message, type = 'success') => set({ toast: { message, type, id: Date.now() } }),
      clearToast: () => set({ toast: null }),
      
      setFilter: (key, value) => 
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value
          }
        })),
        
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
          toast: { message: 'Got it — transaction saved.', type: 'success', id: Date.now() }
        })),
        
      editTransaction: (id, updatedDetails) =>
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...t, ...updatedDetails } : t
          )
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id),
          toast: { message: 'Transaction deleted.', type: 'success', id: Date.now() }
        })),
        
      deleteMultipleTransactions: (ids) =>
        set((state) => ({
          transactions: state.transactions.filter(t => !ids.includes(t.id)),
          toast: { message: `${ids.length} transactions deleted.`, type: 'success', id: Date.now() }
        })),

      editMultipleTransactions: (ids, updatedDetails) =>
        set((state) => ({
          transactions: state.transactions.map((t) => 
            ids.includes(t.id) ? { ...t, ...updatedDetails } : t
          ),
          toast: { message: `${ids.length} transactions updated.`, type: 'success', id: Date.now() }
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
