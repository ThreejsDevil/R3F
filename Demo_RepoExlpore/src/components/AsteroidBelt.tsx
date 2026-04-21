import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface AsteroidBeltProps {
  count: number
  radius: number
  onAsteroidClick?: (position: THREE.Vector3) => void
}

export function AsteroidBelt({ count, radius, onAsteroidClick }: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  const { scene } = useGLTF('/models/asteroids_pack_rocky_version.glb')
  
  // Extract geometry and material from the loaded GLB
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

  // Initialize the instance matrices
  useEffect(() => {
    if (!meshRef.current || !geometry) return
    
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      // Distribute along a ring (orbit)
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const r = radius + (Math.random() - 0.5) * 3 // Spread of the belt
      const y = (Math.random() - 0.5) * 1.5 // Thickness of the belt
      
      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r)
      
      // Random rotation and varying scales - drastically reduced size!
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      const scale = 0.05 + Math.random() * 0.1
      dummy.scale.set(scale, scale, scale)
      
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count, radius, geometry])

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Slowly rotate the entire asteroid belt
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (onAsteroidClick) {
      // Get the world position of the clicked instance
      const instanceId = e.instanceId
      if (instanceId !== undefined && meshRef.current && groupRef.current) {
        const matrix = new THREE.Matrix4()
        meshRef.current.getMatrixAt(instanceId, matrix)
        const position = new THREE.Vector3().setFromMatrixPosition(matrix)
        
        // Since the mesh is inside a rotating group, we need to apply the group's rotation
        position.applyMatrix4(groupRef.current.matrixWorld)
        onAsteroidClick(position)
      }
    }
  }

  if (!geometry) return null

  return (
    <group ref={groupRef}>
      {/* @ts-ignore */}
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
        frustumCulled={false}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      />
    </group>
  )
}

useGLTF.preload('/models/asteroids_pack_rocky_version.glb')
