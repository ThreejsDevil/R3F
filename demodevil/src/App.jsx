import { useState, Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import Character from "./components/Character";
import ContributionGrid from "./components/ContributionGrid";
import DomeStars from "./components/DomeStars";
import IntroZoom from "./components/IntroZoom";
import useContributionData from "./hooks/useContributionData";
import { Stats } from "@react-three/drei";
import Airboard from "./components/Airboard";
import CameraFollow from "./components/CameraFollow";
import TechFlag from "./components/TechFlag";
import ProjectBox from "./components/ProjectBox";

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const { data } = useContributionData();
  const characterRef = useRef();
  const orbitRef = useRef();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "12px 16px",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
          fontSize: "13px",
          fontFamily: "sans-serif",
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>조작법</div>
        <div>W A S D 또는 방향키로 이동</div>
      </div>

      <Canvas
        shadows
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          powerPreference: "default",
        }}
      >
        <color attach="background" args={["#0a0e1f"]} />
        <fog attach="fog" args={["#0a0e1f", 30, 80]} />

        <OrthographicCamera
          makeDefault
          position={[15, 15, 15]}
          near={0.1}
          far={1000}
        />
        <OrbitControls
          ref={orbitRef}
          enableRotate={false} // 아이소메트릭 고정
          enableZoom={true}
          enablePan={false} // 패닝 끄기 (카메라가 대신 함)
        />
        <CameraFollow targetRef={characterRef} orbitRef={orbitRef} />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 3]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-5, 8, -5]}
          intensity={0.5}
          color="#a0c4ff"
        />
        <hemisphereLight args={["#4477ff", "#1a1a2e", 0.4]} />

        <Suspense fallback={null}>
          {!introFinished && (
            <IntroZoom onFinished={() => setIntroFinished(true)} />
          )}

          <group>
            <Airboard />
            <ContributionGrid dataMatrix={data} offsetX={2.5} />
            // 캐릭터: 그리드 왼쪽 옆
            <Character
              initialPosition={[-0.5, 0.15, 0]}
              positionRef={characterRef}
            />
            // 깃발: 왼쪽 영역 (보드 안쪽으로)
            <TechFlag
              position={[-3.5, 0.15, -3]}
              label="React"
              color="#61dafb"
            />
            <TechFlag
              position={[-3.0, 0.15, -1]}
              label="TypeScript"
              color="#3178c6"
            />
            <TechFlag
              position={[-2.5, 0.15, 1]}
              label="Node.js"
              color="#68a063"
            />
            // 박스: 깃발 아래쪽
            <ProjectBox position={[-3.0, 0.15, 3]} count={5} />
          </group>

          <DomeStars count={30000} radius={150} sizeMultiplier={4} />
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
        <Stats />
      </Canvas>
    </div>
  );
}
