import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#030712] text-slate-100 overflow-hidden font-sans selection:bg-teal-500/30">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-[240px] transition-all duration-300 h-full overflow-y-auto relative">
         {/* Premium background radial glows targeting Main Area */}
         <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/10 blur-[150px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px]" />
         </div>
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
            <Outlet />
         </div>
      </main>
    </div>
  );
};

export default AppLayout;
