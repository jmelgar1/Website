import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Quaternion, TextureLoader, Vector3 } from 'three';
import * as THREE from 'three';

import earthTexture from '../../textures/earth_daymap.jpg';
import moonTexture from '../../textures/moon_map.png';
import cloudTexture from '../../textures/earth_clouds.png';

const Earth = ({ isFocused, onFocus, onDrag }) => {
    const earthGroupRef = useRef();
    const moonRef = useRef();
    const [angle, setAngle] = useState(0);
    const earthMap = useLoader(TextureLoader, earthTexture);
    const moonMap = useLoader(TextureLoader, moonTexture);
    const cloudMap = useLoader(TextureLoader, cloudTexture);
    const [isPointerOver, setIsPointerOver] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const hasDragged = useRef(false);
    const { camera } = useThree();
    const originalCameraPosition = useRef(new THREE.Vector3());
    const targetCameraPosition = useRef(new THREE.Vector3());
    const angularVelocity = useRef(new Vector3(0, 0, 0));

    // Camera positions
    const ZOOMED_POSITION = new Vector3(0, 0, 10);
    const DEFAULT_POSITION = new Vector3(0, 15, 15);

    // Initialize camera positions
    useEffect(() => {
        originalCameraPosition.current.copy(DEFAULT_POSITION);
        targetCameraPosition.current.copy(DEFAULT_POSITION);
        camera.position.copy(DEFAULT_POSITION);
    }, [camera]);

    // Update target position when focus changes
    useEffect(() => {
        targetCameraPosition.current.copy(isFocused ? ZOOMED_POSITION : DEFAULT_POSITION);
    }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
            setIsHighlighted(false);
        }
    }, [isFocused]);


    // Pointer event handlers
    const handlePointerOver = useCallback((e) => {
        e.stopPropagation();
        if (!isFocused) setIsHighlighted(true);
        setIsPointerOver(true);
    }, [isFocused]);

    const handlePointerOut = useCallback(() => {
        setIsHighlighted(false);
        setIsPointerOver(false);
    }, []);

    const handlePointerDown = useCallback((e) => {
        e.stopPropagation();
        hasDragged.current = false;
        onDrag(true);
    }, [onDrag]);

    const handlePointerMove = useCallback((e) => {
        if (e.buttons > 0) {
            hasDragged.current = true;
            onDrag(true);
        }
    }, [onDrag]);

    const handlePointerUp = useCallback((e) => {
        e.stopPropagation();
        onDrag(false);
    }, [onDrag]);

    const handleClick = useCallback((e) => {
        console.log("click");
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!hasDragged.current) {
            onFocus(true);
            setIsHighlighted(false);
        }
        hasDragged.current = false;
    }, [onFocus]);

    // Wheel handler
    const handleWheel = useCallback((e) => {
        e.stopPropagation();
        if (isFocused && e.deltaY > 0) {
            onFocus(false);
        } else if (!isFocused && e.deltaY < 0) {
            onFocus(true);
        }
    }, [isFocused, onFocus]);

    // Animation frame loop
    useFrame((state, delta) => {
        // Smooth camera transition
        camera.position.lerp(targetCameraPosition.current, 0.1);
        camera.lookAt(0, 0, 0);

        // Moon orbit
        if (moonRef.current) {
            setAngle(prev => prev + 0.001 * delta * 60);
            moonRef.current.position.x = Math.sin(angle) * 10;
            moonRef.current.position.z = Math.cos(angle) * 10;
            moonRef.current.lookAt(0, 0, 0);
        }

        // Earth rotation momentum
        if (earthGroupRef.current) {
            const momentum = angularVelocity.current;
            if (momentum.length() > 0.001) {
                const rotationAngle = momentum.length() * delta * 15;
                const axis = momentum.clone().normalize();
                earthGroupRef.current.quaternion.multiply(
                    new Quaternion().setFromAxisAngle(axis, rotationAngle)
                );
                angularVelocity.current.multiplyScalar(0.90);
            }
        }
    });

    return (
        <group>
            <group
                ref={earthGroupRef}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onClick={handleClick}
                onWheel={handleWheel}
            >
                {/* Earth Sphere */}
                <mesh>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshStandardMaterial
                        map={earthMap}
                        metalness={0.2}
                        roughness={0.5}
                        emissive={isHighlighted ? '#5e5e5e' : '#222233'}
                        emissiveIntensity={isHighlighted ? 0.6 : 0.3}
                    />
                </mesh>

                {/* Cloud Layer */}
                <mesh>
                    <sphereGeometry args={[2.05, 64, 64]} />
                    <meshStandardMaterial
                        map={cloudMap}
                        transparent={true}
                        opacity={0.6}
                        alphaTest={0.5}
                        blending={THREE.AdditiveBlending}
                        metalness={0.0}
                        roughness={0.8}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Moon */}
            <mesh ref={moonRef} position={[10, 0, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    map={moonMap}
                    metalness={0.1}
                    roughness={0.8}
                />
            </mesh>
        </group>
    );
};

export default Earth;