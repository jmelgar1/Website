// planets.config.js
import earthTexture from '../assets/textures/earth/earth_map.jpg';
import earthClouds from '../assets/textures/earth/earth_clouds.png';
import marsTexture from '../assets/textures/mars/mars_map.png'
import moonTexture from '../assets/textures/moon_map.png';
//import marsClouds from '../assets/textures/mars_dust.png';
//import phobosTexture from '../assets/textures/phobos_map.jpg';

console.log('Mars texture path:', marsTexture);

export const PLANETS = {
    earth: {
        texture: earthTexture,
        cloudTexture: earthClouds,
        moonTexture: moonTexture,
        size: 2,
        cloudSize: 2.05,
        rotationSpeed: 15,
        hasClouds: true,
        hasMoon: true,
        moonDistance: 10,
        moonSize: 0.5,
        moonOrbitSpeed: 0.001,
        emissive: "#222233",
        emissiveIntensity: 0.3,
        highlightEmissive: "#5e5e5e",
        highlightEmissiveIntensity: 0.6
    },
    mars: {
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