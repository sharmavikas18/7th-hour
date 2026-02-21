import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { useGameStore } from '../../store/useGameStore';
import { AnimatePresence } from 'framer-motion';

import PlayerControls from './PlayerControls';
import ClashIntro from './ClashIntro';
import FracturePoint from './FracturePoint';
import LevelInstructionPopup from '../ui/LevelInstructionPopup';

const GameWorld3D = () => {
    const { fractureLevel, isFractured, stability, chaos, incrementFracture, soundEnabled } = useGameStore();
    const [phase, setPhase] = useState('intro');
    const [stage, setStage] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [pendingStage, setPendingStage] = useState(null);

    const handleIntroComplete = () => {
        setPhase('fracture');
        // Show first level briefing
        setTimeout(() => {
            setPendingStage(0);
            setShowInstructions(true);
        }, 1000);
    };

    const handleNextStage = (next) => {
        // Trigger stage transition flow
        setPendingStage(next);
        setShowInstructions(true);
        incrementFracture();

        // Play Portal Sound
        if (soundEnabled) {
            const audio = new Audio('/audio/portal.wav');
            audio.volume = 0.6;
            audio.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    const startLevel = () => {
        setShowInstructions(false);
        setStage(pendingStage);
        window.dispatchEvent(new CustomEvent('playerTeleport'));
    };

    return (
        <div className="absolute inset-0 w-full h-screen bg-black overflow-hidden">
            <AnimatePresence>
                {showInstructions && (
                    <LevelInstructionPopup
                        level={pendingStage}
                        onStart={startLevel}
                    />
                )}
            </AnimatePresence>

            {!isLocked && !showInstructions && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                    <div className="text-center px-10 py-6 border border-[#d4af37]/30 bg-black/80">
                        <p className="font-heading text-[#d4af37] text-lg tracking-[0.3em] uppercase animate-pulse mb-2">
                            [ CLICK TO CONTROL STUDENT ]
                        </p>
                    </div>
                </div>
            )}

            <Canvas
                shadows
                camera={{ fov: 65, near: 0.1, far: 500, position: [0, 5, 10] }}
                gl={{ antialias: true }}
            >
                <color attach="background" args={['#010005']} />
                <fog attach="fog" args={['#010005', 10, stage === 2 ? 80 : 150]} />

                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 25, 10]} intensity={1.5} color="#d4af37" />

                <Suspense fallback={null}>
                    <EffectComposer multisampling={4}>
                        <Bloom luminanceThreshold={0.5} intensity={1.5} mipmapBlur />
                        <Vignette offset={0} darkness={1.2} />
                        <Noise opacity={0.06} />
                        {(isFractured || stage > 2) && <ChromaticAberration offset={[0.003, 0.003]} />}
                    </EffectComposer>

                    {phase === 'intro' && <ClashIntro onComplete={handleIntroComplete} />}

                    <PlayerControls enabled={phase === 'fracture' && !showInstructions} />

                    {phase === 'fracture' && (
                        <>
                            <FracturePoint stage={stage} onNextStage={handleNextStage} fractureLevel={fractureLevel} />

                            <Stars radius={200} depth={50} count={isFractured ? 10000 : 6000} factor={4} saturation={1} fade speed={0.5} />
                            <Sparkles
                                count={100}
                                scale={50}
                                size={4}
                                speed={0.4}
                                color={chaos > stability ? "#ff3300" : "#d4af37"}
                                opacity={0.6}
                            />
                        </>
                    )}
                </Suspense>

                <PointerLockControls
                    enabled={!showInstructions && phase === 'fracture'}
                    onLock={() => setIsLocked(true)}
                    onUnlock={() => setIsLocked(false)}
                />
            </Canvas>
        </div>
    );
};

export default GameWorld3D;
