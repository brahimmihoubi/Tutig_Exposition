import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

export default function HypervisorStackScene({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const explodeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(6, 6, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xc8d8f0, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(8, 14, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x5588cc, 0.35);
    fillLight.position.set(-6, 5, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00BFFF, 0.6, 25);
    rimLight.position.set(0, 8, -6);
    scene.add(rimLight);

    // ── Floor ──
    const floorGeom = new THREE.PlaneGeometry(30, 20);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0d1117, metalness: 0.8, roughness: 0.5 });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Stack group (all layers live here for explode animation) ──
    const stackGroup = new THREE.Group();
    scene.add(stackGroup);

    // Layer data for interaction
    interface LayerData {
      mesh: THREE.Group;
      label: string;
      description: string;
      baseY: number;
      explodeY: number;
      glowColor: number;
    }
    const layers: LayerData[] = [];

    // ============================================
    // LAYER 0: Server Chassis (bottom hardware base)
    // ============================================
    const chassisGroup = new THREE.Group();

    // Main chassis body
    const chassisW = 7, chassisH = 1.2, chassisD = 5;
    const chassisGeom = new THREE.BoxGeometry(chassisW, chassisH, chassisD);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x3d4556,
      metalness: 0.65,
      roughness: 0.35,
    });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    chassisGroup.add(chassis);

    // Front face plate (slightly lighter)
    const facePlateGeom = new THREE.BoxGeometry(chassisW - 0.1, chassisH - 0.15, 0.08);
    const facePlateMat = new THREE.MeshStandardMaterial({ color: 0x4d5566, metalness: 0.5, roughness: 0.4 });
    const facePlate = new THREE.Mesh(facePlateGeom, facePlateMat);
    facePlate.position.z = chassisD / 2 + 0.04;
    chassisGroup.add(facePlate);

    // Drive bay (left)
    const bayGeom = new THREE.BoxGeometry(2.2, 0.45, 0.12);
    const bayMat = new THREE.MeshStandardMaterial({ color: 0x2a3040, metalness: 0.4, roughness: 0.6 });
    const bay1 = new THREE.Mesh(bayGeom, bayMat);
    bay1.position.set(-1.5, 0.05, chassisD / 2 + 0.1);
    chassisGroup.add(bay1);

    // Drive bay slot lines
    for (let s = 0; s < 3; s++) {
      const slotGeom = new THREE.BoxGeometry(1.8, 0.03, 0.03);
      const slotMat = new THREE.MeshStandardMaterial({ color: 0x5a6678, metalness: 0.6, roughness: 0.3 });
      const slot = new THREE.Mesh(slotGeom, slotMat);
      slot.position.set(-1.5, -0.1 + s * 0.12, chassisD / 2 + 0.16);
      chassisGroup.add(slot);
    }

    // LEDs on chassis (left side: green + amber)
    const ledPositions = [
      { x: -3, color: 0x44FF66, emissive: 0x22DD44 },
      { x: -2.6, color: 0xFFAA22, emissive: 0xDD8800 },
    ];
    const chassisLEDs: THREE.Mesh[] = [];
    ledPositions.forEach(lp => {
      const ledGeom = new THREE.SphereGeometry(0.07, 10, 10);
      const ledMat = new THREE.MeshStandardMaterial({
        color: lp.color, emissive: lp.emissive, emissiveIntensity: 0.9,
      });
      const led = new THREE.Mesh(ledGeom, ledMat);
      led.position.set(lp.x, 0.15, chassisD / 2 + 0.1);
      chassisGroup.add(led);
      chassisLEDs.push(led);
    });

    // LEDs on chassis (right side: blue indicators)
    const rightLEDs = [1.5, 1.9, 2.3, 2.7];
    rightLEDs.forEach((x, i) => {
      const ledGeom = new THREE.BoxGeometry(0.12, 0.12, 0.04);
      const isFilled = i < 2;
      const ledMat = new THREE.MeshStandardMaterial({
        color: isFilled ? 0x00BBFF : 0xFFAA22,
        emissive: isFilled ? 0x0088CC : 0xCC7700,
        emissiveIntensity: 0.7,
      });
      const led = new THREE.Mesh(ledGeom, ledMat);
      led.position.set(x, 0.15, chassisD / 2 + 0.1);
      chassisGroup.add(led);
      chassisLEDs.push(led);
    });

    chassisGroup.position.y = -0.8;
    stackGroup.add(chassisGroup);
    layers.push({
      mesh: chassisGroup,
      label: 'Server Chassis',
      description: 'Physical server hardware with CPU, RAM, storage, and network interfaces.',
      baseY: -0.8,
      explodeY: -3.5,
      glowColor: 0x4d5566,
    });

    // ============================================
    // LAYER 1: HARDWARE layer (glowing blue slab)
    // ============================================
    const hardwareGroup = new THREE.Group();

    const hwW = 6.5, hwH = 0.5, hwD = 4.5;
    const hwGeom = new THREE.BoxGeometry(hwW, hwH, hwD);
    const hwMat = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      emissive: 0x1e90ff,
      emissiveIntensity: 0.2,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const hwMesh = new THREE.Mesh(hwGeom, hwMat);
    hwMesh.castShadow = true;
    hardwareGroup.add(hwMesh);

    // Edge glow
    const hwEdges = new THREE.EdgesGeometry(hwGeom);
    const hwEdgeMat = new THREE.LineBasicMaterial({ color: 0x00BFFF, transparent: true, opacity: 0.6 });
    hardwareGroup.add(new THREE.LineSegments(hwEdges, hwEdgeMat));

    // HARDWARE text
    const hwLabel = makeTextSprite('HARDWARE', 48, '#ffffff');
    hwLabel.scale.set(3.5, 0.7, 1);
    hwLabel.position.set(0, 0, hwD / 2 + 0.3);
    hardwareGroup.add(hwLabel);

    hardwareGroup.position.y = 0.5;
    stackGroup.add(hardwareGroup);
    layers.push({
      mesh: hardwareGroup,
      label: 'Hardware Layer',
      description: 'Physical resources: CPU cores, RAM modules, storage drives, and NICs.',
      baseY: 0.5,
      explodeY: -0.5,
      glowColor: 0x1e90ff,
    });

    // ============================================
    // LAYER 2: HYPERVISOR layer (glowing amber/gold slab)
    // ============================================
    const hypervisorGroup = new THREE.Group();

    const hvW = 6.5, hvH = 0.4, hvD = 4.5;
    const hvGeom = new THREE.BoxGeometry(hvW, hvH, hvD);
    const hvMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.25,
      metalness: 0.35,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const hvMesh = new THREE.Mesh(hvGeom, hvMat);
    hvMesh.castShadow = true;
    hypervisorGroup.add(hvMesh);

    // Edge glow
    const hvEdges = new THREE.EdgesGeometry(hvGeom);
    const hvEdgeMat = new THREE.LineBasicMaterial({ color: 0xFFCC00, transparent: true, opacity: 0.7 });
    hypervisorGroup.add(new THREE.LineSegments(hvEdges, hvEdgeMat));

    // HYPERVISOR text
    const hvLabel = makeTextSprite('HYPERVISOR', 48, '#ffffff');
    hvLabel.scale.set(3.5, 0.7, 1);
    hvLabel.position.set(0, 0, hvD / 2 + 0.3);
    hypervisorGroup.add(hvLabel);

    hypervisorGroup.position.y = 1.6;
    stackGroup.add(hypervisorGroup);
    layers.push({
      mesh: hypervisorGroup,
      label: 'Hypervisor Layer',
      description: 'Software layer (e.g., VMware ESXi) that manages and isolates virtual machines.',
      baseY: 1.6,
      explodeY: 2.5,
      glowColor: 0xf59e0b,
    });

    // ============================================
    // LAYER 3: VMs Platform + cubes
    // ============================================
    const vmsGroup = new THREE.Group();

    // VM platform slab (dark gray)
    const vmPlatGeom = new THREE.BoxGeometry(6, 0.25, 4);
    const vmPlatMat = new THREE.MeshStandardMaterial({
      color: 0x3a4255,
      metalness: 0.5,
      roughness: 0.4,
    });
    const vmPlat = new THREE.Mesh(vmPlatGeom, vmPlatMat);
    vmPlat.castShadow = true;
    vmsGroup.add(vmPlat);

    // Three VM cubes
    const vmColors = [
      { color: 0x00CCFF, emissive: 0x00AADD }, // Cyan
      { color: 0xFFCC00, emissive: 0xDDAA00 }, // Gold
      { color: 0xFF4455, emissive: 0xDD2233 }, // Red
    ];
    const vmCubes: THREE.Mesh[] = [];
    vmColors.forEach((vc, i) => {
      const cubeSize = 0.9;
      const vmGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const vmMat = new THREE.MeshStandardMaterial({
        color: vc.color,
        emissive: vc.emissive,
        emissiveIntensity: 0.6,
        metalness: 0.25,
        roughness: 0.2,
      });
      const vm = new THREE.Mesh(vmGeom, vmMat);
      vm.position.set(-1.6 + i * 1.6, 0.7, 0);
      vm.castShadow = true;
      vmsGroup.add(vm);
      vmCubes.push(vm);
    });

    // "VMs" label above cubes (with callout box style)
    const vmsLabel = makeBoxLabel('VMs', 44, '#FFD700', '#2a2a3a', '#FFD700');
    vmsLabel.scale.set(2.0, 0.6, 1);
    vmsLabel.position.set(0, 2.0, 0);
    vmsGroup.add(vmsLabel);

    // Callout line from label to platform
    const calloutGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.65, 0),
      new THREE.Vector3(0, 1.25, 0),
    ]);
    const calloutMat = new THREE.LineBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.6 });
    vmsGroup.add(new THREE.Line(calloutGeom, calloutMat));

    // Small triangle pointer
    const triShape = new THREE.Shape();
    triShape.moveTo(0, 0);
    triShape.lineTo(-0.12, 0.18);
    triShape.lineTo(0.12, 0.18);
    triShape.closePath();
    const triGeom = new THREE.ShapeGeometry(triShape);
    const triMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, side: THREE.DoubleSide });
    const tri = new THREE.Mesh(triGeom, triMat);
    tri.position.set(0, 1.25, 0);
    vmsGroup.add(tri);

    vmsGroup.position.y = 2.8;
    stackGroup.add(vmsGroup);
    layers.push({
      mesh: vmsGroup,
      label: 'Virtual Machines',
      description: 'Isolated VMs running different OS and apps, sharing the same physical hardware.',
      baseY: 2.8,
      explodeY: 5.5,
      glowColor: 0x00CCFF,
    });

    // ── Message text on floor ──
    const msgCanvas = document.createElement('canvas');
    msgCanvas.width = 1400;
    msgCanvas.height = 128;
    const msgCtx = msgCanvas.getContext('2d')!;
    msgCtx.font = 'bold 48px "Segoe UI", system-ui, sans-serif';
    msgCtx.fillStyle = '#ffffff';
    msgCtx.textAlign = 'center';
    msgCtx.textBaseline = 'middle';
    msgCtx.fillText('Hypervisor enables multiple systems on one machine', 700, 64);
    const msgTexture = new THREE.CanvasTexture(msgCanvas);
    msgTexture.minFilter = THREE.LinearFilter;

    const msgMat = new THREE.MeshStandardMaterial({
      map: msgTexture, transparent: true, opacity: 0,
      emissive: 0xffffff, emissiveMap: msgTexture, emissiveIntensity: 0.5,
    });
    const msgPlane = new THREE.Mesh(new THREE.PlaneGeometry(12, 1), msgMat);
    msgPlane.rotation.x = -Math.PI / 2;
    msgPlane.position.set(0, -1.55, 4);
    scene.add(msgPlane);

    // ── Ambient particles ──
    const particleCount = 50;
    const pGeom = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 20;
      pPositions[i * 3 + 1] = Math.random() * 8 - 1;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x334466, size: 0.05, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(pGeom, pMat);
    scene.add(particles);

    // ── Interaction state ──
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = 0.4;
    let cameraPitch = 0.35;
    let cameraZoom = 14;
    let autoRotate = true;
    let lastInteraction = 0;
    let isExploded = false;
    let hoveredLayerIdx: number | null = null;
    let msgOpacity = 0;

    // Pointer events
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      autoRotate = false;
      lastInteraction = Date.now();
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        cameraAngle -= dx * 0.005;
        cameraPitch = Math.max(-0.2, Math.min(0.8, cameraPitch + dy * 0.003));
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };
    const onPointerUp = () => { isDragging = false; lastInteraction = Date.now(); };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraZoom = Math.max(8, Math.min(24, cameraZoom + e.deltaY * 0.008));
      autoRotate = false;
      lastInteraction = Date.now();
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Click to select layer
    const onClick = () => {
      if (hoveredLayerIdx !== null && tooltipRef.current) {
        const layer = layers[hoveredLayerIdx];
        tooltipRef.current.innerHTML = `<strong>${layer.label}</strong><br/><span style="font-weight:400;opacity:0.7;font-size:0.78rem">${layer.description}</span>`;
        tooltipRef.current.style.opacity = '1';
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    // Explode toggle
    const onExplode = () => {
      isExploded = !isExploded;
      if (explodeBtnRef.current) {
        explodeBtnRef.current.textContent = isExploded ? 'Collapse' : 'Explode View';
      }
    };
    if (explodeBtnRef.current) {
      explodeBtnRef.current.addEventListener('click', onExplode);
    }

    // ── Animation ──
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-rotate resume after 4s
      if (!autoRotate && Date.now() - lastInteraction > 4000) autoRotate = true;
      if (autoRotate) cameraAngle += 0.002;

      // Camera
      camera.position.x = Math.sin(cameraAngle) * cameraZoom * 0.5;
      camera.position.z = Math.cos(cameraAngle) * cameraZoom;
      camera.position.y = 2 + cameraPitch * 8;
      camera.lookAt(0, 1.2, 0);

      // Layer positions (explode/collapse animation)
      layers.forEach((layer) => {
        const targetY = isExploded ? layer.explodeY : layer.baseY;
        layer.mesh.position.y = THREE.MathUtils.lerp(layer.mesh.position.y, targetY, 0.06);
      });

      // VM cubes float + rotate
      vmCubes.forEach((cube, i) => {
        cube.position.y = 0.7 + Math.sin(elapsed * 0.8 + i * 1.5) * 0.08;
        cube.rotation.y = elapsed * 0.4 + i * 0.9;
        cube.rotation.x = Math.sin(elapsed * 0.3 + i) * 0.1;
        const mat = cube.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + Math.sin(elapsed * 1.2 + i * 1.3) * 0.2;
      });

      // LED blink
      chassisLEDs.forEach((led, i) => {
        const mat = led.material as THREE.MeshStandardMaterial;
        const p = elapsed * 2.5 + i * 1.1;
        mat.emissiveIntensity = Math.sin(p) > 0 ? 0.9 : 0.15;
      });

      // Layer glow pulse
      (hwMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.15 + Math.sin(elapsed * 0.8) * 0.08;
      (hvMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.2 + Math.sin(elapsed * 0.9 + 1) * 0.1;

      // Hover detection
      raycaster.setFromCamera(mouse, camera);
      let newHovered: number | null = null;
      for (let li = layers.length - 1; li >= 0; li--) {
        const allMeshes: THREE.Object3D[] = [];
        layers[li].mesh.traverse(c => { if ((c as THREE.Mesh).isMesh) allMeshes.push(c); });
        const hits = raycaster.intersectObjects(allMeshes);
        if (hits.length > 0) {
          newHovered = li;
          break;
        }
      }

      if (newHovered !== hoveredLayerIdx) {
        hoveredLayerIdx = newHovered;
        if (tooltipRef.current) {
          if (hoveredLayerIdx !== null) {
            const layer = layers[hoveredLayerIdx];
            tooltipRef.current.innerHTML = `<strong>${layer.label}</strong> — click for details`;
            tooltipRef.current.style.opacity = '1';
          } else {
            tooltipRef.current.style.opacity = '0';
          }
        }
      }

      // Highlight hovered layer
      layers.forEach((layer, i) => {
        const isHov = i === hoveredLayerIdx;
        layer.mesh.children.forEach(child => {
          if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
            const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            if (mat.emissive && !mat.userData?.isLabel) {
              // Boost emissive on hover
              if (isHov && mat.emissiveIntensity < 0.6) {
                mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.6, 0.1);
              }
            }
          }
        });
      });

      renderer.domElement.style.cursor = hoveredLayerIdx !== null ? 'pointer' : (isDragging ? 'grabbing' : 'grab');

      // Message fade in
      if (elapsed > 1.2 && msgOpacity < 0.9) {
        msgOpacity = Math.min(0.9, msgOpacity + 0.008);
        msgMat.opacity = msgOpacity;
      }

      particles.rotation.y = elapsed * 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', onClick);
      if (explodeBtnRef.current) explodeBtnRef.current.removeEventListener('click', onExplode);
      renderer.dispose();
      scene.traverse((child) => {
        if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else (mat as THREE.Material).dispose();
        }
      });
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '550px', borderRadius: '16px', overflow: 'hidden', cursor: 'grab' }}
      />
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 22px',
          background: 'rgba(10, 37, 64, 0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: '10px',
          border: '1px solid rgba(0, 191, 255, 0.3)',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          textAlign: 'center',
          maxWidth: '400px',
          lineHeight: 1.4,
        }}
      />
      {/* Explode button */}
      <button
        ref={explodeBtnRef}
        style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '0.78rem',
          fontWeight: 600,
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,191,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(0,191,255,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
      >
        Explode View
      </button>
      {/* Hint */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.35)',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        pointerEvents: 'none',
      }}>
        🖱️ Drag to rotate  •  Scroll to zoom  •  Click layer for info
      </div>
    </div>
  );
}

// ── Text sprite helper ──
function makeTextSprite(text: string, fontSize: number, color: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.font = `bold ${fontSize}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
  return new THREE.Sprite(mat);
}

// ── Box label (callout style) ──
function makeBoxLabel(text: string, fontSize: number, textColor: string, bgColor: string, borderColor: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  // Background
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  const r = 12;
  ctx.beginPath();
  ctx.roundRect(8, 8, 240, 72, r);
  ctx.fill();
  ctx.stroke();
  // Text
  ctx.font = `bold ${fontSize}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  return new THREE.Sprite(mat);
}
