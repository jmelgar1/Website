import {useHelper} from "@react-three/drei";
import {useRef} from "react";
import * as THREE from "three";

const DirectionalLightWithHelper = () => {
    const directionalLightRef = useRef();
    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'white');

    return (
        <directionalLight
            ref={directionalLightRef}
            position={[0, 50, 0]}
            intensity={1.5}
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
        >
            <orthographicCamera
                attach="shadow-camera"
                args={[-50, 50, 50, -50, 1, 100]}
            />
        </directionalLight>
    );
};

export default DirectionalLightWithHelper;