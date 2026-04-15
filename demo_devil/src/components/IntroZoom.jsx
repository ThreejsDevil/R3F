import { useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

export default function IntroZoom({ onFinished }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.zoom = 5;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame((_, delta) => {
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, 65, delta * 0.4);
    camera.updateProjectionMatrix();

    if (camera.zoom > 64.5) {
      camera.zoom = 65;
      camera.updateProjectionMatrix();
      if (onFinished) onFinished();
    }
  });
}
