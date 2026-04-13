import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { getLanguageColor } from '../../constants/languageColors'

export default function PlanetInfo() {
  const selectedPlanet = useStore((s) => s.selectedPlanet)
  const setSelectedPlanet = useStore((s) => s.setSelectedPlanet)

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div
          className="planet-info glass-card"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="planet-info-header">
            <h3 className="planet-info-name">{selectedPlanet.name}</h3>
            <button
              className="planet-info-close"
              onClick={() => setSelectedPlanet(null)}
            >
              ✕
            </button>
          </div>

          <div className="planet-info-language">
            <span
              className="planet-info-language-dot"
              style={{ backgroundColor: getLanguageColor(selectedPlanet.language) }}
            />
            {selectedPlanet.language}
          </div>

          <p className="planet-info-desc" style={{ marginTop: '12px' }}>
            {selectedPlanet.description || 'No description available.'}
          </p>

          <div className="planet-info-stats">
            <div className="planet-info-stat">
              <span className="planet-info-stat-value">
                {selectedPlanet.stargazers_count.toLocaleString()}
              </span>
              <span className="planet-info-stat-label">Stars</span>
            </div>
            <div className="planet-info-stat">
              <span className="planet-info-stat-value">
                {selectedPlanet.commits.toLocaleString()}
              </span>
              <span className="planet-info-stat-label">Commits</span>
            </div>
            <div className="planet-info-stat">
              <span className="planet-info-stat-value">
                {selectedPlanet.forks.toLocaleString()}
              </span>
              <span className="planet-info-stat-label">Forks</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
