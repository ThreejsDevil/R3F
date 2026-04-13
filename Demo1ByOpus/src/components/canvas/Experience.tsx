import { useStore } from '../../store/useStore'
import Scene1Dashboard from './Scene1Dashboard'
import Scene2Space from './Scene2Space'
import CameraController from './CameraController'
import { Environment, OrbitControls } from '@react-three/drei'
import Stars from './Stars'

export default function Experience() {
  const currentScene = useStore((s) => s.currentScene)

  return (
    <>
      <CameraController />
      <Stars count={4000} radius={100} />
      <OrbitControls makeDefault enabled={currentScene !== 'TRANSITIONING'} />

      {/* Dashboard scene */}
      {(currentScene === 'DASHBOARD' || currentScene === 'TRANSITIONING') && (
        <Scene1Dashboard />
      )}

      {/* Space scene */}
      {currentScene === 'SPACE' && <Scene2Space />}

      {/* Environment map for reflections */}
      {currentScene !== 'SPACE' && (
        <Environment preset="apartment" environmentIntensity={0.3} />
      )}
    </>
  )
}
