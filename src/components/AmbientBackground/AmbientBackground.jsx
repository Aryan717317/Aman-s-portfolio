import { motion } from 'framer-motion'
import './AmbientBackground.css'

const orbs = [
  {
    className: 'orb orb-a',
    animate: {
      x: [0, 28, -16, 0],
      y: [0, -18, 12, 0],
      scale: [1, 1.08, 0.96, 1],
      opacity: [0.55, 0.7, 0.5, 0.55]
    },
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  {
    className: 'orb orb-b',
    animate: {
      x: [0, -20, 14, 0],
      y: [0, 16, -10, 0],
      scale: [1, 1.12, 1.02, 1],
      opacity: [0.4, 0.55, 0.42, 0.4]
    },
    transition: {
      duration: 26,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  },
  {
    className: 'orb orb-c',
    animate: {
      x: [0, 18, -12, 0],
      y: [0, -12, 16, 0],
      scale: [1, 1.06, 0.98, 1],
      opacity: [0.28, 0.42, 0.3, 0.28]
    },
    transition: {
      duration: 22,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
]

const AmbientBackground = ({ reducedMotion }) => {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-base" />
      <div className="ambient-grid" />
      <div className="ambient-vignette" />
      <div className="ambient-noise" />
      {!reducedMotion && orbs.map((orb, index) => (
        <motion.div
          key={orb.className}
          className={orb.className}
          animate={orb.animate}
          transition={{ ...orb.transition, delay: index * 1.2 }}
        />
      ))}
    </div>
  )
}

export default AmbientBackground