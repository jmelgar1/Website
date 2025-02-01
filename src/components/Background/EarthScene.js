import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './Earth';
import Stars from './Stars';
import * as THREE from 'three';

const EarthScene = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isDraggingScene, setIsDraggingScene] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const sceneRef = useRef();

    const handleMouseMove = (event) => {
        const currentMousePos = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        };

        if (isDraggingScene && sceneRef.current) {
            const deltaX = currentMousePos.x - prevMousePos.x;
            const deltaY = currentMousePos.y - prevMousePos.y;

            // Rotate the entire scene
            sceneRef.current.rotation.y += deltaX * 2;
            sceneRef.current.rotation.x -= deltaY * 2;
        }

        setMousePosition(currentMousePos);
        setPrevMousePos(currentMousePos);
    };

    const handleMouseDown = (event) => {
        setIsDraggingScene(true);
        setPrevMousePos({
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        });
    };

    const handleMouseUp = () => {
        setIsDraggingScene(false);
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
                zIndex: -1,
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <Canvas
                camera={{
                    position: [0, 15, 15],
                    fov: 45,
                    near: 0.1,
                    far: 1000,
                }}
                shadows
                gl={{ physicallyCorrectLights: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <group ref={sceneRef}>
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
                    {/* Pass isDraggingScene as a prop to Earth */}
                    <Earth mousePosition={mousePosition} isDraggingScene={isDraggingScene} />
                    <Stars />
                </group>
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