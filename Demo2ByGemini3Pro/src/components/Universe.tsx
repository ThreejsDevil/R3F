import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import Planet from './Planet';

const Universe: React.FC = () => {
  const { repos, cameraPhase } = useStore();
  
  // Arrange planets in a galaxy spiral or randomized sphere
  const planetPositions = useMemo(() => {
    return repos.map((repo, i) => {
      // Golden spiral distribution roughly
      const goldenRatio = 1.61803398875;
      const angle = i * Math.PI * 2 * goldenRatio;
      const radius = 5 + Math.sqrt(i) * 3; // spread out
      
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 10; // some vertical scatter
      const z = Math.sin(angle) * radius;
      return { pos: [x, y, z] as [number, number, number], repo };
    });
  }, [repos]);

  // Provide colors based on language
  const languageColors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Rust: '#dea584',
    Go: '#00ADD8',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Shell: '#89e051'
  };

  return (
    <group position={[0, 0, 0]}>
      {planetPositions.map(({ pos, repo }, index) => {
        const lang = repo.language || 'Unknown';
        const rawColor = languageColors[lang] || '#888888';
        
        return (
          <Planet 
            key={repo.id} 
            position={pos} 
            repo={repo} 
            color={rawColor} 
            delay={index * 0.1} // Staggered entrance
            isVisible={cameraPhase === 'universe'}
          />
        );
      })}
    </group>
  );
};

export default Universe;
