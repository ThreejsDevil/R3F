import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

interface TelescopeProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export default function Telescope({
  position = [3.5, 0.25, -2],
  rotation = [0, -0.4, 0],
}: TelescopeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const lensRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const triggerTransition = useStore((s) => s.triggerTransition)
  const currentScene = useStore((s) => s.currentScene)
  const setTelescopePosition = useStore((s) => s.setTelescopePosition)

  const handleClick = useCallback(() => {
    if (currentScene !== 'DASHBOARD' || !lensRef.current) return

    // Calculate world position of the specific lens tip mesh
    const lensWorldPos = new THREE.Vector3()
    lensRef.current.getWorldPosition(lensWorldPos)

    const lookAt: [number, number, number] = [
      lensWorldPos.x,
      lensWorldPos.y,
      lensWorldPos.z - 2,
    ]

    setTelescopePosition(
      [lensWorldPos.x, lensWorldPos.y, lensWorldPos.z],
      lookAt
    )
    triggerTransition()
  }, [currentScene, triggerTransition, setTelescopePosition])

  // Hover glow effect
  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.05 : 1.0
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })

  // Materials
  const brassMat = new THREE.MeshStandardMaterial({
    color: '#C8A560',
    roughness: 0.3,
    metalness: 0.8,
  })

  const darkMat = new THREE.MeshStandardMaterial({
    color: '#2a1f14',
    roughness: 0.6,
    metalness: 0.3,
  })

  const lensMat = new THREE.MeshStandardMaterial({
    color: '#88ccff',
    roughness: 0.1,
    metalness: 0.9,
    emissive: hovered ? '#4488cc' : '#223344',
    emissiveIntensity: hovered ? 0.8 : 0.2,
  })

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Invisible Interactive Hitbox to catch clicks reliably */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2.5, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Tripod Legs */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.35,
            0.45,
            Math.cos(angle) * 0.35,
          ]}
          rotation={[
            Math.cos(angle) * 0.5,
            0,
            -Math.sin(angle) * 0.5,
          ]}
          material={darkMat}
        >
          <cylinderGeometry args={[0.02, 0.03, 1, 8]} />
        </mesh>
      ))}

      {/* Tripod Hub */}
      <mesh position={[0, 0.95, 0]} material={brassMat}>
        <sphereGeometry args={[0.08, 12, 12]} />
      </mesh>

      {/* Telescope Barrel */}
      <group position={[0, 1.0, 0]} rotation={[0.3, 0, 0]}>
        <mesh material={brassMat} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.9, 16]} />
        </mesh>

        {/* Lens Hood */}
        <mesh position={[0, 0.5, 0]} material={brassMat}>
          <cylinderGeometry args={[0.1, 0.07, 0.15, 16]} />
        </mesh>

        {/* Lens */}
        <mesh ref={lensRef} position={[0, 0.58, 0]} rotation={[-Math.PI / 2, 0, 0]} material={lensMat}>
          <circleGeometry args={[0.09, 24]} />
        </mesh>

        {/* Eyepiece */}
        <mesh position={[0, -0.5, 0]} material={darkMat}>
          <cylinderGeometry args={[0.04, 0.05, 0.12, 12]} />
        </mesh>

        {/* Glow ring when hovered - attached properly inside barrel group */}
        {hovered && (
          <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.015, 8, 32]} />
            <meshBasicMaterial color="#88ccff" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    </group>
  )
}
