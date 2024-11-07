// src/components/Globe.js
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getFresnelMat } from './getFresnelMat.js';

const Globe = () => {
  const mountRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const convertLatLonToVector3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
  
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
  
    return new THREE.Vector3(x, y, z);
  };
  

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('../ne_50m_admin_0_countries.geojson');
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        const countryData = await response.json();
        console.log('Country Data:', countryData);
        createCountryOutlines(countryData);
      } catch (error) {
        console.error('Error loading GeoJSON data:', error);
      }
    };

    fetchGeoJSON();

    const w = window.innerWidth;
    const h = window.innerHeight - 60;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    mountRef.current.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);

    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, 12);
    const material = new THREE.MeshPhongMaterial({
      map: loader.load("/textures/8k_earth_nightmap.jpg"),
      bumpScale: 0.04,
      shininess: 30,
      emissive: 0x000000,
      specular: 0xaaaaaa
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    const backgroundTexture = loader.load("/textures/8k_stars.jpg");
    scene.background = backgroundTexture;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let countryLines = [];

    const createCountryOutlines = (data) => {
      const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White outline
      const fillMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true }); // Semi-transparent red fill

      data.features.forEach((feature) => {
        const geometryType = feature.geometry.type;

        const createOutlineFromCoordinates = (coordinates) => {
          const points = [];
          coordinates.forEach((coord) => {
            if (Array.isArray(coord[0])) {
              coord.forEach((subCoord) => {
                const lat = subCoord[1];
                const lon = subCoord[0];
                const phi = (lat) * (Math.PI / 180);
                const theta = (lon - 90) * (Math.PI / 180);
                points.push(new THREE.Vector3(
                  Math.cos(phi) * Math.sin(theta),
                  Math.sin(phi),
                  Math.cos(phi) * Math.cos(theta)
                ));
              });
            } else {
              const lat = coord[1];
              const lon = coord[0];
              const phi = (lat) * (Math.PI / 180);
              const theta = (lon - 90) * (Math.PI / 180);
              points.push(new THREE.Vector3(
                Math.cos(phi) * Math.sin(theta),
                Math.sin(phi),
                Math.cos(phi) * Math.cos(theta)
              ));
            }
          });
          return points;
        };

        if (geometryType === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0];
          const points = createOutlineFromCoordinates(coordinates);
          createOutlineAndFill(points, outlineMaterial, fillMaterial, feature.properties.SOVEREIGNT); // Pass country name
        } else if (geometryType === 'MultiPolygon') {
          feature.geometry.coordinates.forEach((polygon) => {
            const coordinates = polygon[0];
            const points = createOutlineFromCoordinates(coordinates);
            createOutlineAndFill(points, outlineMaterial, fillMaterial, feature.properties.SOVEREIGNT); // Pass country name
          });
        }
      });

      console.log('Created country outlines:', countryLines);
    };

    const createOutlineAndFill = (points, outlineMaterial, fillMaterial, countryName) => {
      // Create outline
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const outline = new THREE.LineLoop(geometry, outlineMaterial);
      outline.userData = { name: countryName }; // Set country name for the outline
      earthGroup.add(outline);
      countryLines.push(outline);
    
      // Create filled shape
      const shapePoints = points.map(point => new THREE.Vector2(point.x, point.y));
    
      // Create a shape using the projected points
      const shape = new THREE.Shape(shapePoints);
    
      // Create the geometry with depth to match the globe's surface
      const extrudeSettings = {
        steps: 1,
        depth: 0.001, // Increase depth for better visibility
        bevelEnabled: false
      };
    
      const meshGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
      // Create a new mesh for the filled shape
      const fillMesh = new THREE.Mesh(meshGeometry, fillMaterial);
    
      // Adjust the fill mesh position to sit on the globe's surface
      const radius = 1; // The radius of your globe
      fillMesh.geometry.computeBoundingBox();
      const boundingBox = fillMesh.geometry.boundingBox;
      const center = boundingBox.getCenter(new THREE.Vector3());
    
      fillMesh.position.set(center.x, center.y, radius); // Start position at the globe's surface
    
      // Adjust to sit on the globe surface
      fillMesh.position.add(new THREE.Vector3(center.x, center.y, center.z).normalize().multiplyScalar(radius));
    
      earthGroup.add(fillMesh);
    };
     
    
    const animate = () => {
      requestAnimationFrame(animate);
      earthGroup.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };
    animate();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(countryLines);
  
      if (intersects.length > 0) {
          const intersectedObject = intersects[0].object;
  
          if (intersectedObject.userData && intersectedObject.userData.name) {
              console.log('Country clicked:', intersectedObject.userData.name);
              setSelectedCountry(intersectedObject.userData.name);
          }
  
          // Convert intersection point to latitude and longitude
          const intersectionPoint = intersects[0].point;
          const radius = intersectionPoint.length(); // Distance from origin (center of the globe)
  
          // Calculate latitude and longitude from intersectionPoint
          const lat = Math.asin(intersectionPoint.y / radius) * (180 / Math.PI);
          const lon = Math.atan2(intersectionPoint.z, intersectionPoint.x) * (180 / Math.PI);
  
          console.log(`Latitude: ${lat.toFixed(4)}, Longitude: ${lon.toFixed(4)}`);
      } else {
          setSelectedCountry(null);
      }
  };  

    window.addEventListener('click', onMouseClick);

    const handleWindowResize = () => {
      const newHeight = window.innerHeight - 60;
      camera.aspect = window.innerWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, newHeight);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleWindowResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
    };
  }, []);

  return (
    <div>
      <div id="globeViz" ref={mountRef} />
      {selectedCountry && (
        <div className="info-box" style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          zIndex: 10,
        }}>
          Selected Country: {selectedCountry}
        </div>
      )}
    </div>
  );
};

export default Globe;
