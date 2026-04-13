import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

export default function Overlay() {
  const currentScene = useStore((s) => s.currentScene)
  const returnToDashboard = useStore((s) => s.returnToDashboard)

  return (
    <>
      {/* Transition blackout overlay */}
      <AnimatePresence>
        {currentScene === 'TRANSITIONING' && (
          <motion.div
            className="transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />
        )}
      </AnimatePresence>

      {/* Main UI overlay */}
      <div className="overlay">
        <AnimatePresence mode="wait">
          {/* Dashboard UI */}
          {currentScene === 'DASHBOARD' && (
            <motion.div
              key="dashboard-ui"
              className="title-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="title-main">Git-Universe</h1>
              <p className="title-sub">
                Your GitHub journey, reimagined as a living cosmos.
                Every commit plants a seed. Every repo births a planet.
              </p>
            </motion.div>
          )}

          {/* Space UI */}
          {currentScene === 'SPACE' && (
            <motion.div
              key="space-ui"
              className="space-nav"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                className="back-button"
                onClick={returnToDashboard}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <span className="space-title">✦ YOUR UNIVERSE</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom hint */}
        <AnimatePresence>
          {currentScene === 'DASHBOARD' && (
            <motion.div
              className="hint-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <span className="hint-dot" />
              <span className="hint-text">Click the telescope to explore your universe</span>
              <span className="hint-dot" />
            </motion.div>
          )}

          {currentScene === 'SPACE' && (
            <motion.div
              className="hint-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="hint-text">Click on a planet to explore a repository</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
