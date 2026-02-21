import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = ({ fractureLevel, isFractured }) => {
    // Determine atmosphere based on fracture level
    const atmosphere = useMemo(() => {
        if (fractureLevel === 0) return { color: '#090b10', particles: '#d4af37', speed: 20 };
        if (fractureLevel < 3) return { color: '#0d0d1a', particles: '#4f46e5', speed: 15 };
        if (isFractured) return { color: '#050005', particles: '#991b1b', speed: 5 };
        return { color: '#090b10', particles: '#d4af37', speed: 20 };
    }, [fractureLevel, isFractured]);

    return (
        <div
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-[3s]"
            style={{ backgroundColor: atmosphere.color }}
        >
            {/* Animated Clouds/Fog */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ duration: atmosphere.speed, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-10"
            />

            {/* Subtle Gradient Shimmer */}
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-tr transition-colors duration-[5s] ${isFractured
                    ? 'from-red-900/20 via-transparent to-purple-900/20'
                    : 'from-blue-900/10 via-transparent to-transparent'
                }`} />

            {/* Particle Layer (Floating Embers) */}
            <div className="absolute inset-0 backdrop-blur-[1px]">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: "110%",
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: 0.2
                        }}
                        animate={{
                            y: "-10%",
                            x: (Math.random() * 100 - 50) + "%",
                            opacity: [0.2, 0.5, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 20
                        }}
                        className="absolute w-1 h-1 rounded-full"
                        style={{ backgroundColor: atmosphere.particles, boxShadow: `0 0 10px ${atmosphere.particles}` }}
                    />
                ))}
            </div>

            {/* Glitch Overlay for High Fracture */}
            {isFractured && (
                <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] animate-pulse">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),auto] bg-[length:100%_4px]" />
                </div>
            )}
        </div>
    );
};

export default AnimatedBackground;
