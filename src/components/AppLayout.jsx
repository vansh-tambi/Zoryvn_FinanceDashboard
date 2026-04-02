import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { CheckCircle } from 'lucide-react';
import EmptyGlobalState from './EmptyGlobalState';

const Toast = () => {
    const toast = useFinanceStore(state => state.toast);
    const clearToast = useFinanceStore(state => state.clearToast);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => { clearToast(); }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast, clearToast]);

    return (
        <AnimatePresence mode="sync">
            {toast && (
                <motion.div
                    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: shouldReduceMotion ? 0 : 80 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[200] bg-teal-500 text-[#030712] px-6 py-3.5 rounded-full shadow-[0_10px_30px_rgba(20,184,166,0.3)] flex items-center gap-3 font-semibold text-sm font-sora pointer-events-none"
                    style={{ willChange: "transform" }}
                >
                    <CheckCircle size={18} />
                    {toast.message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const AppLayout = () => {
  const location = useLocation();
  const transactions = useFinanceStore(state => state.transactions);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex h-screen w-full bg-[#030712] text-slate-100 overflow-hidden font-sans selection:bg-teal-500/30">
      <Sidebar />
      <main className="flex-1 md:ml-[228px] transition-all duration-300 h-full overflow-y-auto overflow-x-hidden relative pb-[80px] md:pb-0">
         <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/10 blur-[150px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px]" />
         </div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
                    className="h-full"
                    style={{ willChange: "transform, opacity" }}
                >
                    {transactions.length === 0 && location.pathname !== '/transactions' ? <EmptyGlobalState /> : <Outlet />}
                </motion.div>
            </AnimatePresence>
         </div>
      </main>
      <Toast />
    </div>
  );
};
export default AppLayout;
