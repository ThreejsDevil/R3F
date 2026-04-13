import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars as DreiStars } from '@react-three/drei';

const Stars: React.FC<{ phase: string }> = ({ phase }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Warp speed particles
  const particlesCount = 1000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < particlesCount; i++) {
        const x = (Math.random() - 0.5) * 40;
        const y = (Math.random() - 0.5) * 40;
        const z = -Math.random() * 100;
        list.push({ x, y, z, speed: Math.random() * 0.5 + 0.1 });
    }
    return list;
  }, []);

  useFrame(() => {
    if (phase === 'traveling' && meshRef.current) {
        particles.forEach((p, i) => {
            p.z += p.speed * 8; // move towards camera
            if (p.z > 5) p.z = -100;
            dummy.position.set(p.x, p.y, p.z);
            // stretch along z
            dummy.scale.set(0.05, 0.05, 2);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <DreiStars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {phase === 'traveling' && (
        <instancedMesh ref={meshRef} args={[undefined, undefined, particlesCount]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </instancedMesh>
      )}
    </>
  );
};

export default Stars;
