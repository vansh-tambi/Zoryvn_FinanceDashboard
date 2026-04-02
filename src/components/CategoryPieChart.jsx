import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';
import { getCategoryTotals } from '../utils/derive';

const COLORS = ['#14b8a6', '#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // Expanding logic
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D1117] border border-slate-700 p-3 rounded-xl shadow-xl pointer-events-none">
        <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">
          {payload[0].name}
        </p>
        <p className="text-white font-bold text-lg">
           ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = () => {
    const transactions = useFinanceStore(state => state.transactions);
    const [activeIndex, setActiveIndex] = useState(-1);
    
    const data = useMemo(() => {
        let sorted = getCategoryTotals(transactions);
        if (sorted.length > 6) {
           const top5 = sorted.slice(0, 5);
           const otherTotal = sorted.slice(5).reduce((acc, c) => acc + c.total, 0);
           return [...top5, { category: 'other', total: otherTotal }];
        }
        return sorted;
    }, [transactions]);

    const topCategory = data.length > 0 ? data[0].category : '';
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full h-full bg-[#1C2333] p-6 rounded-[16px] border border-[#252D42] flex flex-col relative overflow-hidden"
        >
            <h3 className="text-white font-sora font-semibold mb-2 text-lg z-10 relative">Spending by Category</h3>
            
            {/* Absolute overlay for "donut hole" text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 mt-8">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-0.5">Top Category</span>
                <span className="text-xl font-bold font-sora text-slate-100 capitalize">{topCategory}</span>
            </div>

            <div className="flex-1 w-full min-h-0 z-0 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="total"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            innerRadius={"65%"}
                            outerRadius={"85%"}
                            paddingAngle={5}
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(-1)}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                           wrapperStyle={{ fontSize: '11px', fontWeight: 500, fontFamily: 'system-ui' }} 
                           formatter={(value) => <span className="text-slate-400 capitalize hover:text-slate-200 transition-colors cursor-pointer ml-1.5">{value}</span>}
                           iconType="circle"
                           iconSize={8}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default CategoryPieChart;
