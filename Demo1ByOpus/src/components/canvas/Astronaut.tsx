import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AstronautProps {
  position?: [number, number, number]
}

export default function Astronaut({ position = [-3.5, 0.25, -1.5] }: AstronautProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Idle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.1
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05
      groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.03
    }
  })

  const whiteMat = new THREE.MeshStandardMaterial({
    color: '#e8e4e0',
    roughness: 0.85,
    metalness: 0.05,
  })

  const visorMat = new THREE.MeshStandardMaterial({
    color: '#1a3a5c',
    roughness: 0.1,
    metalness: 0.9,
    emissive: '#0a2040',
    emissiveIntensity: 0.3,
  })

  const detailMat = new THREE.MeshStandardMaterial({
    color: '#b0a090',
    roughness: 0.7,
    metalness: 0.2,
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Helmet */}
      <mesh material={whiteMat} castShadow>
        <sphereGeometry args={[0.3, 20, 20]} />
      </mesh>

      {/* Visor */}
      <mesh position={[0, 0, 0.2]} material={visorMat}>
        <sphereGeometry args={[0.22, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.55, 0]} material={whiteMat} castShadow>
        <capsuleGeometry args={[0.22, 0.35, 8, 16]} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, -0.5, -0.2]} material={detailMat}>
        <boxGeometry args={[0.28, 0.35, 0.12]} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.32, -0.4, 0]} rotation={[0, 0, 0.4]}>
        <mesh material={whiteMat}>
          <capsuleGeometry args={[0.06, 0.25, 6, 10]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.2, 0]} material={detailMat}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.32, -0.4, 0]} rotation={[0, 0, -0.3]}>
        <mesh material={whiteMat}>
          <capsuleGeometry args={[0.06, 0.25, 6, 10]} />
        </mesh>
        {/* Hand (waving) */}
        <mesh position={[0, -0.2, 0]} material={detailMat}>
          <sphereGeometry args={[0.06, 10, 10]} />
        </mesh>
      </group>

      {/* Left Leg */}
      <mesh position={[-0.12, -0.95, 0]} rotation={[0, 0, 0.1]} material={whiteMat}>
        <capsuleGeometry args={[0.07, 0.2, 6, 10]} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.12, -0.95, 0]} rotation={[0, 0, -0.1]} material={whiteMat}>
        <capsuleGeometry args={[0.07, 0.2, 6, 10]} />
      </mesh>

      {/* Left Boot */}
      <mesh position={[-0.12, -1.15, 0.04]} material={detailMat}>
        <boxGeometry args={[0.1, 0.08, 0.14]} />
      </mesh>

      {/* Right Boot */}
      <mesh position={[0.12, -1.15, 0.04]} material={detailMat}>
        <boxGeometry args={[0.1, 0.08, 0.14]} />
      </mesh>
    </group>
  )
}
