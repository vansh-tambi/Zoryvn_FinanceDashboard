import React, { useEffect, useMemo } from 'react';
import { motion, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { getTotalBalance, getSavingsRate } from '../utils/derive';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

const AnimatedCounter = ({ value, prefix = '₹' }) => {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 60, damping: 15 });
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
    } else {
      motionValue.set(value);
    }
  }, [value, motionValue, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    return springValue.onChange((latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue, shouldReduceMotion]);

  return <span>{prefix}{displayValue.toLocaleString('en-IN')}</span>;
};

const SummaryCards = () => {
  const transactions = useFinanceStore(state => state.transactions);
  const shouldReduceMotion = useReducedMotion();
  
  const { income, expense, balance, savingsRate } = useMemo(() => {
    return { ...getTotalBalance(transactions), savingsRate: getSavingsRate(transactions) };
  }, [transactions]);

  const cards = [
    { label: 'Total Balance', value: balance, icon: Wallet, color: 'text-blue-400' },
    { label: 'Total Income', value: income, icon: TrendingUp, color: 'text-teal-400' },
    { label: 'Total Expenses', value: expense, icon: TrendingDown, color: 'text-red-400' },
    { label: 'Savings Rate', value: Math.max(0, savingsRate), icon: PiggyBank, color: 'text-purple-400', prefix: '', suffix: '%' }
  ];

  const containerVariants = {
      hidden: {},
      visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } }
  };

  const cardVariants = {
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
      visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((c, i) => (
         <motion.div 
           key={i}
           variants={cardVariants}
           whileHover={!shouldReduceMotion ? { y: -4, borderColor: "rgba(0, 217, 163, 0.18)" } : {}}
           whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
           transition={{ y: { duration: 0.2, ease: "easeOut" }, borderColor: { duration: 0.2, ease: "easeOut" }, scale: { type: "spring", stiffness: 400, damping: 17 } }}
           className="bg-[#1C2333] border border-[#1e3a5f] rounded-2xl p-6 flex flex-col relative overflow-hidden cursor-pointer w-full shadow-lg"
           style={{ willChange: "transform" }}
         >
             <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-full bg-[#0D1117] border border-[#252D42] ${c.color}`}>
                     <c.icon size={22} />
                 </div>
                 <div className="flex items-center gap-1 text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded">
                     ↑ 2.4%
                 </div>
             </div>
             <p className="text-sm font-medium text-slate-400 mb-1">{c.label}</p>
             <h2 className="text-2xl font-bold font-sora text-white tracking-wide">
                 <AnimatedCounter value={c.value} prefix={c.prefix !== undefined ? c.prefix : '₹'} />{c.suffix}
             </h2>
             <svg className="absolute bottom-0 right-0 w-24 h-16 opacity-30" viewBox="0 0 100 50">
                 <path d="M0,50 Q10,30 20,40 T40,20 T60,35 T80,10 T100,20 L100,50 Z" fill="url(#sparkline)" />
                 <defs>
                     <linearGradient id="sparkline" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
                         <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                     </linearGradient>
                 </defs>
             </svg>
         </motion.div>
      ))}
    </motion.div>
  );
};
export default SummaryCards;
