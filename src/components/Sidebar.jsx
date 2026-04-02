import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, LineChart, Shield, UserCircle } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import StreakCard from './StreakCard';

import { motion, useReducedMotion } from 'framer-motion';

const NavItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    
    return (
        <NavLink
            to={item.path}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ padding: '11px 16px' }}
            className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl transition-all duration-150 whitespace-nowrap overflow-hidden ${
                    isActive ? 'bg-[#0d1f3c] text-white' : 'text-slate-400 hover:bg-[#0d1f3c]/70 hover:text-slate-200'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-teal-500 origin-bottom transition-transform duration-150 ease-out ${(isActive || isHovered) ? 'scale-y-100' : 'scale-y-0'}`} />
                    <motion.span 
                        animate={(!shouldReduceMotion && (isActive || isHovered)) ? { rotate: 8, scale: 1.1 } : { rotate: 0, scale: 1 }} 
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="shrink-0 z-10"
                    >
                        {item.icon}
                    </motion.span>
                    <span className="font-medium z-10">{item.label}</span>
                </>
            )}
        </NavLink>
    );
};

const Sidebar = () => {
  const { role, setRole } = useFinanceStore();
  
  const navItems = [
    { label: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { label: 'Insights', path: '/insights', icon: <LineChart size={20} /> },
  ];

  return (
    <>
      <div className="hidden md:flex fixed inset-y-0 left-0 z-50 flex-col bg-[#0D1117] border-r border-[#1C2333] transition-all duration-300 w-[228px]">
        <div className="flex h-20 shrink-0 items-center px-4 justify-start">
           <div className="flex items-center gap-3 overflow-hidden">
               <div className="bg-teal-500/20 p-2 rounded-lg text-teal-500 shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.3)] ring-1 ring-teal-500/30">
                  <Shield size={22} />
               </div>
               <span className="font-sora font-semibold text-lg text-slate-100 whitespace-nowrap">Finance</span>
           </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="px-3 pb-4">
            <button 
                onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0a1628] border border-[#1e2d45] hover:border-teal-500/50 transition-colors mb-3 group"
            >
                <div className="flex items-center gap-2 text-slate-300 group-hover:text-white">
                    <UserCircle size={16} />
                    <span className="text-xs font-semibold">{role === 'admin' ? 'Admin Mode' : 'Viewer Mode'}</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${role === 'admin' ? 'bg-teal-500' : 'bg-slate-600'}`}>
                    <div className={`w-3 h-3 bg-[#030712] rounded-full shadow-sm transition-transform ${role === 'admin' ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
            </button>
            {role === 'admin' && (
                <NavLink to="/admin" className="w-full flex items-center justify-center p-2.5 rounded-xl bg-teal-500 text-[#030712] font-bold text-sm hover:brightness-110 mb-4 shadow-[0_4px_15px_rgba(20,184,166,0.2)] transition-all">
                    Go to Admin Panel
                </NavLink>
            )}
            <StreakCard />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D1117]/95 backdrop-blur-md border-t border-[#1C2333] px-2 flex justify-around items-center h-[72px] pb-safe">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex flex-col items-center justify-center w-20 h-full gap-1 transition-colors ${isActive ? 'text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-300 font-medium'}`}>
               {item.icon}
               <span className="text-[10px] tracking-wide">{item.label}</span>
            </NavLink>
          ))}
      </div>
    </>
  );
};
export default Sidebar;
