import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { getMonthlyComparison } from '../utils/derive';
import { motion, useReducedMotion } from 'framer-motion';

const tooltipBase = {
    background: '#0d1f3c',
    border: '1px solid #1e3a5f',
    borderRadius: '10px',
    padding: '10px 14px',
    boxShadow: '0 4px 20px #00000060',
    fontFamily: '"DM Mono", monospace',
};

const AreaTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const current = payload[0].payload;
    const balance = current.income - current.expense;
    const prevBalance = current.prevBalance ?? null;
    const delta = prevBalance !== null ? balance - prevBalance : null;
    const deltaPositive = delta >= 0;

    return (
        <div style={tooltipBase}>
            <p style={{
                fontSize: '10px',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: '#4a7fa5',
                marginBottom: '8px',
                fontVariantNumeric: 'tabular-nums',
            }}>
                {label}
            </p>
            <p style={{ fontSize: '18px', color: '#00D9A3', fontWeight: '600', lineHeight: 1, marginBottom: '4px' }}>
                ₹{balance.toLocaleString('en-IN')}
            </p>
            <div style={{ height: '1px', background: '#1e3a5f', margin: '8px 0' }} />
            <div style={{ display: 'flex', gap: '16px' }}>
                <div>
                    <p style={{ fontSize: '9px', color: '#4a7fa5', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>In</p>
                    <p style={{ fontSize: '13px', color: '#00D9A3', fontWeight: '500' }}>₹{current.income.toLocaleString('en-IN')}</p>
                </div>
                <div>
                    <p style={{ fontSize: '9px', color: '#4a7fa5', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>Out</p>
                    <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: '500' }}>₹{current.expense.toLocaleString('en-IN')}</p>
                </div>
            </div>
            {delta !== null && (
                <p style={{
                    fontSize: '11px',
                    color: deltaPositive ? '#22c55e' : '#ef4444',
                    marginTop: '8px',
                    fontWeight: '500',
                }}>
                    {deltaPositive ? '↑' : '↓'} ₹{Math.abs(delta).toLocaleString('en-IN')} from last period
                </p>
            )}
        </div>
    );
};

const BalanceAreaChart = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const shouldReduceMotion = useReducedMotion();
    const rawData = useMemo(() => getMonthlyComparison(transactions), [transactions]);

    // Attach prevBalance for delta calculation
    const data = useMemo(() => rawData.map((d, i) => ({
        ...d,
        prevBalance: i > 0 ? rawData[i - 1].income - rawData[i - 1].expense : null,
    })), [rawData]);

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
                        <RechartsTooltip
                            content={<AreaTooltip />}
                            cursor={{ stroke: '#1e3a5f', strokeWidth: 1, strokeDasharray: '4 4' }}
                            wrapperStyle={{ outline: 'none' }}
                        />
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
