import React, { useState, useEffect } from 'react';
import './NeumorphismCard.css';
import type { RepoData } from '../hooks/useGithubData';

interface NeumorphismCardProps {
  repo: RepoData | null;
  onClose?: () => void;
}

export function NeumorphismCard({ repo, onClose }: NeumorphismCardProps) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Reset page when repo changes
    setPage(0);
  }, [repo]);

  if (!repo) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPage((p) => (p + 1) % 2); // 2 pages total
  };

  return (
    <div className={`neo-card ${repo ? 'open' : ''}`} onClick={handleNext}>
      {onClose && (
        <button 
          className="neo-close-btn"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          &times;
        </button>
      )}

      {page === 0 ? (
        <div className="neo-page">
          <div className="neo-badge-row">
            <span className="neo-badge">{repo.language.toUpperCase()}</span>
          </div>
          
          <h1 className="neo-title">{repo.full_name}</h1>
          <p className="neo-desc">{repo.description || 'No description available for this repository.'}</p>
          
          <div className="neo-stats-container">
            <div className="neo-stat">
              <div className="neo-stat-icon star">★</div>
              <div className="neo-stat-value">{repo.stargazers_count > 1000 ? (repo.stargazers_count/1000).toFixed(1) + 'k' : repo.stargazers_count}</div>
              <div className="neo-stat-label">STARS</div>
            </div>
            <div className="neo-stat-divider" />
            <div className="neo-stat">
              <div className="neo-stat-icon fork">⑂</div>
              <div className="neo-stat-value">{repo.forks_count > 1000 ? (repo.forks_count/1000).toFixed(1) + 'k' : repo.forks_count}</div>
              <div className="neo-stat-label">FORKS</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="neo-page">
          <div className="neo-badge-row">
            <span className="neo-badge">ACTIVITY & STATS</span>
          </div>
          <h1 className="neo-title">{repo.name}</h1>
          
          <div className="neo-stats-container" style={{ marginTop: '20px', flexDirection: 'column', gap: '15px', alignItems: 'stretch' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <span style={{ color: '#9295a3', fontWeight: 'bold' }}>Total Commits</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{repo.commits_count.toLocaleString()}</span>
             </div>
             <div className="neo-stat-divider" style={{ width: '100%', height: '1px' }} />
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <span style={{ color: '#9295a3', fontWeight: 'bold' }}>Contributors</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{repo.contributors_count.toLocaleString()}</span>
             </div>
             <div className="neo-stat-divider" style={{ width: '100%', height: '1px' }} />
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <span style={{ color: '#e07474', fontWeight: 'bold' }}>Open Issues</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{repo.open_issues_count.toLocaleString()}</span>
             </div>
          </div>
        </div>
      )}
      
      <div className="neo-pagination">
        <div className={`neo-dot ${page === 0 ? 'active' : ''}`} />
        <div className={`neo-dot ${page === 1 ? 'active' : ''}`} />
      </div>
    </div>
  );
}
