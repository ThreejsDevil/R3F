import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

export default function LoadingScreen() {
  const isLoaded = useStore((s) => s.isLoaded)
  const progress = useStore((s) => s.loadingProgress)

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="loading-title">Git-Universe</h2>
          </motion.div>

          <motion.div
            className="loading-bar-track"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="loading-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </motion.div>

          <motion.p
            className="loading-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Initializing cosmic viewport...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
