import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './Earth';
import Stars from './Stars';

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
                background: 'linear-gradient(to bottom, #000000, #1a1a4c)',
                zIndex: -1
            }}
            onMouseMove={handleMouseMove}
        >
            <Canvas
                camera={{
                    position: [0, 15, 15], // X, Y, Z coordinates
                    fov: 45,              // Field of view
                    near: 0.1,            // Clipping planes
                    far: 1000
                }}
                shadows
                gl={{ physicallyCorrectLights: true }}
            >
                <ambientLight intensity={0.5} color="#ffffff" />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1.2}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                >
                    <orthographicCamera
                        attach="shadow-camera"
                        args={[-10, 10, 10, -10, 0.5, 50]}
                    />
                </directionalLight>
                <pointLight
                    position={[-5, 3, 2]}
                    intensity={0.8}
                    color="#bde0ff"
                    decay={2}
                />
                <pointLight
                    position={[0, -5, -3]}
                    intensity={0.5}
                    color="#ffeedd"
                    decay={2}
                />
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