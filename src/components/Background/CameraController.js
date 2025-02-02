import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CameraController = ({ focusedObject }) => {
    const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 15, 15);
    const ZOOMED_CAMERA_POSITION = new THREE.Vector3(0, 0, 10);

    useFrame((state) => {
        const targetPosition = focusedObject === 'earth' ? ZOOMED_CAMERA_POSITION : DEFAULT_CAMERA_POSITION;
        state.camera.position.lerp(targetPosition, 0.1);
        state.camera.lookAt(0, 0, 0);
    });

    return null;
};

export default CameraController;