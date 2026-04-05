import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
}

export default function CaseStudiesScene({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    if (container.children.length > 0) return;

    const width = container.clientWidth;
    const height = 500;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight = new THREE.PointLight(0x0ea5e9, 15, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const redLight = new THREE.PointLight(0xff4444, 10, 15);
    redLight.position.set(-5, -5, 5);
    scene.add(redLight);

    const group = new THREE.Group();
    scene.add(group);

    // Globe
    const globeGeom = new THREE.SphereGeometry(4, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({ 
        color: 0x0f172a, 
        metalness: 0.8, 
        roughness: 0.3,
        wireframe: true 
    });
    const globe = new THREE.Mesh(globeGeom, globeMat);
    group.add(globe);

    // Inner glowing core
    const core = new THREE.Mesh(
        new THREE.SphereGeometry(3.8, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.1 })
    );
    group.add(core);

    // Points (AWS Regions / Netflix Nodes)
    const points: THREE.Group[] = [];
    for(let i=0; i<15; i++) {
        const pointGroup = new THREE.Group();
        const phi = Math.acos(-1 + (2 * i) / 15);
        const theta = Math.sqrt(15 * Math.PI) * phi;
        
        const x = 4 * Math.sin(phi) * Math.cos(theta);
        const y = 4 * Math.sin(phi) * Math.sin(theta);
        const z = 4 * Math.cos(phi);
        
        const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 16, 16),
            new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xff4444 : 0x0ea5e9 })
        );
        node.position.set(x, y, z);
        pointGroup.add(node);

        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.MeshBasicMaterial({ color: node.material.color, transparent: true, opacity: 0.3 })
        );
        glow.position.set(x, y, z);
        pointGroup.add(glow);

        group.add(pointGroup);
        points.push(pointGroup);
    }

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / height) * 2 + 1;
    };
    container.addEventListener('mousemove', handleMouseMove);

    let frameId: number;
    const animate = () => {
        group.rotation.y += 0.002;
        group.rotation.y += mouseX * 0.01;
        group.rotation.x += mouseY * 0.01;

        points.forEach((p, i) => {
            const s = 1 + Math.sin(Date.now() * 0.002 + i) * 0.2;
            p.scale.set(s, s, s);
        });

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        renderer.setSize(w, height);
        camera.aspect = w / height;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(frameId);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
    };
  }, []);

  return (
    <div className={`w-full bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden ${className}`}>
        <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
