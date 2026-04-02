import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutTemplate, PlusCircle } from 'lucide-react';

const EmptyGlobalState = () => {
    const navigate = useNavigate();

    return (
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full h-full flex flex-col items-center justify-center text-center p-8 pt-32"
        >
            <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="w-full h-full border-2 border-dashed border-[#252D42] rounded-full flex items-center justify-center bg-[#1C2333]/50 relative z-10">
                    <LayoutTemplate size={64} className="text-teal-500/50" />
                </div>
            </div>
            
            <h1 className="text-3xl font-sora font-bold text-white mb-4">Blank Canvas</h1>
            <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                Your financial dashboard is ready, but it looks like you haven't logged any data yet. Track your first expense or income source to wake up the insights engine.
            </p>
            
            <button 
                onClick={() => navigate('/transactions')}
                className="flex items-center gap-2 bg-teal-500 text-slate-900 px-6 py-3.5 rounded-full font-semibold shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:opacity-90 transition-opacity"
            >
                <PlusCircle size={20} />
                Add Your First Transaction
            </button>
        </motion.div>
    );
};
export default EmptyGlobalState;
