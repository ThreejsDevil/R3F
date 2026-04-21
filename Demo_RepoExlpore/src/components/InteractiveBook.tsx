import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

interface InteractiveBookProps {
  onBookClick?: (position: THREE.Vector3, isOpen: boolean) => void
}

export function InteractiveBook({ onBookClick }: InteractiveBookProps) {
  const { scene, animations } = useGLTF('/models/book_animated_book__historical_book.glb')
  const groupRef = useRef<THREE.Group>(null)
  const { actions, names } = useAnimations(animations, groupRef)

  const [isOpen, setIsOpen] = useState(false)
  const animProgress = useRef(0)

  // Local static quaternions to avoid recreating them on every frame
  // closed: tilted to show cover nicely from front
  const closedQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.2, 0.4, 0))
  // opened: facing camera directly to read pages
  const openedQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, -0.2, 0))

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]]
      action!.clampWhenFinished = true
      action!.loop = THREE.LoopOnce

      if (isOpen) {
        action!.paused = false
        action!.timeScale = 2.5
        action!.play()
      } else {
        // play backwards to close
        action!.paused = false
        action!.timeScale = -2.5
        action!.time = action!.getClip().duration
        action!.play()
      }
    }
  }, [isOpen, actions, names])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    animProgress.current = THREE.MathUtils.lerp(
      animProgress.current,
      isOpen ? 1 : 0,
      delta * 5
    )
    const p = animProgress.current

    // Calculate dimensions relative to the camera
    const cam = state.camera as THREE.PerspectiveCamera
    const distance = 4
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * distance
    const width = height * cam.aspect

    // Position relative to camera frame
    // Tweak to sit "absolutely" on the Neumorphism UI card on the top left
    const closedLocalPos = new THREE.Vector3(-width / 2 + 1.4, height / 2 - 1.2, -distance)
    
    // When opened, book comes fully to the center, much closer to the camera
    const openedLocalPos = new THREE.Vector3(0, -0.2, -2.5)

    const currentLocalPos = new THREE.Vector3().lerpVectors(closedLocalPos, openedLocalPos, p)
    const currentLocalQuat = new THREE.Quaternion().slerpQuaternions(closedQuat, openedQuat, p)

    // Apply transform tied exactly to camera's current matrix
    currentLocalPos.applyMatrix4(cam.matrixWorld)
    groupRef.current.position.copy(currentLocalPos)
    
    groupRef.current.quaternion.copy(cam.quaternion).multiply(currentLocalQuat)
  })

  return (
    <group
      ref={groupRef}
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
