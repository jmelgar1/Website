// components/Background/Earth.js
import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import earthTexture from '../../textures/earth_daymap.jpg';

// Earth component with single texture
const Earth = ({ mousePosition }) => {
    const earthRef = useRef();

    // Load only the day map texture
    const colorMap = useLoader(TextureLoader, earthTexture);

    // Follow mouse movement
    useFrame(() => {
        if (earthRef.current && mousePosition) {
            // Smooth rotation based on mouse position
            const targetRotationX = (mousePosition.y * 0.5 - 0.25) * Math.PI;
            const targetRotationY = (mousePosition.x * 0.5) * Math.PI;

            earthRef.current.rotation.x += (targetRotationX - earthRef.current.rotation.x) * 0.05;
            earthRef.current.rotation.y += (targetRotationY - earthRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group>
            {/* Earth sphere */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={colorMap}
                    metalness={0.4}
                    roughness={0.7}
                />
            </mesh>

            {/* Simple atmosphere effect */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial
                    color="#004499"
                    transparent={true}
                    opacity={0.1}
                />
            </mesh>
        </group>
    );
};

// Stars background component
const Stars = () => {
    const starsRef = useRef();
    const [stars] = React.useState(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;
            positions[i + 1] = (Math.random() - 0.5) * 50;
            positions[i + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    });

    useFrame(() => {
        if (starsRef.current) {
            starsRef.current.rotation.y += 0.0001;
        }
    });

    return (
        <points ref={starsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attachObject={['attributes', 'position']}
                    count={stars.length / 3}
                    array={stars}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.01}
                color="#ffffff"
                sizeAttenuation={true}
            />
        </points>
    );
};

// Main Scene component
const EarthScene = () => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        setMousePosition({
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: 'linear-gradient(to bottom, #000000, #0a0a2c)',
                zIndex: -1
            }}
            onMouseMove={handleMouseMove}
        >
            <Canvas
                camera={{ position: [0, 0, 6], fov: 75 }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 10, 10]} intensity={1.2} />
                <pointLight position={[-100, -10, -10]} intensity={0.8} />

                <Earth mousePosition={mousePosition} />
                <Stars />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                />
            </Canvas>
        </div>
    );
};

export default EarthScene;