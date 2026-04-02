import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import { getPersonalityTags, getSuspiciousPatterns, getMonthlyCategoryComparison, getCategoryTotals } from '../utils/derive';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, AlertTriangle, CheckCircle, Flame, Star, Zap } from 'lucide-react';
import ActionableSuggestions from '../components/ActionableSuggestions';

const COLORS = {
  food: '#f59e0b',
  rent: '#3b82f6',
  shopping: '#ec4899',
  transport: '#eab308',
  entertainment: '#a855f7',
  subscription: '#22c55e'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D1117] border border-[#252D42] rounded-xl p-4 shadow-xl">
        <p className="text-slate-400 text-xs font-semibold tracking-wider mb-2">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
             <div key={index} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                 <span className="text-slate-300 capitalize text-sm">{entry.name}:</span>
                 <span className="text-white font-bold font-sora text-sm ml-auto">₹{entry.value.toLocaleString()}</span>
             </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyBarChart = ({ data }) => {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.div 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' }}
            className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 flex flex-col h-full overflow-hidden shadow-lg"
        >
            <h3 className="text-xl font-bold font-sora text-white mb-6">Trimester Breakdown</h3>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.1 }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#94a3b8' }} />
                        {Object.keys(COLORS).map((cat) => (
                           <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[cat]} radius={[0, 0, 0, 0]} animationDuration={1000} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

const SuspiciousPatterns = ({ patterns }) => {
    const shouldReduceMotion = useReducedMotion();
    const getIcon = (level) => {
        if (level === 'red') return <AlertTriangle size={20} className="text-red-500" />;
        if (level === 'yellow') return <AlertCircle size={20} className="text-amber-500" />;
        return <CheckCircle size={20} className="text-green-500" />;
    };
    const getBorder = (level) => {
        if (level === 'red') return 'border-l-red-500 hover:border-l-red-400';
        if (level === 'yellow') return 'border-l-amber-500 hover:border-l-amber-400';
        return 'border-l-green-500 hover:border-l-green-400';
    };

    const containerVariants = {
       hidden: {},
       visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } }
    };
    const itemVariants = {
       hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -16 },
       visible: { opacity: 1, x: 0, transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' } }
    };

    return (
       <div className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 flex flex-col h-full shadow-lg">
           <h3 className="text-xl font-bold font-sora text-white mb-6 flex items-center gap-2">
               <Flame size={20} className="text-orange-500" /> Activity Alerts
           </h3>
           <motion.div initial="hidden" whileInView="visible" viewport={{once: true}} variants={containerVariants} className="flex flex-col gap-4 flex-1">
               {patterns.map((p, i) => (
                   <motion.div key={i} variants={itemVariants} style={{ willChange: "transform, opacity" }} className={`flex flex-col gap-2 p-4 rounded-xl bg-[#0D1117] border-l-[3px] ${getBorder(p.level)} ring-1 ring-[#252D42] group hover:bg-[#1C2333]/70 hover:brightness-105 transition-all`}>
                       <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-[#1C2333] px-2 py-0.5 rounded shadow-sm">{p.type}</span>
                           <span className="text-[10px] text-slate-500 font-medium ml-auto">{p.timestamp}</span>
                       </div>
                       <div className="flex items-start gap-3">
                           <div className="shrink-0 mt-0.5">{getIcon(p.level)}</div>
                           <p className="text-sm text-slate-300 leading-relaxed font-medium">{p.message}</p>
                       </div>
                   </motion.div>
               ))}
           </motion.div>
       </div>
    );
};

const PersonalityCard = ({ tags }) => {
    const shouldReduceMotion = useReducedMotion();
    return (
        <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' }} className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-[24px] p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg">
           <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-teal-500/50 flex items-center justify-center relative overflow-hidden shrink-0 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
               <Star size={40} className="text-teal-400 z-10" />
               <div className="absolute inset-0 bg-teal-500/20 blur-xl animate-pulse" />
           </div>
           <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
               <span className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-2">Your Spending Persona</span>
               <h2 className="text-3xl font-bold font-sora text-white mb-4">The {tags[0]}</h2>
               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   {tags.map((tag, i) => (
                       <motion.span 
                           key={i} 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }} 
                           transition={{ delay: i * 0.1 }}
                           className="px-4 py-1.5 bg-[#0D1117] border border-[#252D42] rounded-full text-slate-300 text-sm font-semibold shadow-inner"
                       >
                           {tag}
                       </motion.span>
                   ))}
               </div>
           </div>
        </motion.div>
    );
};

const CategoryRanking = ({ totals }) => {
    const expenses = totals.filter(t => t.category !== 'salary' && t.category !== 'freelance');
    const max = expenses.length > 0 ? expenses[0].total : 1;
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 shadow-lg h-full">
             <h3 className="text-xl font-bold font-sora text-white mb-6">Top Outflows</h3>
             <div className="flex flex-col gap-5">
                 {expenses.slice(0, 5).map((cat, i) => (
                     <div key={cat.category} className="flex flex-col gap-2">
                         <div className="flex justify-between items-end">
                             <span className="text-sm font-bold text-slate-300 capitalize">{cat.category}</span>
                             <span className="text-sm font-mono text-slate-400">₹{cat.total.toLocaleString()}</span>
                         </div>
                         <div className="w-full h-2 bg-[#0D1117] rounded-full overflow-hidden border border-[#252D42]/50">
                             <motion.div 
                               initial={{ scaleX: 0 }}
                               whileInView={{ scaleX: 1 }}
                               viewport={{ once: true }}
                               transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : i * 0.06, ease: 'easeOut' }}
                               className="h-full rounded-full origin-left"
                               style={{ backgroundColor: COLORS[cat.category] || '#14b8a6', width: `${(cat.total / max) * 100}%` }}
                             />
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

const InsightsPage = () => {
    const transactions = useFinanceStore(state => state.transactions);
    
    if (!transactions) return <div className="p-8 text-slate-400">Loading metrics...</div>;

    const expenses = transactions.filter(t => t.type === 'expense');
    if (transactions.length > 0 && expenses.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center pt-32 pb-24 text-center">
                <div className="w-32 h-32 bg-teal-500/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} className="text-teal-500" />
                </div>
                <h2 className="text-3xl font-bold font-sora text-white mb-2">100% Savings</h2>
                <p className="text-slate-400 max-w-md">You've logged income, but no expenses tracked yet! Your insights will generate once outbound cash flows begin.</p>
            </div>
        );
    }

    const tags = getPersonalityTags(transactions);
    const patterns = getSuspiciousPatterns(transactions);
    const monthlyData = getMonthlyCategoryComparison(transactions);
    const categoryTotals = getCategoryTotals(transactions);

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold font-sora text-white mb-2 tracking-tight">Intelligence</h1>
                <p className="text-slate-400">Predictive analytics and historical spending patterns.</p>
            </div>

            <div className="flex flex-col gap-6">
                <PersonalityCard tags={tags} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <MonthlyBarChart data={monthlyData} />
                    </div>
                    <div className="lg:col-span-1">
                        <SuspiciousPatterns patterns={patterns} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ActionableSuggestions />
                    <CategoryRanking totals={categoryTotals} />
                </div>
            </div>
        </div>
    );
};
export default InsightsPage;
