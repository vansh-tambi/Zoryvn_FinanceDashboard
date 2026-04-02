import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';

const TransactionChart = () => {
    const transactions = useFinanceStore(state => state.transactions);

    const chartData = useMemo(() => {
        // Group by month
        const monthly = {
            '08': { name: 'August', Income: 0, Expense: 0 },
            '09': { name: 'September', Income: 0, Expense: 0 },
            '10': { name: 'October', Income: 0, Expense: 0 }
        };

        transactions.forEach(t => {
            const date = new Date(t.date);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            if (monthly[month]) {
                if (t.type === 'income') monthly[month].Income += t.amount;
                else monthly[month].Expense += t.amount;
            }
        });

        return Object.values(monthly);
    }, [transactions]);

    return (
        <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                    <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                    />
                    <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionChart;
