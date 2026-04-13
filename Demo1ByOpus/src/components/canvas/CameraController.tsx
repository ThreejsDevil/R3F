import { useRef, useEffect, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore'
import gsap from 'gsap'
import * as THREE from 'three'

const DASHBOARD_CAM_POS = new THREE.Vector3(0, 7, 10)
const DASHBOARD_CAM_LOOK = new THREE.Vector3(0, 0, 0)
const SPACE_CAM_POS = new THREE.Vector3(0, 5, 25)
const SPACE_CAM_LOOK = new THREE.Vector3(0, 0, 0)

export default function CameraController() {
  const { camera } = useThree()
  const currentScene = useStore((s) => s.currentScene)
  const telescopePosition = useStore((s) => s.telescopePosition)
  const completeTransition = useStore((s) => s.completeTransition)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const lookAtTarget = useRef(new THREE.Vector3())
  const isAnimating = useRef(false)

  // Initialize camera
  useEffect(() => {
    camera.position.copy(DASHBOARD_CAM_POS)
    lookAtTarget.current.copy(DASHBOARD_CAM_LOOK)
    camera.lookAt(lookAtTarget.current)
  }, [camera])

  // Handle transition animation
  useEffect(() => {
    if (currentScene === 'TRANSITIONING') {
      isAnimating.current = true

      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill()
      }

      const tl = gsap.timeline({
        onComplete: () => {
          // Reset camera to space position
          camera.position.copy(SPACE_CAM_POS)
          lookAtTarget.current.copy(SPACE_CAM_LOOK)
          camera.lookAt(lookAtTarget.current)

          // Reset FOV
          if ((camera as THREE.PerspectiveCamera).fov !== undefined) {
            ;(camera as THREE.PerspectiveCamera).fov = 60
            ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
          }

          isAnimating.current = false
          completeTransition()
        },
      })

      const perspCam = camera as THREE.PerspectiveCamera

      // Phase 1: Accelerate toward telescope (0 → 1.2s)
      tl.to(
        camera.position,
        {
          x: telescopePosition[0],
          y: telescopePosition[1],
          z: telescopePosition[2],
          duration: 1.2,
          ease: 'power2.in',
        },
        0
      )

      // Look at telescope lens
      tl.to(
        lookAtTarget.current,
        {
          x: telescopePosition[0],
          y: telescopePosition[1],
          z: telescopePosition[2] - 2,
          duration: 1.0,
          ease: 'power2.in',
        },
        0
      )

      // Phase 2: FOV warp effect (0.8 → 1.5s)
      tl.to(
        { fov: perspCam.fov },
        {
          fov: 5,
          duration: 0.7,
          ease: 'power3.in',
          onUpdate: function () {
            perspCam.fov = this.targets()[0].fov
            perspCam.updateProjectionMatrix()
          },
        },
        0.8
      )

      // Phase 3: Brief pause in darkness (1.5 → 2.0s)
      // The transition overlay in the UI handles the black screen

      timelineRef.current = tl
    }

    if (currentScene === 'DASHBOARD') {
      isAnimating.current = true

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false
        },
      })

      const perspCam = camera as THREE.PerspectiveCamera

      // Restore FOV
      tl.to(
        { fov: perspCam.fov },
        {
          fov: 60,
          duration: 1.0,
          ease: 'power2.out',
          onUpdate: function () {
            perspCam.fov = this.targets()[0].fov
            perspCam.updateProjectionMatrix()
          },
        },
        0
      )

      // Move camera back
      tl.to(
        camera.position,
        {
          x: DASHBOARD_CAM_POS.x,
          y: DASHBOARD_CAM_POS.y,
          z: DASHBOARD_CAM_POS.z,
          duration: 1.5,
          ease: 'power2.out',
        },
        0
      )

      tl.to(
        lookAtTarget.current,
        {
          x: DASHBOARD_CAM_LOOK.x,
          y: DASHBOARD_CAM_LOOK.y,
          z: DASHBOARD_CAM_LOOK.z,
          duration: 1.5,
          ease: 'power2.out',
        },
        0
      )

      timelineRef.current = tl
    }
  }, [currentScene, camera, telescopePosition, completeTransition])

  // Update camera lookAt every frame during animations
  useFrame(() => {
    if (isAnimating.current) {
      camera.lookAt(lookAtTarget.current)
    }

    // Gentle idle sway in space scene (Disabled as OrbitControls overrides this now)
    // if (currentScene === 'SPACE' && !isAnimating.current) {
    //   const t = performance.now() * 0.0001
    //   camera.position.x = SPACE_CAM_POS.x + Math.sin(t * 2) * 0.5
    //   camera.position.y = SPACE_CAM_POS.y + Math.cos(t * 1.5) * 0.3
    //   camera.lookAt(SPACE_CAM_LOOK)
    // }
  })

  return null
}
