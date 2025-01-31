import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import earthTexture from '../../textures/earth_daymap.jpg';

const Earth = ({ mousePosition }) => {
    const earthRef = useRef();
    const colorMap = useLoader(TextureLoader, earthTexture);

    useFrame(() => {
        if (earthRef.current && mousePosition) {
            const targetRotationX = (mousePosition.y * 0.5 - 0.25) * Math.PI;
            const targetRotationY = (mousePosition.x * 0.5) * Math.PI;
            earthRef.current.rotation.x += (targetRotationX - earthRef.current.rotation.x) * 0.05;
            earthRef.current.rotation.y += (targetRotationY - earthRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group>
            <mesh ref={earthRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={colorMap}
                    metalness={0.2}
                    roughness={0.5}
                    emissive="#222233"
                    emissiveIntensity={0.3}
                />
            </mesh>
            <mesh scale={[1.08, 1.08, 1.08]}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshPhongMaterial
                    color="#2266cc"
                    transparent={true}
                    opacity={0.2}
                    specular="#4488ff"
                    shininess={100}
                />
            </mesh>
        </group>
    );
};

export default Earth;