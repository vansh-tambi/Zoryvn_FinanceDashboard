import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, LineChart, Shield, User } from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';

const Sidebar = () => {
  const { role, setRole } = useFinanceStore();

  const navItems = [
    { label: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { label: 'Insights', path: '/insights', icon: <LineChart size={20} /> },
  ];

  return (
    <div 
      className="fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0D1117] border-r border-[#1C2333] transition-all duration-300 w-16 md:w-[240px]"
    >
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center px-4 justify-center md:justify-start">
         <div className="flex items-center gap-3 overflow-hidden">
             <div className="bg-teal-500/20 p-2 rounded-lg text-teal-500 shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.3)] ring-1 ring-teal-500/30">
                <Shield size={22} />
             </div>
             <span className="font-sora font-semibold text-lg text-slate-100 whitespace-nowrap opacity-0 md:opacity-100 hidden md:block">
               Finance
             </span>
         </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-400'
                  : 'text-slate-400 hover:bg-[#1C2333]/50 hover:text-slate-200 border-l-2 border-transparent'
              }`
            }
          >
             <span className="shrink-0 mx-auto md:mx-0">{item.icon}</span>
             <span className="font-medium opacity-0 md:opacity-100 hidden md:block">
               {item.label}
             </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Role Toggle */}
      <div className="p-4 border-t border-[#1C2333]">
         {/* Desktop Toggle Pill */}
         <div className="hidden md:block">
             <button 
               onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
               className="flex items-center p-1 w-full bg-[#1A202C] rounded-full relative overflow-hidden h-10 ring-1 ring-slate-800 transition-colors hover:ring-slate-700"
             >
                <div 
                  className={`absolute w-1/2 h-8 bg-teal-500 rounded-full transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] shadow-lg shadow-teal-500/20 ${role === 'admin' ? 'translate-x-[96%]' : 'translate-x-0'}`}
                />
                <div className="relative z-10 flex w-full justify-around text-[10px] font-bold tracking-widest px-1">
                   <span className={`w-1/2 flex justify-center items-center h-8 transition-colors duration-300 ${role === 'viewer' ? 'text-slate-900' : 'text-slate-500'}`}>VIEWER</span>
                   <span className={`w-1/2 flex justify-center items-center h-8 transition-colors duration-300 ${role === 'admin' ? 'text-slate-900' : 'text-slate-500'}`}>ADMIN</span>
                </div>
             </button>
         </div>

         {/* Mobile Toggle Icon */}
         <div className="md:hidden flex justify-center">
             <button 
                onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')} 
                className={`p-2.5 rounded-full transition-colors ${role === 'admin' ? 'bg-teal-500 text-slate-900' : 'bg-[#1A202C] text-slate-400'}`}
             >
                <User size={18} />
             </button>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
