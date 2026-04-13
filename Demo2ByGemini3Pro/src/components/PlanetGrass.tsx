import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const grassMaterial = new THREE.MeshStandardMaterial({
  color: 0x5cd663, // Brighter contribution green
  side: THREE.DoubleSide,
});

// Reuse the shader compilation logic
grassMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.time = { value: 0 };
  shader.vertexShader = `
    uniform float time;
    ${shader.vertexShader}
  `.replace(
    `#include <begin_vertex>`,
    `
    // Wind effect
    float sway = sin(time * 3.0 + position.x * 2.0 + position.z * 2.0) * 0.2;
    vec3 transformed = vec3(position);
    if (position.y > 0.0) {
      transformed.x += sway * position.y;
      transformed.z += sway * position.y;
    }
    `
  );
  grassMaterial.userData.shader = shader;
};

interface PlanetGrassProps {
  count?: number;
  radius?: number;
}

const PlanetGrass: React.FC<PlanetGrassProps> = ({ count = 200, radius = 1 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.08, 0.4, 1, 4);
    geo.translate(0, 0.2, 0); // Origin at bottom
    return geo;
  }, []);

  useMemo(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
        // Place on the top hemisphere
        const phi = Math.acos(1 - 2 * (Math.random() * 0.5)); // Only upper half
        const theta = Math.random() * Math.PI * 2;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        dummy.position.set(x, y, z);
        
        // Orient towards outward normal (which is just the position vector for a sphere centered at origin)
        const normal = new THREE.Vector3(x, y, z).normalize();
        dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        
        // Random rotation around its own up-axis
        dummy.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
        
        const scale = 0.5 + Math.random() * 0.5;
        dummy.scale.set(scale, scale, scale);
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, count, radius]);

  useFrame((state) => {
    if (grassMaterial.userData.shader) {
      grassMaterial.userData.shader.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return <instancedMesh ref={meshRef} args={[geometry, grassMaterial, count]} receiveShadow castShadow />;
};

export default PlanetGrass;
