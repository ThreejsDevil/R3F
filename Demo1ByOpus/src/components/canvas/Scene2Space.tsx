import { useMemo } from 'react'
import Planet from './Planet'
import OrbitParticles from './OrbitParticles'
import Stars from './Stars'
import { useStore } from '../../store/useStore'
import { getLanguageColor } from '../../constants/languageColors'
import { Html } from '@react-three/drei'

// Arrange planets in a spiral galaxy layout
function calcPosition(index: number, total: number): [number, number, number] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const angle = index * goldenAngle
  const radiusBase = 3 + index * 1.8
  const y = (Math.random() - 0.5) * 2

  return [
    Math.cos(angle) * radiusBase,
    y,
    Math.sin(angle) * radiusBase,
  ]
}

export default function Scene2Space() {
  const githubData = useStore((s) => s.githubData)

  const planets = useMemo(() => {
    if (!githubData) return []
    return githubData.repos.map((repo, i) => ({
      repo,
      position: calcPosition(i, githubData.repos.length),
    }))
  }, [githubData])

  return (
    <group>

      {/* Nebula ambient light */}
      <ambientLight intensity={0.15} color="#1a1a2e" />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#6b4fa0" distance={60} />
      <pointLight position={[-15, -5, 10]} intensity={0.4} color="#1e40af" distance={40} />
      <pointLight position={[15, 5, -10]} intensity={0.3} color="#c026d3" distance={40} />

      {/* Planets with orbit particles */}
      {planets.map(({ repo, position }, i) => {
        const planetRadius = Math.max(0.4, Math.log(repo.stargazers_count + 1) * 0.25)
        const orbitRadius = planetRadius + 0.8 + Math.random() * 0.3
        const particleCount = Math.min(120, Math.max(20, Math.floor(repo.commits / 10)))

        return (
          <group key={repo.name}>
            <Planet repo={repo} position={position} index={i} />
            <OrbitParticles
              center={position}
              radius={orbitRadius}
              count={particleCount}
              color={getLanguageColor(repo.language)}
              speed={0.2 + (i % 3) * 0.1}
            />

            {/* Planet name label floating above */}
            <Html
              position={[position[0], position[1] + planetRadius + 0.6, position[2]]}
              center
              distanceFactor={15}
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '600',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                pointerEvents: 'none',
                textShadow: '0 0 10px rgba(100,100,255,0.3)',
              }}
            >
              {repo.name}
            </Html>
          </group>
        )
      })}

      {/* Central sun / star */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#fff5e0" transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2} color="#fff5e0" distance={50} />

      {/* Sun glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffd080"
          transparent
          opacity={0.08}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
