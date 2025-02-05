import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraController = ({ focusedObject }) => {
    const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 30, 30); // Higher vantage point
    const ZOOMED_CAMERA_POSITION = new THREE.Vector3(0, 0, 10);

    useFrame((state) => {
        const targetPosition = focusedObject
            ? ZOOMED_CAMERA_POSITION
            : DEFAULT_CAMERA_POSITION;

        state.camera.position.lerp(targetPosition, 0.1);
        state.camera.lookAt(focusedObject === 'mars' ? -10 : 0, 0, 0); // Look at Mars when focused
    });

    return null;
};

export default CameraController