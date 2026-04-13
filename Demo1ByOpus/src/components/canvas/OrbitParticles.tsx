import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitParticlesProps {
  center: [number, number, number]
  radius: number
  count: number
  color: string
  speed?: number
}

export default function OrbitParticles({
  center,
  radius,
  count,
  color,
  speed = 0.3,
}: OrbitParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, angles } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ang = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * radius * 0.15
      const yOffset = (Math.random() - 0.5) * 0.15

      pos[i * 3] = Math.cos(angle) * r
      pos[i * 3 + 1] = yOffset
      pos[i * 3 + 2] = Math.sin(angle) * r

      ang[i] = angle
    }

    return { positions: pos, angles: ang }
  }, [count, radius])

  useFrame((state) => {
    if (!pointsRef.current) return

    const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
    const t = state.clock.elapsedTime * speed

    for (let i = 0; i < count; i++) {
      const angle = angles[i] + t
      const r = radius + (Math.sin(angle * 3 + t) * radius * 0.05)

      posAttr.setX(i, Math.cos(angle) * r)
      posAttr.setZ(i, Math.sin(angle) * r)
    }

    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={center}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.06}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
