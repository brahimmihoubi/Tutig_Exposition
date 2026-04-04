import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VisualProps {
  className?: string;
}

export function FundamentalsVisual({ className }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00D4AA, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}

export function TechnologiesVisual({ className }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const nodeGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const nodeMat = new THREE.MeshPhongMaterial({ color: 0x0A2540 });
    
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.set(Math.cos(i * Math.PI * 2 / 5), Math.sin(i * Math.PI * 2 / 5), 0);
      group.add(node);
      nodes.push(node);
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0x00D4AA, transparent: true, opacity: 0.5 });
    nodes.forEach((n1, i) => {
      nodes.forEach((n2, j) => {
        if (i < j) {
          const geometry = new THREE.BufferGeometry().setFromPoints([n1.position, n2.position]);
          const line = new THREE.Line(geometry, lineMat);
          group.add(line);
        }
      });
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    camera.position.z = 2.5;

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.z += 0.005;
      group.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}

export function StrategyVisual({ className }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const stepGeom = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
    const stepMat = new THREE.MeshPhongMaterial({ color: 0x00D4AA });
    
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(stepGeom, stepMat);
      step.position.y = i * 0.5 - 0.5;
      step.rotation.x = Math.PI / 2;
      group.add(step);
    }

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.02;
      group.children.forEach((child, i) => {
        child.position.y = (i * 0.5 - 0.5) + Math.sin(Date.now() * 0.002 + i) * 0.1;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}

export function FutureVisual({ className }: VisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    containerRef.current.appendChild(renderer.domElement);

    const particlesGeom = new THREE.BufferGeometry();
    const count = 100;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2;
    }
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMat = new THREE.PointsMaterial({ color: 0x00D4AA, size: 0.05 });
    const points = new THREE.Points(particlesGeom, particlesMat);
    scene.add(points);

    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.01;
      points.rotation.x += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
