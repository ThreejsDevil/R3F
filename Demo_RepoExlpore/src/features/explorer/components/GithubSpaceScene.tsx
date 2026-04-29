import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useRef, useState, useEffect, forwardRef } from 'react'
import { CameraControls, Environment, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'

import { BackgroundStars } from './BackgroundStars'
import { RepoPlanet } from './RepoPlanet'
import type { RepoData } from '../../../types/github'

type SelectedPart = 'planet' | 'commits' | 'prs' | 'issues' | null;

function Loader() {
  useProgress()
  return (
    <Html center>
      <div className="loader-container" style={{ background: 'transparent', color: 'white' }}>

      </div>
    </Html>
  )
}

function SceneControls({ target, selectedPart }: { target: THREE.Vector3 | null, selectedPart: SelectedPart }) {
  const controlsRef = useRef<CameraControls>(null)

  // Store the initial position to guarantee exact return
  const initialPosition = useRef(new THREE.Vector3(0, 5, 25))
  const initialTarget = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    if (controlsRef.current) {
      // Normalize rotations to prevent wild spinning after long idle times
      controlsRef.current.normalizeRotations()
    }

    if (target && controlsRef.current && selectedPart) {
      // Zoom into the selected part tightly with distinct views
      switch (selectedPart) {
        case 'planet':
          controlsRef.current.setTarget(target.x, target.y, target.z, true)
          controlsRef.current.setPosition(target.x + 3, target.y + 2, target.z + 6, true)
          break;
        case 'commits':
          controlsRef.current.setTarget(target.x, target.y, target.z, true)
          controlsRef.current.setPosition(target.x, target.y + 8, target.z + 10, true)
          break;
        case 'prs':
          controlsRef.current.setTarget(target.x + 4, target.y, target.z + 4, true)
          controlsRef.current.setPosition(target.x + 8, target.y + 2, target.z + 8, true)
          break;
        case 'issues':
          controlsRef.current.setTarget(target.x - 4, target.y, target.z + 4, true)
          controlsRef.current.setPosition(target.x - 8, target.y - 1, target.z + 8, true)
          break;
      }
    } else if (controlsRef.current) {
      // Reset to exact initial solar system view
      controlsRef.current.setTarget(initialTarget.current.x, initialTarget.current.y, initialTarget.current.z, true)
      controlsRef.current.setPosition(initialPosition.current.x, initialPosition.current.y, initialPosition.current.z, true)
    }
  }, [target, selectedPart])

  useFrame((_, delta) => {
    if (!target && controlsRef.current) {
      // Slow rotation when in overview mode
      controlsRef.current.azimuthAngle += delta * 0.1
    }
  })

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={5}
      maxDistance={60}
      maxPolarAngle={Math.PI / 1.5}
    />
  )
}

export interface GithubSpaceSceneProps {
  repos: RepoData[];
  isSearchMode?: boolean;
  isSceneVisible?: boolean;
  selectedPart?: SelectedPart;
  onSelectPart?: (part: SelectedPart) => void;
}

function SceneFog({ isSearchMode }: { isSearchMode: boolean }) {
  useFrame((state, delta) => {
    const fog = state.scene.fog as THREE.Fog
    if (fog) {
      const targetFar = isSearchMode ? 0.1 : 200
      fog.far = THREE.MathUtils.lerp(fog.far, targetFar, delta * 1.5)
    }
  });

  return <fog attach="fog" args={['#0b0e14', 0, 0.1]} />; // Deep space dark matching background
}

const DistantSun = forwardRef<THREE.Mesh, any>((props, ref) => {
  return (
    <mesh ref={ref} position={[-100, 40, 100]}>
      <sphereGeometry args={[1, 10, 10]} />
      {/* emissive 속성을 가진 StandardMaterial로 변경하여 Bloom 효과를 잘 받도록 함 */}
      <meshStandardMaterial emissive="#ff8855" emissiveIntensity={30} color="black" toneMapped={false} />
    </mesh>
  )
})

export function GithubSpaceScene({ repos, isSearchMode = false, isSceneVisible = false, selectedPart = null, onSelectPart }: GithubSpaceSceneProps) {
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync zoom target when selected part changes externally (e.g. from PlanetCard)
  useEffect(() => {
    if (!selectedPart) {
      setZoomTarget(null);
    } else if (!zoomTarget && repos.length > 0) {
      // If a part is selected but we don't have a target (e.g. initial load or reset), target the first repo
      const pos = getRepoPosition(0, repos.length);
      setZoomTarget(new THREE.Vector3(pos[0], pos[1], pos[2]));
    }
  }, [selectedPart]);

  // Calculate Stars based on Contributors
  const totalContributors = repos.reduce((sum, r) => sum + r.contributors_count, 0)
  const starCount = Math.max(Math.min((totalContributors || 0) * 10, 5000), 500)

  const getRepoPosition = (index: number, total: number): [number, number, number] => {
    if (total === 1) return [0, 0, 0]
    // Line them up
    const offset = (index - (total - 1) / 2) * 12
    return [offset, 0, 0]
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#16171b', overflow: 'hidden' }}>

      {/* 2D UI Layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      </div>

      <Canvas
        style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'auto' }}
        camera={{ position: [0, 5, 25], fov: 45 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 20, 10]} intensity={1.5} angle={0.3} penumbra={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight
          position={[-50, 20, 50]}
          intensity={3}
          color="white"
        />

        <Suspense fallback={<Loader />}>
          <SceneFog isSearchMode={isSearchMode} />
          <SceneControls target={zoomTarget} selectedPart={selectedPart} />

          <BackgroundStars count={starCount} />
          <DistantSun />

          {repos.map((repo, idx) => (
            <RepoPlanet
              key={repo.id}
              repo={repo}
              position={getRepoPosition(idx, repos.length)}
              isSceneVisible={isSceneVisible}
              onClickPart={(part, pos) => {
                if (selectedPart === part) {
                  onSelectPart?.(null);
                  setZoomTarget(null);
                } else {
                  onSelectPart?.(part);
                  setZoomTarget(pos);
                }
              }}
            />
          ))}

          <Environment files="/models/monochrome_studio_02_1k.hdr" background={false} />
          <EffectComposer enableNormalPass={false} multisampling={4}>
            <Bloom
              luminanceThreshold={1.2}
              mipmapBlur
              intensity={1.5}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
