import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {PLANETS} from "../config/planets.config";

const CameraController = ({ focusedObject, cameraTheta, cameraPhi }) => {
    const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 30, 30);
    const ORBIT_RADIUS = 10;

    useFrame((state) => {
        if (focusedObject) {
            const planet = PLANETS[focusedObject];
            const planetPosition = new THREE.Vector3(...planet.position);

            const adjustedTheta = -cameraTheta;
            const adjustedPhi = Math.PI - cameraPhi;

            const spherical = new THREE.Spherical(
                ORBIT_RADIUS,
                adjustedPhi,
                adjustedTheta
            );

            const cameraPosition = new THREE.Vector3()
                .setFromSpherical(spherical)
                .add(planetPosition);

            state.camera.position.lerp(cameraPosition, 0.1);
            state.camera.lookAt(planetPosition);
        } else {
            // Default view: camera stays fixed, scene rotates
            state.camera.position.lerp(DEFAULT_CAMERA_POSITION, 0.1);
            state.camera.lookAt(0, 0, 0);
        }
    });

    return null;
};

export default CameraController;