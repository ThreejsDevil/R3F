import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Unlit standard material base for shader
const grassMaterial = new THREE.MeshStandardMaterial({
  color: 0x3d8c40,
  side: THREE.DoubleSide,
});

grassMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.time = { value: 0 };
  shader.vertexShader = `
    uniform float time;
    ${shader.vertexShader}
  `.replace(
    `#include <begin_vertex>`,
    `
    // Wind effect
    float sway = sin(time * 2.0 + position.x * 0.5 + position.z * 0.5) * 0.15;
    vec3 transformed = vec3(position);
    // Only sway upper vertices
    if (position.y > 0.0) {
      transformed.x += sway * position.y;
      transformed.z += sway * position.y;
    }
    `
  );
  // store shader reference to update time
  grassMaterial.userData.shader = shader;
};

const Grass: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const grassCount = 1000;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const geometry = useMemo(() => {
    // Simple blade of grass
    const geo = new THREE.PlaneGeometry(0.05, 0.4, 1, 4);
    geo.translate(0, 0.2, 0); // Origin at bottom
    return geo;
  }, []);

  useMemo(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < grassCount; i++) {
        // Randomize placement within a radius
        const r = Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        
        // Don't place right under the telescope
        if (x*x + z*z < 0.5) continue;

        dummy.position.set(x, 0, z);
        dummy.rotation.y = Math.random() * Math.PI;
        // random scale
        const scale = 0.5 + Math.random() * 0.5;
        dummy.scale.set(scale, scale, scale);
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((state) => {
    if (grassMaterial.userData.shader) {
      grassMaterial.userData.shader.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, grassMaterial, grassCount]}
      receiveShadow
      castShadow
    />
  );
};

export default Grass;
