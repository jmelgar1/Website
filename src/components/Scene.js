import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import Earth from './Earth';
import Mars from "./Mars";
import Stars from './Stars';
import CameraController from './CameraController';
import ClickHandler from './ClickHandler';
import * as THREE from 'three';

const Scene = () => {
    const sceneRef = useRef();
    const [isDraggingScene, setIsDraggingScene] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const [focusedObject, setFocusedObject] = useState(null);
    const [planetDragStates, setPlanetDragState] = useState({
        earth: false,
        mars: false
    });
    const [hasSceneDragged, setHasSceneDragged] = useState(false);

    // Handle focus changes
    const handleFocus = useCallback((planetName, shouldFocus) => {
        setFocusedObject(shouldFocus ? planetName : null);
    }, []);

    // Handle scene dragging
    const handleMouseMove = (event) => {
        const currentMousePos = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        };

        if (isDraggingScene && sceneRef.current) {
            const deltaX = currentMousePos.x - prevMousePos.x;
            const deltaY = currentMousePos.y - prevMousePos.y;

            if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
                setHasSceneDragged(true);
            }

            sceneRef.current.rotation.y += deltaX * 2;
            sceneRef.current.rotation.x -= deltaY * 2;
        }
        setPrevMousePos(currentMousePos);
    };

    const handleMouseDown = (event) => {
        setIsDraggingScene(true);
        setHasSceneDragged(false);
        setPrevMousePos({
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        });
    };

    // Scene dragging cleanup
    useEffect(() => {
        const handleMouseUp = () => {
            setIsDraggingScene(false);
            setHasSceneDragged(false);
        };
        if (isDraggingScene) window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [isDraggingScene]);

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
                cursor: isDraggingScene ? 'grabbing' : 'grab'
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
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
                <CameraController focusedObject={focusedObject} />
                <ClickHandler
                    sceneRef={sceneRef}
                    focusedObject={focusedObject}
                    planetDragStates={planetDragStates}
                    hasSceneDragged={hasSceneDragged}
                    setFocusedObject={setFocusedObject}
                    setPlanetDragState={setPlanetDragState}
                    setHasSceneDragged={setHasSceneDragged}
                />
                <group ref={sceneRef}>
                    <ambientLight intensity={0.5} color="#ffffff" />
                    <directionalLight
                        position={[0, 50, 0]}
                        intensity={1.5}
                        shadow-mapSize-width={4096}
                        shadow-mapSize-height={4096}
                    >
                        <orthographicCamera
                            attach="shadow-camera"
                            args={[-50, 50, 50, -50, 1, 100]}
                        />
                    </directionalLight>
                    <pointLight position={[-5, 3, 2]} intensity={0.8} color="#bde0ff" decay={2} />
                    <pointLight position={[0, -5, -3]} intensity={0.5} color="#ffeedd" decay={2} />

                    <Earth
                        name="planet-earth"
                        isFocused={focusedObject === 'earth'}
                        onFocus={(shouldFocus) => handleFocus('earth', shouldFocus)}
                        onDrag={(dragging) => setPlanetDragState(prev => ({
                            ...prev,
                            earth: dragging
                        }))}
                    />

                    <Mars
                        name="planet-mars"
                        isFocused={focusedObject === 'mars'}
                        onFocus={(shouldFocus) => handleFocus('mars', shouldFocus)}
                        onDrag={(dragging) => setPlanetDragState(prev => ({
                            ...prev,
                            mars: dragging
                        }))}
                    />
                    <axesHelper args={[20]} />
                    <gridHelper args={[100, 100]} />

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

export default Scene;