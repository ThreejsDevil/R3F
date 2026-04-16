import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import useKeyboard from "../hooks/useKeyboard";
import { SPEED, ROTATION_SPEED } from "../constants";

const direction = new THREE.Vector3();
const yAxis = new THREE.Vector3(0, 1, 0);

// 실제로 사용할 애니메이션 이름 목록
const VALID_ANIMATIONS = ["idle", "walk", "gone"];

export default function Character({
  initialPosition = [0, 0, 0],
  positionRef,
}) {
  const outerGroup = useRef();
  const innerGroup = useRef();
  const keys = useKeyboard();

  // GLB 사용
  const { scene, animations } = useGLTF("/astronaut.glb");

  // 스킨드 메시는 반드시 clone
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // 필요한 애니메이션만 필터링 + position 트랙 제거 (제자리 재생)
  const clips = useMemo(() => {
    return animations
      .filter((clip) => VALID_ANIMATIONS.includes(clip.name))
      .map((clip) => {
        const cloned = clip.clone();
        // 루트 position 트랙 제거 → 캐릭터가 제자리에서 애니메이션
        cloned.tracks = cloned.tracks.filter(
          (track) => !track.name.endsWith(".position"),
        );
        return cloned;
      });
  }, [animations]);

  const { actions } = useAnimations(clips, innerGroup);

  // 그림자 설정
  useEffect(() => {
    clonedScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  // 부모에 ref 노출
  useEffect(() => {
    if (positionRef) positionRef.current = outerGroup.current;
  }, [positionRef]);

  // 키 입력에 따라 idle ↔ walk 전환
  useEffect(() => {
    if (!actions.idle) return;

    actions.idle.reset().fadeIn(0.2).play();

    return () => {
      actions.idle?.fadeOut(0.2);
    };
  }, [actions]);

  // 이동 + 애니메이션 전환
  const currentAnim = useRef("idle");

  useFrame((_, delta) => {
    if (!outerGroup.current) return;
    const { forward, backward, left, right } = keys.current;
    const moving = forward || backward || left || right;

    // 애니메이션 전환
    const targetAnim = moving ? "walk" : "idle";
    if (currentAnim.current !== targetAnim) {
      const prev = actions[currentAnim.current];
      const next = actions[targetAnim];
      if (prev && next) {
        prev.fadeOut(0.2);
        next.reset().fadeIn(0.2).play();
      }
      currentAnim.current = targetAnim;
    }

    // 이동 처리
    if (moving) {
      direction.set(0, 0, 0);
      if (forward) direction.z -= 1;
      if (backward) direction.z += 1;
      if (left) direction.x -= 1;
      if (right) direction.x += 1;
      direction.normalize().applyAxisAngle(yAxis, Math.PI / 4);

      outerGroup.current.position.x += direction.x * SPEED * delta;
      outerGroup.current.position.z += direction.z * SPEED * delta;

      const targetY = Math.atan2(direction.x, direction.z);
      let diff = targetY - outerGroup.current.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      outerGroup.current.rotation.y +=
        diff * (1 - Math.exp(-ROTATION_SPEED * delta));
    }
  });

  return (
    <group ref={outerGroup} position={initialPosition}>
      <group ref={innerGroup} scale={0.5} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/astronaut.glb");
