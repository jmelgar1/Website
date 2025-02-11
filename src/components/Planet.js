import React, { useRef, useState, useCallback } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import {Sparkles} from "@react-three/drei";

const Planet = ({
                    position,
                    texture,
                    cloudTexture,
                    moonTexture,
                    size,
                    cloudSize,
                    rotationSpeed,
                    hasClouds,
                    hasMoon,
                    moonDistance,
                    moonSize,
                    moonOrbitSpeed,
                    emissive,
                    emissiveIntensity,
                    highlightEmissive,
                    highlightEmissiveIntensity,
                    hasFlares,
                    flareSettings = {},
                    glowSettings = {},
                    isFocused,
                    onFocus,
                    onDrag
                }) => {
    const planetGroupRef = useRef();
    const moonRef = useRef();
    const cloudGroupRef = useRef();
    const flareGroupRef = useRef();
    const flareRotation = useRef(0);
    const angle = useRef(0);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [hasDragged, setHasDragged] = useState(false);

    const fallbackTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    // Load textures
    const planetMap = useLoader(TextureLoader, texture);

    const cloudMap = useLoader(
        TextureLoader,
        hasClouds ? cloudTexture || fallbackTexture : fallbackTexture
    );

    // Moon texture loader
    const moonMap = useLoader(
        TextureLoader,
        hasMoon ? moonTexture || fallbackTexture : fallbackTexture
    );

    const flareMap = useLoader(
        TextureLoader,
        hasClouds ? cloudTexture || fallbackTexture : fallbackTexture
    );

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
        setHasDragged(false);
        onDrag(true);
    }, [onDrag]);

    const handlePointerMove = useCallback((e) => {
        if (e.buttons > 0) {
            setHasDragged(true);
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
        if (!hasDragged) {
            if (!isFocused) onFocus(true);
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
        if (hasMoon && moonRef.current && moonTexture) {
            angle.current += moonOrbitSpeed * delta * 60;
            const x = Math.sin(angle.current) * moonDistance;
            const z = Math.cos(angle.current) * moonDistance;
            moonRef.current.position.set(x, 0, z);
            moonRef.current.lookAt(0, 0, 0);
        }

        // Automatic planet rotation
        if (planetGroupRef.current) {
            // Rotate slightly slower than clouds
            planetGroupRef.current.rotation.y += delta * rotationSpeed * 0.0015;
        }

        // Cloud rotation
        if (hasClouds && cloudGroupRef.current) {
            // Rotate faster than planet
            cloudGroupRef.current.rotation.y += delta * rotationSpeed * 0.003;
        }

        //Flares
        if (hasFlares && flareGroupRef.current) {
            flareRotation.current += delta * flareSettings.speed;
            flareGroupRef.current.rotation.y = flareRotation.current;

            // Pulsing opacity
            const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
            flareGroupRef.current.children.forEach(flare => {
                flare.material.opacity = flareSettings.opacity * pulse;
            });
        }
    });

    return (
        <group position={position}>
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

                {/* Dedicated Flare System */}
                {hasFlares && (
                    <group ref={flareGroupRef}>
                        {/* Radial flares */}
                        {Array.from({ length: flareSettings.count }).map((_, i) => {
                            const angle = (Math.PI * 2 * i) / flareSettings.count;
                            return (
                                <mesh
                                    key={i}
                                    position={[
                                        Math.cos(angle) * size * flareSettings.scale,
                                        0,
                                        Math.sin(angle) * size * flareSettings.scale
                                    ]}
                                    rotation={[0, -angle, 0]}
                                >
                                    <planeGeometry args={[size * 0.8, size * 0.8]} />
                                    <meshStandardMaterial
                                        map={flareMap}
                                        transparent=""
                                        blending={THREE.AdditiveBlending}
                                        depthWrite={false}
                                        opacity={flareSettings.opacity}
                                        side={THREE.DoubleSide}
                                    />
                                </mesh>
                            );
                        })}

                        {/* Particle corona */}
                        <Sparkles
                            count={100}
                            size={6}
                            speed={0.4}
                            color="#ffaa00"
                            scale={size * 2}
                            opacity={0.6}
                        />
                    </group>
                )}

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