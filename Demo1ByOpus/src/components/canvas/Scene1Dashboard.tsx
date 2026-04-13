import ClayBoard from './ClayBoard'
import Grass from './Grass'
import Telescope from './Telescope'
import Astronaut from './Astronaut'
import { useStore } from '../../store/useStore'
import { Text } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Scene1Dashboard() {
  const githubData = useStore((s) => s.githubData)
  const sceneRef = useRef<THREE.Group>(null)

  // Floating animation for the entire cohesive dashboard scene
  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group>
      <group ref={sceneRef}>
        {/* Main Clay Board */}
        <ClayBoard position={[0, 0, 0]} size={[12, 0.5, 8]} />
  
        {/* GitHub Contribution Grass Grid */}
      {githubData && (
        <Grass
          contributions={githubData.contributions}
          position={[1.5, 0.25, 1]}
        />
      )}

      {/* "Contribution Activity" label */}
      <Text
        position={[1.5, 0.28, 2.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="#8B7355"
        anchorX="center"
        anchorY="middle"

      >
        CONTRIBUTION ACTIVITY
      </Text>

      {/* Telescope */}
      <Telescope position={[3.5, 0.25, -2]} rotation={[0, -0.6, 0]} />

      {/* Astronaut */}
      <Astronaut position={[-3, 1.55, -1]} />

      {/* Tech stack label area - decorative clay buttons */}
      <group position={[-2.5, 0.3, 1.5]}>
        <Text
          position={[0, 0, 1.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#8B7355"
          anchorX="center"
          anchorY="middle"
  
        >
          TECH STACK
        </Text>

        {/* Decorative clay tech buttons */}
        {[
          { label: 'React', color: '#61dafb', pos: [-1, 0, 0.5] },
          { label: 'TS', color: '#3178c6', pos: [-0.3, 0, 0.5] },
          { label: 'Python', color: '#3572A5', pos: [0.4, 0, 0.5] },
          { label: 'Go', color: '#00ADD8', pos: [1.1, 0, 0.5] },
          { label: 'Rust', color: '#dea584', pos: [-1, 0, -0.15] },
          { label: 'Java', color: '#b07219', pos: [-0.3, 0, -0.15] },
          { label: 'Docker', color: '#384d54', pos: [0.4, 0, -0.15] },
          { label: 'AWS', color: '#FF9900', pos: [1.1, 0, -0.15] },
        ].map(({ label, color, pos }) => (
          <group key={label} position={pos as [number, number, number]}>
            <mesh castShadow>
              <boxGeometry args={[0.55, 0.08, 0.55]} />
              <meshStandardMaterial
                color={color}
                roughness={0.9}
                metalness={0.05}
                transparent
                opacity={0.85}
              />
            </mesh>
            <Text
              position={[0, 0.05, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.1}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
          </group>
        ))}
      </group>

      {/* "Start Journey" button near telescope */}
      <group position={[2.2, 0.3, -1]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.06, 0.35]} />
          <meshStandardMaterial
            color="#f0e6d4"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
        <Text
          position={[0, 0.04, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.09}
          color="#8B7355"
          anchorX="center"
          anchorY="middle"
  
        >
          Start Journey →
        </Text>
      </group>

      </group>

      {/* Lighting specific to dashboard scene */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} color="#ffd4a0" />
      <ambientLight intensity={0.5} />
    </group>
  )
}
