import React, { useRef, useState, useCallback } from 'react';
import {useFrame, useLoader, useThree} from '@react-three/fiber';
import { TextureLoader } from 'three';
import earthTexture from '../../textures/earth_daymap.jpg';
import moonTexture from '../../textures/moon_map.png';

const Earth = () => {
    const earthRef = useRef();
    const moonRef = useRef();
    const [angle, setAngle] = useState(0);
    const colorMap = useLoader(TextureLoader, earthTexture);
    const moonMap = useLoader(TextureLoader, moonTexture);
    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePos, setPrevMousePos] = useState({ x: 0, y: 0 });
    const { size } = useThree();

    // Moon orbital parameters
    const MOON_DISTANCE = 8;
    const MOON_SPEED = 0.001;

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

            earthRef.current.rotation.y += deltaX * 2;
            earthRef.current.rotation.x -= deltaY * 2;

            setPrevMousePos(currentMousePos);
        }
    }, [isDragging, prevMousePos, size]);

    useFrame(() => {
        // Update moon position
        if (moonRef.current) {
            setAngle(prev => prev + MOON_SPEED);
            moonRef.current.position.x = Math.cos(angle) * MOON_DISTANCE;
            moonRef.current.position.z = Math.sin(angle) * MOON_DISTANCE;
            moonRef.current.position.y = Math.sin(angle * 2) * 0.5; // Vertical variation
        }

        // Add smooth damping when not dragging
        if (!isDragging && earthRef.current) {
            earthRef.current.rotation.y += 0.0003;
        }
    });

    return (
        <group>
            {/* Earth */}
            <mesh
                ref={earthRef}
                onPointerDown={handleMouseDown}
                onPointerUp={handleMouseUp}
                onPointerMove={handleMouseMove}
                onPointerLeave={() => setIsDragging(false)}
            >
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={colorMap}
                    metalness={0.2}
                    roughness={0.5}
                    emissive="#222233"
                    emissiveIntensity={0.3}
                />
            </mesh>

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