import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Stars = () => {
    const starsRef = useRef();
    const positions = React.useMemo(() => {
        const count = 4000;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const radius = 50;
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

    return (
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
    );
};

export default Stars;