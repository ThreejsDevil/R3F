import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Environment, OrbitControls } from '@react-three/drei';
import Scene from './components/Scene';
import { useStore } from './store/useStore';

function App() {
  const { cameraPhase, setCameraPhase, setUsername, setRepos } = useStore();
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${inputVal}/repos?per_page=20&sort=pushed`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
        setUsername(inputVal);
        setCameraPhase('stage'); // Transition to stage
      } else {
        alert('User not found!');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching user');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="overlay-ui">
        <div className={`input-container ${cameraPhase !== 'input' ? 'hidden' : ''}`}>
          <h1>Explore GitHub Universe</h1>
          <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="cyber-input" 
              placeholder="Enter GitHub ID..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button className="cyber-button" type="submit" disabled={loading || !inputVal.trim()}>
              {loading ? <div className="loader"></div> : 'Launch'}
            </button>
          </form>
        </div>
      </div>

      {cameraPhase === 'stage' && (
        <div className="instruction">
          Click the telescope to begin your journey
        </div>
      )}

      <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 8], fov: 45 }}>
        <color attach="background" args={['#050510']} />
        
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
            intensity={0.8}
            radius={0.7}
          />
          <ToneMapping />
        </EffectComposer>

        {/* Ambient & Environment lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <Environment preset="city" />

        {/* Main 3D content */}
        <React.Suspense fallback={null}>
          <OrbitControls 
            enabled={cameraPhase === 'stage' || cameraPhase === 'universe'} 
            enablePan={false} 
            maxDistance={100}
            minDistance={2}
          />
          <Scene />
        </React.Suspense>
      </Canvas>
    </>
  );
}

export default App;
