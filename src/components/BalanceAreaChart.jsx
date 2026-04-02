import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { getMonthlyComparison } from '../utils/derive';
import { motion, useReducedMotion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const { income, expense } = payload[0].payload;
        return (
            <div className="bg-[#0D1117] border border-[#252D42] rounded-xl p-4 shadow-xl">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                <div className="flex flex-col gap-1">
                     <p className="text-teal-400 font-bold font-sora">In: ₹{income.toLocaleString('en-IN')}</p>
                     <p className="text-coral-400 font-bold font-sora text-[#ef4444]">Out: ₹{expense.toLocaleString('en-IN')}</p>
                     <div className="w-full h-[1px] bg-[#252D42] my-1" />
                     <p className="text-white font-bold font-sora">Bal: ₹{(income - expense).toLocaleString('en-IN')}</p>
                </div>
            </div>
        );
    }
    return null;
};

const BalanceAreaChart = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const shouldReduceMotion = useReducedMotion();
    const data = useMemo(() => getMonthlyComparison(transactions), [transactions]);

    return (
        <motion.div 
            whileInView={{ opacity: 1, y: 0 }} 
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }} 
            viewport={{ once: true, margin: "-60px" }} 
            whileHover={!shouldReduceMotion ? { scale: 1.01 } : {}}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="bg-[#1C2333] border border-[#252D42] rounded-[24px] p-6 h-full flex flex-col relative overflow-hidden shadow-lg"
        >
            <h3 className="text-white font-sora font-semibold mb-4 text-lg z-10 relative">Balance Trend</h3>
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-900/10 blur-[80px] pointer-events-none" />
            <div className="flex-1 w-full min-h-0 z-10 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <AreaChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                        <XAxis 
                            dataKey="label" 
                            stroke="#94a3b8" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fill: '#94a3b8'}} 
                            dy={10}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fill: '#94a3b8'}}
                            dx={-10}
                            tickFormatter={(val) => `₹${val>=1000 ? val/1000 + 'k' : val}`}
                        />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="#14b8a6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#tealGradient)" 
                            activeDot={{ r: 6, fill: '#14b8a6', stroke: '#030712', strokeWidth: 2 }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default BalanceAreaChart;
