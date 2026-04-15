import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useFBX, useAnimations, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import useKeyboard from "../hooks/useKeyboard";
import { SPEED, ROTATION_SPEED, HEAD_TILT } from "../constants";

// 매 프레임 객체 생성을 피하기 위해 컴포넌트 외부에 한 번만 선언
const direction = new THREE.Vector3();
const yAxis = new THREE.Vector3(0, 1, 0);

/**
 * 키보드 입력으로 조작 가능한 3D 캐릭터 컴포넌트.
 * Idle / Walk FBX 애니메이션을 이동 상태에 따라 자동으로 전환한다.
 *
 * @param {{ initialPosition?: [number, number, number] }} props
 * @param {number[]} [props.initialPosition=[0,0,0]] 캐릭터 초기 월드 위치 [x, y, z]
 */
export default function Character({
  initialPosition = [0, 0, 0],
  positionRef,
}) {
  // 부모에게 ref 연결
  useEffect(() => {
    if (positionRef) positionRef.current = outerGroup.current;
  }, [positionRef]);

  const outerGroup = useRef();
  const innerGroup = useRef();
  const headBone = useRef(null);
  const idle = useFBX("/Idle.fbx");
  const walk = useFBX("/Catwalk_Walk.fbx");
  const { scene, animations } = useGLTF("/cute_astronaut.glb");
  useEffect(() => {
    console.log(
      "animations:",
      animations.map((a) => a.name),
    );
  }, [animations]);
  const keys = useKeyboard();
  // useState 대신 useRef 사용 — 이동 상태 변경이 리렌더를 트리거하지 않도록
  const isMovingRef = useRef(false);
  const clonedScene = useMemo(() => SkeletonUtils.clone(idle), [idle]);

  // 섀도우 활성화 + Head 본 참조 수집
  useEffect(() => {
    clonedScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
      if (obj.isBone && obj.name === "Head" && !headBone.current)
        headBone.current = obj;
    });
  }, [clonedScene]);

  // 루트 모션(.position 트랙)을 제거한 애니메이션 클립 생성
  const clips = useMemo(() => {
    const i = idle.animations[0]?.clone();
    const w = walk.animations[0]?.clone();
    if (i) {
      i.name = "idle";
      i.tracks = i.tracks.filter((t) => !t.name.endsWith(".position"));
    }
    if (w) {
      w.name = "walk";
      w.tracks = w.tracks.filter((t) => !t.name.endsWith(".position"));
    }
    return [i, w].filter(Boolean);
  }, [idle, walk]);

  const { actions } = useAnimations(clips, innerGroup);

  // actions가 준비되면 초기 idle 애니메이션 시작
  useEffect(() => {
    const idleAction = actions["idle"];
    if (!idleAction) return;
    idleAction.reset().fadeIn(0.2).play();
  }, [actions]);

  useFrame((_, delta) => {
    if (!outerGroup.current) return;
    const { forward, backward, left, right } = keys.current;
    const moving = forward || backward || left || right;

    // 이동 상태가 바뀐 경우에만 애니메이션 전환 (useFrame 안에서 직접 처리)
    if (moving !== isMovingRef.current) {
      isMovingRef.current = moving;
      const next = actions[moving ? "walk" : "idle"];
      const prev = actions[moving ? "idle" : "walk"];
      if (prev) prev.fadeOut(0.2);
      if (next) next.reset().fadeIn(0.2).play();
    }

    if (moving) {
      direction.set(0, 0, 0);
      if (forward) direction.z -= 1;
      if (backward) direction.z += 1;
      if (left) direction.x -= 1;
      if (right) direction.x += 1;
      direction.normalize();
      // 아이소메트릭 카메라 기준으로 방향 보정 (45도 회전)
      direction.applyAxisAngle(yAxis, Math.PI / 4);

      outerGroup.current.position.x += direction.x * SPEED * delta;
      outerGroup.current.position.z += direction.z * SPEED * delta;

      // 이동 방향으로 부드럽게 회전 (exponential smoothing)
      const targetRotation = Math.atan2(direction.x, direction.z);
      const currentY = outerGroup.current.rotation.y;
      let diff = targetRotation - currentY;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      outerGroup.current.rotation.y +=
        diff * (1 - Math.exp(-ROTATION_SPEED * delta));
    }

    // 고정값 대입 — 매 프레임 누산하면 무한 증가 버그 발생
    if (headBone.current) headBone.current.rotation.z = HEAD_TILT;
  });

  return (
    <group ref={outerGroup} position={initialPosition}>
      <group ref={innerGroup} scale={0.02} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

useFBX.preload("/Idle.fbx");
useFBX.preload("/Catwalk_Walk.fbx");
