# Three JS의 악마 😈👺

한 번 해 봅시다.

### 각자 랜딩페이지 만들어 보기
- 기술 스택 : React + 가능하면 R3F 까지 사용하기
- 헥토르의 죽음 당하지 않기(AI에게 끌려 다니지 말라는 뜻)

#### Demo1
- Claude Opus로 제작
- 사용한 프롬프트는 다음과 같음
 ```
  [역할 설정]
너는 세계 최고의 시니어 크리에이티브 개발자이자 Three.js 전문가야. GitHub 데이터를 활용해 '클레이모피즘(Claymorphism) 랜딩 페이지'에서 '3D 우주 공간'으로 끊김 없이(Seamless) 전환되는 인터랙티브 웹사이트를 구축해야 해.
[기술 스택]
Framework: Next.js (App Router), TypeScript
3D Engine: React Three Fiber (R3F), @react-three/drei
Animation: GSAP (카메라 시퀀싱용), Framer Motion (UI용)
State Management: Zustand (전역 상태 및 씬 전환 관리)
Shader: GLSL (잔디 흔들림 효과 및 행성 대기 효과용)
[요구 사항 및 구현 가이드]
Scene 1: The Dashboard (Landing)
Clay Board: 둥근 모서리를 가진 보드 모델을 생성해. MeshStandardMaterial의 roughness를 높여 매트한 질감을 표현해줘.
Interactive Grass (GitHub Contribution): InstancedMesh를 사용하여 52x7 격자의 잔디 블록을 생성해.
Shader Detail: onBeforeCompile 혹은 커스텀 ShaderMaterial을 사용해 바람에 살랑거리는 애니메이션을 넣어줘. sin(uv.y + time)을 활용해 윗부분만 흔들려야 함.
Telescope & Astronaut: 외부 GLB 파일을 로드할 수 있는 컴포넌트 구조를 만들고, 망원경에 onClick 이벤트를 달아줘.
The Cinematic Transition
망원경 클릭 시 GSAP를 사용하여 카메라를 망원경 렌즈(target position)로 1.5초간 가속하며 돌진시켜줘.
렌즈 중심에 도달하는 순간 화면을 완전히 검은색으로 덮거나, FOV(시야각)를 급격히 줄여 '워프' 느낌을 연출해.
씬 상태(currentScene)를 'SPACE'로 변경하고 카메라를 새로운 좌표로 리셋해.
Scene 2: The Git-Universe
Planets (Repos): GitHub API 데이터를 매핑할 수 있는 구조를 짜줘.
행성 크기 = stargazers_count
행성 색상 = language (색상 맵핑 테이블 포함)
Orbits (Commits): BufferGeometry와 Points를 사용해 행성 주위를 도는 입자 고리를 만들어줘.
API & Data Flow
GitHub GraphQL API 연동을 위한 전용 Hook(useGitHubData)을 구조화해줘.
실제 API 호출 전까지 사용할 Mock Data(레포 이름, 언어, 스타 수, 기여도 데이터)를 포함해줘.
Code Quality
모든 컴포넌트는 재사용 가능하도록 분리해 (Grass.tsx, Planet.tsx, Telescope.tsx, Experience.tsx).
성능 최적화를 위해 useFrame 내부의 계산을 최소화하고, 가급적 선언적인 코드를 작성해.
[출력 결과]
전체 프로젝트 구조 가이드.
Experience.tsx (메인 씬 컨트롤러).
GrassShader Material 코드를 포함한 잔디 컴포넌트.
GSAP 카메라 전환 로직이 담긴 핸들러 코드.
```

#### Demo2
- Gemini Pro 3.1로 제작
- 사용한 프롬프트는 다음과 같음
 ```
[역할 설정]
너는 예술적 감각이 뛰어난 시니어 프론트엔드 개발자이자 R3F(React Three Fiber) 아티스트야. '어린왕자'의 감성을 담아, 사용자의 GitHub 프로필을 하나의 작은 소행성계로 여행하는 몰입형 웹사이트를 개발해야 해. 조잡한 디테일은 배제하고, 세련된 미니멀리즘과 감성적인 인터랙션에 집중해줘.
[핵심 아트 디렉션]
The Little Prince Vibe: 행성들은 작고 귀엽지만(Small Radius), 각기 고유한 색감과 은은한 대기 광채(Atmospheric Glow)를 가져야 함.
HDR & Lighting: @react-three/drei의 Environment를 사용하여 고품질 HDR 조명을 적용해. 물리 기반 렌더링(PBR)을 통해 클레이 재질이 빛을 부드럽게 머금도록 설정해줘.
Clean & Minimal: 불필요한 UI는 숨기고, 오직 핵심적인 메타포(망원경, 행성, 잔디)만 아름답게 배치해.
[기술 요구 사항 (React 기반)]
Post-processing (HDR/Bloom): @react-three/postprocessing을 사용해. 행성 주변에 은은한 Bloom 효과를 주어 꿈꾸는 듯한 분위기를 연출하되, 과하지 않게(Intensity 0.5~1.0) 조절해줘.
The Journey Logic (GSAP): 망원경을 선택하면 카메라가 단순히 이동하는 게 아니라, '시공간을 유영하듯' 부드러운 곡선을 그리며 망원경 속으로 빨려 들어가야 해.
Grass Detail: 깃허브 잔디(Contribution)는 어린왕자의 장미 정원처럼 표현해. InstancedMesh를 사용하며, 바람에 부드럽게 물결치는 셰이더 애니메이션을 포함해.
Data Connection: 사용자의 GitHub 데이터를 기반으로 행성을 생성하되, 레포지토리 이름이 행성 위에 아주 얇고 세련된 타이포그래피로 떠 있도록 해줘.
[코드 구조 가이드]
App.tsx: Canvas 설정, HDR 환경 구축, EffectComposer 적용.
Stage.tsx: 메인 랜딩 보드(클레이 보드, 우주인, 망원경, 살랑이는 잔디) 관리.
Universe.tsx: 전환 후 나타날 행성들의 군집. 각 행성은 Planet 컴포넌트로 독립화.
useStore.ts (Zustand): isTraveling, selectedPlanet, cameraLookAt 등 여행의 상태를 관리.
[애니메이션 디테일 요청]
모든 객체가 나타날 때 Spring 애니메이션을 사용하여 쫀득하고 생동감 있게 등장하게 해줘.
카메라가 우주로 진입할 때 Starfield 입자들이 사용자 옆을 스쳐 지나가는 'Warp Speed' 연출을 추가해.
```