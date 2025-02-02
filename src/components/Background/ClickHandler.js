import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

const ClickHandler = ({
                          sceneRef,
                          focusedObject,
                          earthHasDragged,
                          hasSceneDragged,
                          setFocusedObject,
                          setEarthHasDragged,
                          setHasSceneDragged
                      }) => {
    const { camera } = useThree();

    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (focusedObject === 'earth' && !earthHasDragged && !hasSceneDragged) {
                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

                if (intersects.length === 0) {
                    setFocusedObject(null);
                }
            }
            // Reset drag states
            setEarthHasDragged(false);
            setHasSceneDragged(false);
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [focusedObject, earthHasDragged, hasSceneDragged, camera, sceneRef, setFocusedObject, setEarthHasDragged, setHasSceneDragged]);

    return null;
};

export default ClickHandler;