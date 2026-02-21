import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const CharacterModel = ({ isMoving }) => {
    const group = useRef();

    useFrame((state) => {
        if (!group.current) return;

        const time = state.clock.elapsedTime;
        if (!isMoving) {
            // Idle hover
            group.current.position.y = Math.sin(time * 2) * 0.05 + 0.1;
            group.current.rotation.z = Math.sin(time * 1.5) * 0.02;
            group.current.rotation.x = 0;
        } else {
            // Moving "walk" bob
            group.current.position.y = Math.abs(Math.sin(time * 10)) * 0.12 + 0.1;
            group.current.rotation.x = 0.2; // Lean forward
            group.current.rotation.z = Math.sin(time * 10) * 0.05; // Swagger
        }
    });

    return (
        <group ref={group}>
            {/* The Cloaked Body */}
            <mesh position={[0, 0.75, 0]}>
                <coneGeometry args={[0.45, 1.5, 12]} />
                <meshStandardMaterial color="#08080c" roughness={1} metalness={0.1} />
            </mesh>

            {/* Inner "Soul" Glow */}
            <mesh position={[0, 0.75, 0]}>
                <coneGeometry args={[0.3, 1.4, 8]} />
                <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1} transparent opacity={0.4} />
            </mesh>

            {/* Head / Hood */}
            <mesh position={[0, 1.45, 0]}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial color="#050508" roughness={1} />
            </mesh>

            {/* Glow Eyes / Visor */}
            <mesh position={[0, 1.5, 0.18]}>
                <boxGeometry args={[0.2, 0.02, 0.05]} />
                <meshBasicMaterial color="#d4af37" />
            </mesh>

            {/* Magic Aura Ring at feet */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 0.6, 32]} />
                <meshBasicMaterial color="#d4af37" transparent opacity={0.6} side={THREE.DoubleSide} />
            </mesh>

            {/* Ambient light following character */}
            <pointLight position={[0, 1.5, 0]} intensity={1.5} color="#d4af37" distance={8} />
        </group>
    );
};

export default CharacterModel;
