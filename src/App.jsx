// src/App.jsx
import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';

// List of visited countries with capital coords and ISO-2 codes for flags
const visitedLocations = [
  { country: 'Morocco',   lat: 33.5731,  lng: -7.5898,  iso2: 'ma' },
  { country: 'Canada',    lat: 45.4215,  lng: -75.6972, iso2: 'ca' },
  { country: 'Sweden',    lat: 59.3293,  lng: 18.0686,  iso2: 'se' },
  { country: 'Iceland',   lat: 64.1466,  lng: -21.9426, iso2: 'is' },
  { country: 'Australia', lat: -35.2809, lng: 149.1300, iso2: 'au' },
  { country: 'Belgium',   lat: 50.8503,  lng: 4.3517,   iso2: 'be' },
  { country: 'France',    lat: 48.8566,  lng: 2.3522,   iso2: 'fr' },
  { country: 'Spain',     lat: 40.4168,  lng: -3.7038,  iso2: 'es' },
  { country: 'Greece',    lat: 37.9838,  lng: 23.7275,  iso2: 'gr' },
  { country: 'Croatia',   lat: 45.8150,  lng: 15.9819,  iso2: 'hr' }
];

function App() {
  const globeEl = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    // Base textures
    const dayMap  = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
    const bumpMap = '//unpkg.com/three-globe/example/img/earth-topology.png';
    const waterSpec = '//unpkg.com/three-globe/example/img/earth-water.png';

    // Initialize globe
    const globe = Globe()(globeEl.current)
      .globeImageUrl(dayMap)
      .bumpImageUrl(bumpMap)
      .showAtmosphere(true)
      .atmosphereColor('lightblue')
      .atmosphereAltitude(0.25)
      .pointOfView({ lat: 20, lng: 0, altitude: 2 })
      .polygonsData([])             // no country fill
      .pointsData(visitedLocations)
      .pointAltitude(0.06)
      .pointRadius(0.3)
      .pointColor(() => 'orange')
      .pointLabel(d => d.country)
      .pointsTransitionDuration(300);

    // Add specular (water highlight)
    const mat = globe.globeMaterial();
    new THREE.TextureLoader().load(waterSpec, tex => {
      mat.specularMap = tex;
      mat.specular    = new THREE.Color('grey');
      mat.shininess   = 10;
      mat.needsUpdate = true;
    });

    // OrbitControls for auto-rotate & user interaction
    const { current: canvas } = globeEl;
    const renderer = globe.renderer();
    const camera   = globe.camera();
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enablePan = false;

    // Animate controls
    function animate() {
      controls.update();
      requestAnimationFrame(animate);
    }
    animate();

    // Clean up on unmount
    return () => controls.dispose();
  }, []);

  return (
    <div className="globe-container">
      <div ref={globeEl} className="globe" />
      <div className="sidebar">
        <h2>Visited Countries</h2>
        {visitedLocations.map(loc => (
          <div key={loc.iso2} className="entry">
            {/* flagcdn.com for flags: */}
            <img
              src={`https://flagcdn.com/w20/${loc.iso2}.png`}
              srcSet={`https://flagcdn.com/w40/${loc.iso2}.png 2x`}
              alt={loc.country}
            />
            <span>{loc.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
