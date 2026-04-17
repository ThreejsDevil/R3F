/**
 * StarObject.jsx
 *
 * ProjectBox 위에 고정 배치되는 star.glb 오브젝트.
 *
 * 이번 수정 포인트:
 *  - OrthographicCamera 환경에서는 <Html>의 distanceFactor가 불안정하다.
 *    (거리 기반 스케일 계산이 원근 카메라 전제라 orthographic에서는 엉뚱한
 *    값이 나와 DOM이 화면을 덮거나 1px 폭으로 짜부라짐 → 사용자가 겪은 증상)
 *    → distanceFactor 제거. 기본 DOM 크기로 렌더.
 *  - <Html>의 position prop 대신 감싸는 <group position={[0, y, 0]}>로 위치
 *    오프셋을 줘서 계산 책임을 three 쪽에 넘김.
 *  - 호버 툴팁은 pointerEvents:none, 클릭 패널은 auto로 분리.
 */

import { useState, useEffect, useMemo } from "react";
import { useGLTF, Html } from "@react-three/drei";

const MOCK_TOP_REPO = {
  name: "awesome-project",
  stars: 312,
  url: "https://github.com/",
  language: "TypeScript",
};

useGLTF.preload("/star.glb");

export default function StarObject({
  position = [-3.0, 1.2, 3],
  repo = MOCK_TOP_REPO,
}) {
  const { scene } = useGLTF("/star.glb");
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (!child.isMesh || !child.material) return;
      child.material.color?.set(hovered ? "#ffe566" : "#ffd700");
      child.material.emissive?.set(hovered ? "#ffaa00" : "#ff8800");
      child.material.emissiveIntensity = hovered ? 1.2 : 0.5;
      child.material.needsUpdate = true;
    });
  }, [cloned, hovered]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <group position={position}>
      {/* GLB 메시 */}
      <primitive object={cloned} scale={1.8} />

      {/* 투명 히트박스 (visible=true, opacity=0) */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          setClicked((v) => !v);
        }}
      >
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 호버 툴팁 */}
      {hovered && !clicked && (
        <group position={[0, 1.6, 0]}>
          <Html center style={{ pointerEvents: "none" }}>
            <div
              style={{
                background: "rgba(5, 8, 20, 0.82)",
                border: "1px solid #ffd70066",
                borderRadius: "8px",
                padding: "6px 12px",
                color: "#ffd700",
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                whiteSpace: "nowrap",
                backdropFilter: "blur(8px)",
              }}
            >
              ⭐ {repo.stars.toLocaleString()} &nbsp;·&nbsp; {repo.name}
            </div>
          </Html>
        </group>
      )}

      {/* 클릭 패널 */}
      {clicked && (
        <group position={[0, 2.0, 0]}>
          <Html center style={{ pointerEvents: "auto" }}>
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              style={{
                background: "rgba(5, 8, 20, 0.92)",
                border: "1px solid #ffd700aa",
                borderRadius: "12px",
                padding: "14px 18px",
                color: "#e0e8ff",
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
                backdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "220px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    color: "#ffd700",
                    fontWeight: 700,
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {repo.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setClicked(false);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    fontSize: "18px",
                    lineHeight: 1,
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ color: "#a0b4e0", fontSize: "11px" }}>
                ⭐ {repo.stars.toLocaleString()} stars &nbsp;·&nbsp;{" "}
                {repo.language}
              </div>

              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "block",
                  background: "#ffd700",
                  color: "#000",
                  textAlign: "center",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "11px",
                  textDecoration: "none",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
              >
                GitHub에서 보기 →
              </a>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
