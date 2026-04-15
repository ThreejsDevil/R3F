import { Text } from "@react-three/drei";

const WOOD_COLOR = "#8B6914";
const BOX_ARGS = [0.5, 0.35, 0.5];

/**
 * 나무 박스 더미 컴포넌트
 *
 * @param {{ position: [number,number,number], count: number }} props
 */
export default function ProjectBox({ position = [0, 0, 0], count = 0 }) {
  return (
    <group position={position}>
      {/* 박스 1 */}
      <mesh castShadow position={[0, 0.2, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={BOX_ARGS} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} metalness={0} />
      </mesh>

      {/* 박스 2 */}
      <mesh castShadow position={[0.3, 0.2, 0.1]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={BOX_ARGS} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} metalness={0} />
      </mesh>

      {/* 박스 3 */}
      <mesh castShadow position={[-0.1, 0.55, 0.05]} rotation={[0, 0.1, 0]}>
        <boxGeometry args={BOX_ARGS} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.9} metalness={0} />
      </mesh>

      {/* 라벨 — 두 줄 */}
      <Text
        position={[0, 1.0, 0]}
        fontSize={0.13}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#000000"
        textAlign="center"
      >
        {`내 프로젝트: ${count}\n포트폴리오 바로가기`}
      </Text>
    </group>
  );
}
