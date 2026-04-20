import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

interface InteractiveBookProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  onBookClick?: (position: THREE.Vector3, isOpen: boolean) => void
}

export function InteractiveBook({ position, rotation, onBookClick }: InteractiveBookProps) {
  const { scene, animations } = useGLTF('/models/book_animated_book__historical_book.glb')
  const groupRef = useRef<THREE.Group>(null)
  const { actions, names } = useAnimations(animations, groupRef)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    console.log("Book animations available: ", names)
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]]
      action!.clampWhenFinished = true
      action!.loop = THREE.LoopOnce

      if (isOpen) {
        action!.paused = false
        action!.timeScale = 3
        action!.play()
      } else {
        // play backwards to close
        action!.paused = false
        action!.timeScale = -3
        action!.time = action!.getClip().duration
        action!.play()
      }
    }
  }, [isOpen, actions, names])

  // basic rotation towards camera if no anims
  const baseRotX = rotation?.[0] || 0
  const baseRotY = rotation?.[1] || 0
  const baseRotZ = rotation?.[2] || 0

  const targetRotX = isOpen && names.length === 0 ? baseRotX + Math.PI / 4 : baseRotX
  const targetRotY = isOpen && names.length === 0 ? baseRotY + Math.PI / 8 : baseRotY

  useFrame((_, delta) => {
    if (groupRef.current && names.length === 0) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4)
    }
  })

  return (
    <group
      position={position}
      ref={groupRef}
      rotation={[baseRotX, baseRotY, baseRotZ]}
      onClick={(e) => {
        e.stopPropagation()
        const nextState = !isOpen
        setIsOpen(nextState)

        if (onBookClick && groupRef.current) {
          const worldPos = new THREE.Vector3()
          groupRef.current.getWorldPosition(worldPos)
          onBookClick(worldPos, nextState)
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <primitive object={scene} scale={[1, 1, 1]} />
    </group>
  )
}

useGLTF.preload('/models/book_animated_book__historical_book.glb')
