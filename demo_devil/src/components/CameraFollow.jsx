import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const OFFSET = new THREE.Vector3(15, 15, 15); // 아이소메트릭 오프셋
const tempWorldPos = new THREE.Vector3();
const tempCamTarget = new THREE.Vector3();

export default function CameraFollow({ targetRef, orbitRef }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!targetRef.current) return;

    // 캐릭터 월드 위치
    targetRef.current.getWorldPosition(tempWorldPos);

    // 카메라 위치: 캐릭터 위치 + 고정 오프셋
    camera.position.lerp(tempCamTarget.copy(tempWorldPos).add(OFFSET), 0.08);

    // OrbitControls target을 캐릭터 위치로 lerp
    if (orbitRef?.current) {
      orbitRef.current.target.lerp(tempWorldPos, 0.08);
      orbitRef.current.update();
    }
  });

  return null;
}
