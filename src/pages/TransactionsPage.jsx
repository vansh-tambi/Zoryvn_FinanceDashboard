import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { Plus, Search, Filter, Receipt, LayoutTemplate } from 'lucide-react';

const EmptyStateSVG = () => (
    <div className="flex flex-col items-center gap-4">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Wallet body */}
            <rect x="10" y="26" width="58" height="38" rx="7" fill="#0d1f3c" stroke="#3a5a7a" strokeWidth="1.5" strokeLinecap="round" />
            {/* Wallet flap / top fold */}
            <path d="M10 34 C10 30 14 26 18 26 H62 C66 26 68 28 68 31" stroke="#3a5a7a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Card slot */}
            <rect x="44" y="38" width="18" height="11" rx="3" fill="none" stroke="#3a5a7a" strokeWidth="1.5" strokeLinecap="round" />
            {/* Coin dot in slot */}
            <circle cx="53" cy="43.5" r="2.5" fill="none" stroke="#3a5a7a" strokeWidth="1.2" />
            {/* Sad eyes — left */}
            <ellipse cx="26" cy="42" rx="2" ry="2.3" fill="none" stroke="#3a5a7a" strokeWidth="1.5" strokeLinecap="round" />
            {/* Sad eyes — right (slightly higher for asymmetry) */}
            <ellipse cx="36" cy="41.2" rx="2" ry="2.3" fill="none" stroke="#3a5a7a" strokeWidth="1.5" strokeLinecap="round" />
            {/* Downward mouth arc */}
            <path d="M24 52 Q31 48 38 52" stroke="#3a5a7a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Subtle shine line on wallet */}
            <path d="M16 31 Q22 29 28 31" stroke="#3a5a7a" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
        <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-white font-sora font-semibold" style={{ fontSize: '16px' }}>Nothing here</p>
            <p className="text-slate-500 font-medium" style={{ fontSize: '13px' }}>Try clearing your filters</p>
        </div>
    </div>
);

const AddTransactionModal = ({ isOpen, onClose }) => {
    const addTransaction = useFinanceStore(state => state.addTransaction);
    const shouldReduceMotion = useReducedMotion();
    const [formData, setFormData] = useState({
        title: '', amount: '', category: 'food', type: 'expense', date: new Date().toISOString().substring(0, 10), note: ''
    });

    const isFormValid = formData.title.trim() !== '' && Number(formData.amount) > 0 && formData.date !== '';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        addTransaction({
            id: Date.now().toString(),
            ...formData,
            amount: Number(formData.amount)
        });
        setFormData({ title: '', amount: '', category: 'food', type: 'expense', date: new Date().toISOString().split('T')[0], note: '' });
        onClose();
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4 pb-0 md:pb-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 60 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ willChange: 'transform, opacity' }}
                        className="bg-[#1C2333] border border-[#252D42] rounded-t-3xl md:rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col"
                    >
                        <div className="px-6 py-4 border-b border-[#252D42] flex justify-between items-center bg-[#0D1117]/50">
                            <h2 className="text-xl font-bold font-sora text-white">Record a transaction</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-[#252D42]">
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex bg-[#0D1117] p-1 rounded-xl border border-[#252D42]">
                                <motion.button whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}} transition={{ type: "spring", stiffness: 400, damping: 17 }} type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'expense' ? 'bg-[#1C2333] text-white shadow' : 'text-slate-500'}`}>Expense</motion.button>
                                <motion.button whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}} transition={{ type: "spring", stiffness: 400, damping: 17 }} type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'income' ? 'bg-[#1C2333] text-white shadow' : 'text-slate-500'}`}>Income</motion.button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Netflix Subscription" className="w-full bg-[#0D1117] border border-[#252D42] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-medium" />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                                        <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" className="w-full bg-[#0D1117] border border-[#252D42] rounded-xl pl-8 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-all font-mono font-bold" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date</label>
                                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0D1117] border border-[#252D42] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-all font-mono text-sm [&::-webkit-calendar-picker-indicator]:invert-[0.8]" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 mb-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
                                <div className="relative">
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0D1117] border border-[#252D42] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-all appearance-none font-medium">
                                        {formData.type === 'expense' ? (
                                            <>
                                                <option value="food">Food & Dining</option>
                                                <option value="rent">Rent & Utilities</option>
                                                <option value="shopping">Shopping</option>
                                                <option value="transport">Transportation</option>
                                                <option value="entertainment">Entertainment</option>
                                                <option value="subscription">Subscriptions</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="salary">Salary</option>
                                                <option value="freelance">Freelance</option>
                                            </>
                                        )}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                                </div>
                            </div>

                            <motion.button 
                                type="submit"
                                disabled={!isFormValid}
                                whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="w-full py-4 rounded-xl bg-teal-500 text-[#030712] font-bold font-sora shadow-[0_5px_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_12px_rgba(0,217,163,0.25)] hover:brightness-110 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ willChange: 'transform' }}
                            >
                                Add and it's logged.
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
    return createPortal(modalContent, document.body);
};

const TransactionsPage = () => {
    const { transactions, filters, setFilter, role } = useFinanceStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchSearch = t.title.toLowerCase().includes(filters.search.toLowerCase());
            const matchCat = filters.category === 'all' || t.category === filters.category;
            const matchType = filters.type === 'all' || t.type === filters.type;
            return matchSearch && matchCat && matchType;
        }).sort((a,b) => {
            if (filters.sortBy === 'date') return new Date(b.date) - new Date(a.date);
            if (filters.sortBy === 'amountDesc') return b.amount - a.amount;
            if (filters.sortBy === 'amountAsc') return a.amount - b.amount;
            return 0;
        });
    }, [transactions, filters]);

    const [isLoading, setIsLoading] = useState(true);
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col gap-6 relative min-h-full pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-sora text-white mb-2 tracking-tight">Ledger</h1>
                    <p className="text-slate-400">Every rupee in, every rupee out — all in one place.</p>
                </div>
            </div>

            <div className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 shadow-lg flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" value={filters.search} onChange={e => setFilter('search', e.target.value)} placeholder="Search transactions..." className="w-full bg-[#0D1117] border border-[#252D42] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors font-medium" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pb-2 lg:pb-0">
                        <div className="relative w-full sm:w-auto">
                            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            <select value={filters.category} onChange={e => setFilter('category', e.target.value)} className="w-full sm:w-auto bg-[#0D1117] border border-[#252D42] rounded-xl pl-10 pr-10 py-3.5 text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer font-medium min-w-[140px]">
                                <option value="all">All Cats</option>
                                <option value="food">Food</option>
                                <option value="rent">Rent</option>
                                <option value="shopping">Shopping</option>
                                <option value="subscription">Subscriptions</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                        </div>

                        <div className="flex w-full sm:w-auto bg-[#0D1117] p-1 rounded-xl border border-[#252D42]">
                            <motion.button whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => setFilter('type', 'all')} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all ${filters.type === 'all' ? 'bg-[#1C2333] text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>All</motion.button>
                            <motion.button whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => setFilter('type', 'income')} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all ${filters.type === 'income' ? 'bg-teal-500/20 text-teal-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}>In</motion.button>
                            <motion.button whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}} transition={{ type: "spring", stiffness: 400, damping: 17 }} onClick={() => setFilter('type', 'expense')} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all ${filters.type === 'expense' ? 'bg-[#1C2333] text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Out</motion.button>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#252D42] bg-[#0D1117]">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#252D42] bg-[#1C2333]/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <div className="col-span-6 md:col-span-5">Details</div>
                        <div className="col-span-3 hidden md:block">Category</div>
                        <div className="col-span-3 hidden md:block">Date</div>
                        <div className="col-span-6 md:col-span-1 text-right">Amount</div>
                    </div>

                    <div className="flex flex-col">
                        {filteredTransactions.length === 0 ? (
                            isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-[#252D42]/50 animate-pulse">
                                        <div className="col-span-6 md:col-span-5 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#1C2333]" /><div className="w-24 h-4 bg-[#1C2333] rounded" /></div>
                                        <div className="col-span-3 hidden md:flex items-center"><div className="w-16 h-6 bg-[#1C2333] rounded-full" /></div>
                                        <div className="col-span-3 hidden md:flex items-center"><div className="w-20 h-4 bg-[#1C2333] rounded" /></div>
                                        <div className="col-span-6 md:col-span-1 flex items-center justify-end"><div className="w-16 h-4 bg-[#1C2333] rounded" /></div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 flex flex-col items-center gap-6">
                                    <EmptyStateSVG />
                                    <motion.button 
                                       whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}} transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                       onClick={() => { setFilter('search', ''); setFilter('category', 'all'); setFilter('type', 'all'); }} 
                                       className="px-6 py-2.5 rounded-full border border-[#252D42] text-slate-400 hover:text-white hover:bg-[#252D42] transition-colors mt-2 text-sm font-semibold shadow-lg"
                                    >
                                       Reset filters
                                    </motion.button>
                                </div>
                            )
                        ) : (
                            filteredTransactions.map((tx, index) => {
                                const isIncome = tx.type === 'income';
                                const delaySecs = shouldReduceMotion ? 0 : Math.min(index, 8) * 0.05;
                                
                                return (
                                    <motion.div 
                                        key={tx.id}
                                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut", delay: delaySecs }}
                                        className="grid grid-cols-12 gap-4 border-b border-[#252D42]/50 hover:bg-[#1C2333]/50 transition-colors group items-center relative overflow-hidden"
                                        style={{ padding: '13px 16px', willChange: "transform, opacity" }}
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-teal-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-150 ease-out" />
                                        
                                        <div className="col-span-6 md:col-span-5 flex items-center gap-4 z-10 pl-1">
                                            <div className="w-10 h-10 rounded-full bg-[#1C2333] border border-[#252D42] flex items-center justify-center shrink-0">
                                                <Receipt size={16} className="text-slate-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{tx.title}</span>
                                                <span className="text-xs text-slate-500 md:hidden">{new Date(tx.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="col-span-3 hidden md:flex items-center">
                                            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-[#1C2333] text-slate-400 border border-[#252D42]">
                                                {tx.category}
                                            </span>
                                        </div>
                                        
                                        <div className="col-span-3 hidden md:flex items-center text-sm font-medium text-slate-400">
                                            {new Date(tx.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                        
                                        <motion.div whileHover={!shouldReduceMotion ? { scale: 1.04 } : {}} className="col-span-6 md:col-span-1 flex items-center justify-end z-10">
                                            <span className={`font-mono font-bold ${isIncome ? 'text-teal-400' : 'text-slate-300'}`}>
                                                {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {role === 'admin' && createPortal(
                <motion.button 
                    whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}} transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-24 md:bottom-8 right-6 md:right-8 w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center text-[#030712] shadow-[0_10px_30px_rgba(20,184,166,0.4)] hover:shadow-[0_0_20px_rgba(0,217,163,0.3)] hover:brightness-110 transition-all z-[100] group"
                >
                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </motion.button>,
                document.body
            )}

            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
export default TransactionsPage;
