import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { IndianRupee, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, PiggyBank, ReceiptText } from 'lucide-react';
import { getTotalBalance, getSavingsRate } from '../utils/derive';

const AnimatedNumber = ({ value, prefix }) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(springValue, (current) => {
     return prefix === '₹' 
       ? `${prefix}${Math.round(current).toLocaleString('en-IN')}` 
       : `${Math.round(current)}${prefix}`;
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{displayValue}</motion.span>;
};

const Sparkline = ({ color, dataPts }) => {
  if (!dataPts || dataPts.length !== 7) return null;
  const max = Math.max(...dataPts) || 1;
  const min = Math.min(...dataPts) || 0;
  const range = max - min || 1;
  
  const points = dataPts.map((val, i) => {
    const x = (i / 6) * 100;
    const y = 40 - (((val - min) / range) * 35);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="absolute bottom-4 right-4 w-20 h-10 opacity-40 transition-opacity group-hover:opacity-100" viewBox="0 -5 100 50" preserveAspectRatio="none">
       <polyline fill="none" stroke={color} strokeWidth="2.5" points={points} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const SummaryCard = ({ label, value, prefix, trend, icon: Icon, accentColor, sparklineData }) => {
  const isPositive = trend >= 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-[#1C2333] p-5 rounded-[16px] border border-[#252D42] hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all duration-300 group cursor-default"
    >
       <div className="flex justify-between items-start mb-4">
           <span className="text-slate-400 font-medium text-sm tracking-wide">{label}</span>
           <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}>
               <Icon size={18} />
           </div>
       </div>

       <div className="flex flex-col gap-1 relative z-10">
           <h3 className="text-2xl font-bold font-sora tracking-tight text-white mb-1">
               <AnimatedNumber value={value} prefix={prefix} />
           </h3>
           <div className="flex items-center text-xs font-semibold mt-1">
               <span className={`flex items-center px-1.5 py-0.5 rounded-md ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                   {isPositive ? <TrendingUp size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                   {Math.abs(trend)}%
               </span>
               <span className="text-slate-500 ml-2 font-medium">vs last month</span>
           </div>
       </div>

       <Sparkline color={accentColor} dataPts={sparklineData} />
    </motion.div>
  );
};

const SummaryCards = () => {
  const transactions = useFinanceStore(state => state.transactions);
  
  const { income, expense, balance } = getTotalBalance(transactions);
  const savingsRate = getSavingsRate(transactions);

  const cardsData = [
    {
      label: 'Total Balance',
      value: balance,
      prefix: '₹',
      trend: 12.5,
      icon: Wallet,
      accentColor: '#14b8a6', // teal
      sparklineData: [40, 45, 42, 55, 60, 58, 65]
    },
    {
      label: 'Total Income',
      value: income,
      prefix: '₹',
      trend: 8.2,
      icon: IndianRupee,
      accentColor: '#10b981', // green
      sparklineData: [50, 50, 50, 50, 85, 85, 90]
    },
    {
      label: 'Total Expenses',
      value: expense,
      prefix: '₹',
      trend: -4.1,
      icon: ReceiptText,
      accentColor: '#ef4444', // red
      sparklineData: [20, 30, 25, 40, 35, 55, 45]
    },
    {
      label: 'Savings Rate',
      value: savingsRate,
      prefix: '%',
      trend: 2.4,
      icon: PiggyBank,
      accentColor: '#8b5cf6', // purple
      sparklineData: [10, 15, 12, 20, 18, 25, 33]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
       {cardsData.map((card, idx) => (
           <SummaryCard key={idx} {...card} />
       ))}
    </div>
  );
};

export default SummaryCards;
