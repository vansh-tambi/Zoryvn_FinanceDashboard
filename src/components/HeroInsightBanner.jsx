import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { getMonthlyTotals, getCategoryTotals } from '../utils/derive';
import FinancialHealthScore from './FinancialHealthScore';

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

        const cats = getCategoryTotals(transactions).filter(c => c.category !== 'salary' && c.category !== 'freelance');

        let spikeDateStr = 'this month';
        if (transactions.length > 0) {
            const maxTxn = [...transactions.filter(t => t.type === 'expense')].sort((a,b) => b.amount - a.amount)[0];
            if (maxTxn) spikeDateStr = new Date(maxTxn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        const savingsRate = ((currentTotals.income - currentTotals.expense) / (currentTotals.income || 1)) * 100;
        const isNegativeSavings = savingsRate < 0;
        const isLess = deltaPct <= 0;
        const formattedExpense = currentTotals.expense.toLocaleString('en-IN');
        const headline = `You spent ₹${formattedExpense} this month — ${Math.abs(deltaPct).toFixed(1)}% ${isLess ? 'less' : 'more'} than last month.`;
        
        return {
            headline,
            isLess,
            isNegativeSavings,
            topCategory: cats[0]?.category || 'Unknown',
            spikeDate: spikeDateStr,
            tags: ['Stable flow', isLess ? 'Improving' : 'High Spend', 'On Track']
        };
    }, [transactions]);

    if (!bannerData) return null;

    return (
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative bg-[#0D1117] rounded-[24px] p-6 md:p-8 mb-6 overflow-hidden border border-[#252D42] shadow-[0_15px_40px_rgba(0,0,0,0.5)] group z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4"
        >
           {/* Animated gradient top border via Framer scale */}
           <motion.div 
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, ease: "circOut" }}
             className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 origin-left z-20" 
           />
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#252D42] to-transparent z-10" />
           
           <div className="flex flex-col w-full text-center md:text-left relative z-10">
               <div className="flex items-center justify-center md:justify-start mb-3">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-widest uppercase">
                       <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,1)]" /> Live Insight
                   </div>
               </div>
               
               <h2 className="text-xl md:text-[22px] font-bold font-sora text-slate-100 mb-2 leading-snug">
                   {bannerData.isNegativeSavings ? (
                       <span className="text-red-400">Critical: You are spending more than you earn this month.</span>
                   ) : (
                       bannerData.headline
                   )}
               </h2>
               
               <p className="text-slate-400 text-sm font-medium mb-5">
                   Highest activity driven by <span className="text-teal-300 capitalize font-bold mx-1">{bannerData.topCategory}</span> expenses. Peak spending occurred on <span className="text-slate-200 font-bold">{bannerData.spikeDate}</span>.
               </p>

               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold drop-shadow-sm">{bannerData.tags[0]}</span>
                   <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold drop-shadow-sm">{bannerData.tags[1]}</span>
                   <span className="px-3 py-1 rounded-lg bg-[#3b82f6]/10 text-blue-400 border border-[#3b82f6]/20 text-xs font-semibold drop-shadow-sm">{bannerData.tags[2]}</span>
               </div>
           </div>

           <div className="shrink-0 flex items-center justify-center relative z-10 w-full md:w-auto">
               <FinancialHealthScore />
           </div>

           <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute -right-32 -top-32 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
    );
};
export default HeroInsightBanner;
