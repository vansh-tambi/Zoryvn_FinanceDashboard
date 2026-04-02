import React from 'react';
import { motion } from 'framer-motion';
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
  subscription: '#a855f7',
  salary: '#22c55e',
  freelance: '#14b8a6',
  other: '#64748b'
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const PersonalityCard = ({ tags }) => {
   const mainTag = tags[0] || 'Careful Spender';
   const initials = mainTag.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

   return (
       <motion.div variants={slideUp} className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group">
           <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
           <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-2xl md:text-3xl font-bold font-sora text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
               {initials}
           </div>
           <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 w-full">
               <h3 className="text-xs font-bold text-purple-400 tracking-[0.2em] uppercase mb-1">Your Financial Persona</h3>
               <h2 className="text-2xl md:text-3xl font-bold font-sora text-white mb-4">{mainTag}</h2>
               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   {tags.slice(1).map((tag, i) => (
                       <motion.span 
                          key={tag}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                          className="px-3 py-1.5 rounded-full bg-[#0D1117] border border-[#252D42] text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                       >
                          <Zap size={12} className="text-yellow-400" /> {tag}
                       </motion.span>
                   ))}
               </div>
           </div>
       </motion.div>
   );
};

const SuspiciousPatterns = ({ patterns }) => {
   const getIcon = (level) => {
       if (level === 'red') return <AlertCircle size={20} className="text-red-500" />;
       if (level === 'yellow') return <AlertTriangle size={20} className="text-yellow-500" />;
       return <CheckCircle size={20} className="text-green-500" />;
   };
   const getBorder = (level) => {
       if (level === 'red') return 'border-l-red-500';
       if (level === 'yellow') return 'border-l-yellow-500';
       return 'border-l-green-500';
   };

   return (
       <motion.div variants={slideUp} className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 flex flex-col h-full">
           <h3 className="text-xl font-bold font-sora text-white mb-6 flex items-center gap-2">
               <Flame size={20} className="text-orange-500" /> Activity Alerts
           </h3>
           <div className="flex flex-col gap-4 flex-1">
               {patterns.map((p, i) => (
                   <div key={i} className={`flex items-start gap-4 p-4 rounded-xl bg-[#0D1117] border-l-[3px] ${getBorder(p.level)} ring-1 ring-[#252D42]`}>
                       <div className="shrink-0 mt-0.5">{getIcon(p.level)}</div>
                       <p className="text-sm text-slate-300 leading-relaxed font-medium">{p.message}</p>
                   </div>
               ))}
           </div>
       </motion.div>
   );
};

const MonthlyBarChart = ({ data }) => {
   return (
       <motion.div variants={slideUp} className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 h-[400px] flex flex-col">
           <h3 className="text-xl font-bold font-sora text-white mb-6">Monthly Evolution</h3>
           <div className="flex-1 min-h-0 w-full overflow-hidden">
               <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                   <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                       <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} dy={10} />
                       <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                       <RechartsTooltip 
                           cursor={{fill: '#252D42', opacity: 0.4}} 
                           contentStyle={{ backgroundColor: '#0D1117', borderColor: '#334155', borderRadius: '12px', border: '1px solid #252D42' }}
                           itemStyle={{ fontSize: '13px', fontWeight: 'bold', paddingTop: '4px' }}
                           labelStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                       />
                       <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                       <Bar dataKey="food" stackId="a" fill={COLORS.food} radius={[0, 0, 0, 0]} />
                       <Bar dataKey="shopping" stackId="a" fill={COLORS.shopping} />
                       <Bar dataKey="transport" stackId="a" fill={COLORS.transport} />
                       <Bar dataKey="rent" stackId="a" fill={COLORS.rent} />
                       <Bar dataKey="subscription" stackId="a" fill={COLORS.subscription} radius={[4, 4, 0, 0]} />
                   </BarChart>
               </ResponsiveContainer>
           </div>
       </motion.div>
   );
};

const CategoryRanking = ({ totals }) => {
   const max = totals[0]?.total || 1;
   
   return (
       <motion.div variants={slideUp} className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6">
           <h3 className="text-xl font-bold font-sora text-white mb-6 flex items-center gap-2">
               <Star size={20} className="text-teal-400" /> Category Ranks
           </h3>
           <div className="flex flex-col gap-6">
               {totals.slice(0, 5).map((cat, i) => (
                   <div key={cat.category} className="flex flex-col gap-2">
                       <div className="flex justify-between text-sm">
                           <span className="text-slate-300 font-semibold capitalize flex items-center gap-2">
                               <span className="text-slate-500 font-mono text-xs">0{i+1}</span> {cat.category}
                           </span>
                           <span className="text-white font-bold tracking-wide">₹{cat.total.toLocaleString('en-IN')}</span>
                       </div>
                       <div className="w-full h-3 bg-[#0D1117] rounded-full overflow-hidden border border-[#252D42]">
                           <motion.div 
                               initial={{ scaleX: 0 }}
                               whileInView={{ scaleX: 1 }}
                               viewport={{ once: true }}
                               transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                               className="h-full rounded-full origin-left"
                               style={{ width: `${(cat.total / max) * 100}%`, backgroundColor: COLORS[cat.category] || COLORS.other }}
                           />
                       </div>
                   </div>
               ))}
           </div>
       </motion.div>
   );
};

const InsightsPage = () => {
    const transactions = useFinanceStore(state => state.transactions);
    
    // Safety check fallback
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
    const categoryTotals = getCategoryTotals(transactions).filter(c => c.category !== 'salary' && c.category !== 'freelance');

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
               visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="w-full flex flex-col pb-24 md:pb-8"
        >
            <div className="mb-8 mt-2">
                <h1 className="text-3xl font-bold font-sora text-white">Insights Engine</h1>
                <p className="text-slate-400 mt-1">Deep computational analysis of your financial behavior.</p>
            </div>

            <div className="flex flex-col gap-6">
                <PersonalityCard tags={tags} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <MonthlyBarChart data={monthlyData} />
                    </div>
                    <div className="lg:col-span-1 border border-[#252D42] rounded-[24px]">
                        <SuspiciousPatterns patterns={patterns} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ActionableSuggestions />
                    <CategoryRanking totals={categoryTotals} />
                </div>
            </div>
        </motion.div>
    );
};
export default InsightsPage;
