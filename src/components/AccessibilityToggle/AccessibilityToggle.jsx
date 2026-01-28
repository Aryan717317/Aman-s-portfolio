import { useMotion } from '../../App'
import './AccessibilityToggle.css'

const AccessibilityToggle = () => {
  const { reducedMotion, setReducedMotion } = useMotion()

  return (
    <div className="accessibility-toggle">
      <button
        className={`a11y-btn ${reducedMotion ? 'active' : ''}`}
        onClick={() => setReducedMotion(!reducedMotion)}
        aria-label={reducedMotion ? 'Enable animations' : 'Reduce motion'}
        title={reducedMotion ? 'Enable animations' : 'Reduce motion'}
      >
        <span className="a11y-icon">
          {reducedMotion ? '▶' : '⏸'}
        </span>
        <span className="a11y-label">
          {reducedMotion ? 'Motion Off' : 'Motion On'}
        </span>
      </button>
    </div>
  )
}

export default AccessibilityToggle
