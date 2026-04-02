import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Card = ({ title, amount, icon, type, trend }) => {
    return (
        <motion.div variants={item} className="relative overflow-hidden bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 glass hover:bg-slate-800/60 transition-colors group">
            <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${type === 'income' ? 'bg-green-500' : type === 'expense' ? 'bg-red-500' : 'bg-blue-500'}`} />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className={`p-2.5 rounded-xl ${type === 'income' ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : type === 'expense' ? 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20' : 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'}`}>
                        {icon}
                    </div>
                    <h3 className="text-sm font-medium text-slate-400">{title}</h3>
                </div>
            </div>
            
            <div className="flex items-baseline gap-2 relative z-10 mt-2">
                <span className="text-2xl text-slate-500 mb-1">₹</span>
                <span className="text-4xl font-bold tracking-tight text-white bg-clip-text">
                    {amount.toLocaleString('en-IN')}
                </span>
            </div>
            
            <div className="mt-4 flex items-center text-sm relative z-10">
                <span className={`flex items-center font-medium bg-slate-800/80 px-2 py-1 rounded-md ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                    {Math.abs(trend)}%
                </span>
                <span className="text-slate-500 ml-3">vs last month</span>
            </div>
        </motion.div>
    );
};

const SummaryCards = () => {
  const { income, expense, balance } = useFinanceStore(state => state.getMetrics());

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
        <Card title="Total Balance" amount={balance} type="balance" icon={<IndianRupee size={20} />} trend={12.5} />
        <Card title="Total Income" amount={income} type="income" icon={<ArrowUpRight size={20} />} trend={8.2} />
        <Card title="Total Expenses" amount={expense} type="expense" icon={<ArrowDownRight size={20} />} trend={-4.1} />
    </motion.div>
  );
};

export default SummaryCards;
