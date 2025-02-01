import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import {Quaternion, TextureLoader, Vector3} from 'three';
import earthTexture from '../../textures/earth_daymap.jpg';
import moonTexture from '../../textures/moon_map.png';
import cloudTexture from '../../textures/earth_clouds.png';
import * as THREE from "three";

const Earth = () => {
    const earthRef = useRef();
    const moonRef = useRef();
    const cloudRef = useRef();
    const [angle, setAngle] = useState(0);
    const colorMap = useLoader(TextureLoader, earthTexture);
    const moonMap = useLoader(TextureLoader, moonTexture);
    const cloudMap = useLoader(TextureLoader, cloudTexture);
    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const [zoomed, setZoomed] = useState(false);
    const { size, camera } = useThree();
    const originalCameraPosition = useRef(new THREE.Vector3());
    const angularVelocity = useRef({ x: 0, y: 0 });

    // Store initial camera position
    useEffect(() => {
        originalCameraPosition.current.copy(camera.position);
    }, [camera]);

    // Moon orbital parameters
    const MOON_DISTANCE = 8;
    const MOON_SPEED = 0.001;

    const handleMouseOver = useCallback((e) => {
        e.stopPropagation();
        setIsDragging(true);
        setPrevMousePos({
            x: e.clientX / size.width * 2 - 1,
            y: -(e.clientY / size.height) * 2 + 1
        });
    }, [size]);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (isDragging && earthRef.current) {
            const currentMousePos = {
                x: e.clientX / size.width * 2 - 1,
                y: -(e.clientY / size.height) * 2 + 1
            };

            const deltaX = currentMousePos.x - prevMousePos.x;
            const deltaY = currentMousePos.y - prevMousePos.y;

            // Create rotation quaternion in world space
            const axis = new Vector3(-deltaY, deltaX, 0);
            const angle = axis.length() * 3; // Rotation speed multiplier
            axis.normalize();

            // Apply rotation relative to camera view
            const quaternion = new Quaternion()
                .setFromAxisAngle(axis, angle);

            // Apply to Earth's current rotation
            earthRef.current.quaternion.multiply(quaternion);

            // Update angular velocity for momentum
            angularVelocity.current.x = deltaY * 0.8;
            angularVelocity.current.y = deltaX * 0.8;

            setPrevMousePos(currentMousePos);
        }
    }, [isDragging, prevMousePos, size]);

    const handleZoom = useCallback((e) => {
        e.stopPropagation();
        setZoomed(!zoomed);
    }, [zoomed]);

    useFrame(() => {
        // Smooth camera zoom
        const targetPosition = zoomed
            ? new THREE.Vector3(0, 0, 10)
            : originalCameraPosition.current;

        camera.position.lerp(targetPosition, 0.1);
        camera.lookAt(0, 0, 0);

        // Moon orbit
        if (moonRef.current) {
            setAngle(prev => prev + MOON_SPEED);
            moonRef.current.position.x = Math.sin(angle) * MOON_DISTANCE;
            moonRef.current.position.z = Math.cos(angle) * MOON_DISTANCE;
            moonRef.current.rotation.y = angle;
        }

        // Apply angular velocity with damping
        if (earthRef.current) {
            earthRef.current.rotation.y += angularVelocity.current.y;
            earthRef.current.rotation.x += angularVelocity.current.x;

            // Velocity damping (creates smooth slowdown)
            angularVelocity.current.y *= 0.8; // Horizontal damping
            angularVelocity.current.x *= 0.8; // Vertical damping

            // Cloud rotation (slightly faster than Earth)
            if (cloudRef.current) {
                cloudRef.current.rotation.y += 0.00035 + angularVelocity.current.y * 0.5;
            }
        }

        // Add base rotation when not interacting
        if (!isDragging) {
            earthRef.current.rotation.y += 0.0003;
        }
    });

    return (
        <group>
            {/* Earth Group with hover and click handlers */}
            <group
                ref={earthRef}
                onPointerOver={handleMouseOver}
                onPointerLeave={handleMouseLeave}
                onPointerMove={handleMouseMove}
                onClick={handleZoom}
            >
                {/* Earth Sphere */}
                <mesh>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshStandardMaterial
                        map={colorMap}
                        metalness={0.2}
                        roughness={0.5}
                        emissive="#222233"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Cloud Layer with momentum-based rotation */}
                <mesh ref={cloudRef}>
                    <sphereGeometry args={[2.05, 64, 64]} />
                    <meshStandardMaterial
                        map={cloudMap}
                        transparent={true}
                        opacity={0.8}
                        alphaTest={0.5}
                        blending={THREE.AdditiveBlending}
                        metalness={0.0}
                        roughness={0.8}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>

            {/* Moon */}
            <mesh ref={moonRef} position={[MOON_DISTANCE, 0, 0]}>
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