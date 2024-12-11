'use client'

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PopupInfo {
  title: string;
  content: string;
}

const AboutPage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const yachtRef = useRef<THREE.Object3D | null>(null);
  const islandsRef = useRef<THREE.Object3D[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
    camera.position.set(0, 1000, 1000);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Sky
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 3;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.7;

    const sun = new THREE.Vector3();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    const phi = THREE.MathUtils.degToRad(88);
    const theta = THREE.MathUtils.degToRad(180);
    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);

    scene.environment = pmremGenerator.fromScene(sky as any).texture;

    // Water
    const waterGeometry = new THREE.PlaneGeometry(200000, 200000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg', function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = -25; // Lowered the water level by 10 more units
    scene.add(water);

    // Yacht
    const loader = new GLTFLoader();
    loader.load('/models/yacht.glb', (gltf) => {
      const yacht = gltf.scene;
      yacht.scale.set(10, 10, 10);
      yacht.position.set(0, 120, 0); // Raised the yacht's y-position by 10 more units
      yacht.rotation.y = Math.PI;
      scene.add(yacht);
      yachtRef.current = yacht;
    });

    // Create realistic islands
    const createIsland = (position: THREE.Vector3, size: number) => {
      const islandGroup = new THREE.Group();
      
      // Island base (sand)
      const sandGeometry = new THREE.ConeGeometry(size, size * 0.2, 32);
      const sandMaterial = new THREE.MeshPhongMaterial({ color: 0xf2d2a9 });
      const sandMesh = new THREE.Mesh(sandGeometry, sandMaterial);
      islandGroup.add(sandMesh);

      // Vegetation (green top)
      const vegetationGeometry = new THREE.ConeGeometry(size * 0.8, size * 0.3, 32);
      const vegetationMaterial = new THREE.MeshPhongMaterial({ color: 0x2d4c1e });
      const vegetationMesh = new THREE.Mesh(vegetationGeometry, vegetationMaterial);
      vegetationMesh.position.y = size * 0.2;
      islandGroup.add(vegetationMesh);

      // Add trees
      const treeCount = Math.floor(size / 10);
      for (let i = 0; i < treeCount; i++) {
        const treeGeometry = new THREE.ConeGeometry(size * 0.05, size * 0.2, 8);
        const treeMaterial = new THREE.MeshPhongMaterial({ color: 0x0f3f0f });
        const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * size * 0.7;
        treeMesh.position.set(
          Math.cos(angle) * radius,
          size * 0.3,
          Math.sin(angle) * radius
        );
        islandGroup.add(treeMesh);
      }

      islandGroup.position.copy(position);
      islandGroup.position.y += 20; // Raise each island by 10 more units
      return islandGroup;
    };

    const islandPositions = [
      { pos: new THREE.Vector3(-1500, 70, -3000), size: 500, label: "Our Story", content: "Founded in 2023, KOS Yachts began with a passion for the open water..." },
      { pos: new THREE.Vector3(1500, 70, -6000), size: 600, label: "Our Fleet", content: "We pride ourselves on offering a diverse range of top-quality vessels..." },
      { pos: new THREE.Vector3(-2000, 70, -9000), size: 550, label: "Our Mission", content: "At KOS Yachts, our mission is to provide unforgettable maritime experiences..." },
      { pos: new THREE.Vector3(2000, 70, -12000), size: 700, label: "Community Impact", content: "We're committed to giving back to our community..." },
      { pos: new THREE.Vector3(0, 70, -15000), size: 800, label: "Join Our Crew", content: "Interested in a career on the water? KOS Yachts is always looking for passionate individuals..." }
    ];

    islandPositions.forEach((islandInfo, index) => {
      const island = createIsland(islandInfo.pos, islandInfo.size);
      scene.add(island);
      islandsRef.current.push(island);

      // Add text to the island
      const createTextMesh = (text: string, size: number) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return null;

        canvas.width = 1024;
        canvas.height = 512;
        context.fillStyle = '#ffffff';
        context.font = `bold ${size}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 512, 256);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const geometry = new THREE.PlaneGeometry(islandInfo.size, islandInfo.size / 2);
        return new THREE.Mesh(geometry, material);
      };

      const textMesh = createTextMesh(islandInfo.label, 128);
      if (textMesh) {
        textMesh.position.set(islandInfo.pos.x, islandInfo.pos.y + islandInfo.size * 0.6, islandInfo.pos.z);
        textMesh.rotation.x = 0; // Make text vertical
        textMesh.rotation.y = Math.atan2(camera.position.x - textMesh.position.x, camera.position.z - textMesh.position.z); // Face the camera
        textMesh.userData = { isClickable: true, title: islandInfo.label, content: islandInfo.content };
        scene.add(textMesh);
      }
    });

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      if (water) {
        water.material.uniforms['time'].value += 1.0 / 60.0;
      }

      if (yachtRef.current) {
        const time = performance.now() * 0.001;
        yachtRef.current.rotation.x = Math.sin(time * 0.5) * 0.02;
        yachtRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
        yachtRef.current.position.y = Math.sin(time * 0.7) * 0.5 + 110; // Adjusted to keep yacht above water
      }

      renderer.render(scene, camera);
    };
    animate();

    // Scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (cameraRef.current && yachtRef.current) {
            cameraRef.current.position.z = 1000 - progress * 27500;
            cameraRef.current.position.y = 1000 + progress * 1000;
            yachtRef.current.position.z = -progress * 28000;
            yachtRef.current.position.y = Math.sin(performance.now() * 0.001 * 0.7) * 0.5 + 110; // Ensure yacht stays above water during scroll
          }
        },
      },
    });

    // Resize handler
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Click handler
    const handleClick = (event: MouseEvent) => {
      event.preventDefault();

      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData && intersects[i].object.userData.isClickable) {
          setPopupInfo({
            title: intersects[i].object.userData.title,
            content: intersects[i].object.userData.content,
          });
          break;
        }
      }
    };
    window.addEventListener('click', handleClick);

    // Raycaster for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0 && intersects[0].object.userData && intersects[0].object.userData.isClickable) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', onMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative min-h-[600vh] font-sans antialiased overflow-x-hidden">
      <div ref={mountRef} className="fixed inset-0 z-[-1]" />
      <div className="relative z-10">
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">Welcome to KOS Yachts</h1>
        </div>
      </div>
      {popupInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">{popupInfo.title}</h2>
            <p>{popupInfo.content}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setPopupInfo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
