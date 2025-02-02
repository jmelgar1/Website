import React from 'react';
import Planet from './Planet';
import earthTexture from '../../textures/earth_daymap.jpg';
import moonTexture from '../../textures/moon_map.png';
import cloudTexture from '../../textures/earth_clouds.png';

const Earth = ({ isFocused, onFocus, onDrag }) => {
    return (
        <Planet
            texture={earthTexture}
            cloudTexture={cloudTexture}
            moonTexture={moonTexture}
            size={2}
            cloudSize={2.05}
            rotationSpeed={15}
            hasClouds={true}
            hasMoon={true}
            moonDistance={10}
            moonSize={0.5}
            moonOrbitSpeed={0.001}
            emissive="#222233"
            emissiveIntensity={0.3}
            highlightEmissive="#5e5e5e"
            highlightEmissiveIntensity={0.6}
            isFocused={isFocused}
            onFocus={onFocus}
            onDrag={onDrag}
        />
    );
};

export default Earth;