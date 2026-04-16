import { NEON_CYAN, NEON_PINK, BOARD_W, BOARD_D, BOARD_H, BOARD_LINE } from "../constants";

/** 네온 사이안 테두리 머티리얼 공통 props */
const cyanNeon = {
  color: NEON_CYAN,
  emissive: NEON_CYAN,
  emissiveIntensity: 2,
  toneMapped: false,
};

/**
 * 기여도 그리드를 올려놓는 보드 컴포넌트.
 * 상단 네온 사이안 테두리와 하단 핑크 글로우로 구성된다.
 */
export default function Board() {
  const top = BOARD_H / 2 + 0.005;
  const bot = -BOARD_H / 2 - 0.005;

  return (
    <group position={[0, -0.1, 0]}>
      {/* 보드 본체 */}
      <mesh receiveShadow>
        <boxGeometry args={[BOARD_W, BOARD_H, BOARD_D]} />
        <meshStandardMaterial color="#1a1f2e" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 상단 네온 사이안 테두리 — 앞/뒤/좌/우 */}
      <mesh position={[0, top, BOARD_D / 2]}>
        <boxGeometry args={[BOARD_W, 0.01, BOARD_LINE]} />
        <meshStandardMaterial {...cyanNeon} />
      </mesh>
      <mesh position={[0, top, -BOARD_D / 2]}>
        <boxGeometry args={[BOARD_W, 0.01, BOARD_LINE]} />
        <meshStandardMaterial {...cyanNeon} />
      </mesh>
      <mesh position={[-BOARD_W / 2, top, 0]}>
        <boxGeometry args={[BOARD_LINE, 0.01, BOARD_D]} />
        <meshStandardMaterial {...cyanNeon} />
      </mesh>
      <mesh position={[BOARD_W / 2, top, 0]}>
        <boxGeometry args={[BOARD_LINE, 0.01, BOARD_D]} />
        <meshStandardMaterial {...cyanNeon} />
      </mesh>

      {/* 하단 핑크 글로우 */}
      <mesh position={[0, bot, 0]}>
        <boxGeometry args={[BOARD_W + 0.1, 0.01, BOARD_D + 0.1]} />
        <meshStandardMaterial
          color={NEON_PINK}
          emissive={NEON_PINK}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
