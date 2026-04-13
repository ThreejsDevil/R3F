import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import Grass from './Grass';
import * as THREE from 'three';

const Stage: React.FC = () => {
  const { setCameraPhase } = useStore();
  const telescopeRef = useRef<THREE.Group>(null);
  
  // Subtle hovering animation for the telescope
  useFrame((state) => {
    if (telescopeRef.current) {
        telescopeRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05 + 0.3;
    }
  });

  return (
    <group>
      {/* Asteroid Surface / Clay Ground */}
      <mesh receiveShadow position={[0, -4.5, 0]}>
        <sphereGeometry args={[4.5, 64, 64]} />
        <meshStandardMaterial 
          color="#d2a679" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <Grass />

      {/* Abstract Astronaut (Simple forms to keep it minimal) */}
      <group position={[-1.5, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.4, 4, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0.65, 0.15]} castShadow>
          <boxGeometry args={[0.25, 0.2, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>

      {/* Telescope - The Gateway */}
      <group 
        ref={telescopeRef}
        position={[0, 0.3, -1]} 
        rotation={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setCameraPhase('traveling');
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        {/* Stand */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.1, 0.6]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Telescope Tube */}
        <mesh position={[0, 0.2, 0.2]} rotation={[Math.PI / 6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 1.2]} />
          <meshStandardMaterial color="#e6e6e6" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Lens Area */}
        <mesh position={[0, 0.5, 0.7]} rotation={[Math.PI / 6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.1]} />
          <meshStandardMaterial color="#44bcff" emissive="#44bcff" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

export default Stage;
