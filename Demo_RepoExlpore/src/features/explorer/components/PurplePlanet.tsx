import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface PurplePlanetProps {
  position: [number, number, number]
}

export function PurplePlanet({ position }: PurplePlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/purple_planet.glb')

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Rotate slowly on Y-axis
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene} scale={[2, 2, 2]} />
    </group>
  )
}

useGLTF.preload('/models/purple_planet.glb')
