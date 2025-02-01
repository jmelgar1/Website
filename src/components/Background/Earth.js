import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { Matrix4, Quaternion, TextureLoader, Vector3 } from 'three';
import * as THREE from 'three';

import earthTexture from '../../textures/earth_daymap.jpg';
import moonTexture from '../../textures/moon_map.png';
import cloudTexture from '../../textures/earth_clouds.png';

const Earth = () => {
    const earthRef = useRef();
    const moonRef = useRef();
    const cloudRef = useRef();
    const [angle, setAngle] = useState(0);
    const earthMap = useLoader(TextureLoader, earthTexture);
    const moonMap = useLoader(TextureLoader, moonTexture);
    const cloudMap = useLoader(TextureLoader, cloudTexture);
    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const [zoomed, setZoomed] = useState(false);
    const { size, camera } = useThree();
    const originalCameraPosition = useRef(new THREE.Vector3());
    const angularVelocity = useRef(new Vector3(0, 0, 0));

    // Store initial camera position
    useEffect(() => {
        originalCameraPosition.current.copy(camera.position);
    }, [camera]);

    // Moon orbital parameters
    const MOON_DISTANCE = 8;
    const MOON_SPEED = 0.001;

    const handleMouseOver = useCallback((e) => {
        e.stopPropagation();
        setZoomed(true);  // Enter zoom mode on hover
    }, []);

    const handleMouseLeave = useCallback(() => {
        setZoomed(false);  // Exit zoom mode on leave
    }, []);

    const handleMouseDown = useCallback((e) => {
        e.stopPropagation();
        setIsDragging(true);
        setPrevMousePos({
            x: e.clientX / size.width * 2 - 1,
            y: -(e.clientY / size.height) * 2 + 1
        });
    }, [size]);

    const handleMouseUp = useCallback(() => {
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

            // Calculate cursor speed with exponential scaling
            const cursorSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Get camera vectors
            const cameraDirection = new Vector3();
            camera.getWorldDirection(cameraDirection);

            // Create rotation axis
            const dragDirection = new Vector3(deltaX, deltaY, 0);
            let rotationAxis = new Vector3()
                .crossVectors(dragDirection, cameraDirection)
                .normalize();

            // Transform axis to local space
            const worldMatrix = new Matrix4();
            worldMatrix.extractRotation(earthRef.current.matrixWorld);
            rotationAxis.applyMatrix4(worldMatrix).normalize();

            // Calculate rotation power based on cursor speed
            const rotationPower = Math.pow(cursorSpeed, 1.5) * 1.5; // Non-linear response

            // Apply velocity with speed-based scaling
            angularVelocity.current.add(
                rotationAxis.multiplyScalar(rotationPower * 100)
            );

            setPrevMousePos(currentMousePos);
        }
    }, [isDragging, prevMousePos, size, camera]);

    useFrame((state, delta) => {
        // Smooth camera zoom
        const targetPosition = zoomed
            ? new Vector3(0, 0, 10)
            : originalCameraPosition.current;

        camera.position.lerp(targetPosition, 0.1);
        camera.lookAt(0, 0, 0);

        // Moon orbit
        if (moonRef.current) {
            setAngle(prev => prev + MOON_SPEED * delta * 60);
            moonRef.current.position.x = Math.sin(angle) * MOON_DISTANCE;
            moonRef.current.position.z = Math.cos(angle) * MOON_DISTANCE;
            moonRef.current.rotation.y = angle;
        }

        // Apply momentum-based rotation
        if (earthRef.current) {
            const momentumMagnitude = angularVelocity.current.length();

            if (momentumMagnitude > 0.001) {
                // Calculate rotation angle based on velocity magnitude
                const rotationAngle = momentumMagnitude * delta * 15;
                const axis = angularVelocity.current.clone().normalize();

                // Apply rotation to Earth
                earthRef.current.quaternion.multiply(
                    new Quaternion().setFromAxisAngle(axis, rotationAngle)
                );

                // Apply the same rotation to clouds
                if (cloudRef.current) {
                    cloudRef.current.quaternion.copy(earthRef.current.quaternion);
                }

                // Speed-dependent damping (faster spins last longer)
                const damping = 0.90 - Math.min(momentumMagnitude * 0.015, 0.05);
                angularVelocity.current.multiplyScalar(damping);
            }

            // Gentle base rotation when not zoomed
            if (!zoomed && angularVelocity.current.length() < 0.01) {
                const baseRotation = new Quaternion()
                    .setFromAxisAngle(new Vector3(0, 1, 0), 0.0001 * delta * 60);

                // Apply base rotation to Earth
                earthRef.current.quaternion.multiply(baseRotation);

                // Apply the same base rotation to clouds
                if (cloudRef.current) {
                    cloudRef.current.quaternion.multiply(baseRotation);
                }
            }
        }
    });

    return (
        <group>
            {/* Earth Group with hover and click handlers */}
            <group
                ref={earthRef}
                onPointerOver={handleMouseOver}
                onPointerLeave={handleMouseLeave}
                onPointerDown={handleMouseDown}
                onPointerUp={handleMouseUp}
                onPointerMove={handleMouseMove}
            >
                {/* Earth Sphere */}
                <mesh>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshStandardMaterial
                        map={earthMap}
                        metalness={0.2}
                        roughness={0.5}
                        emissive="#222233"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Cloud Layer with synchronized rotation */}
                <mesh ref={cloudRef}>
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