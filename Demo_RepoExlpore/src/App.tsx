import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import { CameraControls, Environment, Html, useProgress, Stars } from '@react-three/drei'
import * as THREE from 'three'

import { PurplePlanet } from './components/PurplePlanet'
import { AsteroidBelt } from './components/AsteroidBelt'
import { BackgroundStars } from './components/BackgroundStars'
import { InteractiveBook } from './components/InteractiveBook'
import { Desk } from './components/Desk'
import { Telescope } from './components/Telescope'
import * as d3 from 'd3'

function D3Graph() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return
    d3.select(chartRef.current).selectAll('*').remove()

    const data = [15, 30, 45, 80, 50, 60, 40]
    const w = 300
    const h = 200

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .style('overflow', 'visible')

    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, w])
      .padding(0.2)

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([h, 0])

    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => xScale(i.toString())!)
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => h - yScale(d))
      .attr('fill', 'url(#gradient)')
      .attr('rx', 4)

    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%')

    gradient.append('stop').attr('offset', '0%').style('stop-color', '#a18cd1')
    gradient.append('stop').attr('offset', '100%').style('stop-color', '#fbc2eb')
  }, [])

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: 'bold' }}>Repository Activity</h2>
      <div ref={chartRef}></div>
      <p style={{ marginTop: '20px', color: '#ccc' }}>Visualizing the last 7 weeks of commits</p>
    </div>
  )
}


function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="glass-panel" style={{ width: '200px', textAlign: 'center' }}>
        LOADING... {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

function SceneControls({ target }: { target: THREE.Vector3 | null }) {
  const controlsRef = useRef<CameraControls>(null)

  useEffect(() => {
    if (target && controlsRef.current) {
      // Transition camera to look at the target (zoom in)
      controlsRef.current.setTarget(target.x, target.y, target.z, true)
      controlsRef.current.setPosition(target.x + 0.5, target.y + 1.5, target.z + 6, true)
    } else if (controlsRef.current) {
      // Reset to default
      controlsRef.current.setTarget(0, 0, 0, true)
      controlsRef.current.setPosition(0, 3, 20, true)
    }
  }, [target])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={2}
      maxDistance={50}
      maxPolarAngle={Math.PI / 1.5}
    />
  )
}

export default function App() {
  const [zoomTarget, setZoomTarget] = useState<THREE.Vector3 | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for counts
  const mockCommits = 350
  const mockIssues = 45
  const mockContributors = 12

  const asteroidCount = Math.floor(mockCommits / 10 + mockIssues) // 35 + 45 = 80
  const starCount = mockContributors * 50 // 600

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 8, 25], fov: 45 }}>
        <color attach="background" args={['#050508']} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 20, 10]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={<Loader />}>
          <SceneControls target={zoomTarget} />

          <PurplePlanet position={[0, 0, 0]} />

          <AsteroidBelt
            count={asteroidCount}
            radius={18}
            onAsteroidClick={(pos) => setZoomTarget(pos)}
          />

          <BackgroundStars count={starCount} />

          <group position={[0, -2, 5]}>

            <InteractiveBook
              position={[-4, -2, 0]}
              rotation={[0, 0, 0]}
              onBookClick={(pos, isOpen) => {
                if (isOpen) {
                  setZoomTarget(pos)
                  setIsModalOpen(true)
                } else {
                  setZoomTarget(null)
                  setIsModalOpen(false)
                }
              }}
            />

          </group>

          {/* Environment for better reflections on PBR materials */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="overlay" style={{ pointerEvents: 'none' }}>
        <h1 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Demo Repository Explorer</h1>

        {/* 2D Modal container strictly overlaying the screen center */}
        {isModalOpen && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'auto', zIndex: 50
          }}>
            <D3Graph />
          </div>
        )}

        {zoomTarget && (
          <button
            style={{
              pointerEvents: 'auto',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              fontWeight: 'bold',
              marginTop: '1rem',
              zIndex: 100
            }}
            onClick={() => {
              setZoomTarget(null)
              setIsModalOpen(false)
            }}
          >
            Reset View
          </button>
        )}
      </div>
    </div>
  )
}
