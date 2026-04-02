import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { getSavingsRate, getMonthlyTotals, getCategoryTotals } from '../utils/derive';

const Tooltip = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="relative w-full" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1C2333] border border-[#252D42] text-[10px] sm:text-xs text-slate-300 rounded-lg shadow-xl z-50 pointer-events-none text-center">
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AnimatedHealthScore = ({ value, colorClass }) => {
    const shouldReduceMotion = useReducedMotion();
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, { stiffness: 45, damping: 15 });
    const [display, setDisplay] = React.useState(0);
    
    React.useEffect(() => {
        if (shouldReduceMotion) setDisplay(value);
        else {
            motionValue.set(value);
            return spring.onChange(v => setDisplay(Math.floor(v)));
        }
    }, [value, motionValue, shouldReduceMotion, spring]);
    
    return <span className={`font-sora font-bold text-2xl leading-none ${colorClass}`}>{display}</span>;
};

const FinancialHealthScore = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const shouldReduceMotion = useReducedMotion();

    const metrics = useMemo(() => {
        const savingsRate = getSavingsRate(transactions);
        const savingsScoreRaw = (savingsRate / 50) * 40;
        const savingsScore = Math.min(40, Math.max(0, savingsScoreRaw));

        const monthKeys = [...new Set(transactions.map(t => t.date.substring(0, 7)))];
        const monthlyExpenses = monthKeys.map(m => getMonthlyTotals(transactions, m).expense);
        let consistencyScore = 30; 
        if (monthlyExpenses.length > 1) {
            const mean = monthlyExpenses.reduce((a, b) => a + b, 0) / monthlyExpenses.length;
            if (mean > 0) {
                const variance = monthlyExpenses.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / monthlyExpenses.length;
                const stdDev = Math.sqrt(variance);
                const cv = stdDev / mean;
                consistencyScore = Math.max(0, 30 * (1 - Math.min(cv, 1)));
            }
        }

        const cats = getCategoryTotals(transactions).filter(c => c.category !== 'salary' && c.category !== 'freelance');
        let categoryBalance = 30;
        if (cats.length > 0) {
            const totalExpense = cats.reduce((acc, curr) => acc + curr.total, 0);
            if (totalExpense > 0) {
                const topRatio = cats[0].total / totalExpense;
                if (topRatio > 0.6) {
                    const overage = topRatio - 0.6;
                    categoryBalance = Math.max(0, 30 - ((overage / 0.4) * 30));
                }
            }
        }

        const totalScore = Math.round(savingsScore + consistencyScore + categoryBalance);
        return { savingsScore, consistencyScore, categoryBalance, totalScore };
    }, [transactions]);

    const { savingsScore, consistencyScore, categoryBalance, totalScore } = metrics;
    
    let colorClass, strokeColor;
    if (totalScore > 70) {
        colorClass = "text-green-500"; strokeColor = "#22c55e";
    } else if (totalScore >= 40) {
        colorClass = "text-amber-500"; strokeColor = "#f59e0b";
    } else {
        colorClass = "text-red-500"; strokeColor = "#ef4444";
    }

    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (totalScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center bg-[#1A202C]/50 backdrop-blur-sm p-4 rounded-3xl border border-[#252D42] w-56 md:w-64 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div className="relative flex items-center justify-center mb-5">
                <svg width="90" height="90" className="transform -rotate-90 drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                    <circle cx="45" cy="45" r={radius} fill="none" stroke="#252D42" strokeWidth="6" />
                    <motion.circle
                        cx="45"
                        cy="45"
                        r={radius}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <AnimatedHealthScore value={totalScore} colorClass={colorClass} />
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">/ 100</span>
                </div>
            </div>

            <div className="w-full flex flex-col gap-3.5 px-1">
                <Tooltip content="How much you're actually putting away. Higher savings rate = higher score, capped at 50%.">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 w-[65px] leading-none text-right">Saving</span>
                        <div className="flex-1 h-1.5 bg-[#0D1117] rounded-full overflow-hidden border border-[#252D42]/50">
                            <motion.div 
                               initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                               style={{ width: `${(savingsScore/40)*100}%` }}
                               className="h-full bg-blue-500 rounded-full origin-left" transition={{ duration: 1, delay: 0.2 }}
                            />
                        </div>
                    </div>
                </Tooltip>
                
                <Tooltip content="Are you spending the same each month, or all over the place? Wild swings hurt this score.">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 w-[65px] leading-none text-right tracking-tight">Consistency</span>
                        <div className="flex-1 h-1.5 bg-[#0D1117] rounded-full overflow-hidden border border-[#252D42]/50">
                            <motion.div 
                               initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                               style={{ width: `${(consistencyScore/30)*100}%` }}
                               className="h-full bg-purple-500 rounded-full origin-left" transition={{ duration: 1, delay: 0.4 }}
                            />
                        </div>
                    </div>
                </Tooltip>

                <Tooltip content="If one category swallows more than 60% of your spend, this drops. Diversify a bit.">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 w-[65px] leading-none text-right">Balance</span>
                        <div className="flex-1 h-1.5 bg-[#0D1117] rounded-full overflow-hidden border border-[#252D42]/50">
                            <motion.div 
                               initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                               style={{ width: `${(categoryBalance/30)*100}%` }}
                               className="h-full bg-teal-500 rounded-full origin-left" transition={{ duration: 1, delay: 0.6 }}
                            />
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};
export default FinancialHealthScore;
