import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from './Earth';
import Mars from "./Mars";
import Stars from './Stars';
import CameraController from './CameraController';
import ClickHandler from './ClickHandler';
import * as THREE from 'three';
import { PLANETS } from "../config/planets.config";
import CameraSetter from "./CameraSetter";

const Scene = () => {
    const sceneRef = useRef();
    const cameraRef = useRef();
    const [cameraTheta, setCameraTheta] = useState(0);
    const [cameraPhi, setCameraPhi] = useState(3 * Math.PI / 4);
    const [isDraggingScene, setIsDraggingScene] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const [focusedObject, setFocusedObject] = useState(null);
    const [planetDragStates, setPlanetDragState] = useState({ earth: false, mars: false });
    const [hasSceneDragged, setHasSceneDragged] = useState(false);

    const handleFocus = useCallback((planetName, shouldFocus) => {
        if (shouldFocus && cameraRef.current) {
            const planet = PLANETS[planetName];
            const planetPosition = new THREE.Vector3(...planet.position);
            const offset = cameraRef.current.position.clone().sub(planetPosition);
            const spherical = new THREE.Spherical().setFromVector3(offset);

            setCameraTheta(-spherical.theta);
            setCameraPhi(Math.PI - spherical.phi);
            setFocusedObject(planetName);
        } else {
            setFocusedObject(null);
        }
    }, []);

    const updateCameraAngles = (deltaX, deltaY) => {
        setCameraTheta(prev => prev + deltaX * 0.005);
        setCameraPhi(prev => THREE.MathUtils.clamp(
            prev + deltaY * 0.005,
            0.1,
            Math.PI - 0.1
        ));
    };

    const handleMouseMove = (event) => {
        const currentMousePos = { x: event.clientX, y: event.clientY };

        if (isDraggingScene && sceneRef.current) {
            const deltaX = currentMousePos.x - prevMousePos.x;
            const deltaY = currentMousePos.y - prevMousePos.y;

            if (deltaX !== 0 || deltaY !== 0) {
                updateCameraAngles(deltaX, deltaY);
                setHasSceneDragged(true);
            }
        }

        setPrevMousePos(currentMousePos);
    };

    const handleMouseDown = (event) => {
        setIsDraggingScene(true);
        setHasSceneDragged(false);
        setPrevMousePos({ x: event.clientX, y: event.clientY });
    };

    useEffect(() => {
        const handleMouseUp = () => {
            setIsDraggingScene(false);
            setHasSceneDragged(false);
        };

        if (isDraggingScene) window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [isDraggingScene]);

    const renderPlanet = (planetName) => {
        const PlanetComponent = planetName === 'earth' ? Earth : Mars;

        return (
            <PlanetComponent
                key={`planet-${planetName}`}
                name={`planet-${planetName}`}
                isFocused={focusedObject === planetName}
                onFocus={(shouldFocus) => handleFocus(planetName, shouldFocus)}
                onDrag={(dragging) => setPlanetDragState(prev => ({
                    ...prev,
                    [planetName]: dragging
                }))}
            />
        );
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
                cursor: isDraggingScene ? 'grabbing' : 'grab'
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
        >
            <Canvas
                camera={{ position: [0, 30, 30], fov: 45, near: 0.1, far: 1000 }}
                shadows
                gl={{ physicallyCorrectLights: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <CameraSetter onMount={(cam) => (cameraRef.current = cam)} />
                <CameraController focusedObject={focusedObject} cameraTheta={cameraTheta} cameraPhi={cameraPhi} />
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
                        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50, 1, 100]} />
                    </directionalLight>
                    <pointLight position={[-5, 3, 2]} intensity={0.8} color="#bde0ff" decay={2} />
                    <pointLight position={[0, -5, -3]} intensity={0.5} color="#ffeedd" decay={2} />

                    {['earth', 'mars'].map(renderPlanet)}

                    <axesHelper args={[20]} />
                    <gridHelper args={[100, 100]} />
                    <Stars />
                </group>

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    );
};

export default Scene;