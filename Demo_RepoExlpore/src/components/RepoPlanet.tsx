import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text, Billboard, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import type { RepoData } from '../hooks/useGithubData'
import { SaturnRing } from './SaturnRingProps'

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

function IssueAsteroids({ count, radius }: { count: number; radius: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/asteroids_pack_rocky_version.glb')

  const { geometry, material } = useMemo(() => {
    let geo = null
    let mat = null
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        geo = (child as THREE.Mesh).geometry
        mat = ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).clone()
        // Make it red emissive
        mat.color = new THREE.Color('#330000')
        mat.emissive = new THREE.Color('#0051ffff')
        mat.emissiveIntensity = 2.0
      }
    })
    return { geometry: geo, material: mat }
  }, [scene])

  useEffect(() => {
    if (!meshRef.current || !geometry) return

    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const r = radius + (Math.random() - 0.5) * 2
      const y = (Math.random() - 0.5) * 2
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r)
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      // smaller than normal asteroids
      const scale = 0.005 + Math.random() * 0.015
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, radius, geometry])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.08 // Rotate slightly differently
      groupRef.current.rotation.x += delta * 0.00 //회전축을 돌리고 싶으면 조정
    }
  })

  if (!geometry) return null

  return (
    <group ref={groupRef}>
      {/* @ts-ignore */}
      <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />
    </group>
  )
}

export function RepoPlanet({ repo, position, onClick }: RepoPlanetProps) {
  const groupRef = useRef<THREE.Group>(null)

  const { scene: planetScene } = useGLTF('/models/purple_planet.glb')
  const clonedPlanetScene = useMemo(() => planetScene.clone(), [planetScene]);

  // Set emissive settings for HDR Bloom
  useEffect(() => {
    if (clonedPlanetScene) {
      clonedPlanetScene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.material) {
            const mat = obj.material.clone()
            if (mat.emissive) {
              if (mat.emissive.getHex() === 0) {
                mat.emissive.copy(mat.color || new THREE.Color(0xffffff))
              }
              mat.emissiveIntensity = 2.0 // Boost for HDR threshold
            }
            obj.material = mat
          }
        }
      });
    }
  }, [clonedPlanetScene]);

  const totalPopularity = repo.stargazers_count + repo.forks_count
  const baseScale = 0.5
  const planetScale = baseScale + (totalPopularity / 500000)

  const asteroidCount = 10//Math.min(Math.max(Math.ceil(repo.commits_count / 1000), 10), 40)
  const beltRadius = 6

  const issueAsteroidCount = Math.min(Math.max(Math.ceil(repo.open_issues_count / 100), 10), 60)
  const issueRadius = beltRadius + 3

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
        <primitive object={clonedPlanetScene} scale={[planetScale, planetScale, planetScale]} />
        <PlanetAsteroidBelt count={asteroidCount} radius={beltRadius} />
        <SaturnRing planetScale={planetScale} commitsCount={repo.commits_count} />

        {issueAsteroidCount > 0 && (
          <IssueAsteroids count={issueAsteroidCount} radius={issueRadius} />
        )}
      </group>

      <Billboard position={[0, planetScale * 2, 0]}>
        <Text
          font="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff/Pretendard-Regular.woff"
          fontSize={0.6}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {repo.name}
        </Text>
      </Billboard>
    </group>
  )
}

useGLTF.preload('/models/asteroids_pack_rocky_version.glb')
useGLTF.preload('/models/purple_planet.glb')
