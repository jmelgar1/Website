// planets.config.js
import sunTexture from '../assets/textures/sun/sun_map.jpg';
import earthTexture from '../assets/textures/earth/earth_map.jpg';
import earthClouds from '../assets/textures/earth/earth_clouds.png';
import marsTexture from '../assets/textures/mars/mars_map.png'
import moonTexture from '../assets/textures/moon_map.png';

export const PLANETS = {
    sun: {
        position: [0, 0, 0],
        texture: sunTexture,
        cloudTexture: null,
        moonTexture: null,
        size: 2,
        rotationSpeed: 15,
        emissive: "#222233",
        emissiveIntensity: 0.3,
        highlightEmissive: "#5e5e5e",
        highlightEmissiveIntensity: 0.6,
        hasGlow: true,
        // flareSettings: {
        //     count: 100,
        //     scale: [8, 8, 8],
        //     size: 50,
        //     speed: 0.2,
        //     color: "#ff8800",
        //     opacity: 0.6
        // },
    },
    earth: {
        position: [30, 0, 0],
        texture: earthTexture,
        cloudTexture: earthClouds,
        moonTexture: moonTexture,
        size: 2,
        cloudSize: 2.05,
        rotationSpeed: 15,
        hasClouds: true,
        hasMoon: true,
        moonDistance: 7,
        moonSize: 0.5,
        moonOrbitSpeed: 0.001,
        emissive: "#222233",
        emissiveIntensity: 0.3,
        highlightEmissive: "#5e5e5e",
        highlightEmissiveIntensity: 0.6
    },
    mars: {
        position: [60, 0, 0],
        texture: marsTexture,
        cloudTexture: null,
        moonTexture: null,
        size: 1.2,
        cloudSize: 1.2,
        rotationSpeed: 20,
        hasClouds: false,
        hasMoon: false,
        moonDistance: 0,
        moonSize: 0,
        moonOrbitSpeed: 0,
        emissive: "#3a1f00",
        emissiveIntensity: 0.4,
        highlightEmissive: "#7a4f2e",
        highlightEmissiveIntensity: 0.5
    }
};