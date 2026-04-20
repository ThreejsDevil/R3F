import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface TelescopeProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  onTelescopeClick: () => void
}

export function Telescope({ position, rotation, onTelescopeClick }: TelescopeProps) {
  const { scene } = useGLTF('/models/telescope.glb')
  const groupRef = useRef<THREE.Group>(null)

  // Gentle floating/rotating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime()
      // Oscillate slightly
      groupRef.current.rotation.y = (rotation?.[1] || 0) + Math.sin(t * 0.5) * 0.1
      groupRef.current.position.y = position[1] + Math.sin(t) * 0.1
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
      scale={[0.02, 0.02, 0.02]}
      onClick={(e) => {
        e.stopPropagation() // Prevent clicking things behind it
        onTelescopeClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/telescope.glb')
