// Airboard.jsx — 직사각형 SF 갑판
import { NEON_CYAN } from "../constants";

const DECK_W = 12;
const DECK_D = 12;
const DECK_H = 0.3;

const neonCyan = {
  color: NEON_CYAN,
  emissive: NEON_CYAN,
  emissiveIntensity: 2,
  toneMapped: false,
};

const neonOrange = {
  color: "#ff6a00",
  emissive: "#ff6a00",
  emissiveIntensity: 2.5,
  toneMapped: false,
};

export default function Airboard() {
  const top = DECK_H / 2 + 0.005;
  const bot = -DECK_H / 2 - 0.005;

  return (
    <group position={[0, 0, 0]}>
      {/* 갑판 본체 */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[DECK_W, DECK_H, DECK_D]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* 상단 네온 사이안 테두리 앞/뒤/좌/우 */}
      <mesh position={[0, top, DECK_D / 2]}>
        <boxGeometry args={[DECK_W, 0.015, 0.04]} />
        <meshStandardMaterial {...neonCyan} />
      </mesh>
      <mesh position={[0, top, -DECK_D / 2]}>
        <boxGeometry args={[DECK_W, 0.015, 0.04]} />
        <meshStandardMaterial {...neonCyan} />
      </mesh>
      <mesh position={[-DECK_W / 2, top, 0]}>
        <boxGeometry args={[0.04, 0.015, DECK_D]} />
        <meshStandardMaterial {...neonCyan} />
      </mesh>
      <mesh position={[DECK_W / 2, top, 0]}>
        <boxGeometry args={[0.04, 0.015, DECK_D]} />
        <meshStandardMaterial {...neonCyan} />
      </mesh>

      {/* 측면 오렌지 라인 — 앞/뒤 */}
      <mesh position={[0, 0, DECK_D / 2 + 0.01]}>
        <boxGeometry args={[DECK_W, DECK_H * 0.3, 0.03]} />
        <meshStandardMaterial {...neonOrange} />
      </mesh>
      <mesh position={[0, 0, -DECK_D / 2 - 0.01]}>
        <boxGeometry args={[DECK_W, DECK_H * 0.3, 0.03]} />
        <meshStandardMaterial {...neonOrange} />
      </mesh>

      {/* 하단 엔진 글로우 — 좌우 */}
      <mesh position={[DECK_W / 2 - 1.5, bot - 0.05, 0]}>
        <boxGeometry args={[2.5, 0.06, DECK_D * 0.7]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00aaff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-(DECK_W / 2 - 1.5), bot - 0.05, 0]}>
        <boxGeometry args={[2.5, 0.06, DECK_D * 0.7]} />
        <meshStandardMaterial
          color="#00aaff"
          emissive="#00aaff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* 부유 포인트 라이트 */}
      <pointLight
        position={[0, -1, 0]}
        color="#0088ff"
        intensity={4}
        distance={6}
      />
    </group>
  );
}
