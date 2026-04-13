import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ContributionDay } from '../../store/useStore'

// Contribution level → color
const LEVEL_COLORS = [
  new THREE.Color('#2d1f0e'), // 0 - no contribution (dry earth)
  new THREE.Color('#4a7c3f'), // 1 - low
  new THREE.Color('#5ca64c'), // 2 - medium
  new THREE.Color('#73d056'), // 3 - high
  new THREE.Color('#8aff6a'), // 4 - very high
]

interface GrassProps {
  contributions: ContributionDay[][]
  position?: [number, number, number]
  blockSize?: number
  gap?: number
}

export default function Grass({
  contributions,
  position = [0, 0, 0],
  blockSize = 0.1,
  gap = 0.02,
}: GrassProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  const cols = contributions.length // ~52 weeks
  const rows = 7  // days per week

  const count = cols * rows

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWindStrength: { value: 0.03 },
    }),
    []
  )

  // Grass blade geometry - taller for higher contributions
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(blockSize, blockSize * 2, blockSize)
    // Shift pivot to bottom so it grows from the board surface
    geo.translate(0, blockSize, 0)
    return geo
  }, [blockSize])

  // Set instance matrices and colors
  useEffect(() => {
    if (!meshRef.current) return

    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const totalWidth = cols * (blockSize + gap)
    const totalDepth = rows * (blockSize + gap)
    const offsetX = -totalWidth / 2
    const offsetZ = -totalDepth / 2

    let idx = 0
    for (let week = 0; week < cols; week++) {
      for (let day = 0; day < rows; day++) {
        const contribution = contributions[week]?.[day]
        const level = contribution?.level ?? 0

        // Height based on contribution level
        const heightScale = level === 0 ? 0.3 : 0.5 + level * 0.35

        const x = offsetX + week * (blockSize + gap)
        const z = offsetZ + day * (blockSize + gap)

        dummy.position.set(x, 0, z)
        dummy.scale.set(1, heightScale, 1)
        dummy.updateMatrix()

        meshRef.current.setMatrixAt(idx, dummy.matrix)
        meshRef.current.setColorAt(idx, color.copy(LEVEL_COLORS[level]))

        idx++
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  }, [contributions, cols, rows, blockSize, gap])

  // Animate time uniform
  useFrame((state) => {
    if (materialRef.current && (materialRef.current as any).userData?.shader) {
      ;(materialRef.current as any).userData.shader.uniforms.uTime.value =
        state.clock.elapsedTime
    }
  })

  return (
    <group position={position}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, undefined, count]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          ref={materialRef}
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = uniforms.uTime
            shader.uniforms.uWindStrength = uniforms.uWindStrength

            // Inject uniforms
            shader.vertexShader = `
              uniform float uTime;
              uniform float uWindStrength;
            ` + shader.vertexShader

            // Inject vertex shader: wind sway only at top of grass
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              /* glsl */ `
              vec3 transformed = vec3(position);

              // Use instance position for variation
              vec4 instancePos = instanceMatrix[3];
              float phase = instancePos.x * 3.7 + instancePos.z * 2.3;

              // Wind displacement - only affects top vertices (uv.y > 0.5)
              float windX = sin(uTime * 1.8 + phase) * uWindStrength * uv.y * uv.y;
              float windZ = cos(uTime * 1.4 + phase * 0.7) * uWindStrength * 0.5 * uv.y * uv.y;

              transformed.x += windX;
              transformed.z += windZ;
              `
            )

            // Store shader reference for uniform updates
            ;(materialRef.current as any).userData = {
              ...(materialRef.current as any).userData,
              shader,
            }
          }}
        />
      </instancedMesh>
    </group>
  )
}
