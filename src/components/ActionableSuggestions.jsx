import React, { useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { getActionableSuggestions } from '../utils/derive';
import { Coffee, Flame, AlertTriangle, CheckCircle, ChevronRight, Zap } from 'lucide-react';

const ActionableSuggestions = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const suggestions = useMemo(() => getActionableSuggestions(transactions), [transactions]);
    const shouldReduceMotion = useReducedMotion();

    const getIconSrc = (iconName) => {
        switch(iconName) {
            case 'food': return <Coffee size={18} className="text-orange-400" />;
            case 'plugin': return <Zap size={18} className="text-purple-400" />;
            case 'trending-up': return <Flame size={18} className="text-red-400" />;
            case 'alert-triangle': return <AlertTriangle size={18} className="text-amber-400" />;
            default: return <CheckCircle size={18} className="text-green-400" />;
        }
    };

    const getBorderClass = (priority) => {
        if (priority === 'red') return 'border-l-red-500 hover:border-l-red-400';
        if (priority === 'amber') return 'border-l-amber-500 hover:border-l-amber-400';
        return 'border-l-green-500 hover:border-l-green-400';
    };

    if (suggestions.length === 0) return null;

    const containerVariants = {
       hidden: {},
       visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } }
    };

    const itemVariants = {
       hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -16 },
       visible: { opacity: 1, x: 0, transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' } }
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-sora font-semibold text-white flex items-center gap-2">
                <Zap size={18} className="text-teal-400" /> Actionable Insights
            </h3>
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               className="flex flex-col gap-3"
            >
                <AnimatePresence>
                    {suggestions.map((item, i) => (
                        <motion.div 
                           key={i}
                           variants={itemVariants}
                           className={`bg-[#1C2333] border border-[#252D42] border-l-[4px] ${getBorderClass(item.priority)} rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:bg-[#1C2333]/70 hover:brightness-105 transition-all shadow-lg`}
                           style={{ willChange: "transform, opacity" }}
                        >
                           <div className="flex items-center gap-4 flex-1">
                               <div className="w-10 h-10 rounded-full bg-[#0D1117] border border-[#252D42] flex items-center justify-center shrink-0">
                                   {getIconSrc(item.icon)}
                               </div>
                               <p className="text-sm font-medium text-slate-300 leading-snug">{item.message}</p>
                           </div>
                           
                           {item.saving > 0 && (
                               <div className="flex items-center gap-3 shrink-0 self-end md:self-center mt-2 md:mt-0">
                                   <div className="px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 flex flex-col items-end shadow-inner">
                                       <span className="text-[9px] uppercase tracking-wider text-teal-500 font-bold mb-0.5">Potential Saving</span>
                                       <span className="text-sm font-bold text-teal-400 font-mono">₹{item.saving.toLocaleString('en-IN')}/mo</span>
                                   </div>
                                   <ChevronRight size={16} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                               </div>
                           )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
export default ActionableSuggestions;
