import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

// ── Helper: Create a detailed, well-contrasted server tower ──
function createServerTower(
  group: THREE.Group,
  position: THREE.Vector3,
  cubeColor: number,
  serverIndex: number,
): { vm: THREE.Mesh; leds: THREE.Mesh[]; cpuBars: THREE.Mesh[]; serverGroup: THREE.Group } {
  const serverGroup = new THREE.Group();
  serverGroup.position.copy(position);
  serverGroup.userData = { index: serverIndex, hovered: false };

  const caseWidth = 2.4;
  const caseHeight = 3.8;
  const caseDepth = 2.2;

  // ── Server case body (medium gray with blue tint — NOT black) ──
  const bodyGeom = new THREE.BoxGeometry(caseWidth, caseHeight, caseDepth);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x4a5568,
    metalness: 0.5,
    roughness: 0.45,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  serverGroup.add(body);

  // Top cap (lighter accent)
  const topCapGeom = new THREE.BoxGeometry(caseWidth + 0.06, 0.18, caseDepth + 0.06);
  const topCapMat = new THREE.MeshStandardMaterial({ color: 0x5a6577, metalness: 0.4, roughness: 0.5 });
  const topCap = new THREE.Mesh(topCapGeom, topCapMat);
  topCap.position.y = caseHeight / 2 + 0.09;
  serverGroup.add(topCap);

  // Bottom base (darker accent)
  const baseCap = new THREE.Mesh(topCapGeom.clone(), new THREE.MeshStandardMaterial({ color: 0x3d4555, metalness: 0.5, roughness: 0.4 }));
  baseCap.position.y = -caseHeight / 2 - 0.09;
  serverGroup.add(baseCap);

  // ── Front panel (slightly lighter than body for contrast) ──
  const frontPanelGeom = new THREE.BoxGeometry(caseWidth - 0.1, caseHeight - 0.3, 0.06);
  const frontPanelMat = new THREE.MeshStandardMaterial({ color: 0x556270, metalness: 0.3, roughness: 0.55 });
  const frontPanel = new THREE.Mesh(frontPanelGeom, frontPanelMat);
  frontPanel.position.z = caseDepth / 2 + 0.03;
  serverGroup.add(frontPanel);

  // ── Window area (dark recessed area with visible interior) ──
  const windowWidth = 1.7;
  const windowHeight = 1.9;

  // Window recess (dark inset)
  const recessGeom = new THREE.BoxGeometry(windowWidth + 0.1, windowHeight + 0.1, 0.12);
  const recessMat = new THREE.MeshStandardMaterial({ color: 0x1a2030, metalness: 0.2, roughness: 0.8 });
  const recess = new THREE.Mesh(recessGeom, recessMat);
  recess.position.set(0, 0.35, caseDepth / 2 + 0.02);
  serverGroup.add(recess);

  // Glass panel (semi-transparent, tinted with cube color)
  const glassGeom = new THREE.BoxGeometry(windowWidth, windowHeight, 0.04);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a2538,
    transparent: true,
    opacity: 0.45,
    metalness: 0.05,
    roughness: 0.05,
    side: THREE.DoubleSide,
  });
  const glass = new THREE.Mesh(glassGeom, glassMat);
  glass.position.set(0, 0.35, caseDepth / 2 + 0.08);
  serverGroup.add(glass);

  // Window frame (bright silver/light gray for contrast)
  const silverFrameMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.7, roughness: 0.25 });
  const frameThickness = 0.06;
  // Top
  serverGroup.add(createFrameBar(windowWidth + 0.16, frameThickness, 0, 0.35 + windowHeight / 2 + frameThickness / 2, caseDepth / 2 + 0.08, silverFrameMat));
  // Bottom
  serverGroup.add(createFrameBar(windowWidth + 0.16, frameThickness, 0, 0.35 - windowHeight / 2 - frameThickness / 2, caseDepth / 2 + 0.08, silverFrameMat));
  // Left
  serverGroup.add(createFrameBarV(frameThickness, windowHeight + 0.16, -windowWidth / 2 - frameThickness / 2, 0.35, caseDepth / 2 + 0.08, silverFrameMat));
  // Right
  serverGroup.add(createFrameBarV(frameThickness, windowHeight + 0.16, windowWidth / 2 + frameThickness / 2, 0.35, caseDepth / 2 + 0.08, silverFrameMat));

  // ── Glowing cube (VM/app) inside ──
  const cubeSize = 0.7;
  const vmGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const vmMat = new THREE.MeshStandardMaterial({
    color: cubeColor,
    emissive: cubeColor,
    emissiveIntensity: 0.9,
    metalness: 0.2,
    roughness: 0.15,
  });
  const vm = new THREE.Mesh(vmGeom, vmMat);
  vm.position.set(0, 0.35, 0);
  serverGroup.add(vm);

  // Cube point light (illuminates interior)
  const cubeLight = new THREE.PointLight(cubeColor, 1.0, 3.5);
  cubeLight.position.set(0, 0.35, 0.5);
  serverGroup.add(cubeLight);

  // ── Interior details ──
  // Motherboard (green PCB)
  const mbGeom = new THREE.BoxGeometry(1.5, 2.2, 0.06);
  const mbMat = new THREE.MeshStandardMaterial({ color: 0x2d6a2d, metalness: 0.25, roughness: 0.7 });
  const mb = new THREE.Mesh(mbGeom, mbMat);
  mb.position.set(0, 0.35, -caseDepth / 2 + 0.25);
  serverGroup.add(mb);

  // Heat sink (silver block)
  const hsGeom = new THREE.BoxGeometry(0.4, 0.35, 0.3);
  const hsMat = new THREE.MeshStandardMaterial({ color: 0xaabbcc, metalness: 0.8, roughness: 0.2 });
  const hs = new THREE.Mesh(hsGeom, hsMat);
  hs.position.set(-0.4, 0.15, -0.2);
  serverGroup.add(hs);

  // RAM sticks
  for (let r = 0; r < 3; r++) {
    const ramGeom = new THREE.BoxGeometry(0.05, 0.7, 0.12);
    const ramMat = new THREE.MeshStandardMaterial({ color: 0x3a7a3a, metalness: 0.35, roughness: 0.5 });
    const ram = new THREE.Mesh(ramGeom, ramMat);
    ram.position.set(0.45 + r * 0.12, 0.45, -0.25);
    serverGroup.add(ram);
  }

  // ── LED indicator lights (top front) ──
  const leds: THREE.Mesh[] = [];
  const ledColors = [0x00CCFF, 0x00CCFF, 0x44FF88];
  for (let l = 0; l < 3; l++) {
    const ledGeom = new THREE.SphereGeometry(0.05, 12, 12);
    const ledMat = new THREE.MeshStandardMaterial({
      color: ledColors[l],
      emissive: ledColors[l],
      emissiveIntensity: 0.9,
    });
    const led = new THREE.Mesh(ledGeom, ledMat);
    led.position.set(-0.35 + l * 0.3, caseHeight / 2 - 0.2, caseDepth / 2 + 0.1);
    serverGroup.add(led);
    leds.push(led);
  }

  // ── Drive bay slots (horizontal grooves with silver accents) ──
  for (let d = 0; d < 3; d++) {
    const slotGeom = new THREE.BoxGeometry(1.5, 0.06, 0.05);
    const slotMat = new THREE.MeshStandardMaterial({ color: 0x6b7b8a, metalness: 0.5, roughness: 0.4 });
    const slot = new THREE.Mesh(slotGeom, slotMat);
    slot.position.set(0, -0.75 - d * 0.22, caseDepth / 2 + 0.08);
    serverGroup.add(slot);
  }

  // ── CPU USAGE section ──
  // Label panel (recessed dark area)
  const labelRecessGeom = new THREE.BoxGeometry(1.8, 0.65, 0.05);
  const labelRecessMat = new THREE.MeshStandardMaterial({ color: 0x2a3040, metalness: 0.2, roughness: 0.7 });
  const labelRecess = new THREE.Mesh(labelRecessGeom, labelRecessMat);
  labelRecess.position.set(0, -caseHeight / 2 + 0.45, caseDepth / 2 + 0.06);
  serverGroup.add(labelRecess);

  // CPU USAGE text
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 256;
  labelCanvas.height = 64;
  const labelCtx = labelCanvas.getContext('2d')!;
  labelCtx.font = 'bold 20px "Segoe UI", system-ui, sans-serif';
  labelCtx.fillStyle = '#c0c8d4';
  labelCtx.textAlign = 'center';
  labelCtx.textBaseline = 'middle';
  labelCtx.fillText('CPU USAGE', 128, 28);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.minFilter = THREE.LinearFilter;
  const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture, transparent: true }));
  labelSprite.scale.set(1.3, 0.32, 1);
  labelSprite.position.set(0, -caseHeight / 2 + 0.6, caseDepth / 2 + 0.14);
  serverGroup.add(labelSprite);

  // CPU bars (red filled blocks vs dark unfilled)
  const cpuBars: THREE.Mesh[] = [];
  const totalBars = 5;
  const filledBars = 1; // 20% usage
  for (let b = 0; b < totalBars; b++) {
    const barGeom = new THREE.BoxGeometry(0.2, 0.16, 0.05);
    const isFilled = b < filledBars;
    const barMat = new THREE.MeshStandardMaterial({
      color: isFilled ? 0xFF4444 : 0x3a3545,
      emissive: isFilled ? 0xFF3333 : 0x000000,
      emissiveIntensity: isFilled ? 0.7 : 0,
      metalness: 0.3,
      roughness: 0.5,
    });
    const bar = new THREE.Mesh(barGeom, barMat);
    bar.position.set(-0.5 + b * 0.25, -caseHeight / 2 + 0.3, caseDepth / 2 + 0.1);
    serverGroup.add(bar);
    cpuBars.push(bar);
  }

  group.add(serverGroup);
  return { vm, leds, cpuBars, serverGroup };
}

// Helper to create horizontal frame bar
function createFrameBar(w: number, h: number, x: number, y: number, z: number, mat: THREE.Material): THREE.Mesh {
  const geom = new THREE.BoxGeometry(w, h, 0.05);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, y, z);
  return mesh;
}
// Helper to create vertical frame bar
function createFrameBarV(w: number, h: number, x: number, y: number, z: number, mat: THREE.Material): THREE.Mesh {
  const geom = new THREE.BoxGeometry(w, h, 0.05);
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, y, z);
  return mesh;
}

export default function WastedResourcesScene({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── Scene ──
    const scene = new THREE.Scene();
    // Gradient-like background (dark navy, not pure black)
    scene.background = new THREE.Color(0x141e30);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(0, 3, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // ── Lighting (brighter for contrast) ──
    scene.add(new THREE.AmbientLight(0xd0dbe8, 0.45));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(6, 12, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6699cc, 0.4);
    fillLight.position.set(-8, 6, -4);
    scene.add(fillLight);

    const backLight = new THREE.PointLight(0x3366aa, 0.5, 25);
    backLight.position.set(0, 4, -8);
    scene.add(backLight);

    // ── Platform (dark with subtle blue tint, not pure black) ──
    const platformGeom = new THREE.BoxGeometry(13, 0.35, 4.5);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x1a2236,
      metalness: 0.75,
      roughness: 0.3,
    });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.position.y = -2.15;
    platform.receiveShadow = true;
    scene.add(platform);

    // Platform silver edge trim
    const trimGeom = new THREE.BoxGeometry(13.15, 0.06, 4.65);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x445566, metalness: 0.8, roughness: 0.2 });
    const trim = new THREE.Mesh(trimGeom, trimMat);
    trim.position.y = -1.96;
    scene.add(trim);

    // Floor reflection area
    const floorGeom = new THREE.PlaneGeometry(22, 14);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f1520, metalness: 0.85, roughness: 0.45 });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.38;
    scene.add(floor);

    // ── Server Group ──
    const serversGroup = new THREE.Group();
    scene.add(serversGroup);

    const cubeColors = [0x00DDFF, 0xFFCC00, 0xFF5544]; // Cyan, Gold, Red
    const serverNames = ['Web Server', 'Database', 'Mail Server'];
    const allVMs: THREE.Mesh[] = [];
    const allLEDs: THREE.Mesh[][] = [];
    const serverGroups: THREE.Group[] = [];

    cubeColors.forEach((color, i) => {
      const xPos = (i - 1) * 4; // -4, 0, 4
      const { vm, leds, serverGroup } = createServerTower(serversGroup, new THREE.Vector3(xPos, 0, 0), color, i);
      allVMs.push(vm);
      allLEDs.push(leds);
      serverGroups.push(serverGroup);
    });

    // ── "Resources are wasted" text ──
    const msgCanvas = document.createElement('canvas');
    msgCanvas.width = 1024;
    msgCanvas.height = 128;
    const msgCtx = msgCanvas.getContext('2d')!;
    msgCtx.font = 'bold 52px "Segoe UI", system-ui, sans-serif';
    msgCtx.fillStyle = '#ffffff';
    msgCtx.textAlign = 'center';
    msgCtx.textBaseline = 'middle';
    msgCtx.fillText('Resources are wasted', 512, 64);
    const msgTexture = new THREE.CanvasTexture(msgCanvas);
    msgTexture.minFilter = THREE.LinearFilter;

    const msgMat = new THREE.MeshStandardMaterial({
      map: msgTexture,
      transparent: true,
      opacity: 0,
      emissive: 0xffffff,
      emissiveMap: msgTexture,
      emissiveIntensity: 0.6,
    });
    const msgPlane = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 1), msgMat);
    msgPlane.rotation.x = -Math.PI / 2;
    msgPlane.position.set(0, -1.95, 2.5);
    scene.add(msgPlane);

    // ── Raycaster for interaction ──
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredServer: number | null = null;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = 0;
    let cameraPitch = 0.2;
    let cameraZoom = 14;
    let autoRotate = true;
    let lastInteraction = 0;

    // Mouse events for orbit interaction
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      autoRotate = false;
      lastInteraction = Date.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      // Update mouse for raycasting
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        cameraAngle -= dx * 0.005;
        cameraPitch = Math.max(-0.3, Math.min(0.8, cameraPitch + dy * 0.003));
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      lastInteraction = Date.now();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraZoom = Math.max(8, Math.min(22, cameraZoom + e.deltaY * 0.008));
      autoRotate = false;
      lastInteraction = Date.now();
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // ── Animation Loop ──
    const clock = new THREE.Clock();
    let msgOpacity = 0;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Resume auto-rotate after 4s of no interaction
      if (!autoRotate && Date.now() - lastInteraction > 4000) {
        autoRotate = true;
      }

      // Camera orbit
      if (autoRotate) {
        cameraAngle += 0.003;
      }
      camera.position.x = Math.sin(cameraAngle) * cameraZoom * 0.4;
      camera.position.z = Math.cos(cameraAngle) * cameraZoom;
      camera.position.y = 2 + cameraPitch * 6;
      camera.lookAt(0, 0, 0);

      // VM cubes: blink + float
      allVMs.forEach((vm, i) => {
        const phase = elapsed * 1.0 + i * 1.4;
        const blink = Math.sin(phase) * 0.35 + 0.65;
        const mat = vm.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = blink * 0.9;
        vm.position.y = 0.35 + Math.sin(elapsed * 0.7 + i * 1.2) * 0.06;
        vm.rotation.y = elapsed * 0.35 + i * 0.8;
      });

      // LED blinking
      allLEDs.forEach((leds, si) => {
        leds.forEach((led, li) => {
          const mat = led.material as THREE.MeshStandardMaterial;
          const p = elapsed * 2.2 + si * 0.6 + li * 0.9;
          mat.emissiveIntensity = Math.sin(p) > 0 ? 1.0 : 0.1;
        });
      });

      // Hover detection
      raycaster.setFromCamera(mouse, camera);
      const allServerMeshes: THREE.Object3D[] = [];
      serverGroups.forEach(sg => sg.traverse(c => { if ((c as THREE.Mesh).isMesh) allServerMeshes.push(c); }));
      const intersects = raycaster.intersectObjects(allServerMeshes);

      let newHovered: number | null = null;
      if (intersects.length > 0) {
        // Find which server group this belongs to
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== serversGroup) {
          obj = obj.parent;
        }
        if (obj.userData && obj.userData.index !== undefined) {
          newHovered = obj.userData.index;
        }
      }

      // Apply hover effects
      if (newHovered !== hoveredServer) {
        hoveredServer = newHovered;
        serverGroups.forEach((sg, i) => {
          const targetScale = i === hoveredServer ? 1.06 : 1;
          const targetY = i === hoveredServer ? 0.15 : 0;
          gsapLerp(sg.scale, targetScale);
          sg.position.y = THREE.MathUtils.lerp(sg.position.y, targetY, 0.1);
        });

        // Update tooltip
        if (tooltipRef.current) {
          if (hoveredServer !== null) {
            tooltipRef.current.textContent = `${serverNames[hoveredServer]} — CPU: 20%`;
            tooltipRef.current.style.opacity = '1';
          } else {
            tooltipRef.current.style.opacity = '0';
          }
        }
      }

      // Smooth scale lerp
      serverGroups.forEach((sg, i) => {
        const target = i === hoveredServer ? 1.06 : 1;
        const targetY = i === hoveredServer ? 0.15 : 0;
        sg.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
        sg.position.y = THREE.MathUtils.lerp(sg.position.y, targetY, 0.08);
      });

      // Cursor
      renderer.domElement.style.cursor = hoveredServer !== null ? 'pointer' : (isDragging ? 'grabbing' : 'grab');

      // Message fade in
      if (elapsed > 1.0 && msgOpacity < 0.95) {
        msgOpacity = Math.min(0.95, msgOpacity + 0.01);
        msgMat.opacity = msgOpacity;
      }

      renderer.render(scene, camera);
    };

    // Simple lerp helper
    function gsapLerp(scale: THREE.Vector3, target: number) {
      // Handled in animation loop
    }

    animate();

    // ── Resize ──
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
      scene.traverse((child) => {
        if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else (mat as THREE.Material).dispose();
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '500px', borderRadius: '16px', overflow: 'hidden', cursor: 'grab' }}
      />
      {/* Tooltip overlay */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 20px',
          background: 'rgba(10, 37, 64, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          border: '1px solid rgba(0, 191, 255, 0.3)',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      />
      {/* Interaction hint */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.35)',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        pointerEvents: 'none',
      }}>
        🖱️ Drag to rotate  •  Scroll to zoom
      </div>
    </div>
  );
}
