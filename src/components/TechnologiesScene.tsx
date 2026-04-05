import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

function buildServerTower(
  group: THREE.Group,
  pos: THREE.Vector3,
  topCubeColors: number[],
  insideCubeColor: number | null,
  ledColor: number
) {
  const serverGroup = new THREE.Group();
  serverGroup.position.copy(pos);

  const cW = 2.6, cH = 3.8, cD = 2.2;

  // Main case body
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3d4555, metalness: 0.6, roughness: 0.35 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(cW, cH, cD), bodyMat);
  body.castShadow = true;
  serverGroup.add(body);

  // Top cap
  const topCap = new THREE.Mesh(
    new THREE.BoxGeometry(cW + 0.06, 0.16, cD + 0.06),
    new THREE.MeshStandardMaterial({ color: 0x5a6577, metalness: 0.45, roughness: 0.4 })
  );
  topCap.position.y = cH / 2 + 0.08;
  serverGroup.add(topCap);

  // Bottom base
  const baseCap = new THREE.Mesh(
    new THREE.BoxGeometry(cW + 0.06, 0.16, cD + 0.06),
    new THREE.MeshStandardMaterial({ color: 0x3a4050, metalness: 0.5, roughness: 0.4 })
  );
  baseCap.position.y = -cH / 2 - 0.08;
  serverGroup.add(baseCap);

  // Front panel
  const frontPanel = new THREE.Mesh(
    new THREE.BoxGeometry(cW - 0.1, cH - 0.2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.35, roughness: 0.5 })
  );
  frontPanel.position.z = cD / 2 + 0.03;
  serverGroup.add(frontPanel);

  // Window recess
  const winW = 1.7, winH = 1.8;
  const recess = new THREE.Mesh(
    new THREE.BoxGeometry(winW + 0.1, winH + 0.1, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x151d2d, metalness: 0.2, roughness: 0.8 })
  );
  recess.position.set(0, 0.2, cD / 2 + 0.02);
  serverGroup.add(recess);

  // Glass window
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(winW, winH, 0.04),
    new THREE.MeshPhysicalMaterial({ color: 0x1a2538, transparent: true, opacity: 0.4, roughness: 0.05, side: THREE.DoubleSide })
  );
  glass.position.set(0, 0.2, cD / 2 + 0.08);
  serverGroup.add(glass);

  // Silver window frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.7, roughness: 0.25 });
  const ft = 0.06;
  const makeBar = (w: number, h: number, x: number, y: number, z: number) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), frameMat);
    bar.position.set(x, y, z);
    return bar;
  };
  serverGroup.add(makeBar(winW + 0.14, ft, 0, 0.2 + winH / 2 + ft / 2, cD / 2 + 0.08));
  serverGroup.add(makeBar(winW + 0.14, ft, 0, 0.2 - winH / 2 - ft / 2, cD / 2 + 0.08));
  serverGroup.add(makeBar(ft, winH + 0.14, -winW / 2 - ft / 2, 0.2, cD / 2 + 0.08));
  serverGroup.add(makeBar(ft, winH + 0.14, winW / 2 + ft / 2, 0.2, cD / 2 + 0.08));

  // Drive bay slots
  for (let d = 0; d < 3; d++) {
    const slot = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.06, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x6b7b8a, metalness: 0.5, roughness: 0.4 })
    );
    slot.position.set(0, -0.8 - d * 0.22, cD / 2 + 0.08);
    serverGroup.add(slot);
  }

  // LEDs
  const ledPositions = [-0.4, -0.1, 0.2];
  const leds: THREE.Mesh[] = [];
  ledPositions.forEach((lx) => {
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 10, 10),
      new THREE.MeshStandardMaterial({ color: ledColor, emissive: ledColor, emissiveIntensity: 1.0 })
    );
    led.position.set(lx, -cH / 2 + 0.25, cD / 2 + 0.12);
    serverGroup.add(led);
    leds.push(led);
  });

  // Inside cube (visible through glass)
  let insideMesh: THREE.Mesh | null = null;
  if (insideCubeColor !== null) {
    insideMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.65),
      new THREE.MeshStandardMaterial({ color: insideCubeColor, emissive: insideCubeColor, emissiveIntensity: 0.7, metalness: 0.2, roughness: 0.15 })
    );
    insideMesh.position.set(0, 0.2, 0);
    serverGroup.add(insideMesh);

    // Glow
    const insideGlow = new THREE.PointLight(insideCubeColor, 2, 4);
    insideGlow.position.set(0, 0.2, 0);
    serverGroup.add(insideGlow);
  }

  // Top cubes (VMs sitting on top of server)
  const topCubeMeshes: THREE.Mesh[] = [];
  topCubeColors.forEach((color, i) => {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, metalness: 0.2, roughness: 0.2 })
    );
    const xOff = (i - (topCubeColors.length - 1) / 2) * 0.85;
    cube.position.set(xOff, cH / 2 + 0.5, 0);
    cube.castShadow = true;
    serverGroup.add(cube);
    topCubeMeshes.push(cube);
  });

  group.add(serverGroup);
  return { serverGroup, topCubeMeshes, insideMesh, leds };
}

export default function TechnologiesScene({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
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
    scene.fog = new THREE.Fog('#080c18', 15, 40);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5, 18);
    camera.lookAt(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0x0a1a3a, 2.0));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueSpot = new THREE.SpotLight(0x0088ff, 60, 30, Math.PI/4, 0.5, 2);
    blueSpot.position.set(0, 15, 5);
    scene.add(blueSpot);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: 0x050810, metalness: 0.9, roughness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Build 3 Server Towers
    const s1 = buildServerTower(mainGroup, new THREE.Vector3(-5.5, 0, 0), [0x3b82f6, 0xfbbf24], 0x22d3ee, 0x3b82f6);
    const s2 = buildServerTower(mainGroup, new THREE.Vector3(0, 0, 0), [0xef4444, 0xfbbf24], 0xef4444, 0xf97316);
    const s3 = buildServerTower(mainGroup, new THREE.Vector3(5.5, 0, 0), [0x3b82f6, 0xfbbf24, 0x22c55e], 0x22c55e, 0x22c55e);

    // Blue horizontal connection beams between servers
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.6 });
    const beamYPositions = [-0.5, 0.5];
    beamYPositions.forEach(by => {
      // Beam S1 → S2
      const beam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 5.5), beamMat);
      beam1.rotation.z = Math.PI / 2;
      beam1.position.set(-2.75, by, 1.2);
      mainGroup.add(beam1);

      // Beam S2 → S3
      const beam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 5.5), beamMat);
      beam2.rotation.z = Math.PI / 2;
      beam2.position.set(2.75, by, 1.2);
      mainGroup.add(beam2);
    });

    // Beam glow particles traveling along beams
    const beamParticles: { mesh: THREE.Mesh; startX: number; endX: number; y: number; speed: number; t: number }[] = [];
    beamYPositions.forEach(by => {
      for (let p = 0; p < 3; p++) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x00ccff })
        );
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
        );
        particle.add(glow);
        particle.position.set(-5.5, by, 1.2);
        mainGroup.add(particle);
        beamParticles.push({ mesh: particle, startX: -5.5, endX: 5.5, y: by, speed: 0.8 + Math.random() * 0.5, t: p * 0.33 });
      }
    });

    // Migration Arrow (orange curved arrow from S2 to S3, above the servers)
    const arrowCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.8, 3.5, 0),
      new THREE.Vector3(2.75, 5.5, 0.5),
      new THREE.Vector3(4.7, 3.5, 0)
    );
    const arrowTube = new THREE.Mesh(
      new THREE.TubeGeometry(arrowCurve, 32, 0.06, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.8 })
    );
    mainGroup.add(arrowTube);

    // Arrow head
    const arrowHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.5, 8),
      new THREE.MeshBasicMaterial({ color: 0xf97316 })
    );
    arrowHead.position.copy(arrowCurve.getPoint(1));
    arrowHead.rotation.z = Math.PI / 2;
    mainGroup.add(arrowHead);

    // Migrating cube (flying along arrow)
    const migCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.55, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.8, metalness: 0.2, roughness: 0.15 })
    );
    const migGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
    );
    migCube.add(migGlow);
    mainGroup.add(migCube);

    // Floor reflections (subtle glow under each server)
    [s1, s2, s3].forEach((s, i) => {
      const colors = [0x3b82f6, 0xef4444, 0x22c55e];
      const glow = new THREE.PointLight(colors[i], 3, 5);
      glow.position.set(s.serverGroup.position.x, -1.8, 1);
      mainGroup.add(glow);
    });

    // Animation
    let time = 0;
    let frameId: number;

    const animate = () => {
      time += 0.016;

      // Slow auto-rotate
      mainGroup.rotation.y = Math.sin(time * 0.15) * 0.15;

      // Top cubes float gently
      [s1, s2, s3].forEach((s) => {
        s.topCubeMeshes.forEach((cube, i) => {
          cube.position.y = 1.9 + 0.5 + Math.sin(time * 1.5 + i * 1.2) * 0.12;
          cube.rotation.y = time * 0.4 + i;
        });
        // Inside cube rotation
        if (s.insideMesh) {
          s.insideMesh.rotation.y = time * 0.5;
          s.insideMesh.rotation.x = Math.sin(time * 0.3) * 0.2;
        }
        // LED blink
        s.leds.forEach((led, i) => {
          const mat = led.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.5 + Math.sin(time * 3 + i * 2) * 0.5;
        });
      });

      // Beam particles
      beamParticles.forEach(p => {
        p.t += p.speed * 0.016;
        if (p.t > 1) p.t = 0;
        p.mesh.position.x = p.startX + (p.endX - p.startX) * p.t;
        p.mesh.position.y = p.y;
        p.mesh.scale.setScalar(0.8 + Math.sin(p.t * Math.PI) * 0.5);
      });

      // Migrating cube along arrow curve
      const migT = (time * 0.3) % 1;
      const migPos = arrowCurve.getPoint(migT);
      migCube.position.copy(migPos);
      migCube.rotation.y = time * 3;
      migCube.rotation.x = time * 1.5;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
