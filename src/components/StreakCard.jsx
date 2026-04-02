import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { getNoSpendStreak } from '../utils/derive';
import { Flame, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

const StreakCard = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const { currentStreak, bestStreak } = useMemo(() => getNoSpendStreak(transactions), [transactions]);

    const isHot = currentStreak >= 2;

    return (
        <div className="bg-[#1C2333] border border-[#252D42] rounded-[16px] p-4 flex flex-col w-full shadow-lg">
           <div className="flex items-center justify-between mb-2">
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Spending Streak</span>
               {isHot ? (
                   <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                       <Flame size={16} className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                   </motion.div>
               ) : (
                   <Snowflake size={16} className="text-blue-400" />
               )}
           </div>

           {currentStreak === 0 ? (
               <p className="text-sm text-slate-300 font-medium py-1">Start your no-spend streak today.</p>
           ) : (
               <div className="flex items-baseline gap-2 py-1">
                   <h3 className="text-2xl font-bold font-sora text-white">{currentStreak} <span className="text-sm text-slate-400 font-sans">days</span></h3>
               </div>
           )}

           <div className="mt-3 text-xs bg-[#0D1117] text-slate-400 px-3 py-1.5 rounded-lg border border-[#252D42] w-fit font-bold">
               Best: {bestStreak} days
           </div>
        </div>
    );
};
export default StreakCard;
