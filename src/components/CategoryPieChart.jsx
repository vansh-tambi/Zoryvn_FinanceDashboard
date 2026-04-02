import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryTotals } from '../utils/derive';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#f59e0b', '#3b82f6', '#ec4899', '#eab308', '#a855f7', '#22c55e', '#14b8a6', '#64748b'];

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
        <g>
            <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" className="font-sora font-bold text-lg capitalize">{payload.category}</text>
            <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#94a3b8" className="text-xs font-semibold">₹{value.toLocaleString()}</text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 10} outerRadius={outerRadius + 12} fill={fill} />
        </g>
    );
};

const CategoryPieChart = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const shouldReduceMotion = useReducedMotion();
    const data = useMemo(() => getCategoryTotals(transactions).slice(0, 6), [transactions]);
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    if (data.length === 0) {
       return (
         <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeOut" }} className="bg-[#1C2333] border border-[#252D42] rounded-3xl p-6 h-full flex items-center justify-center text-slate-500 shadow-lg">
            No expenses logged yet.
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
                            data={data}
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
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default CategoryPieChart;
