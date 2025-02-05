import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

const ClickHandler = ({
                          sceneRef,
                          focusedObject,
                          planetDragStates,
                          hasSceneDragged,
                          setFocusedObject,
                          setPlanetDragState,
                          setHasSceneDragged
                      }) => {
    const { camera } = useThree();

    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (focusedObject && !planetDragStates[focusedObject] && !hasSceneDragged) {
                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(
                    sceneRef.current.children,
                    true
                );

                // Check if click is outside any planet
                const planetClicked = intersects.some(obj =>
                    obj.object.name?.includes('planet')
                );

                if (!planetClicked) {
                    setFocusedObject(null);
                }
            }

            // Reset drag states for all planets
            Object.keys(planetDragStates).forEach(planet => {
                setPlanetDragState(prev => ({
                    ...prev,
                    [planet]: false
                }));
            });
            setHasSceneDragged(false);
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [
        focusedObject,
        planetDragStates,
        hasSceneDragged,
        camera,
        sceneRef,
        setFocusedObject,
        setPlanetDragState,
        setHasSceneDragged
    ]);

    return null;
};

export default ClickHandler;