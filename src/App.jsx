import React, { useState, useEffect } from 'react';
import GameWorld3D from './components/3d/GameWorld3D';
import StoryScene from './components/StoryScene';
import HUDOverlay from './components/ui/HUDOverlay';
import AnimatedBackground from './components/ui/AnimatedBackground';
import TeleportOverlay from './components/ui/TeleportOverlay';
import { useGameStore } from './store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

function App() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState(null); // '2d' or '3d'
  const [isTeleporting, setIsTeleporting] = useState(false);

  const { isFractured, fractureLevel, currentSceneId, soundEnabled, toggleSound } = useGameStore();
  const bgMusic = React.useRef(null);

  // Initialize and manage Background Music
  useEffect(() => {
    if (!bgMusic.current) {
      bgMusic.current = new Audio('/audio/dark.mp3');
      bgMusic.current.loop = true;
      bgMusic.current.volume = 0.3;
    }

    if (started && soundEnabled) {
      bgMusic.current.play().catch(e => console.log("Autoplay blocked:", e));
    } else {
      bgMusic.current.pause();
    }
  }, [started, soundEnabled]);

  // Trigger teleport overlay on scene change
  useEffect(() => {
    if (started) {
      if (soundEnabled) {
        const audio = new Audio('/audio/portal.wav');
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play blocked", e));
      }
      setIsTeleporting(true);
      const timer = setTimeout(() => setIsTeleporting(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentSceneId, started, mode, soundEnabled]);

  if (!started) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
        <AnimatedBackground fractureLevel={0} isFractured={false} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="relative z-10"
        >
          <div className="mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 border-2 border-[#d4af37]/40 rounded-full mx-auto flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
            >
              <div className="w-16 h-16 border border-[#d4af37]/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#d4af37] rotate-45" />
              </div>
            </motion.div>
          </div>

          <h1 className="text-6xl md:text-8xl font-heading mb-6 tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-yellow-100 via-[#d4af37] to-yellow-700 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            7TH-HOUR
            <br />
            <span className="text-3xl md:text-5xl tracking-[0.3em] font-light mt-2 block opacity-90 font-heading">TIME IS FRACTURED</span>
          </h1>

          <p className="font-body text-[#d4af37]/70 max-w-lg mx-auto mb-16 tracking-[0.2em] text-xl italic drop-shadow-md">
            "When the clock stops, the nightmare begins."
          </p>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <button
              onClick={() => { setStarted(true); setMode('3d'); }}
              className="group relative px-12 py-6 bg-[#d4af37]/10 border-2 border-[#d4af37]/60 hover:border-[#d4af37] transition-all overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] scale-110"
            >
              <div className="absolute inset-0 bg-[#d4af37]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 font-heading tracking-[0.2em] text-[#d4af37] group-hover:text-yellow-100 transition-colors uppercase text-lg">Enter The Story</span>
            </button>

            <button
              onClick={() => { setStarted(true); setMode('2d'); }}
              className="px-10 py-5 bg-black/40 border border-white/20 hover:border-white/40 transition-all text-white/60 hover:text-white"
            >
              <span className="font-heading tracking-[0.1em] uppercase text-xs">Legacy 2D Mode</span>
            </button>
          </div>
        </motion.div>

        <button
          onClick={toggleSound}
          className="fixed bottom-10 right-10 z-50 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors p-3 hover:bg-white/5 rounded-full"
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 flex flex-col relative overflow-hidden bg-black">
      {/* Background Ambience */}
      {mode === '2d' && <AnimatedBackground fractureLevel={fractureLevel} isFractured={isFractured} />}

      {/* Cinematic Teleport Overlay */}
      <TeleportOverlay active={isTeleporting} type={(isFractured || fractureLevel > 3) ? 'fracture' : 'normal'} />

      {/* Game HUD */}
      <HUDOverlay />

      <main className="flex-1 w-full h-full relative z-20 overflow-hidden">
        {mode === '3d' ? <GameWorld3D /> : <StoryScene />}
      </main>

      {/* Atmospheric Cinema Bars */}
      <div className="fixed top-0 left-0 w-full h-[6vh] bg-black z-[100] border-b border-white/5" />
      <div className="fixed bottom-0 left-0 w-full h-[6vh] bg-black z-[100] border-t border-white/5" />

      {/* Global Stability Pulse */}
      {isFractured && (
        <div className="fixed inset-0 pointer-events-none z-[60] bg-red-950/5 animate-pulse mix-blend-overlay" />
      )}
    </div>
  );
}

export default App;
