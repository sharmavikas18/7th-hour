import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeleportOverlay = ({ active, type = 'normal' }) => {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                >
                    {/* White Flash */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, times: [0, 0.4, 1] }}
                        className="absolute inset-0 bg-white mix-blend-screen"
                    />

                    {/* Crack Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cracked-glass-panel.png')] scale-150 transform transition-transform duration-[3s]" />

                    {/* Distorting Shards */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: [0, 0.3, 0] }}
                        transition={{ duration: 1.2 }}
                        className="w-[200vw] h-[200vh] bg-gradient-radial from-white via-transparent to-transparent opacity-10"
                    />

                    {/* Text Flash (Optional) */}
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white font-heading text-6xl tracking-[1em] z-[110]"
                    >
                        {type === 'fracture' ? 'FRACTURE' : 'SHIFTING'}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TeleportOverlay;
