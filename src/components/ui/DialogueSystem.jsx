import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from '../GlitchText';

const DialogueSystem = ({ scene, isFractured, onChoice }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setIsFinished(false);
        let currentText = scene.text;
        let charIndex = 0;

        const interval = setInterval(() => {
            if (charIndex < currentText.length) {
                setDisplayedText(prev => prev + currentText[charIndex]);
                charIndex++;
            } else {
                setIsFinished(true);
                clearInterval(interval);
            }
        }, 20); // Speed of typewriter

        return () => clearInterval(interval);
    }, [scene]);

    return (
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-40 flex justify-center pointer-events-none">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`w-full max-w-5xl bg-black/80 backdrop-blur-xl border-t-2 ${isFractured ? 'border-red-900/50 shadow-[0_-20px_50px_rgba(153,27,27,0.1)]' : 'border-[#d4af37]/20'} p-8 md:p-12 relative pointer-events-auto`}
            >
                {/* Parchment texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]" />

                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    <div className="flex-1">
                        {scene.speaker && (
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`font-heading text-2xl mb-4 tracking-[0.3em] uppercase flex items-center gap-3 ${isFractured ? 'text-red-500' : 'text-[#d4af37]'}`}
                            >
                                <div className={`w-3 h-3 rotate-45 ${isFractured ? 'bg-red-600 animate-pulse' : 'bg-[#d4af37]'}`} />
                                <GlitchText text={scene.speaker} isFractured={isFractured} />
                            </motion.h3>
                        )}

                        <div className={`font-body text-xl md:text-2xl leading-relaxed transition-all duration-300 ${isFractured ? 'text-gray-300 italic' : 'text-gray-100'} tracking-wide min-h-[4em]`}>
                            {displayedText}
                            {!isFinished && <span className="inline-block w-2 h-5 ml-1 bg-[#d4af37]/40 animate-pulse align-middle" />}
                        </div>
                    </div>

                    <AnimatePresence>
                        {isFinished && scene.choices && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-4 min-w-[300px] border-l border-white/5 pl-8 justify-center"
                            >
                                {scene.choices.map((choice, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onChoice(choice)}
                                        className={`group py-2 px-4 text-left font-body text-xl transition-all border-l-2 border-transparent hover:border-[#d4af37] ${isFractured ? 'hover:text-red-400' : 'hover:text-[#d4af37]'} text-gray-400`}
                                    >
                                        <GlitchText text={choice.text} isFractured={isFractured} />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default DialogueSystem;
