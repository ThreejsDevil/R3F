import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarsProps {
  count?: number
  radius?: number
}

export default function Stars({ count = 3000, radius = 80 }: StarsProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute on a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * (0.5 + Math.random() * 0.5)

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)

      sz[i] = Math.random() * 0.5 + 0.1
    }

    return { positions: pos, sizes: sz }
  }, [count, radius])

  // Gentle rotation for parallax effect
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f0f0ff"
        size={0.15}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
