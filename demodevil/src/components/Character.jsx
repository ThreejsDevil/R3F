import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import useKeyboard from "../hooks/useKeyboard";
import { SPEED, ROTATION_SPEED } from "../constants";

const direction = new THREE.Vector3();
const yAxis = new THREE.Vector3(0, 1, 0);

const VALID_ANIMATIONS = ["idle", "walk", "gone"];

export default function Character({
  initialPosition = [0, 0, 0],
  positionRef,
}) {
  const outerGroup = useRef();
  const innerGroup = useRef();
  const keys = useKeyboard();

  const { scene, animations } = useGLTF("/astronaut.glb");
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const clips = useMemo(() => {
    return animations
      .filter((clip) => VALID_ANIMATIONS.includes(clip.name))
      .map((clip) => {
        const cloned = clip.clone();
        cloned.tracks = cloned.tracks.filter(
          (track) => !track.name.endsWith(".position"),
        );
        return cloned;
      });
  }, [animations]);

  const { actions } = useAnimations(clips, innerGroup);

  // gone 재생 중인지 추적
  const isGone = useRef(false);
  const currentAnim = useRef("idle");

  useEffect(() => {
    clonedScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  useEffect(() => {
    if (positionRef) positionRef.current = outerGroup.current;
  }, [positionRef]);

  useEffect(() => {
    if (!actions.idle) return;
    actions.idle.reset().fadeIn(0.2).play();
    return () => {
      actions.idle?.fadeOut(0.2);
    };
  }, [actions]);

  // gone 애니메이션 종료 시 idle로 복귀
  useEffect(() => {
    if (!actions.gone) return;

    const onFinish = () => {
      isGone.current = false;
      currentAnim.current = "idle";
      actions.gone.fadeOut(0.2);
      actions.idle?.reset().fadeIn(0.2).play();
    };

    actions.gone.getMixer().addEventListener("finished", onFinish);
    return () => {
      actions.gone.getMixer().removeEventListener("finished", onFinish);
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!outerGroup.current) return;

    const { forward, backward, left, right, space } = keys.current;

    // space 눌렸고 gone 재생 중이 아닐 때
    if (space && !isGone.current) {
      const prev = actions[currentAnim.current];
      if (prev) prev.fadeOut(0.2);

      actions.gone
        ?.reset()
        .fadeIn(0.2)
        .setLoop(THREE.LoopOnce, 1) // 한 번만 재생
        .play();
      actions.gone.clampWhenFinished = true; // 마지막 프레임 유지

      isGone.current = true;
      currentAnim.current = "gone";
      return; // gone 중엔 이동 막기
    }

    // gone 재생 중엔 이동/전환 스킵
    if (isGone.current) return;

    const moving = forward || backward || left || right;
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
