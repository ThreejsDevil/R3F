import { useMemo } from "react";
import * as THREE from "three";

function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

export default function DomeStars({
  count = 6000,
  radius = 150,
  sizeMultiplier = 1,
}) {
  const circleTexture = useMemo(() => createCircleTexture(), []);

  const [smallPos, mediumPos, largePos] = useMemo(() => {
    const smallCount = Math.floor(count * 0.8);
    const mediumCount = Math.floor(count * 0.17);
    const largeCount = count - smallCount - mediumCount;

    const createPositions = (n) => {
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * (0.7 + Math.random() * 0.3);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.cos(phi);
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      return pos;
    };

    return [
      createPositions(smallCount),
      createPositions(mediumCount),
      createPositions(largeCount),
    ];
  }, [count, radius]);

  return (
    <group renderOrder={-1}>
      <points renderOrder={-1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={smallPos.length / 3}
            array={smallPos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          color="#ffffff"
          size={0.3 * sizeMultiplier}
          sizeAttenuation={false}
          transparent
          opacity={0.8}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </points>

      <points renderOrder={-1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={mediumPos.length / 3}
            array={mediumPos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          color="#ffffff"
          size={0.6 * sizeMultiplier}
          sizeAttenuation={false}
          transparent
          opacity={0.9}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </points>

      <points renderOrder={-1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={largePos.length / 3}
            array={largePos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={circleTexture}
          color="#ffffff"
          size={1.0 * sizeMultiplier}
          sizeAttenuation={false}
          transparent
          opacity={1.0}
          depthWrite={false}
          alphaTest={0.01}
          fog={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
