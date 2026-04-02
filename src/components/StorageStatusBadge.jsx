import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';

const StorageStatusBadge = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const [status, setStatus] = useState('Saved locally');

    useEffect(() => {
        if (transactions.length === 0) return;
        setStatus('Saving...');
        const timer = setTimeout(() => setStatus('Saved locally'), 800);
        return () => clearTimeout(timer);
    }, [transactions]);

    const hasKey = !!localStorage.getItem('finance-store');
    if (!hasKey && transactions.length === 0) return null;

    return (
        <div className="flex items-center gap-2 px-2 py-1 select-none">
            <span className="relative flex h-2 w-2 shrink-0">
                {status === 'Saving...' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'Saving...' ? 'bg-teal-400' : 'bg-teal-600'}`} />
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={status}
                        initial={{ opacity: 0, y: 2 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="block"
                    >
                        {status}
                    </motion.span>
                </AnimatePresence>
            </span>
        </div>
    );
};
export default StorageStatusBadge;
