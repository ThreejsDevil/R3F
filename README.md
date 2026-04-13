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
