import * as THREE from "three";
import { CELL_COLORS, CELL_SIZE, CELL_GAP, CELL_HEIGHT } from "../constants";
import GrassBlade from "./GrassBlade";

// 치수가 상수이므로 모듈 레벨에서 한 번만 생성해 모든 셀이 공유
const sharedCellGeo = new THREE.BoxGeometry(
  CELL_SIZE - CELL_GAP,
  CELL_HEIGHT,
  CELL_SIZE - CELL_GAP,
);

// 레벨별 재질을 미리 생성해 셀 개수만큼 중복 생성되지 않도록 공유
const sharedMaterials = CELL_COLORS.map(
  (color, level) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: level === 0 ? 0.95 : 0.7,
      metalness: level === 0 ? 0 : 0.1,
    }),
);

/**
 * GitHub 기여도 히트맵을 3D 그리드로 렌더링하는 컴포넌트.
 * 각 셀은 level(0~4)에 따라 색상이 달라지고,
 * level > 0 인 셀에는 GrassBlade가 추가된다.
 *
 * @param {{ dataMatrix: number[][] }} props
 * @param {number[][]} props.dataMatrix 행×열 기여도 레벨 배열 (값: 0~4)
 */
export default function ContributionGrid({ dataMatrix, offsetX = 0 }) {
  const rows = dataMatrix.length;
  const cols = dataMatrix[0].length;
  // offsetX를 더해서 오른쪽으로 이동
  const startX = -(cols * CELL_SIZE) / 2 + offsetX;
  const startZ = -(rows * CELL_SIZE) / 2;

  return (
    <group position={[startX, 0.22, startZ]}>
      {dataMatrix.map((row, zIndex) =>
        row.map((level, xIndex) => {
          const x = xIndex * CELL_SIZE;
          const z = zIndex * CELL_SIZE;
          return (
            <group key={`${xIndex}-${zIndex}`} position={[x, 0, z]}>
              <mesh
                geometry={sharedCellGeo}
                material={sharedMaterials[level || 0]}
                position={[0, CELL_HEIGHT / 2, 0]}
                receiveShadow
              />
              {level > 0 && (
                <GrassBlade level={level} position={[0, CELL_HEIGHT, 0]} />
              )}
            </group>
          );
        }),
      )}
    </group>
  );
}
