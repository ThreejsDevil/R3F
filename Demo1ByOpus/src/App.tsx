import { Suspense, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './components/canvas/Experience'
import Overlay from './components/ui/Overlay'
import LoadingScreen from './components/ui/LoadingScreen'
import PlanetInfo from './components/ui/PlanetInfo'
import { useGitHubData } from './hooks/useGitHubData'
import { useStore } from './store/useStore'

function LoadingTracker() {
  const setLoaded = useStore((s) => s.setLoaded)
  const setLoadingProgress = useStore((s) => s.setLoadingProgress)

  useEffect(() => {
    // Simulate loading progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => setLoaded(true), 500)
      }
      setLoadingProgress(progress)
    }, 200)

    return () => clearInterval(interval)
  }, [setLoaded, setLoadingProgress])

  return null
}

export default function App() {
  const currentScene = useStore((s) => s.currentScene)

  // Fetch or load mock GitHub data
  useGitHubData()

  const bgColor = '#050510'

  return (
    <>
      <LoadingScreen />
      <LoadingTracker />

      <div className="canvas-container">
        <Canvas
          shadows
          camera={{
            fov: 60,
            near: 0.1,
            far: 200,
            position: [0, 7, 10],
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          style={{ background: bgColor }}
          onCreated={(state) => {
            state.gl.setClearColor(bgColor)
          }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>

      <Overlay />
      <PlanetInfo />
    </>
  )
}
