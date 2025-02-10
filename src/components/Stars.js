import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Stars = () => {
    const starsRef = useRef();
    const positions = React.useMemo(() => {
        const count = 4000;
        const positions = new Float32Array(count * 3);

        // Generate stars in a larger sphere
        const radius = 100; // Increased radius
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
        }
        return positions;
    }, []);

    const starTexture = React.useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Draw white circle on black background for testing
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(32, 32, 16, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }, []);

    useFrame(() => {
        starsRef.current.rotation.y += 0.0001;
    });

    const sunTexture = React.useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Create gradient for sun
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 200, 100, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 150, 50, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }, []);

    return (
        <group>
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    map={starTexture}
                    size={0.2}
                    sizeAttenuation={true}
                    transparent={true}
                    opacity={1}
                    alphaTest={0.1}
                    depthWrite={false}
                />
            </points>

            {/* Distant Sun */}
            <mesh
                position={[0, 0, -100]}
                rotation={[0, 0, 0]}
            >
                <planeGeometry args={[10, 10]} />
                <meshBasicMaterial
                    map={sunTexture}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            <ambientLight intensity={0.1} color="#ffaa44" />
        </group>
    );
};

export default Stars;