import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANETS } from "../config/planets.config";

const CameraController = ({ focusedObject, cameraTheta, cameraPhi }) => {
    const DEFAULT_ORBIT_RADIUS = 30 * Math.sqrt(2);
    const ORBIT_RADIUS = 10;

    const getCameraPosition = (orbitRadius, targetPosition = new THREE.Vector3()) => {
        const adjustedTheta = -cameraTheta;
        const adjustedPhi = Math.PI - cameraPhi;

        const spherical = new THREE.Spherical(
            orbitRadius,
            adjustedPhi,
            adjustedTheta
        );

        return new THREE.Vector3()
            .setFromSpherical(spherical)
            .add(targetPosition);
    };

    useFrame((state) => {
        if (focusedObject) {
            const planet = PLANETS[focusedObject];
            const planetPosition = new THREE.Vector3(...planet.position);
            const cameraPosition = getCameraPosition(ORBIT_RADIUS, planetPosition);

            state.camera.position.lerp(cameraPosition, 0.1);
            state.camera.lookAt(planetPosition);
        } else {
            const cameraPosition = getCameraPosition(DEFAULT_ORBIT_RADIUS);

            state.camera.position.lerp(cameraPosition, 0.1);
            state.camera.lookAt(0, 0, 0);
        }
    });

    return null;
};

export default CameraController;