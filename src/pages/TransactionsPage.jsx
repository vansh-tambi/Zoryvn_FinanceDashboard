import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { Plus, Search, Filter, X, Coffee, Home, ShoppingBag, Car, Film, Wallet, Briefcase, ChevronDown } from 'lucide-react';

const categoryIcons = {
    food: <Coffee size={18} className="text-orange-400" />,
    rent: <Home size={18} className="text-blue-400" />,
    shopping: <ShoppingBag size={18} className="text-pink-400" />,
    transport: <Car size={18} className="text-yellow-400" />,
    subscription: <Film size={18} className="text-purple-400" />,
    salary: <Wallet size={18} className="text-green-400" />,
    freelance: <Briefcase size={18} className="text-teal-400" />,
    other: <Wallet size={18} className="text-slate-400" />
};

const categoryColors = {
    food: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    rent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    shopping: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    transport: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    subscription: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    salary: 'bg-green-500/10 text-green-400 border-green-500/20',
    freelance: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    other: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

const SkeletonLoader = () => (
    <div className="space-y-4 pt-4">
        {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[72px] w-full bg-[#1C2333]/50 rounded-2xl border border-[#252D42] animate-pulse flex items-center px-6">
                <div className="w-10 h-10 rounded-xl bg-slate-700/50 mr-4 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700/50 rounded w-1/4" />
                    <div className="h-3 bg-slate-700/50 rounded w-1/6" />
                </div>
                <div className="w-16 h-6 rounded-full bg-slate-700/50 mr-6" />
                <div className="w-20 h-5 bg-slate-700/50 rounded" />
            </div>
        ))}
    </div>
);

const EmptyStateSVG = () => (
    <div className="flex flex-col items-center justify-center p-16 h-full mt-10">
        <svg width="250" height="200" viewBox="0 0 250 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 160 L210 160" stroke="#1C2333" strokeWidth="4" strokeLinecap="round" />
            <rect x="75" y="80" width="100" height="70" rx="12" fill="#1C2333" stroke="#252D42" strokeWidth="4" />
            <circle cx="125" cy="115" r="14" fill="#252D42" />
            <path d="M125 115 L125 100" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
            <path d="M85 90 Q125 40 165 90" stroke="#14b8a6" strokeWidth="3" fill="none" strokeDasharray="8 8" />
            <circle cx="170" cy="65" r="5" fill="#f59e0b" opacity="0.6" />
            <circle cx="100" cy="50" r="3" fill="#3b82f6" opacity="0.4" />
        </svg>
        <p className="text-slate-300 font-sora text-xl font-semibold mt-8">No matching records found</p>
        <p className="text-slate-500 text-sm mt-2">Try adjusting your active filters or clear your search.</p>
    </div>
);

const AddTransactionModal = ({ isOpen, onClose }) => {
    const addTransaction = useFinanceStore(state => state.addTransaction);
    const [formData, setFormData] = useState({
        title: '', amount: '', category: 'food', type: 'expense', date: new Date().toISOString().substring(0, 10)
    });

    const isFormValid = formData.title.trim() !== '' && Number(formData.amount) > 0 && formData.date !== '';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        addTransaction({
            id: Date.now().toString(),
            ...formData,
            amount: Number(formData.amount),
            note: ''
        });
        setFormData({ title: '', amount: '', category: 'food', type: 'expense', date: new Date().toISOString().split('T')[0], note: '' });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-[100]"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 w-full md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[460px] bg-[#121826] border border-[#252D42] rounded-t-[32px] md:rounded-[24px] p-8 z-[101] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-sora text-white">Add Record</h2>
                            <button onClick={onClose} className="p-2 rounded-full bg-[#1C2333] hover:bg-[#252D42] text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Transaction Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1C2333] border border-[#252D42] rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-slate-600" placeholder="e.g. Swiggy Lunch" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                        <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full bg-[#1C2333] border border-[#252D42] rounded-xl pl-8 pr-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all" placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Date</label>
                                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#1C2333] border border-[#252D42] rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all [&::-webkit-calendar-picker-indicator]:invert" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Category</label>
                                    <div className="relative">
                                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#1C2333] border border-[#252D42] rounded-xl px-4 py-3 text-slate-100 focus:outline-none appearance-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all">
                                            <option value="food">Food</option>
                                            <option value="rent">Rent</option>
                                            <option value="shopping">Shopping</option>
                                            <option value="transport">Transport</option>
                                            <option value="subscription">Subscription</option>
                                            <option value="salary">Salary</option>
                                            <option value="freelance">Freelance</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Type</label>
                                    <div className="flex bg-[#1C2333] p-1 rounded-xl h-[50px] border border-[#252D42]">
                                        <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 rounded-lg text-sm font-semibold transition-colors ${formData.type === 'expense' ? 'bg-[#ef4444] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Expense</button>
                                        <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 rounded-lg text-sm font-semibold transition-colors ${formData.type === 'income' ? 'bg-teal-500 text-[#0f172a] shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Income</button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={!isFormValid}
                                className="w-full py-4 rounded-xl bg-teal-500 text-slate-900 font-bold font-sora shadow-[0_5px_20px_rgba(20,184,166,0.2)] hover:shadow-[0_10px_25px_rgba(20,184,166,0.3)] transition-all hover:bg-teal-400 active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Transaction
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const TransactionsPage = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const filters = useFinanceStore(state => state.filters);
    const setFilter = useFinanceStore(state => state.setFilter);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Trigger 800ms loading skeleton on mount
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredTransactions = useMemo(() => {
        let result = transactions.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCat = filters.category === 'all' || t.category === filters.category;
            const matchesType = filters.type === 'all' || t.type === filters.type;
            return matchesSearch && matchesCat && matchesType;
        });

        return result.sort((a, b) => {
            if (filters.sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
            if (filters.sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
            if (filters.sortBy === 'amount_desc') return b.amount - a.amount;
            if (filters.sortBy === 'amount_asc') return a.amount - b.amount;
            return 0;
        });
    }, [transactions, filters]);

    return (
        <div className="w-full flex flex-col h-[calc(100vh-64px)] pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-2 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-sora text-white">Transactions</h1>
                    <p className="text-slate-400 mt-1">Manage and track your financial footprint.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#1C2333] p-4 rounded-[20px] border border-[#252D42] mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-auto md:flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search activity..." 
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                        className="w-full bg-[#1A202C] border border-[#252D42] rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-colors placeholder:text-slate-500"
                    />
                </div>
                
                <div className="flex w-full md:w-auto gap-3 items-center overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <div className="relative shrink-0">
                        <select 
                            value={filters.category} 
                            onChange={(e) => setFilter('category', e.target.value)}
                            className="appearance-none bg-[#1A202C] border border-[#252D42] rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500 transition-colors shrink-0"
                        >
                            <option value="all">All Categories</option>
                            <option value="food">Food</option>
                            <option value="rent">Rent</option>
                            <option value="shopping">Shopping</option>
                            <option value="transport">Transport</option>
                            <option value="subscription">Subscription</option>
                            <option value="salary">Salary</option>
                            <option value="freelance">Freelance</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>

                    <div className="relative shrink-0">
                        <select 
                            value={filters.type} 
                            onChange={(e) => setFilter('type', e.target.value)}
                            className="appearance-none bg-[#1A202C] border border-[#252D42] rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500 transition-colors"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>

                    <div className="relative shrink-0">
                        <select 
                            value={filters.sortBy} 
                            onChange={(e) => setFilter('sortBy', e.target.value)}
                            className="appearance-none bg-[#1A202C] border border-[#252D42] rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-teal-500 transition-colors"
                        >
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                            <option value="amount_desc">Highest Amount</option>
                            <option value="amount_asc">Lowest Amount</option>
                        </select>
                        <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                {isLoading ? (
                    <SkeletonLoader />
                ) : filteredTransactions.length === 0 ? (
                    <EmptyStateSVG />
                ) : (
                    <AnimatePresence>
                        {filteredTransactions.map((t, idx) => (
                            <motion.div
                                layout
                                key={t.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.03, duration: 0.2 }}
                                className="flex items-center justify-between p-4 mb-3 bg-[#1C2333] hover:bg-[#252D42] rounded-2xl border border-[#252D42] transition-colors group cursor-default"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-[#0D1117] ring-1 ring-[#252D42] group-hover:ring-slate-600 transition-all shadow-inner">
                                        {categoryIcons[t.category] || <Wallet size={18} className="text-slate-400" />}
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-slate-200 group-hover:text-white transition-colors">{t.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {new Date(t.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className={`hidden md:flex px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${categoryColors[t.category] || categoryColors.other}`}>
                                        {t.category}
                                    </div>
                                    <div className={`font-sora font-semibold text-right min-w-[100px] ${t.type === 'income' ? 'text-teal-400' : 'text-[#ef4444]'}`}>
                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Floating Add Button */}
            <AnimatePresence>
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="fixed bottom-24 right-6 md:fixed md:bottom-8 md:right-8 z-50 p-4 rounded-2xl bg-teal-500 text-slate-900 shadow-[0_10px_30px_rgba(20,184,166,0.3)] hover:shadow-[0_10px_30px_rgba(20,184,166,0.5)] transition-shadow"
                >
                    <Plus size={24} strokeWidth={3} />
                </motion.button>
            </AnimatePresence>

            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default TransactionsPage;
