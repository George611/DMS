import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = false }) => {
    const containerClasses = fullPage
        ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
        : "flex items-center justify-center p-8";

    return (
        <div className={containerClasses}>
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                    borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: Infinity
                }}
                className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30"
            />
        </div>
    );
};

export default Loader;
