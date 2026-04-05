import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

export default function FutureTrendsScene({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Check if duplicate mount in React Strict Mode
    const container = mountRef.current;
    if (container.children.length > 0) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // @ts-ignore
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    
    const scene = new THREE.Scene();
    // Beautiful deep dark blue fog
    scene.fog = new THREE.Fog('#010515', 8, 30);
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 7, 16);
    camera.lookAt(0, 1, 0);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1a3a, 2.5); // Increased ambient
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2); // Brighter directional
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Rim light for silhouette definition
    const rimLight = new THREE.PointLight(0x0088ff, 10, 20);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);
    
    const blueSpot = new THREE.SpotLight(0x0088ff, 100); // Brighter spot
    blueSpot.position.set(0, 15, 5);
    blueSpot.angle = Math.PI / 4;
    blueSpot.penumbra = 0.5;
    blueSpot.decay = 2;
    blueSpot.distance = 40;
    scene.add(blueSpot);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Platform
    const platformGeom = new THREE.PlaneGeometry(300, 300);
    const platformMat = new THREE.MeshStandardMaterial({ 
        color: 0x02050a, 
        roughness: 0.1, 
        metalness: 0.9 
    });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = -0.5;
    platform.receiveShadow = true;
    scene.add(platform);

    // Central Server (Intelligent Hub)
    const serverGroup = new THREE.Group();
    serverGroup.position.set(0, -0.5, 0);
    mainGroup.add(serverGroup);

    // Brighter, more metallic case
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x1a2a4a, roughness: 0.2, metalness: 0.9 });
    const caseGeom = new THREE.BoxGeometry(3.2, 4.2, 3.2); // Slightly larger
    const caseMesh = new THREE.Mesh(caseGeom, caseMat);
    caseMesh.position.y = 2.1;
    caseMesh.castShadow = true;
    serverGroup.add(caseMesh);

    // Silver Frame Detail
    const frameGeom = new THREE.BoxGeometry(3.3, 4.3, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.8, roughness: 0.2 });
    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.position.set(0, 2.1, 1.55);
    serverGroup.add(frame);

    // Front Panel (Now Re-colored for clarity)
    const frontMat = new THREE.MeshStandardMaterial({ color: 0x050a15, roughness: 0.5 });
    const frontGeom = new THREE.BoxGeometry(2.8, 3.8, 0.1);
    const frontMesh = new THREE.Mesh(frontGeom, frontMat);
    frontMesh.position.set(0, 2.1, 1.61);
    serverGroup.add(frontMesh);

    // Central Core Glow inside server
    const innerGlow = new THREE.PointLight(0x00d9ff, 5, 8);
    innerGlow.position.set(0, 2.1, 1.8);
    serverGroup.add(innerGlow);
    const innerGlowBox = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 3.6, 2.8),
        new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
    );
    innerGlowBox.position.y = 2.1;
    serverGroup.add(innerGlowBox);

    // Server Blades (AI Accelerators)
    const slotsY = [0.8, 1.5, 2.2, 2.9, 3.6];
    slotsY.forEach((y, i) => {
        const blade = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.4, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x1a2a4a, roughness: 0.3, metalness: 0.7 })
        );
        blade.position.set(0, y, 1.62);
        serverGroup.add(blade);

        // Brighter Blinking AI Lights
        const led = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ffcc : 0x0088ff })
        );
        led.position.set(-1.0 + (i*0.3)%0.8, y, 1.68);
        serverGroup.add(led);
    });

    // Floating AI / Automation Cubes above main server
    const topCubes: { mesh: THREE.Mesh; phase: number }[] = [];
    const topData = [
        { x: -0.8, y: 4.5, z: 0, color: 0x0088ff },
        { x: 0, y: 4.6, z: 0.4, color: 0xff0055 },
        { x: 0.8, y: 4.4, z: -0.2, color: 0x00ffaa },
    ];
    topData.forEach((d, i) => {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 0.8),
            new THREE.MeshStandardMaterial({ 
                color: d.color, roughness: 0.1, metalness: 0.8, 
                emissive: d.color, emissiveIntensity: 0.8 
            })
        );
        cube.position.set(d.x, d.y, d.z);
        cube.castShadow = true;
        serverGroup.add(cube);
        
        // Aura
        const aura = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
        );
        cube.add(aura);
        topCubes.push({ mesh: cube, phase: i });
    });

    // Edge Nodes (Distributed architecture)
    const edgeNodeData: { x: number; z: number; color: number; delay: number }[] = [];
    const numNodes = 7;
    const radiusX = 8;
    const radiusZ = 5;
    
    for (let i = 0; i < numNodes; i++) {
        // Exclude the very back/center to keep front visibility open
        const angle = Math.PI * 1.2 + (Math.PI * 0.6 * (i / (numNodes - 1))); // Semi-circle around front
        edgeNodeData.push({
            x: Math.cos(angle) * radiusX,
            z: Math.sin(angle) * radiusZ + 2, // shift a bit forward
            color: i % 3 === 0 ? 0x00ffaa : 0x0088ff,
            delay: i * 0.5
        });
    }

    const dataPackets: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; t: number; speed: number; delay: number }[] = [];
    
    edgeNodeData.forEach(pos => {
        // Platform pad
        const pad = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 0.9, 0.2, 16),
            new THREE.MeshStandardMaterial({ color: 0x051025, roughness: 0.5, metalness: 0.8 })
        );
        pad.position.set(pos.x, -0.4, pos.z);
        mainGroup.add(pad);

        // Edge Cube
        const eCube = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 0.8),
            new THREE.MeshStandardMaterial({ color: pos.color, roughness: 0.2, metalness: 0.9, emissive: pos.color, emissiveIntensity: 0.4 })
        );
        eCube.position.set(pos.x, 0.3, pos.z);
        mainGroup.add(eCube);
        
        const eLight = new THREE.PointLight(pos.color, 1, 3);
        eLight.position.set(pos.x, 0.3, pos.z);
        mainGroup.add(eLight);

        // Connection Beams (Spline)
        const startPoint = new THREE.Vector3(0, 0, 0); // Base of server
        const endPoint = new THREE.Vector3(pos.x, -0.3, pos.z);
        const midPoint = new THREE.Vector3(pos.x * 0.5, -0.3, pos.z * 0.5); // flat curve on the floor

        const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint);
        
        const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: pos.color, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        mainGroup.add(tube);

        // Animated Data Packets (Glowing spheres traversing the curve)
        for (let p = 0; p < 2; p++) {
            const packet = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
            );
            
            const pGlow = new THREE.Mesh(
                new THREE.SphereGeometry(0.25, 8, 8),
                new THREE.MeshBasicMaterial({ color: pos.color, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
            );
            packet.add(pGlow);
            mainGroup.add(packet);
            
            dataPackets.push({
                mesh: packet,
                curve: curve,
                t: 0,
                speed: 0.3 + Math.random() * 0.2,
                delay: pos.delay + p * 1.5
            });
        }
    });

    // Subtly glowing floor rings (Automated pulse)
    const floorRings: { mesh: THREE.Mesh; phase: number }[] = [];
    for (let i = 0; i < 4; i++) {
        const ringGeom = new THREE.RingGeometry(1, 1.05, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = -0.48;
        mainGroup.add(ring);
        floorRings.push({ mesh: ring, phase: i * 0.8 });
    }

    // Mouse Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    // Auto Rotation Base
    let autoRotateAngle = 0;

    // Interaction State
    let isBursting = false;
    let burstTimer = 0;
    const raycaster = new THREE.Raycaster();
    const mouseParams = new THREE.Vector2();

    const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(8, 8, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    hitBox.position.set(0, 3, 0);
    mainGroup.add(hitBox);

    const handleMouseClick = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseParams.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseParams.y = -((e.clientY - rect.top) / height) * 2 + 1;
        raycaster.setFromCamera(mouseParams, camera);
        
        const intersects = raycaster.intersectObjects([hitBox]);
        if (intersects.length > 0) {
            isBursting = true;
            burstTimer = 2.0; // Burst lasts 2 seconds
            
            // Extreme central glow
            innerGlow.intensity = 15;
            innerGlow.color.setHex(0xffffff);
            (innerGlowBox.material as THREE.MeshBasicMaterial).opacity = 0.6;
            (innerGlowBox.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
        }
    };
    container.addEventListener('click', handleMouseClick);
    
    // Mouse hover cursor
    const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        targetMouseX = ((e.clientX - rect.left) / width) * 2 - 1;
        targetMouseY = -((e.clientY - rect.top) / height) * 2 + 1;
        
        mouseParams.x = targetMouseX;
        mouseParams.y = targetMouseY;
        raycaster.setFromCamera(mouseParams, camera);
        const intersects = raycaster.intersectObjects([hitBox]);
        container.style.cursor = intersects.length > 0 ? 'pointer' : 'crosshair';
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let time = 0;
    let animationFrameId: number;

    const animate = () => {
        time += 0.016;
        
        // Handle Burst Decay
        if (isBursting) {
            burstTimer -= 0.016;
            if (burstTimer <= 0) {
                isBursting = false;
                // Restore normal
                innerGlow.intensity = 3;
                innerGlow.color.setHex(0x00d9ff);
                (innerGlowBox.material as THREE.MeshBasicMaterial).opacity = 0.1;
                (innerGlowBox.material as THREE.MeshBasicMaterial).color.setHex(0x00aaff);
            } else {
                // Decay glow
                innerGlow.intensity -= 0.2;
                (innerGlowBox.material as THREE.MeshBasicMaterial).opacity -= 0.01;
            }
        }

        // Smooth Mouse Parallax Lerping
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Auto Rotate gently around the scene
        autoRotateAngle += 0.001;
        
        camera.position.x = Math.sin(autoRotateAngle) * 16 + (mouseX * 4);
        camera.position.z = Math.cos(autoRotateAngle) * 16;
        camera.position.y = 6 + mouseY * 2;
        camera.lookAt(0, 1.5, 0);

        // Top Cubes Floating
        topCubes.forEach((c) => {
            const h = isBursting ? 1.0 : 0.2;
            c.mesh.position.y += ((4.5 + Math.sin(time * 2 + c.phase) * h) - c.mesh.position.y) * 0.1;
            c.mesh.rotation.y += isBursting ? 0.1 : 0.01;
            c.mesh.rotation.x = Math.sin(time + c.phase) * 0.1;
        });

        // Floor Rings Expanding
        floorRings.forEach((r) => {
            const speed = isBursting ? 2.0 : 0.5;
            const t = (time * speed + r.phase) % 3;
            r.mesh.scale.setScalar(1 + t * 4);
            const mat = r.mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = t < 0.5 ? t * 2 * 0.4 : Math.max(0, (1 - (t - 0.5) / 2.5)) * 0.4;
            if (isBursting) mat.opacity *= 2;
        });

        // Data Packets along Splines
        dataPackets.forEach((p) => {
            if (time > p.delay || isBursting) {
                const spd = isBursting ? p.speed * 8 : p.speed;
                p.t += spd * 0.016;
                if (p.t >= 1) {
                    p.t = 0; // Loop packet
                }
                const pos = p.curve.getPoint(p.t);
                p.mesh.position.copy(pos);
                // Pulse size
                p.mesh.scale.setScalar(1 + Math.sin(p.t * Math.PI * 10) * 0.2);
            } else {
                p.mesh.position.set(0, -100, 0); // hide initially
            }
        });

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
        if (!mountRef.current) return;
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []);

  return (
    <div className={`w-full h-full relative ${className || ''}`}>
        <div ref={mountRef} className="w-full h-full outline-none cursor-crosshair" />
        {/* Floating Ambient Tech Particles could be added via CSS or inside Canvas, but Canvas looks best */}
    </div>
  );
}
