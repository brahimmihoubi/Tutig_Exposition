import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create a group to represent a "virtualized stack"
    const group = new THREE.Group();
    scene.add(group);

    // Create layers (representing virtualization layers)
    const geometry = new THREE.BoxGeometry(2, 0.1, 2);
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x0A2540, transparent: true, opacity: 0.8 }), // Hardware
      new THREE.MeshPhongMaterial({ color: 0x00D4AA, transparent: true, opacity: 0.8 }), // Hypervisor
      new THREE.MeshPhongMaterial({ color: 0x64748B, transparent: true, opacity: 0.8 }), // VM 1
      new THREE.MeshPhongMaterial({ color: 0x00D4AA, transparent: true, opacity: 0.8 }), // VM 2
    ];

    materials.forEach((material, i) => {
      const layer = new THREE.Mesh(geometry, material);
      layer.position.y = i * 0.4 - 0.6;
      group.add(layer);
    });

    // Add some "nodes" floating around
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00D4AA });
    
    for (let i = 0; i < 20; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      scene.add(node);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      group.rotation.x += 0.005;
      
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
          child.position.y += Math.sin(Date.now() * 0.001 + child.position.x) * 0.002;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[400px] md:h-[600px] bg-neutral-bg rounded-2xl overflow-hidden shadow-inner border border-slate-200" />
  );
}
