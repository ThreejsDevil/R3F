import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

import PlanetGrass from './PlanetGrass';

interface PlanetProps {
  position: [number, number, number];
  repo: any;
  color: string;
  delay: number;
  isVisible: boolean;
}

const Planet: React.FC<PlanetProps> = ({ position, repo, color, delay, isVisible }) => {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (isVisible && meshRef.current) {
      // Spring animation for entrance
      gsap.fromTo(meshRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { 
          x: 1, y: 1, z: 1, 
          duration: 1.5, 
          delay: delay, 
          ease: "elastic.out(1, 0.4)" 
        }
      );
    }
  }, [isVisible, delay]);

  // Subtle rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
    
    // Animate glow/emissive on hover
    if (materialRef.current) {
      const targetIntensity = hovered ? 0.8 : 0.2;
      materialRef.current.emissiveIntensity += (targetIntensity - materialRef.current.emissiveIntensity) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group 
          ref={meshRef} 
          scale={[0, 0, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
          onClick={(e) => {
             e.stopPropagation();
             window.open(repo.html_url, '_blank');
          }}
        >
          {/* Main Planet Sphere */}
          <mesh castShadow receiveShadow>
            {/* Small planet radius */}
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              ref={materialRef}
              color={color} 
              roughness={0.6}
              metalness={0.3}
              emissive={color}
              emissiveIntensity={0.2}
              toneMapped={false}
            />
          </mesh>

          {/* Grass mapping to stars/contributions */}
          <PlanetGrass count={Math.min(repo.stargazers_count * 10 + 50, 400)} />

          {/* Simple Craters / Decor */}
          <mesh position={[0.6, 0.6, 0.6]} rotation={[Math.PI/4, 0, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[-0.8, -0.4, 0.2]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>

          {/* Typography for Repository Name & Tech Stack */}
          {isVisible && (
             <Billboard position={[0, 2, 0]}>
               <Text
                 fontSize={0.4}
                 color="#ffffff"
                 anchorX="center"
                 anchorY="middle"
                 letterSpacing={0.05}
                 outlineWidth={0.02}
                 outlineColor="#000000"
               >
                 {repo.name}
               </Text>
               <Text
                 position={[0, -0.35, 0]}
                 fontSize={0.2}
                 color="rgba(255,255,255,0.8)"
                 anchorX="center"
                 anchorY="middle"
                 outlineWidth={0.01}
                 outlineColor="#000000"
               >
                 {repo.language || 'Code'} • ★ {repo.stargazers_count}
               </Text>
             </Billboard>
          )}
        </group>
      </Float>
    </group>
  );
};

export default Planet;
