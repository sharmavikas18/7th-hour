import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import storyData from '../data/story.json';
import GlitchText from './GlitchText';
import SpellTracing from './SpellTracing';
import DialogueSystem from './ui/DialogueSystem';
import { Eye, MessageCircle, DoorOpen, Hand, Sparkles } from 'lucide-react';

const IconMap = {
    eye: Eye,
    message: MessageCircle,
    door: DoorOpen,
    hand: Hand,
    magic: Sparkles
};

const StoryScene = () => {
    const {
        currentSceneId,
        makeChoice,
        isFractured,
        gameEnded,
        endingId,
        stability,
        chaos,
        knowledge,
        resetGame
    } = useGameStore();

    const [scene, setScene] = useState(null);
    const [playingMiniGame, setPlayingMiniGame] = useState(false);
    const [miniGameChoice, setMiniGameChoice] = useState(null);

    useEffect(() => {
        if (!gameEnded) {
            setScene(storyData.scenes[currentSceneId]);
        }
    }, [currentSceneId, gameEnded]);

    if (gameEnded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 z-50 relative bg-black">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-3xl bg-[#070709]/90 backdrop-blur-3xl p-12 md:p-16 border-2 border-[#d4af37]/30 shadow-[0_0_100px_rgba(0,0,0,1)]"
                >
                    <h1 className="text-5xl md:text-7xl font-heading mb-8 tracking-[0.2em] text-[#d4af37] uppercase">
                        {endingId === 'restore' && 'Reality Restored'}
                        {endingId === 'merge' && 'A Merged Truth'}
                        {endingId === 'chaos' && 'The Final Fracture'}
                    </h1>
                    <p className="font-body text-2xl text-gray-300 mb-12 leading-relaxed italic border-y border-white/5 py-8">
                        {endingId === 'restore' && "The timeline stabilizes. The glyphs fade from your eyes, replaced by familiar words."}
                        {endingId === 'merge' && "A hybrid world where physics and magic coexist in a jagged dance."}
                    }
                    </p>
                    <button onClick={resetGame} className="px-12 py-4 border border-[#d4af37]/50 hover:border-[#d4af37] text-[#d4af37] font-heading">
                        Begin Again
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!scene) return null;

    const handleChoiceClick = (choice) => {
        if (choice.minigame === 'spell-tracing') {
            setMiniGameChoice(choice);
            setPlayingMiniGame(true);
        } else {
            makeChoice(choice);
        }
    };

    const hotspots = scene.hotspots || [];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={scene.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-full h-full overflow-hidden"
            >
                {/* Full-Screen Parallax Artwork */}
                <motion.div
                    initial={{ scale: 1.2, x: 0 }}
                    animate={{ scale: 1.05, x: -10 }}
                    transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: "linear" }}
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${scene.background})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-color" />
                </motion.div>

                {/* Atmospheric Particle Overlays */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                    <motion.div
                        animate={{ y: [-10, 10], x: [-5, 5] }}
                        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                        className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-20"
                    />
                </div>

                {/* Interactive Hotspots */}
                {!playingMiniGame && hotspots.map((hotspot, i) => {
                    const IconComponent = IconMap[hotspot.icon] || Sparkles;
                    return (
                        <motion.button
                            key={`hotspot-${i}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5 + (i * 0.3), type: "spring" }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleChoiceClick(hotspot)}
                            className="absolute z-30 group"
                            style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                        >
                            <div className="p-5 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all">
                                <IconComponent size={28} />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border border-[#d4af37] animate-ping opacity-20 group-hover:opacity-40" />
                            </div>
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-4 bg-black/80 px-4 py-2 text-sm font-heading tracking-widest text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap">
                                {hotspot.text}
                            </span>
                        </motion.button>
                    )
                })}

                {/* Minigame Overlay */}
                <AnimatePresence>
                    {playingMiniGame && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95">
                            <SpellTracing onComplete={(success) => { setPlayingMiniGame(false); if (success) handleChoiceClick(miniGameChoice); }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <DialogueSystem scene={scene} isFractured={isFractured} onChoice={handleChoiceClick} />
            </motion.div>
        </AnimatePresence>
    );
};

export default StoryScene;
