import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, ReceiptTextIcon } from 'lucide-react';
import SummaryCards from './SummaryCards';
import TransactionList from './TransactionList';
import BalanceAreaChart from './BalanceAreaChart';
import CategoryPieChart from './CategoryPieChart';
import HeroInsightBanner from './HeroInsightBanner';

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 mt-2"
      >
        <div className="flex items-center gap-3">
          <div className="bg-teal-600/20 p-2.5 rounded-xl text-teal-400 ring-1 ring-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-sora bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">Finance Dashboard</h1>
            <p className="text-sm text-slate-400">August – October 2025 Overview</p>
          </div>
        </div>

      </motion.div>
      
      {/* Hero Insight Banner */}
      <HeroInsightBanner />

      {/* Metrics Row */}
      <SummaryCards />
      
      {/* Main Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 h-[360px]">
             <BalanceAreaChart />
        </div>
        <div className="col-span-1 h-[360px]">
             <CategoryPieChart />
        </div>
      </div>
      
      {/* Transaction List Row */}
      <div className="bg-[#1C2333] rounded-[16px] p-6 border border-[#252D42] mt-2">
           <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 font-sora text-white">
               <ReceiptTextIcon size={20} className="text-teal-500" />
               Recent Transactions
           </h2>
           <div className="overflow-hidden relative h-[320px]">
               <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1C2333] to-transparent z-10 pointer-events-none" />
               <TransactionList />
           </div>
      </div>
    </div>
  );
};
export default Dashboard;
