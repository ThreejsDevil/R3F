import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useStore } from '../store/useStore';
import Stage from './Stage';
import Universe from './Universe';
import Stars from './Stars';
import * as THREE from 'three';

const Scene: React.FC = () => {
  const { cameraPhase, setCameraPhase } = useStore();
  const { camera } = useThree();
  const cameraRef = useRef(camera as THREE.PerspectiveCamera);
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (cameraPhase === 'traveling') {
      // 1. Zoom into the telescope
      const tl = gsap.timeline({
        onComplete: () => setCameraPhase('universe')
      });
      
      // Animate position along a curve
      tl.to(cameraRef.current.position, {
        x: 0,
        y: 2,
        z: 2,
        duration: 1.5,
        ease: "power2.inOut"
      });
      
      tl.to(cameraRef.current.position, {
        x: 0,
        y: 1.5,
        z: -1, // Dive into telescope lens point
        duration: 1.5,
        ease: "power2.inOut"
      }, "+=0.2");

      // Animate lookAt target
      tl.to(lookAtTarget.current, {
        y: 1.5,
        z: -5,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => {
          cameraRef.current.lookAt(lookAtTarget.current);
        }
      }, 0);
    } else if (cameraPhase === 'universe') {
      // Instantly move camera to universe center and look around
      cameraRef.current.position.set(0, 20, 50);
      lookAtTarget.current.set(0, 0, 0);
      
      gsap.to(cameraRef.current.position, {
        z: 35,
        y: 15,
        duration: 4,
        ease: "power3.out"
      });
    }
  }, [cameraPhase, setCameraPhase]);



  return (
    <>
      <Stars phase={cameraPhase} />
      {cameraPhase !== 'universe' && <Stage />}
      {(cameraPhase === 'universe' || cameraPhase === 'traveling') && <Universe />}
    </>
  );
};

export default Scene;
