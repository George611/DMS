import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoAlertCircle, IoClose } from 'react-icons/io5';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <IoCheckmarkCircle className="text-emerald-500 w-6 h-6" />,
        error: <IoCloseCircle className="text-rose-500 w-6 h-6" />,
        warning: <IoAlertCircle className="text-amber-500 w-6 h-6" />
    };

    const bgColors = {
        success: 'bg-emerald-50 border-emerald-200',
        error: 'bg-rose-50 border-rose-200',
        warning: 'bg-amber-50 border-amber-200'
    };

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-4 p-4 rounded-2xl border shadow-2xl ${bgColors[type]} min-w-[320px]`}
                >
                    <div className="flex-shrink-0">
                        {icons[type]}
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-800 font-medium">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <IoClose className="w-5 h-5 text-slate-400" />
                    </button>

                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: duration / 1000, ease: "linear" }}
                        className={`absolute bottom-0 left-0 h-1 rounded-b-2xl ${type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
