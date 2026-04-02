// import React, { useState, useEffect } from 'react';
// import { useFinanceStore } from '../store/useFinanceStore';
// import { motion, AnimatePresence } from 'framer-motion';

// const StorageStatusBadge = () => {
//     const transactions = useFinanceStore(state => state.transactions);
//     const [isSaving, setIsSaving] = useState(false);

//     useEffect(() => {
//         if (transactions.length === 0) return;
//         setIsSaving(true);
//         const timer = setTimeout(() => setIsSaving(false), 800);
//         return () => clearTimeout(timer);
//     }, [transactions]);

//     const hasKey = !!localStorage.getItem('finance-store');
//     if (!hasKey && transactions.length === 0) return null;

//     return (
//         <div className="flex items-center gap-2 px-2 py-1 select-none h-6">
//             {/* <span className="relative flex h-2 w-2 shrink-0">
//                 {isSaving && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />}
//                 <span className={`relative inline-flex rounded-full h-2 w-2 ${isSaving ? 'bg-teal-400' : 'bg-teal-600'}`} />
//             </span> */}
//             {/* <span className="text-[10px] text-slate-500 font-medium tracking-wide flex items-center">
//                 <AnimatePresence mode="wait">
//                     {isSaving && (
//                         <motion.span
//                             key="saving-text"
//                             initial={{ opacity: 0, x: -4 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -4 }}
//                             transition={{ duration: 0.2 }}
//                             className="block"
//                         >
//                             Saving...
//                         </motion.span>
//                     )}
//                 </AnimatePresence>
//             </span> */}
//         </div>
//     );
// };
// export default StorageStatusBadge;
