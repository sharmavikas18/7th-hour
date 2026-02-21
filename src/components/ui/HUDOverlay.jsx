import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Shield, Flame, Book, Zap, Lock } from 'lucide-react';

const Meter = ({ icon: Icon, value, color, label }) => (
    <div className="flex flex-col gap-1 mb-4">
        <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
                <Icon size={14} className={color === 'stability' ? 'text-blue-400' : color === 'chaos' ? 'text-red-500' : 'text-yellow-500'} />
                <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-gray-400">{label}</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">{value}%</span>
        </div>
        <div className="h-[3px] w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                className={`h-full ${color === 'stability' ? 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_8px_#3b82f6]' :
                    color === 'chaos' ? 'bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_8px_#ef4444]' :
                        'bg-gradient-to-r from-yellow-700 to-yellow-500 shadow-[0_0_8px_#eab308]'
                    }`}
            />
        </div>
    </div>
);

const SpellIcon = ({ name, unlocked, active }) => (
    <div className={`w-10 h-10 rounded border flex items-center justify-center transition-all ${unlocked ? 'border-[#d4af37]/40 bg-black/60 text-[#d4af37] cursor-pointer hover:border-[#d4af37] hover:scale-110' : 'border-white/5 bg-black/20 text-white/10'}`}>
        {name === 'Basic' && <Zap size={18} />}
        {name === 'Stabilize' && <Shield size={18} />}
        {name === 'Amplify' && <Flame size={18} />}
        {!unlocked && <Lock size={12} className="absolute" />}
    </div>
);

const HUDOverlay = () => {
    const { stability, chaos, knowledge, unlockedSpells, currentChapter } = useGameStore();

    return (
        <div className="absolute inset-0 pointer-events-none z-50 p-6 md:p-10 flex flex-col justify-between">
            {/* Top HUD - Chapter Info */}
            <div className="w-full flex justify-center">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center"
                >
                    <h4 className="text-[10px] font-heading text-[#d4af37]/60 tracking-[0.4em] uppercase mb-1">Chapter {currentChapter}</h4>
                    <h2 className="text-2xl font-heading text-white tracking-[0.2em] uppercase drop-shadow-lg">The Night Sky Broke</h2>
                </motion.div>
            </div>

            <div className="flex justify-between items-end">
                {/* Left Panel - Alignment Meters */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-48 bg-black/20 backdrop-blur-md p-4 border border-white/5 rounded-sm"
                >
                    <Meter icon={Shield} value={stability} color="stability" label="Stability" />
                    <Meter icon={Flame} value={chaos} color="chaos" label="Chaos" />
                    <Meter icon={Book} value={knowledge} color="knowledge" label="Knowledge" />
                </motion.div>

                {/* Right Panel - Spells */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex flex-col gap-3 items-end"
                >
                    <div className="text-[10px] font-heading text-[#d4af37]/40 tracking-[0.2em] uppercase mb-1 pointer-events-none">Spellbook</div>
                    <div className="flex gap-3 pointer-events-auto">
                        <SpellIcon name="Basic" unlocked={unlockedSpells.includes('Basic')} />
                        <SpellIcon name="Stabilize" unlocked={unlockedSpells.includes('Stabilize')} />
                        <SpellIcon name="Amplify" unlocked={unlockedSpells.includes('Amplify')} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HUDOverlay;
