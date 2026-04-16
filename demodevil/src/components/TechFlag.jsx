import { Text } from "@react-three/drei";

/**
 * 깃발 폴대 + 깃발 천 컴포넌트
 *
 * @param {{ position: [number,number,number], label: string, color: string }} props
 */
export default function TechFlag({ position = [0, 0, 0], label = "", color = "#ffffff" }) {
  return (
    <group position={position}>
      {/* 폴대 */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#888888" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* 깃발 천 — 폴대 상단 오른쪽에 부착 */}
      <mesh castShadow position={[0.28, 1.05, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.0} />
      </mesh>

      {/* 라벨 텍스트 */}
      <Text
        position={[0.05, 1.05, 0.02]}
        fontSize={0.12}
        color="white"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
}
