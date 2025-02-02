import React, { useRef, useState, useCallback } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Quaternion, TextureLoader, Vector3 } from 'three';
import * as THREE from 'three';

const Planet = ({
                    texture,
                    cloudTexture,
                    moonTexture,
                    size = 1,
                    cloudSize = 1.05,
                    rotationSpeed = 1,
                    hasClouds = false,
                    hasMoon = false,
                    moonDistance = 15,
                    moonSize = 0.5,
                    moonOrbitSpeed = 0.001,
                    emissive = '#222233',
                    emissiveIntensity = 0.3,
                    highlightEmissive = '#5e5e5e',
                    highlightEmissiveIntensity = 0.6,
                    isFocused,
                    onFocus,
                    onDrag,
                }) => {
    const planetGroupRef = useRef();
    const moonRef = useRef();
    const cloudGroupRef = useRef()
    const [angle, setAngle] = useState(0);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [hasDragged, setHasDragged] = useState(false); // Use useState instead of useRef
    const angularVelocity = useRef(new Vector3(0, 0, 0));

    // Load textures unconditionally
    const planetMap = useLoader(TextureLoader, texture);
    const cloudMap = useLoader(TextureLoader, cloudTexture || '');
    const moonMap = useLoader(TextureLoader, moonTexture || '');

    // Event handlers
    const handlePointerOver = useCallback((e) => {
        e.stopPropagation();
        if (!isFocused) setIsHighlighted(true);
    }, [isFocused]);

    const handlePointerOut = useCallback(() => {
        setIsHighlighted(false);
    }, []);

    const handlePointerDown = useCallback((e) => {
        e.stopPropagation();
        setHasDragged(false); // Reset drag state
        onDrag(true);
    }, [onDrag]);

    const handlePointerMove = useCallback((e) => {
        if (e.buttons > 0) {
            setHasDragged(true); // Set drag state
            onDrag(true);
        }
    }, [onDrag]);

    const handlePointerUp = useCallback((e) => {
        e.stopPropagation();
        onDrag(false);
    }, [onDrag]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!hasDragged) { // Use state value
            if (!isFocused) {
                onFocus(true); // Focus on the planet
            }
            setIsHighlighted(false);
        }
        setHasDragged(false);
    }, [onFocus, isFocused, hasDragged]);

    const handleWheel = useCallback((e) => {
        e.stopPropagation();
        if (isFocused && e.deltaY > 0) {
            onFocus(false);
        } else if (!isFocused && e.deltaY < 0) {
            onFocus(true);
        }
    }, [isFocused, onFocus]);

    // Animation frame
    useFrame((state, delta) => {
        // Moon orbit
        if (hasMoon && moonRef.current) {
            setAngle(prev => prev + moonOrbitSpeed * delta * 60);
            const x = Math.sin(angle) * moonDistance;
            const z = Math.cos(angle) * moonDistance;
            moonRef.current.position.set(x, 0, z);
            moonRef.current.lookAt(0, 0, 0);
        }

        // Planet rotation
        if (planetGroupRef.current) {
            const momentum = angularVelocity.current;
            if (momentum.length() > 0.001) {
                const rotationAngle = momentum.length() * delta * rotationSpeed;
                const axis = momentum.clone().normalize();
                planetGroupRef.current.quaternion.multiply(
                    new Quaternion().setFromAxisAngle(axis, rotationAngle)
                );
                angularVelocity.current.multiplyScalar(0.90);
            }
        }

        if (hasClouds && cloudGroupRef.current) {
            cloudGroupRef.current.rotation.y += delta * rotationSpeed * 0.002;
        }
    });

    return (
        <group>
            <group
                ref={planetGroupRef}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onClick={handleClick}
                onWheel={handleWheel}
            >
                {/* Main Planet */}
                <mesh>
                    <sphereGeometry args={[size, 64, 64]} />
                    <meshStandardMaterial
                        map={planetMap}
                        metalness={0.2}
                        roughness={0.5}
                        emissive={isHighlighted ? highlightEmissive : emissive}
                        emissiveIntensity={isHighlighted ? highlightEmissiveIntensity : emissiveIntensity}
                    />
                </mesh>

                {/* Clouds */}
                {hasClouds && (
                    <group ref={cloudGroupRef}>
                        <mesh>
                            <sphereGeometry args={[cloudSize, 64, 64]} />
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
                )}
            </group>

            {/* Moon */}
            {hasMoon && (
                <mesh ref={moonRef}>
                    <sphereGeometry args={[moonSize, 32, 32]} />
                    <meshStandardMaterial
                        map={moonMap}
                        metalness={0.1}
                        roughness={0.8}
                    />
                </mesh>
            )}
        </group>
    );
};

export default Planet;