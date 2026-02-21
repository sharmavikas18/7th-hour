import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CharacterModel from './CharacterModel';
import { useGameStore } from '../../store/useGameStore';

const PlayerControls = ({ enabled = true }) => {
    const { camera, scene } = useThree();
    const { soundEnabled } = useGameStore();
    const characterRef = useRef();
    const raycaster = useRef(new THREE.Raycaster());
    const downDirection = new THREE.Vector3(0, -1, 0);

    // --- Refs for High-Performance Physics ---
    const keys = useRef({
        forward: false, backward: false, left: false, right: false, shift: false, space: false
    });
    const velocity = useRef(new THREE.Vector3(0, 0, 0));
    const playerState = useRef({
        isGrounded: true,
        isMoving: false,
        floorY: 0
    });

    const [moving, setMoving] = useState(false);
    const [grounded, setGrounded] = useState(true);
    const [aiming, setAiming] = useState(false);

    const GRAVITY = -45;
    const JUMP_FORCE = 16;

    useEffect(() => {
        const handleKeyDown = (e) => {
            const code = e.code;
            if (code === 'Space') { e.preventDefault(); keys.current.space = true; }
            if (code === 'KeyW' || code === 'ArrowUp') keys.current.forward = true;
            if (code === 'KeyS' || code === 'ArrowDown') keys.current.backward = true;
            if (code === 'KeyA' || code === 'ArrowLeft') keys.current.left = true;
            if (code === 'KeyD' || code === 'ArrowRight') keys.current.right = true;
            if (code === 'ShiftLeft' || code === 'ShiftRight') keys.current.shift = true;
        };

        const handleKeyUp = (e) => {
            const code = e.code;
            if (code === 'Space') keys.current.space = false;
            if (code === 'KeyW' || code === 'ArrowUp') keys.current.forward = false;
            if (code === 'KeyS' || code === 'ArrowDown') keys.current.backward = false;
            if (code === 'KeyA' || code === 'ArrowLeft') keys.current.left = false;
            if (code === 'KeyD' || code === 'ArrowRight') keys.current.right = false;
            if (code === 'ShiftLeft' || code === 'ShiftRight') keys.current.shift = false;
        };

        const handleMouseDown = (e) => { if (e.button === 2) setAiming(true); };
        const handleMouseUp = (e) => { if (e.button === 2) setAiming(false); };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const resetPos = () => {
            if (characterRef.current) {
                characterRef.current.position.set(0, 2, 0); // Start slightly above
                velocity.current.set(0, 0, 0);
            }
        };
        window.addEventListener('playerTeleport', resetPos);
        return () => window.removeEventListener('playerTeleport', resetPos);
    }, []);

    useFrame((state, delta) => {
        if (!characterRef.current) return;
        const dt = Math.min(delta, 0.05);

        // --- 1. Platform Detection (Raycasting) ---
        // Raycast down from slightly above feet
        const rayOrigin = characterRef.current.position.clone().add(new THREE.Vector3(0, 0.5, 0));
        raycaster.current.set(rayOrigin, downDirection);

        const intersects = raycaster.current.intersectObjects(scene.children, true);
        const platformHit = intersects.find(hit => hit.object.name === "platform" || hit.object.name === "floor");

        if (platformHit && platformHit.distance < 1.0) {
            playerState.current.floorY = platformHit.point.y;
            // Snapping to ground
            if (characterRef.current.position.y <= playerState.current.floorY + 0.1) {
                characterRef.current.position.y = playerState.current.floorY;
                velocity.current.y = 0;
                if (!playerState.current.isGrounded) {
                    playerState.current.isGrounded = true;
                    setGrounded(true);
                }
            }
        } else {
            // Player is in the air over a gap
            playerState.current.isGrounded = false;
            setGrounded(false);
            // Artificial "Infinite Fall" Floor for Hub
            playerState.current.floorY = -100;
        }

        // --- 2. Jumping ---
        if (enabled && keys.current.space && playerState.current.isGrounded) {
            velocity.current.y = JUMP_FORCE + (keys.current.shift ? 4 : 0);
            playerState.current.isGrounded = false;
            setGrounded(false);

            // Play Jump Sound
            if (soundEnabled) {
                const audio = new Audio('/audio/jump.wav');
                audio.volume = 0.4;
                audio.play().catch(e => console.log("Audio play blocked", e));
            }
        }

        // --- 3. Horizontal Movement ---
        const moveDir = new THREE.Vector3(0, 0, 0);
        if (enabled) {
            if (keys.current.forward) moveDir.z -= 1;
            if (keys.current.backward) moveDir.z += 1;
            if (keys.current.left) moveDir.x -= 1;
            if (keys.current.right) moveDir.x += 1;
        }

        if (moveDir.length() > 0) {
            moveDir.normalize();
            if (!playerState.current.isMoving) {
                playerState.current.isMoving = true;
                setMoving(true);
            }

            const camEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
            moveDir.applyEuler(new THREE.Euler(0, camEuler.y, 0));

            const speed = (keys.current.shift ? 14 : 8) * (aiming ? 0.4 : 1);
            characterRef.current.position.addScaledVector(moveDir, speed * dt);

            if (!aiming) {
                const targetRotation = Math.atan2(moveDir.x, moveDir.z);
                characterRef.current.rotation.y = THREE.MathUtils.lerp(characterRef.current.rotation.y, targetRotation, 0.2);
            } else {
                characterRef.current.rotation.y = camEuler.y;
            }
        } else {
            if (playerState.current.isMoving) {
                playerState.current.isMoving = false;
                setMoving(false);
            }
        }

        // --- 4. Apply Vertical Gravity ---
        if (!playerState.current.isGrounded) {
            velocity.current.y += GRAVITY * dt;
            characterRef.current.position.y += velocity.current.y * dt;
        }

        // Fall Death Check
        if (characterRef.current.position.y < -30) {
            window.dispatchEvent(new CustomEvent('playerTeleport')); // Respawn at start
        }

        // --- 5. Camera (Lerp) ---
        const targetDist = aiming ? 3 : 6;
        const targetHeight = aiming ? 1.8 : 2.6;
        const rotY = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ').y;
        const offset = new THREE.Vector3(aiming ? 0.8 : 0, targetHeight, targetDist).applyEuler(new THREE.Euler(0, rotY, 0));
        camera.position.lerp(characterRef.current.position.clone().add(offset), 0.1);
        camera.lookAt(characterRef.current.position.clone().add(new THREE.Vector3(0, 1.4, 0)));
    });

    return (
        <group ref={characterRef}>
            <CharacterModel isMoving={moving} isGrounded={grounded} />
            <mesh position={[0.3, 1.2, 0.5]}>
                <cylinderGeometry args={[0.02, 0.02, 0.7]} />
                <meshStandardMaterial color="#2d1a0f" />
                {aiming && <pointLight intensity={3} color="#d4af37" distance={4} />}
            </mesh>
        </group>
    );
};

export default PlayerControls;
