import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, ReceiptTextIcon } from 'lucide-react';
import SummaryCards from './SummaryCards';
import TransactionList from './TransactionList';
import TransactionChart from './TransactionChart';

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 mt-2"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-2.5 rounded-xl text-blue-400 ring-1 ring-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-slate-400">Finance Dashboard</h1>
            <p className="text-sm text-slate-400">August – October 2025 Overview</p>
          </div>
        </div>
        <div className="flex bg-slate-800/80 p-1.5 rounded-full ring-1 ring-slate-700/50 backdrop-blur-md">
           <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 shadow-lg shadow-blue-900/50 text-white">Overview</button>
           <button className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">Transactions</button>
        </div>
      </motion.div>
      
      {/* Metrics Row */}
      <SummaryCards />
      
      {/* Main Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col h-[400px] bg-slate-900/50 rounded-2xl glass p-6 border border-slate-700/50 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors duration-700" />
             <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 relative z-10">
                 <Wallet size={20} className="text-purple-400" />
                 Cash Flow
             </h2>
             <div className="grow relative z-10">
                 <TransactionChart />
             </div>
        </div>
        <div className="lg:col-span-1 flex flex-col h-[400px] bg-slate-900/50 rounded-2xl glass p-6 border border-slate-700/50">
             <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                 <ReceiptTextIcon size={20} className="text-green-400" />
                 Recent Transactions
             </h2>
             <div className="grow overflow-hidden relative">
                 <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none" />
                 <TransactionList />
             </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
