import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

// ── Build a server tower with VM cubes on top and inside ──
function buildServer(
  parentGroup: THREE.Group,
  pos: THREE.Vector3,
  topCubes: { color: number }[],
  insideCube: { color: number } | null,
  ledColor: number,
): { group: THREE.Group; topCubeMeshes: THREE.Mesh[]; insideMesh: THREE.Mesh | null; bodyMesh: THREE.Mesh; leds: THREE.Mesh[] } {
  const g = new THREE.Group();
  g.position.copy(pos);

  const cW = 2.4, cH = 3.6, cD = 2.0;

  // Body
  const bodyGeom = new THREE.BoxGeometry(cW, cH, cD);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.6, roughness: 0.38 });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.castShadow = true;
  g.add(body);

  // Top cap
  const topGeom = new THREE.BoxGeometry(cW + 0.06, 0.16, cD + 0.06);
  g.add(new THREE.Mesh(topGeom, new THREE.MeshStandardMaterial({ color: 0x5a6577, metalness: 0.45, roughness: 0.45 })));
  g.children[g.children.length - 1].position.y = cH / 2 + 0.08;

  // Bottom base
  const base = new THREE.Mesh(topGeom.clone(), new THREE.MeshStandardMaterial({ color: 0x3d4555, metalness: 0.5, roughness: 0.4 }));
  base.position.y = -cH / 2 - 0.08;
  g.add(base);

  // Front panel
  const fpGeom = new THREE.BoxGeometry(cW - 0.1, cH - 0.2, 0.06);
  g.add(new THREE.Mesh(fpGeom, new THREE.MeshStandardMaterial({ color: 0x556270, metalness: 0.35, roughness: 0.5 })));
  g.children[g.children.length - 1].position.z = cD / 2 + 0.03;

  // Window recess
  const winW = 1.6, winH = 1.7;
  const recess = new THREE.Mesh(
    new THREE.BoxGeometry(winW + 0.1, winH + 0.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x1a2030, metalness: 0.2, roughness: 0.8 })
  );
  recess.position.set(0, 0.2, cD / 2 + 0.02);
  g.add(recess);

  // Glass
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(winW, winH, 0.04),
    new THREE.MeshPhysicalMaterial({ color: 0x1a2538, transparent: true, opacity: 0.4, roughness: 0.05, side: THREE.DoubleSide })
  );
  glass.position.set(0, 0.2, cD / 2 + 0.08);
  g.add(glass);

  // Window frame (silver)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.7, roughness: 0.25 });
  const ft = 0.06;
  g.add(makeBar(winW + 0.14, ft, 0, 0.2 + winH / 2 + ft / 2, cD / 2 + 0.08, frameMat));
  g.add(makeBar(winW + 0.14, ft, 0, 0.2 - winH / 2 - ft / 2, cD / 2 + 0.08, frameMat));
  g.add(makeBar(ft, winH + 0.14, -winW / 2 - ft / 2, 0.2, cD / 2 + 0.08, frameMat));
  g.add(makeBar(ft, winH + 0.14, winW / 2 + ft / 2, 0.2, cD / 2 + 0.08, frameMat));

  // Drive bay slots
  for (let d = 0; d < 3; d++) {
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.05, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x6b7b8a, metalness: 0.5, roughness: 0.4 })
    );
    slot.position.set(0, -0.75 - d * 0.2, cD / 2 + 0.08);
    g.add(slot);
  }

  // LEDs
  const leds: THREE.Mesh[] = [];
  const ledPositions = [-0.35, -0.05, 0.25];
  ledPositions.forEach((lx) => {
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshStandardMaterial({ color: ledColor, emissive: ledColor, emissiveIntensity: 0.8 })
    );
    led.position.set(lx, -cH / 2 + 0.25, cD / 2 + 0.1);
    g.add(led);
    leds.push(led);
  });

  // Inside cube (visible through glass)
  let insideMesh: THREE.Mesh | null = null;
  if (insideCube) {
    const ic = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.MeshStandardMaterial({ color: insideCube.color, emissive: insideCube.color, emissiveIntensity: 0.7, metalness: 0.2, roughness: 0.2 })
    );
    ic.position.set(0, 0.2, 0);
    g.add(ic);
    insideMesh = ic;

    // Interior light
    const il = new THREE.PointLight(insideCube.color, 0.6, 3);
    il.position.set(0, 0.2, 0.4);
    g.add(il);
  }

  // Top cubes (on top of the server)
  const topCubeMeshes: THREE.Mesh[] = [];
  topCubes.forEach((tc, i) => {
    const cubeSize = 0.55;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
      new THREE.MeshStandardMaterial({ color: tc.color, emissive: tc.color, emissiveIntensity: 0.6, metalness: 0.2, roughness: 0.2 })
    );
    const xOff = (i - (topCubes.length - 1) / 2) * 0.7;
    cube.position.set(xOff, cH / 2 + 0.45, 0);
    cube.castShadow = true;
    g.add(cube);
    topCubeMeshes.push(cube);
  });

  parentGroup.add(g);
  return { group: g, topCubeMeshes, insideMesh, bodyMesh: body, leds };
}

function makeBar(w: number, h: number, x: number, y: number, z: number, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), mat);
  m.position.set(x, y, z);
  return m;
}

export default function DynamicMigrationScene({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(0, 5, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xd0dbe8, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(8, 14, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);
    scene.add(new THREE.DirectionalLight(0x5588cc, 0.3)).position.set(-6, 5, -4);
    scene.add(new THREE.PointLight(0x00BFFF, 0.5, 25)).position.set(0, 6, -6);

    // ── Floor ──
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshStandardMaterial({ color: 0x0d1117, metalness: 0.8, roughness: 0.5 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Servers Group ──
    const serversGroup = new THREE.Group();
    scene.add(serversGroup);

    // Server 1 (left) — balanced, normal
    const s1 = buildServer(
      serversGroup,
      new THREE.Vector3(-6, 0, 0),
      [{ color: 0x00CCFF }, { color: 0xFFCC00 }], // blue + yellow on top
      { color: 0x00FF7F },// green inside
      0x44FF66 // green LEDs
    );

    // Server 2 (middle) — overloaded (red-tinted, many cubes)
    const s2 = buildServer(
      serversGroup,
      new THREE.Vector3(0, 0, 0),
      [{ color: 0xFF4444 }, { color: 0xFFAA22 }, { color: 0xFF4444 }, { color: 0xFFAA22 }], // overloaded
      { color: 0xFF4444 }, // red inside
      0xFFAA22 // amber LEDs (warning)
    );

    // Server 3 (right) — receiving, healthy
    const s3 = buildServer(
      serversGroup,
      new THREE.Vector3(6, 0, 0),
      [{ color: 0x00CCFF }, { color: 0xFFCC00 }],  // blue + yellow on top
      { color: 0x00FF7F }, // green inside
      0x44FF66 // green LEDs
    );

    // Overloaded server body tint
    (s2.bodyMesh.material as THREE.MeshStandardMaterial).color.setHex(0x5a3838);
    (s2.bodyMesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x331111);
    (s2.bodyMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15;

    // ── Connection lines between servers (glowing blue) ──
    const lineMat = new THREE.MeshStandardMaterial({
      color: 0x00BFFF,
      emissive: 0x00BFFF,
      emissiveIntensity: 0.8,
      metalness: 0.1,
      roughness: 0.3,
    });

    // Line S1 → S2
    const line1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 0.06), lineMat);
    line1.position.set(-3, 0, 1.1);
    serversGroup.add(line1);

    // Line S2 → S3
    const line2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 0.06), lineMat.clone());
    line2.position.set(3, 0, 1.1);
    serversGroup.add(line2);

    // ── Migrating VM cube (flies from S2 to S3 in an arc) ──
    const migCubeGeom = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const migCubeMat = new THREE.MeshStandardMaterial({
      color: 0xFF6644,
      emissive: 0xFF4422,
      emissiveIntensity: 0.9,
      metalness: 0.2,
      roughness: 0.15,
    });
    const migCube = new THREE.Mesh(migCubeGeom, migCubeMat);
    migCube.castShadow = true;
    scene.add(migCube);

    // Migration arrow (curved line from S2 to S3)
    const arrowCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 3.5, 0),
      new THREE.Vector3(3, 6, 0),
      new THREE.Vector3(6, 3.5, 0),
    );
    const arrowGeom = new THREE.TubeGeometry(arrowCurve, 32, 0.04, 8, false);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0xFFAA22,
      emissive: 0xFFAA22,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.8,
    });
    const arrowTube = new THREE.Mesh(arrowGeom, arrowMat);
    scene.add(arrowTube);

    // Arrow head (cone at end)
    const arrowHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xFFAA22, emissive: 0xFFAA22, emissiveIntensity: 0.7 })
    );
    arrowHead.position.set(5.6, 3.8, 0);
    arrowHead.rotation.z = -Math.PI / 4;
    scene.add(arrowHead);

    // ── Trail particles behind migrating cube ──
    const trailCount = 25;
    const trailGeom = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0xFF8844,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const trail = new THREE.Points(trailGeom, trailMat);
    scene.add(trail);

    // ── Message text ──
    const msgCanvas = document.createElement('canvas');
    msgCanvas.width = 1400;
    msgCanvas.height = 128;
    const msgCtx = msgCanvas.getContext('2d')!;
    msgCtx.font = 'bold 48px "Segoe UI", system-ui, sans-serif';
    msgCtx.fillStyle = '#ffffff';
    msgCtx.textAlign = 'center';
    msgCtx.textBaseline = 'middle';
    msgCtx.fillText('Dynamic resource management & scalability', 700, 64);
    const msgTexture = new THREE.CanvasTexture(msgCanvas);
    msgTexture.minFilter = THREE.LinearFilter;
    const msgMat = new THREE.MeshStandardMaterial({
      map: msgTexture, transparent: true, opacity: 0,
      emissive: 0xffffff, emissiveMap: msgTexture, emissiveIntensity: 0.5,
    });
    const msgPlane = new THREE.Mesh(new THREE.PlaneGeometry(12, 1), msgMat);
    msgPlane.rotation.x = -Math.PI / 2;
    msgPlane.position.set(0, -2.15, 4.5);
    scene.add(msgPlane);

    // ── Ambient particles ──
    const pCount = 40;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 24;
      pPos[i * 3 + 1] = Math.random() * 8 - 1;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeom, new THREE.PointsMaterial({ color: 0x334466, size: 0.05, transparent: true, opacity: 0.4 }));
    scene.add(particles);

    // ── Interaction ──
    const mouse = new THREE.Vector2(-10, -10);
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = 0;
    let cameraPitch = 0.28;
    let cameraZoom = 21;
    let autoRotate = true;
    let lastInteraction = 0;
    let msgOpacity = 0;

    const onPointerDown = (e: PointerEvent) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; autoRotate = false; lastInteraction = Date.now(); };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (isDragging) {
        cameraAngle -= (e.clientX - prevMouse.x) * 0.005;
        cameraPitch = Math.max(-0.2, Math.min(0.8, cameraPitch + (e.clientY - prevMouse.y) * 0.003));
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };
    const onPointerUp = () => { isDragging = false; lastInteraction = Date.now(); };
    const onWheel = (e: WheelEvent) => { e.preventDefault(); cameraZoom = Math.max(10, Math.min(28, cameraZoom + e.deltaY * 0.008)); autoRotate = false; lastInteraction = Date.now(); };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // ── Animation ──
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-rotate resume
      if (!autoRotate && Date.now() - lastInteraction > 4000) autoRotate = true;
      if (autoRotate) cameraAngle += 0.002;

      // Camera
      camera.position.x = Math.sin(cameraAngle) * cameraZoom * 0.4;
      camera.position.z = Math.cos(cameraAngle) * cameraZoom;
      camera.position.y = 3 + cameraPitch * 8;
      camera.lookAt(0, 1.5, 0);

      // ── Migration animation (cube flies S2→S3 on curved path, loops every ~4s) ──
      const migDuration = 4.0;
      const migT = (elapsed % migDuration) / migDuration; // 0→1 loop
      const migPos = arrowCurve.getPoint(migT);
      migCube.position.copy(migPos);
      migCube.rotation.y = elapsed * 3;
      migCube.rotation.x = elapsed * 1.5;
      migCubeMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 6) * 0.3;

      // Scale pulse during flight
      const scl = 1 + Math.sin(migT * Math.PI) * 0.15;
      migCube.scale.setScalar(scl);

      // Update trail
      const trailArr = trail.geometry.attributes.position.array as Float32Array;
      for (let i = trailCount - 1; i > 0; i--) {
        trailArr[i * 3] = trailArr[(i - 1) * 3];
        trailArr[i * 3 + 1] = trailArr[(i - 1) * 3 + 1];
        trailArr[i * 3 + 2] = trailArr[(i - 1) * 3 + 2];
      }
      trailArr[0] = migCube.position.x;
      trailArr[1] = migCube.position.y;
      trailArr[2] = migCube.position.z;
      trail.geometry.attributes.position.needsUpdate = true;

      // Arrow tube pulse
      arrowMat.opacity = 0.5 + Math.sin(elapsed * 2) * 0.3;

      // ── Server 2 overloaded pulse (red glow) ──
      const s2Mat = s2.bodyMesh.material as THREE.MeshStandardMaterial;
      s2Mat.emissiveIntensity = 0.1 + Math.sin(elapsed * 3) * 0.08;

      // ── Top cubes float ──
      [s1, s2, s3].forEach((s, si) => {
        s.topCubeMeshes.forEach((cube, ci) => {
          cube.position.y = 2.25 + Math.sin(elapsed * 0.7 + si * 1.2 + ci * 0.8) * 0.06;
          cube.rotation.y = elapsed * 0.3 + ci * 0.5;
        });
        if (s.insideMesh) {
          s.insideMesh.position.y = 0.2 + Math.sin(elapsed * 0.6 + si) * 0.04;
          s.insideMesh.rotation.y = elapsed * 0.4;
          (s.insideMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(elapsed * 1.2 + si) * 0.2;
        }
        // LED blink
        s.leds.forEach((led, li) => {
          const mat = led.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = Math.sin(elapsed * 2.5 + si + li * 0.8) > 0 ? 0.9 : 0.1;
        });
      });

      // Connection lines pulse
      (line1.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(elapsed * 3) * 0.3;
      (line2.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(elapsed * 3 + 1) * 0.3;

      // Cursor
      renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';

      // Message fade
      if (elapsed > 1.0 && msgOpacity < 0.9) {
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
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '520px', borderRadius: '16px', overflow: 'hidden', cursor: 'grab' }}
      />
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          padding: '10px 22px', background: 'rgba(10,37,64,0.9)', backdropFilter: 'blur(8px)',
          borderRadius: '10px', border: '1px solid rgba(0,191,255,0.3)', color: '#fff',
          fontSize: '0.85rem', fontWeight: 600, fontFamily: '"Segoe UI", system-ui, sans-serif',
          opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none', textAlign: 'center',
        }}
      />
      <div style={{
        position: 'absolute', top: '12px', right: '16px', fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.35)', fontFamily: '"Segoe UI", system-ui, sans-serif', pointerEvents: 'none',
      }}>
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
