import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip as RechartsTooltip } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryTotals } from '../utils/derive';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#f59e0b', '#3b82f6', '#ec4899', '#eab308', '#a855f7', '#22c55e', '#14b8a6', '#64748b'];

const tooltipBase = {
    background: '#0d1f3c',
    border: '1px solid #1e3a5f',
    borderRadius: '10px',
    padding: '10px 14px',
    boxShadow: '0 4px 20px #00000060',
    fontFamily: '"DM Mono", monospace',
    minWidth: '160px',
};

const DonutTooltip = ({ active, payload, totalExpense }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    const pct = totalExpense > 0 ? ((item.total / totalExpense) * 100).toFixed(1) : '0';
    const color = payload[0].payload.fill || COLORS[0];

    return (
        <div style={tooltipBase}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <p style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#7a9cc4', fontWeight: '600' }}>
                    {item.category}
                </p>
            </div>
            <p style={{ fontSize: '18px', color: '#f1f5f9', fontWeight: '600', lineHeight: 1, marginBottom: '6px', fontVariantNumeric: 'tabular-nums' }}>
                ₹{item.total.toLocaleString('en-IN')}
            </p>
            <div style={{ height: '1px', background: '#1e3a5f', margin: '8px 0' }} />
            <p style={{ fontSize: '11px', color: '#4a7fa5' }}>
                <span style={{ color, fontWeight: '600' }}>{pct}%</span> of total spend
            </p>
        </div>
    );
};

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
        <g>
            <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" fontFamily="Sora, sans-serif" fontWeight="700" fontSize={15} textTransform="capitalize">{payload.category}</text>
            <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#94a3b8" fontFamily="DM Mono, monospace" fontSize={13}>₹{value.toLocaleString()}</text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 10} outerRadius={outerRadius + 12} fill={fill} />
        </g>
    );
};

const CategoryPieChart = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const shouldReduceMotion = useReducedMotion();
    const data = useMemo(() => getCategoryTotals(transactions).slice(0, 6), [transactions]);
    const totalExpense = useMemo(() => data.reduce((s, d) => s + d.total, 0), [data]);
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_, index) => setActiveIndex(index);

    // Inject fill into data for tooltip color access
    const coloredData = data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));

    if (data.length === 0) {
       return (
         <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }} className="bg-[#1C2333] border border-[#252D42] rounded-3xl p-6 h-full flex items-center justify-center text-slate-500 shadow-lg">
             Start tracking to see patterns here.
         </motion.div>
       );
    }

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
            <div className="flex justify-between items-center mb-2 z-10 relative">
                <h3 className="text-white font-sora font-semibold text-lg">Top Spendings</h3>
            </div>

            <div className="flex-1 w-full min-h-0 z-0 pb-2">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                        <Pie
                            data={coloredData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="total"
                            onMouseEnter={onPieEnter}
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            stroke="none"
                            animationDuration={1000}
                        >
                            {coloredData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            content={<DonutTooltip totalExpense={totalExpense} />}
                            wrapperStyle={{ outline: 'none' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default CategoryPieChart;
