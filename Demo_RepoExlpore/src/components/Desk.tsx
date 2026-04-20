import { useGLTF } from '@react-three/drei'

interface DeskProps {
  position: [number, number, number]
  rotation: [number, number, number]
}

export function Desk({ position, rotation }: DeskProps) {
  const { scene } = useGLTF('/models/scifi_desk.glb')

  return (
    <group position={position} rotation={rotation} scale={[12, 12, 12]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/scifi_desk.glb')
