import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { Coffee, Home, ShoppingBag, Car, Film, Wallet, Briefcase, Receipt } from 'lucide-react';

const categoryIcons = {
    food: <Coffee size={16} className="text-orange-400" />,
    rent: <Home size={16} className="text-blue-400" />,
    shopping: <ShoppingBag size={16} className="text-pink-400" />,
    transport: <Car size={16} className="text-yellow-400" />,
    entertainment: <Film size={16} className="text-purple-400" />,
    subscription: <Film size={16} className="text-indigo-400" />,
    salary: <Briefcase size={16} className="text-green-400" />,
    freelance: <Wallet size={16} className="text-teal-400" />
};

const categoryColors = {
    food: 'bg-orange-500', rent: 'bg-blue-500', shopping: 'bg-pink-500',
    transport: 'bg-yellow-500', entertainment: 'bg-purple-500', subscription: 'bg-indigo-500',
    salary: 'bg-green-500', freelance: 'bg-teal-500'
};

const TransactionList = () => {
    const allTransactions = useFinanceStore(state => state.transactions);
    const shouldReduceMotion = useReducedMotion();
    
    const transactions = useMemo(() => {
        return [...allTransactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    }, [allTransactions]);

    return (
        <div className="h-full overflow-y-auto pr-2 pb-[40px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full overflow-x-hidden">
            {transactions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm py-8 text-center pt-12">
                   <Receipt size={32} className="mb-3 opacity-50" />
                   No recent transactions
                </div>
            ) : (
                <div className="flex flex-col gap-3 py-1">
                    {transactions.map((tx, i) => {
                        const isIncome = tx.type === 'income';
                        const sign = isIncome ? '+' : '-';
                        const delaySecs = shouldReduceMotion ? 0 : Math.min(i, 8) * 0.05;
                        
                        return (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut", delay: delaySecs }}
                                className="group relative flex items-center justify-between p-3.5 rounded-xl border border-transparent hover:border-[#252D42] hover:bg-[#0d1f3c] transition-colors duration-150 cursor-pointer overflow-hidden shadow-sm"
                                style={{ willChange: "transform, opacity" }}
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-teal-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-150 ease-out" />
                                <div className="flex items-center gap-4 z-10 pl-1">
                                    <div className={`p-2.5 rounded-full bg-slate-900 border border-slate-800 shrink-0 shadow-inner ${categoryColors[tx.category]?.replace('bg-', 'text-') || 'text-slate-400'}`}>
                                        {categoryIcons[tx.category] || <Wallet size={16} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">{tx.title}</span>
                                        <span className="text-xs text-slate-500 flex items-center gap-2">
                                            {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <motion.div 
                                    className="flex flex-col items-end z-10"
                                    whileHover={!shouldReduceMotion ? { scale: 1.04 } : {}}
                                >
                                    <span className={`font-mono font-bold text-[15px] ${isIncome ? 'text-teal-400' : 'text-red-400'}`}>
                                        {sign}₹{tx.amount.toLocaleString('en-IN')}
                                    </span>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default TransactionList;
