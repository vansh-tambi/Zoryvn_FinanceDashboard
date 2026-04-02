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
    if (shouldReduceMotion) { setDisplayValue(value); return; }
    motionValue.set(value);
  }, [value, motionValue, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    return springValue.onChange((latest) => setDisplayValue(Math.floor(latest)));
  }, [springValue, shouldReduceMotion]);

  return <span>{prefix}{displayValue.toLocaleString('en-IN')}</span>;
};

const SummaryCards = () => {
  const transactions = useFinanceStore(state => state.transactions);
  const shouldReduceMotion = useReducedMotion();

  const { income, expense, balance, savingsRate } = useMemo(() => ({
    ...getTotalBalance(transactions),
    savingsRate: Math.max(0, getSavingsRate(transactions))
  }), [transactions]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-6 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr] gap-5"
    >
      {/* Total Balance — spans both rows, left column */}
      <motion.div
        variants={cardVariants}
        whileHover={!shouldReduceMotion ? { y: -4 } : {}}
        whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
        transition={{ y: { duration: 0.2, ease: 'easeOut' }, scale: { type: 'spring', stiffness: 400, damping: 17 } }}
        style={{ willChange: 'transform' }}
        className="lg:row-span-2 bg-[#1C2333] border border-teal-500/25 shadow-[0_0_30px_rgba(20,184,166,0.08)] rounded-[24px] p-7 flex flex-col justify-between relative overflow-hidden cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Wallet size={24} />
          </div>
          <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">NET</span>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-400 mb-2">Your net position</p>
          <h2 className="font-bold font-sora text-white tracking-wide leading-none mb-1" style={{ fontSize: '28px' }}>
            <AnimatedCounter value={balance} />
          </h2>
          <p className="text-xs text-slate-500 mt-2">All income minus everything spent</p>
        </div>

        {/* Decorative glow blob */}
        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/8 blur-[50px] pointer-events-none" />
        <svg className="absolute bottom-0 right-0 w-32 h-20 opacity-20" viewBox="0 0 100 50">
          <path d="M0,50 Q10,30 20,40 T40,20 T60,35 T80,10 T100,20 L100,50 Z" fill="url(#balanceGrad)" />
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Income — top-right */}
      <motion.div
        variants={cardVariants}
        whileHover={!shouldReduceMotion ? { y: -4, borderColor: 'rgba(20,184,166,0.18)' } : {}}
        whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
        transition={{ y: { duration: 0.2, ease: 'easeOut' }, scale: { type: 'spring', stiffness: 400, damping: 17 } }}
        style={{ willChange: 'transform' }}
        className="bg-[#1C2333] border border-[#1e3a5f] rounded-[20px] p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="p-2.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <TrendingUp size={18} />
          </div>
          <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">IN</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Money in</p>
          <h2 className="text-[22px] font-bold font-sora text-teal-400 tracking-wide leading-none">
            <AnimatedCounter value={income} />
          </h2>
        </div>
      </motion.div>

      {/* Expenses — middle-right */}
      <motion.div
        variants={cardVariants}
        whileHover={!shouldReduceMotion ? { y: -4, borderColor: 'rgba(239,68,68,0.18)' } : {}}
        whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
        transition={{ y: { duration: 0.2, ease: 'easeOut' }, scale: { type: 'spring', stiffness: 400, damping: 17 } }}
        style={{ willChange: 'transform' }}
        className="bg-[#1C2333] border border-[#1e3a5f] rounded-[20px] p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="p-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <TrendingDown size={18} />
          </div>
          <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">OUT</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">Money out</p>
          <h2 className="text-[22px] font-bold font-sora text-red-400 tracking-wide leading-none">
            <AnimatedCounter value={expense} />
          </h2>
        </div>
      </motion.div>

      {/* Savings Rate — spans columns 2 & 3, row 2 */}
      <motion.div
        variants={cardVariants}
        whileHover={!shouldReduceMotion ? { y: -4, borderColor: 'rgba(168,85,247,0.18)' } : {}}
        whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
        transition={{ y: { duration: 0.2, ease: 'easeOut' }, scale: { type: 'spring', stiffness: 400, damping: 17 } }}
        style={{ willChange: 'transform' }}
        className="lg:col-span-2 bg-[#1C2333] border border-[#1e3a5f] rounded-[20px] p-5 flex items-center gap-6 relative overflow-hidden cursor-pointer"
      >
        <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
          <PiggyBank size={20} />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 mb-1">How much you're keeping</p>
          <h2 className="text-[22px] font-bold font-sora text-purple-400 tracking-wide leading-none">
            <AnimatedCounter value={savingsRate} prefix="" /><span className="text-lg">%</span>
          </h2>
        </div>
        {/* Mini progress bar */}
        <div className="flex-1 hidden sm:flex flex-col gap-1.5 max-w-[140px]">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">vs 20% target</p>
          <div className="w-full h-1.5 bg-[#0D1117] rounded-full overflow-hidden border border-[#252D42]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-purple-500 rounded-full origin-left"
              style={{ width: `${Math.min(savingsRate / 20 * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-[30%] bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none rounded-r-[20px]" />
      </motion.div>
    </motion.div>
  );
};
export default SummaryCards;
