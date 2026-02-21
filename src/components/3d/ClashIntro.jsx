import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, MeshDistortMaterial } from '@react-three/drei';

const ClashIntro = ({ onComplete }) => {
    const greenBeam = useRef();
    const redBeam = useRef();
    const explosion = useRef();
    const [exploded, setExploded] = useState(false);
    const [timer, setTimer] = useState(0);

    useFrame((state, delta) => {
        setTimer((t) => t + delta);

        const shake = Math.sin(state.clock.elapsedTime * 60) * 0.2;
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 40) * 0.3;

        if (greenBeam.current && !exploded) {
            greenBeam.current.position.y = 1.8 + shake;
            greenBeam.current.scale.x = pulse;
        }
        if (redBeam.current && !exploded) {
            redBeam.current.position.y = 1.8 - shake;
            redBeam.current.scale.x = pulse;
        }

        if (timer > 4 && !exploded) {
            setExploded(true);
        }

        if (exploded && explosion.current) {
            explosion.current.scale.addScalar(delta * 40);
            explosion.current.material.opacity = Math.max(0, explosion.current.material.opacity - delta * 0.5);
            if (explosion.current.scale.x > 80) {
                onComplete();
            }
        }
    });

    return (
        <group>
            {!exploded && (
                <>
                    {/* High Intensity Beams */}
                    <mesh ref={greenBeam} position={[-8, 1.8, -15]} rotation={[0, 0, -Math.PI / 2]}>
                        <cylinderGeometry args={[0.2, 0.6, 16, 12]} />
                        <meshBasicMaterial color={[0, 20, 5]} toneMapped={false} />
                    </mesh>
                    <pointLight position={[-4, 1.8, -15]} color="#00ff66" intensity={30} distance={30} />

                    <mesh ref={redBeam} position={[8, 1.8, -15]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.2, 0.6, 16, 12]} />
                        <meshBasicMaterial color={[20, 2, 0]} toneMapped={false} />
                    </mesh>
                    <pointLight position={[4, 1.8, -15]} color="#ff3300" intensity={30} distance={30} />

                    {/* Collision Node */}
                    <mesh position={[0, 1.8, -15]}>
                        <sphereGeometry args={[0.8, 32, 32]} />
                        <MeshDistortMaterial color="#ffffff" speed={10} distort={0.8} emissive="#ffffff" emissiveIntensity={10} />
                    </mesh>
                    <pointLight position={[0, 1.8, -15]} color="#ffffff" intensity={50} distance={20} />

                    <Sparkles count={100} scale={5} size={10} speed={4} color="#ffffff" />
                </>
            )}

            {/* Expansion Sphere */}
            {exploded && (
                <mesh ref={explosion} position={[0, 1.8, -15]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshBasicMaterial color={[5, 4, 15]} transparent opacity={1} toneMapped={false} />
                </mesh>
            )}
        </group>
    );
};

export default ClashIntro;
