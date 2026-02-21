import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Flame, Book, Sparkles, Wand2, Compass } from 'lucide-react';

const LevelInstructionPopup = ({ level, onStart }) => {
    useEffect(() => {
        const handleEnter = (e) => {
            if (e.key === 'Enter') onStart();
        };
        window.addEventListener('keydown', handleEnter);
        return () => window.removeEventListener('keydown', handleEnter);
    }, [onStart]);

    const data = {
        0: {
            title: "THE NORTH CORRIDOR",
            desc: "The anchor of the castle. Reality's weight is heaviest here.",
            obj: "Find the fractured sigil to investigate the first anomaly.",
            icon: Compass,
        },
        1: {
            title: "FROZEN HALL",
            desc: "Time has crystallized. Students and spells are caught in mid-motion.",
            obj: "Scale the floating archives and reach the Grand Hourglass to reverse the flow.",
            icon: Shield,
        },
        2: {
            title: "FRACTURED FOREST",
            desc: "The woods do not follow natural law. The trees breathe, and the sky rotates.",
            obj: "Follow the glowing spirit trail to find the source of the rot.",
            icon: Flame,
        },
        3: {
            title: "CHAMBER OF DIVIDED SELF",
            desc: "A reflection that lives. A truth that bleeds.",
            obj: "Confront your echo. Your choices here will define your soul's alignment.",
            icon: Wand2,
        },
        4: {
            title: "INVERTED GREAT HALL",
            desc: "Gravity is a suggestion. Up is down, and logic is fractured.",
            obj: "Realign the house crests while navigating the ceiling zones.",
            icon: Book,
        }
    };

    const current = data[level] || data[0];
    const Icon = current.icon;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
            <div className="max-w-2xl w-full p-12 border-2 border-[#d4af37]/30 bg-[#070709] relative overflow-hidden text-center shadow-[0_0_100px_rgba(212,175,55,0.1)]">
                {/* Decorative background logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[3] pointer-events-none">
                    <Icon size={300} strokeWidth={1} />
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Icon className="mx-auto mb-6 text-[#d4af37]" size={64} strokeWidth={1.5} />

                    <h2 className="text-4xl font-heading text-[#d4af37] tracking-[0.4em] uppercase mb-4 drop-shadow-lg">
                        {current.title}
                    </h2>

                    <div className="w-24 h-1 bg-[#d4af37]/40 mx-auto mb-8" />

                    <p className="font-body text-xl text-gray-300 leading-relaxed italic mb-8">
                        "{current.desc}"
                    </p>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-sm mb-12">
                        <h4 className="font-heading text-sm text-[#d4af37]/80 tracking-widest uppercase mb-3">Objective</h4>
                        <p className="font-body text-2xl text-white tracking-wide">
                            {current.obj}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 text-gray-500 font-heading text-[10px] tracking-widest uppercase">
                        <div className="flex justify-center gap-8 border-b border-white/5 pb-4">
                            <span>WASD - Move</span>
                            <span>SPACE - Jump</span>
                            <span>SHIFT - Sprint</span>
                        </div>
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-[#d4af37] text-sm mt-4 font-heading tracking-[0.3em]"
                        >
                            PRESS ENTER TO BEGIN
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LevelInstructionPopup;
