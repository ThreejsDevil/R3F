import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { RepoData } from '../hooks/useGithubData'

interface RepoPlanetProps {
  repo: RepoData;
  position: [number, number, number];
  onClick?: (pos: THREE.Vector3, repo: RepoData) => void;
}

// Sub-component for individual Planet's Asteroid Belt
function PlanetAsteroidBelt({ count, radius }: { count: number; radius: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { scene } = useGLTF('/models/asteroids_pack_rocky_version.glb')
  
  const { geometry, material } = useMemo(() => {
    let geo = null
    let mat = null
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = (child as THREE.Mesh).geometry
        mat = (child as THREE.Mesh).material
      }
    })
    return { geometry: geo, material: mat }
  }, [scene])

  useEffect(() => {
    if (!meshRef.current || !geometry) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const r = radius + (Math.random() - 0.5) * 4
      const y = (Math.random() - 0.5) * 0.5
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r)
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      const scale = 0.03 + Math.random() * 0.05
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, radius, geometry])

  if (!geometry) return null

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />
  )
}

function Comet({ radius, speed, offsetAngle }: { radius: number; speed: number; offsetAngle: number }) {
  const { scene } = useGLTF('/models/3iatlas_-_blue_kachina_comet_tribute_edited.glb')
  const cometRef = useRef<THREE.Group>(null)
  const clonedScene = useMemo(() => scene.clone(), [scene])

  useFrame((state) => {
    if (!cometRef.current) return
    const time = state.clock.getElapsedTime()
    const angle = time * speed + offsetAngle
    cometRef.current.position.x = Math.cos(angle) * radius
    cometRef.current.position.z = Math.sin(angle) * radius
    cometRef.current.rotation.y = -angle + Math.PI
  })

  return (
    <group ref={cometRef}>
      <primitive object={clonedScene} scale={0.01} />
    </group>
  )
}

export function RepoPlanet({ repo, position, onClick }: RepoPlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene: planetScene } = useGLTF('/models/purple_planet.glb')
  
  // 1. Planet Scale (Stars + Forks)
  const totalPopularity = repo.stargazers_count + repo.forks_count
  const baseScale = 0.5 // purple_planet.glb is likely large
  const planetScale = baseScale + (totalPopularity / 500000)

  // 2. Asteroid Count (Commits) - SIGNIFICANTLY REDUCED
  // Map commits to number of asteroids, max 40
  const asteroidCount = Math.min(Math.max(Math.ceil(repo.commits_count / 1000), 10), 40)
  const beltRadius = 6

  // 3. Comets (Open issues)
  const cometCount = Math.min(Math.max(Math.ceil(repo.open_issues_count / 1000), 1), 3)
  const comets = useMemo(() => Array.from({ length: cometCount }).map((_, i) => ({
    radius: beltRadius + 3 + Math.random() * 2,
    speed: 0.1 + Math.random() * 0.15,
    offset: (i / cometCount) * Math.PI * 2,
  })), [cometCount, beltRadius])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group 
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick && groupRef.current) {
          const pos = new THREE.Vector3()
          groupRef.current.getWorldPosition(pos)
          onClick(pos, repo)
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
      <group ref={groupRef}>
        {/* Using the original purple planet model instead of Sphere */}
        <primitive object={planetScene} scale={[planetScale, planetScale, planetScale]} />
        
        <PlanetAsteroidBelt count={asteroidCount} radius={beltRadius} />

        {comets.map((c, i) => (
          <Comet key={i} radius={c.radius} speed={c.speed} offsetAngle={c.offset} />
        ))}
      </group>
      
      <Text 
        position={[0, 4, 0]} 
        fontSize={0.6} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000"
      >
        {repo.name}
      </Text>
    </group>
  )
}

useGLTF.preload('/models/3iatlas_-_blue_kachina_comet_tribute_edited.glb')
useGLTF.preload('/models/asteroids_pack_rocky_version.glb')
useGLTF.preload('/models/purple_planet.glb')
