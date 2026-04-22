import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useRef, useState, useEffect } from 'react'
import { CameraControls, Environment, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'

import { BackgroundStars } from './BackgroundStars'
import { NeumorphismCard } from './NeumorphismCard'
import { RepoPlanet } from './RepoPlanet'
import type { RepoData } from '../hooks/useGithubData'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="loader-container" style={{ background: 'transparent', color: 'white' }}>
        LOADING... {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

function SceneControls({ target }: { target: THREE.Vector3 | null }) {
  const controlsRef = useRef<CameraControls>(null)

  useEffect(() => {
    if (target && controlsRef.current) {
      // Zoom into the selected planet tightly. We approach from slightly right/top
      controlsRef.current.setTarget(target.x, target.y, target.z, true)
      controlsRef.current.setPosition(target.x + 3, target.y + 1, target.z + 8, true)
    } else if (controlsRef.current) {
      // Reset to solar system view
      controlsRef.current.setTarget(0, 0, 0, true)
      controlsRef.current.setPosition(0, 5, 25, true)
    }
  }, [target])

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
}

export function GithubSpaceScene({ repos }: GithubSpaceSceneProps) {
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<RepoData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
        <div style={{ pointerEvents: 'auto', position: 'absolute', top: '40px', left: '40px' }}>
          {/* Neumorphism UI works as a viewer now, appearing when a repo is selected */}
          <NeumorphismCard
            repo={selectedRepo}
            onClose={() => {
              setSelectedRepo(null)
              setZoomTarget(null)
            }}
          />
        </div>
      </div>

      <Canvas
        eventSource={containerRef}
        style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
        camera={{ position: [0, 5, 25], fov: 45 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 20, 10]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight
          position={[-50, 20, 50]}
          intensity={3}
          color="white"
        />

        <Suspense fallback={<Loader />}>
          <SceneControls target={zoomTarget} />

          <BackgroundStars count={starCount} />

          {repos.map((repo, idx) => (
            <RepoPlanet
              key={repo.id}
              repo={repo}
              position={getRepoPosition(idx, repos.length)}
              onClick={(pos, clickedRepo) => {
                setZoomTarget(pos)
                setSelectedRepo(clickedRepo)
              }}
            />
          ))}

          <Environment files="/models/monochrome_studio_02_1k.hdr" background={false} />
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom
              luminanceThreshold={1.5}
              mipmapBlur
              intensity={1.0}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
