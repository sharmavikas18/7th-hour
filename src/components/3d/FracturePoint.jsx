import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Box, Cylinder, Text, Stars, Sparkles, Torus } from '@react-three/drei';
import * as THREE from 'three';

const Pillar = ({ position, height = 8, color = "#d4af37" }) => (
    <group position={position}>
        <Cylinder args={[0.5, 0.7, height, 8]} position={[0, height / 2, 0]}>
            <meshStandardMaterial color="#0c0c14" roughness={0.3} metalness={0.8} />
        </Cylinder>
        <Box args={[0.8, 0.4, 0.8]} position={[0, height * 0.95, 0]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </Box>
        <pointLight position={[0, height, 0]} intensity={2.5} color={color} distance={15} />
    </group>
);

const Checkpoint = ({ position, color, onReach, label, subLabel }) => {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.04;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 0.25 + 2.5;
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef} onClick={onReach}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} />
            </mesh>
            <pointLight position={[0, 2.5, 0]} intensity={6} color={color} distance={25} />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <ringGeometry args={[2.5, 2.8, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
                <Sparkles count={20} scale={2} size={3} color={color} />
            </mesh>

            {label && (
                <Text position={[0, 5, 0]} fontSize={0.65} color={color} anchorX="center" anchorY="middle">
                    {label}
                </Text>
            )}
            {subLabel && (
                <Text position={[0, 4.2, 0]} fontSize={0.3} color="#fff" opacity={0.5} anchorX="center" anchorY="middle">
                    {subLabel}
                </Text>
            )}
        </group>
    );
};

// --- LEVEL 0: CORRIDOR HUB ---
const CorridorHub = ({ onNextStage, fractureLevel }) => (
    <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow name="floor">
            <planeGeometry args={[40, 200]} />
            <meshStandardMaterial color="#0a0a15" />
        </mesh>
        <gridHelper args={[200, 40, "#1a1a25", "#0a0a0f"]} position={[0, 0.01, 0]} />

        {[...Array(8)].map((_, i) => (
            <group key={i}>
                <Pillar position={[14, 0, -i * 20 + 30]} height={14} color={fractureLevel > 3 ? "#991b1b" : "#d4af37"} />
                <Pillar position={[-14, 0, -i * 20 + 30]} height={14} color={fractureLevel > 3 ? "#4f46e5" : "#d4af37"} />
            </group>
        ))}

        <Checkpoint
            position={[0, 0, -30]}
            color="#d4af37"
            label="THE FROZEN HALL"
            subLabel="Investigate the Time Fracture"
            onReach={() => onNextStage(1)}
        />
    </group>
);

// --- LEVEL 1: FROZEN HALL (PLATFORMING) ---
const FrozenHall = ({ onNextStage }) => (
    <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} name="floor">
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#ebf8ff" metalness={0.9} roughness={0.05} />
        </mesh>

        {/* Floating Books / Platforms */}
        {[...Array(15)].map((_, i) => (
            <group key={i} position={[(i % 2 === 0 ? 3 : -3), i * 1.5 + 1.5, -i * 5 - 10]}>
                <Box args={[6, 0.6, 6]} name="platform">
                    <meshStandardMaterial color="#0a0a15" metalness={0.8} roughness={0.2} />
                </Box>
                <pointLight intensity={0.5} distance={10} color="#88ccff" />
            </group>
        ))}

        {/* Suspended Spells (Obstacles) */}
        {[...Array(10)].map((_, i) => (
            <Float key={`spell-${i}`} speed={2} position={[Math.sin(i) * 8, i * 3 + 2, -i * 10 - 20]}>
                <mesh>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={5} />
                </mesh>
            </Float>
        ))}

        <Checkpoint position={[0, 16, -95]} color="#4f46e5" label="THE GRAND HOURGLASS" onReach={() => onNextStage(2)} />
    </group>
);

// --- LEVEL 2: SHIFTING FOREST ---
const ShiftingForest = ({ onNextStage }) => (
    <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} name="floor">
            <planeGeometry args={[400, 400]} />
            <meshStandardMaterial color="#050805" />
        </mesh>
        {[...Array(50)].map((_, i) => (
            <group key={i} position={[Math.sin(i) * 50, 0, Math.cos(i) * 80 - 50]}>
                <Cylinder args={[0.1, 1.2, 20]} position={[0, 10, 0]}>
                    <MeshWobbleMaterial color="#0a100a" speed={1} factor={0.6} />
                </Cylinder>
            </group>
        ))}
        {/* Glowing Spirit Trail */}
        {[...Array(10)].map((_, i) => (
            <pointLight key={i} position={[Math.sin(i * 0.5) * 10, 2, -i * 15]} intensity={2} color="#00ffaa" distance={15} />
        ))}
        <Checkpoint position={[0, 0, -120]} color="#00ffaa" label="CHAMBER OF ECHOES" onReach={() => onNextStage(3)} />
    </group>
);

const FracturePoint = ({ stage, onNextStage, fractureLevel }) => {
    return (
        <group>
            {stage === 0 && <CorridorHub onNextStage={onNextStage} fractureLevel={fractureLevel} />}
            {stage === 1 && <FrozenHall onNextStage={onNextStage} />}
            {stage === 2 && <ShiftingForest onNextStage={onNextStage} />}

            {/* World background visuals based on stage */}
            <Stars radius={250} depth={60} count={stage === 1 ? 15000 : 5000} factor={4} saturation={1} fade speed={1} />
        </group>
    );
};

export default FracturePoint;
