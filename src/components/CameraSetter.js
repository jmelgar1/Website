// CameraSetter.js
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

const CameraSetter = ({ onMount }) => {
    const { camera } = useThree();
    useEffect(() => {
        onMount(camera);
    }, [camera, onMount]);
    return null;
};

export default CameraSetter;
