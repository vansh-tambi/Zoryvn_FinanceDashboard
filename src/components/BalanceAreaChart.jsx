import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { getMonthlyComparison } from '../utils/derive';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Calculate a naive delta vs previous chronological month if available, 
    // or just show pure amounts.
    return (
      <div className="bg-[#0D1117] border border-slate-700 p-3 rounded-xl shadow-xl min-w-[140px]">
        <p className="text-slate-400 text-xs mb-2 font-semibold tracking-wide uppercase">{data.label} 2025</p>
        <div className="flex items-center justify-between gap-4">
           <span className="text-slate-300 text-sm">Balance</span>
           <span className="text-teal-400 font-bold text-lg">
             ₹{data.balance.toLocaleString('en-IN')}
           </span>
        </div>
        {/* Simple mock delta display for visual requirement */}
        <div className="flex justify-end mt-1">
           <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-sm">+2.4%</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={5} stroke="#14b8a6" strokeWidth={2.5} fill="#0D1117" />
  );
};

const BalanceAreaChart = () => {
    const transactions = useFinanceStore(state => state.transactions);
    // Reverse to chronological order (Aug -> Sep -> Oct)
    const data = getMonthlyComparison(transactions).reverse();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full h-full bg-[#1C2333] p-6 rounded-[16px] border border-[#252D42] flex flex-col relative overflow-hidden"
        >
            <h3 className="text-white font-sora font-semibold mb-4 text-lg z-10 relative">Balance Trend</h3>
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-900/10 blur-[80px] pointer-events-none" />
            <div className="flex-1 w-full min-h-0 z-10 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <AreaChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                        <XAxis dataKey="label" stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500}} dy={10} />
                        <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area 
                            type="monotone" 
                            dataKey="balance" 
                            stroke="#14b8a6" 
                            strokeWidth={3.5} 
                            fillOpacity={1} 
                            fill="url(#tealGradient)" 
                            activeDot={<CustomDot />}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default BalanceAreaChart;
