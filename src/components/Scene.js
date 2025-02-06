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
    const [cameraTheta, setCameraTheta] = useState(0); // Horizontal angle
    const [cameraPhi, setCameraPhi] = useState(Math.PI / 4);
    const [isDraggingScene, setIsDraggingScene] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const [focusedObject, setFocusedObject] = useState(null);
    const [planetDragStates, setPlanetDragState] = useState({
        earth: false,
        mars: false
    });
    const [hasSceneDragged, setHasSceneDragged] = useState(false);

    const handleFocus = useCallback((planetName, shouldFocus) => {
        if (shouldFocus) {
            // Reset scene rotation/position to default
            sceneRef.current.rotation.set(0, 0, 0);
            sceneRef.current.position.set(0, 0, 0);
            // Reset camera angles for clean orbit start
            setCameraTheta(0);
            setCameraPhi(Math.PI / 4);
            setFocusedObject(planetName);
        } else {
            setFocusedObject(null);
        }
    }, []);

    // Handle scene dragging
    const handleMouseMove = (event) => {
        const currentMousePos = {
            x: event.clientX,
            y: event.clientY,
        };

        if (isDraggingScene && sceneRef.current) {
            const deltaX = currentMousePos.x - prevMousePos.x;
            const deltaY = currentMousePos.y - prevMousePos.y;

            if (focusedObject) {
                // CASE 1: Rotate CAMERA around focused planet
                setCameraTheta(prev => prev - deltaX * 0.005);
                setCameraPhi(prev => THREE.MathUtils.clamp(
                    prev - deltaY * 0.005,
                    0.1,
                    Math.PI - 0.1
                ));
            } else {
                // CASE 2: Rotate SCENE GROUP (entire scene)
                sceneRef.current.rotation.y += deltaX * 0.01; // Horizontal
                sceneRef.current.rotation.x -= deltaY * 0.01; // Vertical
            }

            if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
                setHasSceneDragged(true);
            }
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
                <CameraController
                    focusedObject={focusedObject}
                    cameraTheta={cameraTheta}
                    cameraPhi={cameraPhi}
                />
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