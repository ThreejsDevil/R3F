import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

export default function IntroZoom({ onFinished }) {
  const { camera } = useThree();
  const finishedRef = useRef(false);

  useEffect(() => {
    camera.zoom = 5;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame((_, delta) => {
    if (finishedRef.current) return;

    camera.zoom = THREE.MathUtils.lerp(camera.zoom, 65, delta * 1.5);
    camera.updateProjectionMatrix();

    if (Math.abs(camera.zoom - 65) < 0.5) {
      camera.zoom = 65;
      camera.updateProjectionMatrix();
      finishedRef.current = true;
      onFinished?.();
    }
  });

  return null;
}
