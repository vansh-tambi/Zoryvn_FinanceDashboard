import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { Coffee, Home, ShoppingBag, Car, Film, Wallet, Briefcase } from 'lucide-react';

const categoryIcons = {
    food: <Coffee size={18} className="text-orange-400" />,
    rent: <Home size={18} className="text-blue-400" />,
    shopping: <ShoppingBag size={18} className="text-pink-400" />,
    transport: <Car size={18} className="text-yellow-400" />,
    subscription: <Film size={18} className="text-purple-400" />,
    salary: <Wallet size={18} className="text-green-400" />,
    freelance: <Briefcase size={18} className="text-teal-400" />
};

const bgColors = {
    food: 'bg-orange-500/10 ring-orange-500/20',
    rent: 'bg-blue-500/10 ring-blue-500/20',
    shopping: 'bg-pink-500/10 ring-pink-500/20',
    transport: 'bg-yellow-500/10 ring-yellow-500/20',
    subscription: 'bg-purple-500/10 ring-purple-500/20',
    salary: 'bg-green-500/10 ring-green-500/20',
    freelance: 'bg-teal-500/10 ring-teal-500/20'
};

const TransactionList = () => {
    const transactions = useFinanceStore(state => state.getRecentTransactions(20));

    return (
        <div className="h-full overflow-y-auto pr-2 pb-[40px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full">
            <AnimatePresence>
                {transactions.map((t, idx) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-3 mb-3 bg-slate-800/30 hover:bg-slate-800/60 transition-colors rounded-xl border border-slate-700/30 group cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ring-1 ${bgColors[t.category] || 'bg-slate-700 ring-slate-600'}`}>
                                {categoryIcons[t.category] || <Wallet size={18} className="text-slate-400" />}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{t.title}</h4>
                                <p className="text-xs text-slate-500 capitalize">
                                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {t.category}
                                </p>
                            </div>
                        </div>
                        <div className={`font-bold text-sm ${t.type === 'income' ? 'text-green-400' : 'text-slate-100'}`}>
                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TransactionList;
