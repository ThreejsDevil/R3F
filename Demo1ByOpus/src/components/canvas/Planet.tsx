import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getLanguageColor } from '../../constants/languageColors'
import type { RepoData } from '../../store/useStore'
import { useStore } from '../../store/useStore'

interface PlanetProps {
  repo: RepoData
  position: [number, number, number]
  index: number
}

export default function Planet({ repo, position, index }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet)

  // Planet size based on stargazers
  const radius = useMemo(() => {
    return Math.max(0.4, Math.log(repo.stargazers_count + 1) * 0.25)
  }, [repo.stargazers_count])

  const color = useMemo(() => new THREE.Color(getLanguageColor(repo.language)), [repo.language])

  // Planet material with slight bumpiness
  const planetMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.65,
        metalness: 0.15,
        emissive: color.clone().multiplyScalar(0.1),
        emissiveIntensity: 0.3,
      }),
    [color]
  )

  // Atmosphere glow (Fresnel-based)
  const atmosphereMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uColor: { value: color },
        uIntensity: { value: 0.6 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - dot(viewDir, vNormal);
          fresnel = pow(fresnel, 3.0) * uIntensity;
          gl_FragColor = vec4(uColor, fresnel);
        }
      `,
    })
  }, [color])

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }

    // Entry animation: scale up
    if (groupRef.current) {
      const t = state.clock.elapsedTime
      const delay = index * 0.15
      const progress = Math.min(1, Math.max(0, (t - delay) * 0.8))
      const eased = 1 - Math.pow(1 - progress, 3)
      groupRef.current.scale.setScalar(eased)
    }
  })

  return (
    <group ref={groupRef} position={position} scale={0}>
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        material={planetMat}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedPlanet(repo)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} material={atmosphereMat}>
        <sphereGeometry args={[radius * 1.3, 32, 32]} />
      </mesh>

      {/* Planet name label - HTML overlay handled separately */}
    </group>
  )
}
