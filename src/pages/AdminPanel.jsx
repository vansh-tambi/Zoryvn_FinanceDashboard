import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useFinanceStore } from '../store/useFinanceStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, User, ShieldCheck, Database, Trash2, 
    LayoutDashboard, Receipt, LineChart, Download, Plus, 
    Search, Filter, Check, X, Edit2, ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';

const categoryColors = {
    food: 'bg-orange-500/10 text-orange-400 border border-orange-500/20', 
    rent: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', 
    shopping: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
    transport: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', 
    entertainment: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', 
    subscription: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    salary: 'bg-green-500/10 text-green-400 border border-green-500/20', 
    freelance: 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
};

const statusColors = {
    Normal: 'bg-slate-500',
    Flagged: 'bg-amber-500',
    Verified: 'bg-teal-500',
    Duplicate: 'bg-red-500'
};

// Modals
const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
    const { addTransaction, editTransaction } = useFinanceStore();
    const [formData, setFormData] = useState({
        title: '', amount: '', category: 'food', type: 'expense', date: new Date().toISOString().substring(0, 10), status: 'Normal'
    });
    
    useEffect(() => {
        if (isOpen) {
            if (initialData) setFormData({ ...initialData, amount: initialData.amount.toString() });
            else setFormData({ title: '', amount: '', category: 'food', type: 'expense', date: new Date().toISOString().substring(0, 10), status: 'Normal' });
        }
    }, [isOpen, initialData]);

    const isValid = formData.title.trim() !== '' && Number(formData.amount) > 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid) return;

        const payload = { ...formData, amount: Number(formData.amount) };
        if (initialData) {
            editTransaction(initialData.id, payload);
            // Use custom toast later or rely on store
        } else {
            addTransaction({ id: 'TXN-' + Date.now(), ...payload });
        }
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/75 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0a1628] border border-teal-500/40 rounded-[12px] w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5"
                >
                    <h2 className="text-xl font-bold font-sora text-slate-100">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex bg-[#060d1a] border border-[#1e2d45] rounded-xl p-1">
                            <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${formData.type === 'income' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500'}`}>Income</button>
                            <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${formData.type === 'expense' ? 'bg-red-500/20 text-red-400' : 'text-slate-500'}`}>Expense</button>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Title</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full bg-[#060d1a] border ${formData.title.trim() === '' ? 'border-red-500/50' : 'border-[#1e2d45] focus:border-[#00D9A360]'} rounded-xl px-3 py-2 text-white outline-none font-sora text-sm transition-colors`} />
                            {formData.title.trim() === '' && <span className="text-[#ff6b6b] text-xs mt-1 block">Title is required</span>}
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Amount</label>
                                <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className={`w-full bg-[#060d1a] border ${Number(formData.amount) <= 0 ? 'border-red-500/50' : 'border-[#1e2d45] focus:border-[#00D9A360]'} rounded-xl px-3 py-2 text-white outline-none font-mono text-sm transition-colors`} />
                                {Number(formData.amount) <= 0 && <span className="text-[#ff6b6b] text-xs mt-1 block">Valid amount required</span>}
                            </div>
                            <div className="flex-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Date</label>
                                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#060d1a] border border-[#1e2d45] focus:border-[#00D9A360] rounded-xl px-3 py-2 text-white outline-none font-mono text-sm transition-colors [&::-webkit-calendar-picker-indicator]:invert-[0.8]" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Category</label>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#060d1a] border border-[#1e2d45] focus:border-[#00D9A360] rounded-xl px-3 py-2 text-white outline-none font-sora text-sm transition-colors appearance-none">
                                    <option value="food">Food</option><option value="rent">Rent</option><option value="shopping">Shopping</option>
                                    <option value="transport">Transport</option><option value="entertainment">Entertainment</option>
                                    <option value="subscription">Subscription</option><option value="salary">Salary</option><option value="freelance">Freelance</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#060d1a] border border-[#1e2d45] focus:border-[#00D9A360] rounded-xl px-3 py-2 text-white outline-none font-sora text-sm transition-colors appearance-none">
                                    <option value="Normal">Normal</option><option value="Flagged">Flagged</option><option value="Verified">Verified</option>
                                    <option value="Duplicate">Duplicate</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button type="submit" disabled={!isValid} className="px-5 py-2 rounded-lg bg-teal-500 text-[#030712] font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-colors">Save Changes</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};

const AdminPanel = () => {
    const navigate = useNavigate();
    const { role, setRole, transactions, deleteTransaction, deleteMultipleTransactions, editMultipleTransactions } = useFinanceStore();

    useEffect(() => {
        if (role !== 'admin') {
            navigate('/', { replace: true });
        }
    }, [role, navigate]);

    // Local States
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, data: null });
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Derived logic
    const filteredList = useMemo(() => {
        return transactions.filter(t => {
            const matchesText = t.title.toLowerCase().includes(search.toLowerCase());
            let matchesType = true;
            if (filterType === 'Income') matchesType = t.type === 'income';
            if (filterType === 'Expense') matchesType = t.type === 'expense';
            if (filterType === 'Flagged') matchesType = t.status === 'Flagged';
            return matchesText && matchesType;
        }).sort((a,b) => new Date(b.date) - new Date(a.date));
    }, [transactions, search, filterType]);

    const totalPages = Math.ceil(filteredList.length / 10) || 1;
    const paginatedList = filteredList.slice((currentPage - 1) * 10, currentPage * 10);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    // Stats calculations
    const netBalance = filteredList.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0) - filteredList.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const flaggedCount = filteredList.filter(t => t.status === 'Flagged').length;
    const incomeTotal = filteredList.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const savingsRate = incomeTotal > 0 ? (((incomeTotal - filteredList.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0)) / incomeTotal) * 100).toFixed(1) : 0;

    // Export CSV
    const exportCSV = () => {
        const header = "Date,Title,Category,Type,Amount,Status\n";
        const body = filteredList.map(t => `${t.date},"${t.title}",${t.category},${t.type},${t.amount},${t.status || 'Normal'}`).join('\n');
        const blob = new Blob([header + body], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finsight-transactions-oct2025.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleBulkDelete = () => {
        deleteMultipleTransactions(selectedRows);
        setSelectedRows([]);
    };

    const handleBulkReview = () => {
        editMultipleTransactions(selectedRows, { status: 'Verified' });
        setSelectedRows([]);
    };

    if (role !== 'admin') return null;

    return (
        <div className="flex flex-col h-screen w-full bg-[#030712] text-slate-200 overflow-hidden font-sora">
            {/* Topbar */}
            <header className="h-[48px] shrink-0 bg-[#0a0f1e] border-b border-[#1e2d45] flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-100 text-[15px] tracking-tight">FinSight</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500 text-[#0a0f1e] text-[10px] font-bold tracking-widest uppercase">Admin</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative cursor-pointer hover:bg-[#1e2d45] p-1.5 rounded-full transition-colors">
                        <Bell size={18} className="text-slate-400" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0f1e]" />
                    </div>
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-500 text-[#0a0f1e] font-bold text-xs uppercase cursor-pointer pointer-events-none">
                        A
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[188px] shrink-0 bg-[#060d1a] border-r border-[#1e2d45] flex flex-col z-10 py-4 font-sans justify-between">
                    <div>
                        <div className="px-4 mb-6">
                            <h3 className="text-slate-200 font-bold text-sm">Administrator</h3>
                            <p className="text-teal-400 text-[10px] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                <ShieldCheck size={12} /> Full Access
                            </p>
                        </div>

                        <div className="px-3 mb-6">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Main</h4>
                            <div className="space-y-1">
                                <div onClick={() => navigate('/')} className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0a1628] cursor-pointer transition-colors text-sm font-medium">
                                    <LayoutDashboard size={16} /> Overview
                                </div>
                                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-[#042820] text-teal-400 border-l-[3px] border-teal-500 cursor-pointer text-sm font-bold relative transition-colors shadow-[0_0_15px_rgba(20,184,166,0.05)]">
                                    <Receipt size={16} className="-ml-[3px]" /> Transactions
                                    <span className="absolute right-2 px-1.5 py-0.5 rounded-md bg-[#0a0f1e] border border-teal-500/20 text-[10px] font-bold font-mono">
                                        {transactions.length}
                                    </span>
                                </div>
                                <div onClick={() => navigate('/insights')} className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0a1628] cursor-pointer transition-colors text-sm font-medium">
                                    <LineChart size={16} /> Insights
                                </div>
                            </div>
                        </div>

                        <div className="px-3">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Admin Tools</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0a1628] cursor-pointer transition-colors text-sm font-medium">
                                    <User size={16} /> User Roles
                                </div>
                                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0a1628] cursor-pointer transition-colors text-sm font-medium">
                                    <Database size={16} /> Data Settings
                                </div>
                                <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer transition-colors text-sm font-medium relative group">
                                    <Trash2 size={16} /> Clear Data
                                    <span className="absolute right-2 text-amber-500 group-hover:animate-pulse"><AlertTriangle size={14} /></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 pb-2">
                        <button 
                            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0a1628] border border-[#1e2d45] hover:border-teal-500/50 transition-colors mb-3 group"
                        >
                            <div className="flex items-center gap-2 text-slate-300 group-hover:text-white">
                                <User size={16} />
                                <span className="text-xs font-semibold">Admin Mode</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${role === 'admin' ? 'bg-teal-500' : 'bg-slate-600'}`}>
                                <div className={`w-3 h-3 bg-[#030712] rounded-full shadow-sm transition-transform ${role === 'admin' ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                        </button>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#0a0f1e] border border-[#1e2d45]">
                           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                           <span className="text-[10px] font-mono font-medium text-slate-400">Saved locally</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-[#030712] p-8 relative flex justify-center">
                    <div className="w-full max-w-6xl flex flex-col gap-6">
                        
                        {/* Header */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                                    Transaction Manager
                                </h1>
                                <p className="text-sm text-slate-400 mt-1">{filteredList.length} total records • Oct 2025</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a1628] border border-[#1e2d45] text-slate-300 text-sm font-semibold hover:border-slate-500 hover:text-white transition-colors">
                                    <Download size={16} /> Export CSV
                                </button>
                                <button onClick={() => setModalConfig({ isOpen: true, data: null })} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 text-[#030712] text-sm font-bold shadow-[0_4px_15px_rgba(20,184,166,0.3)] hover:brightness-110 transition-all">
                                    <Plus size={16} /> Add transaction
                                </button>
                            </div>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4">
                            <div className="bg-[#0a1628] border border-[#1e2d45] rounded-xl p-5 flex flex-col justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Balance</span>
                                <h2 className="text-2xl font-bold text-teal-400 font-mono mt-2 mb-4">₹{netBalance.toLocaleString()}</h2>
                                <div className="h-0.5 bg-teal-500/20 w-full rounded-full"><div className="h-full bg-teal-500 w-2/3 rounded-full" /></div>
                            </div>
                            <div className="bg-[#0a1628] border border-[#1e2d45] rounded-xl p-5 flex flex-col justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Records</span>
                                <h2 className="text-2xl font-bold text-slate-100 font-mono mt-2 mb-4">{filteredList.length}</h2>
                                <div className="h-0.5 bg-slate-500/20 w-full rounded-full"><div className="h-full bg-slate-500 w-full rounded-full" /></div>
                            </div>
                            <div className="bg-[#0a1628] border border-[#1e2d45] rounded-xl p-5 flex flex-col justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Flagged Items</span>
                                <h2 className="text-2xl font-bold text-amber-500 font-mono mt-2 mb-4">{flaggedCount}</h2>
                                <div className="h-0.5 bg-amber-500/20 w-full rounded-full"><div className="h-full bg-amber-500 w-1/4 rounded-full" /></div>
                            </div>
                            <div className="bg-[#0a1628] border border-[#1e2d45] rounded-xl p-5 flex flex-col justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Savings Rate</span>
                                <h2 className="text-2xl font-bold text-blue-400 font-mono mt-2 mb-4">{savingsRate}%</h2>
                                <div className="h-0.5 bg-blue-500/20 w-full rounded-full"><div className="h-full bg-blue-500 w-1/2 rounded-full" /></div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="flex gap-4 items-center">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search IDs, titles, or notes..." className="w-full bg-[#060d1a] border border-[#1e2d45] rounded-lg pl-10 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#00D9A360] transition-colors" />
                            </div>
                            <div className="flex bg-[#060d1a] border border-[#1e2d45] rounded-lg p-1 gap-1">
                                {['All', 'Income', 'Expense', 'Flagged'].map(filter => (
                                    <button 
                                        key={filter} 
                                        onClick={() => setFilterType(filter)} 
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filterType === filter ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e2d45]'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        <div className="relative">
                            <AnimatePresence>
                                {selectedRows.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                        className="absolute -top-3 left-0 right-0 z-10 bg-[#0a1628] border border-teal-500/30 rounded-lg p-2.5 flex items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                                    >
                                        <span className="text-teal-400 font-mono text-sm px-3 font-bold">{selectedRows.length} rows selected</span>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 rounded bg-[#1e2d45] text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors">Edit category</button>
                                            <button onClick={handleBulkReview} className="px-3 py-1.5 rounded bg-[#1e2d45] text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors">Mark reviewed</button>
                                            <button onClick={handleBulkDelete} className="px-3 py-1.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors">Delete selected</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Table */}
                            <div className="border border-[#1e2d45] bg-[#060d1a] text-sm rounded-xl overflow-hidden shadow-lg mt-2">
                                <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#1e2d45] bg-[#0a1628] font-bold text-slate-400 text-xs uppercase tracking-wider">
                                    <div className="col-span-4 flex items-center gap-3">
                                        <input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? paginatedList.map(t=>t.id) : [])} checked={selectedRows.length > 0 && selectedRows.length === paginatedList.length} className="w-4 h-4 rounded border-[#1e2d45] bg-transparent accent-teal-500" />
                                        Transaction
                                    </div>
                                    <div className="col-span-2 flex items-center">Category</div>
                                    <div className="col-span-1 flex items-center">Type</div>
                                    <div className="col-span-2 flex items-center">Amount</div>
                                    <div className="col-span-2 flex items-center">Status</div>
                                    <div className="col-span-1 flex items-center justify-end pr-2">Actions</div>
                                </div>
                                
                                <div className="flex flex-col">
                                    {paginatedList.length === 0 ? (
                                        <div className="py-12 text-center text-slate-500 font-mono">No matching records found.</div>
                                    ) : (
                                        paginatedList.map((t) => {
                                            const status = t.status || 'Normal';
                                            const isSelected = selectedRows.includes(t.id);
                                            const isDeleting = deleteConfirmId === t.id;

                                            return (
                                                <div 
                                                    key={t.id} 
                                                    onClick={(e) => {
                                                        if (['INPUT','BUTTON','svg'].some(tagName => tagName === e.target.tagName || e.target.closest('button'))) return;
                                                        setModalConfig({ isOpen: true, data: t });
                                                    }}
                                                    className={`group grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#1e2d45] hover:bg-[#0a1628] transition-colors cursor-pointer relative items-center ${status === 'Flagged' ? 'border-l-2 border-l-amber-500' : ''}`}
                                                >
                                                    <div className="col-span-4 flex items-center gap-3">
                                                        <input type="checkbox" checked={isSelected} onChange={(e) => setSelectedRows(prev => e.target.checked ? [...prev, t.id] : prev.filter(id => id !== t.id))} className="w-4 h-4 rounded accent-teal-500 z-10" />
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-semibold text-slate-200 truncate">{t.title}</span>
                                                            <span className="text-xs text-slate-500 font-mono">{new Date(t.date).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 flex items-center">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${categoryColors[t.category] || categoryColors.shopping}`}>{t.category}</span>
                                                    </div>
                                                    <div className="col-span-1 flex items-center capitalize text-xs text-slate-400">
                                                        {t.type}
                                                    </div>
                                                    <div className="col-span-2 flex items-center">
                                                        <span className={`font-mono font-bold ${t.type === 'income' ? 'text-teal-400' : 'text-[#ff6b6b]'}`}>
                                                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 flex items-center">
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1e2d45] rounded-full w-fit">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`} />
                                                            <span className="text-[10px] uppercase font-bold text-slate-300">{status}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 flex items-center justify-end gap-1 relative z-10">
                                                        <AnimatePresence>
                                                            {isDeleting ? (
                                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1 bg-[#0a1628] p-1 rounded-lg border border-[#1e2d45] absolute right-8 whitespace-nowrap shadow-xl">
                                                                    <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 hover:bg-[#1e2d45] rounded">Cancel</button>
                                                                    <button onClick={() => deleteTransaction(t.id)} className="px-2 py-1 text-[10px] uppercase font-bold text-red-400 hover:bg-red-500/10 rounded">Delete</button>
                                                                </motion.div>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => setModalConfig({ isOpen: true, data: t })} className="p-1.5 text-slate-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                                                                    <button onClick={() => setDeleteConfirmId(t.id)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><X size={16} /></button>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="px-4 py-3 bg-[#0a1628] flex justify-between items-center text-xs font-mono text-slate-400">
                                    <span>Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, filteredList.length)} of {filteredList.length} transactions</span>
                                    <div className="flex items-center gap-2">
                                        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1 rounded bg-[#1e2d45] border border-transparent disabled:opacity-30 hover:border-slate-500"><ChevronLeft size={16}/></button>
                                        <span className="font-bold text-slate-200">{currentPage}</span>
                                        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1 rounded bg-[#1e2d45] border border-transparent disabled:opacity-30 hover:border-slate-500"><ChevronRight size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <TransactionModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig({ isOpen: false, data: null })} initialData={modalConfig.data} />
        </div>
    );
};

export default AdminPanel;
