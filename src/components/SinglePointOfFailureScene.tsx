import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

export default function SinglePointOfFailureScene({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Setup
    const container = mountRef.current;
    if (container.children.length > 0) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#000000', 8, 30);
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 1.5, 0);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    
    const redLight = new THREE.DirectionalLight(0xff4444, 1.5);
    redLight.position.set(-5, 0, 5);
    scene.add(redLight);

    const bottomRedLight = new THREE.PointLight(0xff0000, 3, 15);
    bottomRedLight.position.set(0, -1, 2);
    scene.add(bottomRedLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Platform
    const platformGeom = new THREE.PlaneGeometry(300, 300);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.8, metalness: 0.2 });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = -0.5;
    platform.receiveShadow = true;
    scene.add(platform);

    // Ripple Rings
    const rings: { mesh: THREE.Mesh; phase: number }[] = [];
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0, -0.4, 0);
    ringGroup.rotation.x = -Math.PI / 2;
    scene.add(ringGroup);

    for (let i = 0; i < 3; i++) {
        const ringGeom = new THREE.RingGeometry(1.5, 1.6, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ringGroup.add(ring);
        rings.push({ mesh: ring, phase: i * 0.6 });
    }

    // Server Rack
    const serverGroup = new THREE.Group();
    serverGroup.position.set(0, -0.5, 0);
    mainGroup.add(serverGroup);

    const caseGeom = new THREE.BoxGeometry(3, 4, 3);
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 });
    const caseMesh = new THREE.Mesh(caseGeom, caseMat);
    caseMesh.position.y = 2;
    caseMesh.castShadow = true;
    serverGroup.add(caseMesh);

    const frontGeom = new THREE.BoxGeometry(2.6, 3.6, 0.1);
    const frontMat = new THREE.MeshStandardMaterial({ color: 0x010101, roughness: 0.9 });
    const frontMesh = new THREE.Mesh(frontGeom, frontMat);
    frontMesh.position.set(0, 2, 1.51);
    serverGroup.add(frontMesh);

    // Server Blades
    const slotsY = [0.5, 1.2, 1.9, 2.6, 3.3];
    const slotsData: { mainLed: THREE.Mesh; subLed: THREE.Mesh }[] = [];
    slotsY.forEach((y, i) => {
        const slotGroup = new THREE.Group();
        slotGroup.position.set(0, y, 1.52);

        const blade = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.4, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.5 })
        );
        slotGroup.add(blade);

        const isRed = i === 2 || i === 4;
        const mainLed = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: isRed ? 0xff0000 : 0xff5555 })
        );
        mainLed.position.set(-0.9, 0, 0.06);
        slotGroup.add(mainLed);

        const subLed = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: isRed ? 0xff0000 : 0xff8888 })
        );
        subLed.position.set(-0.6, 0, 0.06);
        slotGroup.add(subLed);
        
        slotsData.push({ mainLed, subLed });
        serverGroup.add(slotGroup);
    });

    const innerGlow = new THREE.PointLight(0xff0000, 2, 5);
    innerGlow.position.set(0, 2, 2);
    serverGroup.add(innerGlow);
    const innerGlowBox = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3.8, 2.8),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })
    );
    innerGlowBox.position.y = 2;
    serverGroup.add(innerGlowBox);

    // Floating VMs
    const vmCubes: { group: THREE.Group; dropY: number; baseY: number; phase: number; cube: THREE.Mesh; glow: THREE.Mesh }[] = [];
    const vmData = [
        { x: -0.8, y: 4.2, z: 0.4, color: 0x0088ff },
        { x: 0.1, y: 4.2, z: 0, color: 0x44aaff },
        { x: 1, y: 4.2, z: 0.2, color: 0xff4400 },
        { x: -0.4, y: 5.0, z: 0.1, color: 0x00aaff },
        { x: 0.6, y: 5.0, z: -0.2, color: 0xffaa00 },
        { x: 0, y: 5.8, z: 0, color: 0xff0000 },
    ];

    vmData.forEach((data, i) => {
        const group = new THREE.Group();
        group.position.set(data.x, data.y, data.z);
        mainGroup.add(group);

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.7, 0.7),
            new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.2, metalness: 0.8, emissive: data.color, emissiveIntensity: 0.4 })
        );
        cube.castShadow = true;
        group.add(cube);

        const glow = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 0.8),
            new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
        );
        group.add(glow);

        // Calculate a dropping position (stacking loosely on the server y=4 top)
        const dropY = 4 + (i * 0.1) - 0.15;

        vmCubes.push({ group, dropY, baseY: data.y, phase: i * 0.5, cube, glow });
    });

    // Warning Sign
    const warningGroup = new THREE.Group();
    warningGroup.position.set(-3.5, 2, 1);
    mainGroup.add(warningGroup);

    const triangleOuter = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 0.2, 3),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 })
    );
    triangleOuter.rotation.set(Math.PI / 2, Math.PI / 2, 0); 
    warningGroup.add(triangleOuter);

    const triangleInner = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.22, 3),
        new THREE.MeshBasicMaterial({ color: 0x330000 })
    );
    triangleInner.rotation.set(Math.PI / 2, Math.PI / 2, 0);
    warningGroup.add(triangleInner);

    const exclBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.7, 0.3),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    exclBar.position.y = 0.2;
    warningGroup.add(exclBar);

    const exclDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    exclDot.position.y = -0.5;
    warningGroup.add(exclDot);

    const warningGlowLight = new THREE.PointLight(0xff0000, 5, 8);
    warningGlowLight.position.z = 1;
    warningGroup.add(warningGlowLight);

    const warningGlowSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
    );
    warningGroup.add(warningGlowSphere);

    // Invisible clickable hit box around server
    const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(8, 8, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    hitBox.position.set(0, 3, 0);
    mainGroup.add(hitBox);

    // Interaction State
    let isFailed = false;
    const raycaster = new THREE.Raycaster();
    const mouseParams = new THREE.Vector2();

    const handleMouseClick = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseParams.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseParams.y = -((e.clientY - rect.top) / height) * 2 + 1;
        
        raycaster.setFromCamera(mouseParams, camera);
        const intersects = raycaster.intersectObjects([hitBox]);
        
        if (intersects.length > 0) {
            isFailed = !isFailed;
            
            if (isFailed) {
               // Simulate failure
               innerGlow.intensity = 0;
               (innerGlowBox.material as THREE.MeshBasicMaterial).opacity = 0;
               slotsData.forEach(sd => {
                   (sd.mainLed.material as THREE.MeshBasicMaterial).color.setHex(0x111111);
                   (sd.subLed.material as THREE.MeshBasicMaterial).color.setHex(0x111111);
               });
               bottomRedLight.color.setHex(0xff0000); // intensely red
               bottomRedLight.intensity = 5;
               
               (triangleOuter.material as THREE.MeshBasicMaterial).color.setHex(0xff0000);
               (triangleOuter.material as THREE.MeshBasicMaterial).opacity = 1;
               warningGlowLight.color.setHex(0xff0000);
               warningGlowLight.intensity = 15;
            } else {
               // Restore
               innerGlow.intensity = 2;
               (innerGlowBox.material as THREE.MeshBasicMaterial).opacity = 0.1;
               slotsData.forEach((sd, i) => {
                   const isRed = i === 2 || i === 4;
                   (sd.mainLed.material as THREE.MeshBasicMaterial).color.setHex(isRed ? 0xff0000 : 0xff5555);
                   (sd.subLed.material as THREE.MeshBasicMaterial).color.setHex(isRed ? 0xff0000 : 0xff8888);
               });
               bottomRedLight.intensity = 3;
               
               (triangleOuter.material as THREE.MeshBasicMaterial).color.setHex(0xff0000);
               (triangleOuter.material as THREE.MeshBasicMaterial).opacity = 0.8;
               warningGlowLight.color.setHex(0xff0000);
               warningGlowLight.intensity = 5;
            }
        }
    };
    container.addEventListener('click', handleMouseClick);
    
    // Changing cursor on hover
    const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseParams.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseParams.y = -((e.clientY - rect.top) / height) * 2 + 1;
        
        raycaster.setFromCamera(mouseParams, camera);
        const intersects = raycaster.intersectObjects([hitBox]);
        if (intersects.length > 0) {
            container.style.cursor = 'pointer';
        } else {
            container.style.cursor = 'default';
        }
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let time = 0;
    let animationFrameId: number;

    const animate = () => {
        time += 0.016;

        // Auto-rotate Main Group slowly, but follow mouse slightly
        mainGroup.rotation.y += 0.003;
        
        // Ripple Rings Animation - pulse wildly if failed
        rings.forEach((r) => {
            const speed = isFailed ? 8 : 2;
            const size = isFailed ? 8 : 5;
            const t = (time * (isFailed?2:1) + r.phase) % 2;
            r.mesh.scale.setScalar(1 + t * size);
            (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - t) * (isFailed ? 1 : 0.8);
        });

        // VMs Animation depending on state
        vmCubes.forEach((vm) => {
             const mat = vm.cube.material as THREE.MeshStandardMaterial;
             const glowMat = vm.glow.material as THREE.MeshBasicMaterial;
             
             if (isFailed) {
                 // Fall to the bottom randomly
                 vm.group.position.y += (vm.dropY - vm.group.position.y) * 0.1;
                 
                 // Lose power (dim)
                 mat.emissiveIntensity += (0 - mat.emissiveIntensity) * 0.1;
                 glowMat.opacity += (0 - glowMat.opacity) * 0.1;
                 
                 // Stop spinning smoothly
                 vm.group.rotation.x += (0 - vm.group.rotation.x) * 0.1;
                 vm.group.rotation.z += (0 - vm.group.rotation.z) * 0.1;
             } else {
                 // Float magically
                 const targetY = vm.baseY + Math.sin(time * 2 + vm.phase) * 0.1;
                 vm.group.position.y += (targetY - vm.group.position.y) * 0.1;
                 
                 // Spin softly
                 vm.group.rotation.x = Math.sin(time + vm.phase) * 0.05;
                 vm.group.rotation.z = Math.cos(time + vm.phase) * 0.05;
                 
                 // Restore power
                 mat.emissiveIntensity += (0.4 - mat.emissiveIntensity) * 0.1;
                 glowMat.opacity += (0.3 - glowMat.opacity) * 0.1;
             }
        });

        // Floating Warning Sign
        if (isFailed) {
            // Shake it like crazy indicating failure!
            warningGroup.position.y = 2 + Math.sin(time * 20) * 0.2;
            warningGroup.rotation.z = Math.sin(time * 15) * 0.1;
        } else {
            // Calm bouncing
            warningGroup.position.y = 2 + Math.sin(time * 3) * 0.1;
            warningGroup.rotation.z = 0;
        }
        warningGroup.rotation.y = Math.sin(time * 2) * 0.1;

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
        container.removeEventListener('click', handleMouseClick);
        cancelAnimationFrame(animationFrameId);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mountRef} 
        className={`w-full h-full outline-none ${className || ''}`} 
      />
      
      {/* Small floating UI indicator instructing the user to click */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white font-medium text-sm animate-pulse pointer-events-none">
        Click to toggle server failure
      </div>
    </div>
  );
}
