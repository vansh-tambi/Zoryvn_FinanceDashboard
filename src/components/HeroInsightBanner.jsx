import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { getMonthlyTotals, getSuspiciousPatterns, getSavingsRate, getCategoryTotals } from '../utils/derive';

const CircularProgress = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center pointer-events-none">
      <svg width="80" height="80" className="transform -rotate-90 drop-shadow-[0_0_10px_rgba(20,184,166,0.4)]">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#252D42" strokeWidth="6" />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#14b8a6" // teal
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-sora font-bold text-lg leading-none">{Math.round(progress)}</span>
        <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Score</span>
      </div>
    </div>
  );
};

const HeroInsightBanner = () => {
    const transactions = useFinanceStore(state => state.transactions);

    const bannerData = useMemo(() => {
        const sortedDates = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date));
        if (!sortedDates.length) return null;
        
        // Isolate current & past month ranges
        const currentMonthStr = sortedDates[0].date.substring(0, 7);
        const prevDate = new Date(`${currentMonthStr}-01`);
        prevDate.setMonth(prevDate.getMonth() - 1);
        const lastMonthStr = prevDate.toISOString().substring(0, 7);

        const currentTotals = getMonthlyTotals(transactions, currentMonthStr);
        const lastTotals = getMonthlyTotals(transactions, lastMonthStr);

        let deltaPct = 0;
        if (lastTotals.expense > 0) {
            deltaPct = ((currentTotals.expense - lastTotals.expense) / lastTotals.expense) * 100;
        }

        const patterns = getSuspiciousPatterns(transactions);
        const savingsRate = getSavingsRate(transactions);
        const cats = getCategoryTotals(transactions).filter(c => c.category !== 'salary' && c.category !== 'freelance');

        // Score formulas
        let consistencyScore = 100 - (patterns.filter(p => p.level !== 'green').length * 20);
        consistencyScore = Math.max(0, consistencyScore);

        let categoryBalance = 100;
        if (cats.length > 0 && currentTotals.expense > 0) {
           const topRatio = cats[0].total / currentTotals.expense;
           categoryBalance = Math.max(0, 100 - (topRatio * 100)); // The lower the concentration in one bucket, the better
        }

        let healthScore = (savingsRate * 0.4) + (consistencyScore * 0.3) + (categoryBalance * 0.3);
        healthScore = Math.min(100, Math.max(0, healthScore));

        const isLess = deltaPct <= 0;
        const formattedExpense = currentTotals.expense.toLocaleString('en-IN');
        const headline = `You spent ₹${formattedExpense} this month — ${Math.abs(deltaPct).toFixed(1)}% ${isLess ? 'less' : 'more'} than last month.`;
        
        return {
            headline,
            isLess,
            topCategory: cats[0]?.category || 'Unknown',
            healthScore,
            tags: ['Stable flow', isLess ? 'Improving' : 'High Spend', 'On Track']
        };
    }, [transactions]);

    if (!bannerData) return null;

    return (
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative bg-[#0D1117] rounded-[24px] p-6 md:p-8 mb-6 overflow-hidden border border-[#252D42] shadow-[0_15px_40px_rgba(0,0,0,0.5)] group z-10"
        >
           {/* Animated gradient top border via Framer scale */}
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, ease: "circOut" }}
             className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 origin-left z-20" 
           />
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#252D42] to-transparent z-10" />
           
           <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
               <div className="flex flex-col w-full text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start mb-3">
                       <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-widest uppercase">
                           <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,1)]" /> Live Insight
                       </div>
                   </div>
                   
                   <h2 className="text-xl md:text-[22px] font-bold font-sora text-slate-100 mb-2 leading-snug">
                       {bannerData.headline}
                   </h2>
                   
                   <p className="text-slate-400 text-sm font-medium mb-5">
                       Highest activity driven by <span className="text-teal-300 capitalize font-bold mx-1">{bannerData.topCategory}</span> expenses. 
                   </p>

                   <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                       <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold drop-shadow-sm">{bannerData.tags[0]}</span>
                       <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold drop-shadow-sm">{bannerData.tags[1]}</span>
                       <span className="px-3 py-1 rounded-lg bg-[#3b82f6]/10 text-blue-400 border border-[#3b82f6]/20 text-xs font-semibold drop-shadow-sm">{bannerData.tags[2]}</span>
                   </div>
               </div>

               <div className="shrink-0 flex items-center justify-center w-full md:w-auto p-2">
                   <CircularProgress progress={bannerData.healthScore} />
               </div>
           </div>

           <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute -right-32 -top-32 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
    );
};

export default HeroInsightBanner;
