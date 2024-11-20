import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getFresnelMat } from './getFresnelMat.js';
import countryData from './countries.json'; // Import your countries.json

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
        const response = await fetch('../polygons.geojson');
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

    controls.enablePan = true; // Enable panning
    controls.screenSpacePanning = true; // Use screen space panning
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };

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
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const outline = new THREE.LineLoop(geometry, outlineMaterial);
      outline.userData = { name: countryName }; // Set country name for the outline
      earthGroup.add(outline);
      countryLines.push(outline);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      earthGroup.rotation.y += 0.00005; // Much slower rotation
      renderer.render(scene, camera);
    };
    animate();

    const getLatLonFromIntersect = (point) => {
      const radius = point.length();
      const phi = Math.acos(point.y / radius);  // Latitude
      const theta = Math.atan2(point.z, point.x);  // Longitude

      const lat = (90 - (phi * 180) / Math.PI);  // Convert to latitude
      const lon = (theta * 180) / Math.PI - 180;  // Convert to longitude

      return { lat, lon };
    };

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(countryLines);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        if (intersectedObject.userData && intersectedObject.userData.name) {
          console.log('Country clicked:', intersectedObject.userData.name);

          // Find the selected country data from your JSON file
          const countryInfo = countryData.find(
            country => country.name === intersectedObject.userData.name
          );

          if (countryInfo) {
            setSelectedCountry({
              name: countryInfo.name,
              capital: countryInfo.capital,
              population: countryInfo.population.toLocaleString(),  // Format population with commas
              currency: countryInfo.currency.name,  // Use currency name
              code: countryInfo.currency.code,
              languages: countryInfo.languages.join(', ')  // Join language array into a string
            });
          }

          // Log the coordinates (lat, lon) of the clicked point
          const latLon = getLatLonFromIntersect(intersects[0].point);
          console.log(`Coordinates: Latitude = ${latLon.lat}, Longitude = ${latLon.lon}`);
        }
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
          position: 'fixed',
          top: '15vw',
          left: '75vw',
          padding: '10px',
          backgroundColor: 'rgba(31, 31, 31, 0.9)',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          zIndex: 10,
          width: '250px',
          maxWidth: '90%',
        }}>
          <h3>Selected Country: {selectedCountry.name}</h3>
          <p><strong>Capital:</strong> {selectedCountry.capital}</p>
          <p><strong>Population:</strong> {selectedCountry.population}</p>
          <p><strong>Currency(s):</strong> {selectedCountry.currency} {"(" + selectedCountry.code + ")"}</p>
          <p><strong>Language(s):</strong> {selectedCountry.languages}</p>
        </div>
      )}

      {/* Note at the bottom left */}
      <div style={{
        position: 'fixed',
        bottom: '10px', // Adjust this to position it further up or down if needed
        left: '10px',
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: 'rgba(31, 31, 31, 0.9)',
        padding: '5px 10px',
        borderRadius: '5px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
        zIndex: 5
      }}>
        All data is from 2024
      </div>
    </div>
  );

};

export default Globe;
