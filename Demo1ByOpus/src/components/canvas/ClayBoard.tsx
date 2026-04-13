import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

interface ClayBoardProps {
  position?: [number, number, number]
  size?: [number, number, number]
}

export default function ClayBoard({
  position = [0, 0, 0],
  size = [12, 0.5, 8],
}: ClayBoardProps) {
  const boardRef = useRef<THREE.Mesh>(null)



  const clayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#EDD9C0'),
        roughness: 0.92,
        metalness: 0.05,
        envMapIntensity: 0.3,
      }),
    []
  )

  return (
    <group position={position}>
      {/* Main Board */}
      <RoundedBox
        ref={boardRef}
        args={size}
        radius={0.4}
        smoothness={6}
        material={clayMaterial}
        castShadow
        receiveShadow
      />

      {/* Contact Shadow below board */}
      <ContactShadows
        position={[0, -size[1] / 2 - 0.01, 0]}
        opacity={0.35}
        scale={16}
        blur={2.5}
        far={4}
        color="#8B7355"
      />
    </group>
  )
}
