import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { GRASS_COLORS } from "../constants";

/**
 * 잔디 블레이드 하나를 렌더링하는 컴포넌트.
 * level에 따라 색상이 달라지며, GLB 모델을 복제해 사용한다.
 *
 * @param {{ level: number, position: [number, number, number] }} props
 * @param {number}   props.level    기여도 레벨 (1~4)
 * @param {number[]} props.position Three.js 월드 위치 [x, y, z]
 */
export default function GrassBlade({ level, position }) {
  const { scene } = useGLTF("/grass_plant.glb");

  const cloned = useMemo(() => {
    const copy = SkeletonUtils.clone(scene);
    copy.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = obj.material.clone();
        obj.material.color.set(GRASS_COLORS[level - 1] ?? GRASS_COLORS[0]);
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
    return copy;
  }, [scene, level]);

  return <primitive object={cloned} position={position} scale={0.15} />;
}

useGLTF.preload("/grass_plant.glb");
