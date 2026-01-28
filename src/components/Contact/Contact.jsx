import { useState, useRef, useEffect } from 'react'
import { portfolioData, useMotion } from '../../App'
import './Contact.css'

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const sectionRef = useRef(null)
  const { reducedMotion } = useMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Add terminal line effect
    if (value.length === 1) {
      addTerminalLine(`> Typing in ${name} field...`)
    }
  }

  const addTerminalLine = (line) => {
    setTerminalLines(prev => [...prev.slice(-4), line])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    addTerminalLine('> Initializing secure connection...')
    await delay(500)
    addTerminalLine('> Encrypting message data...')
    await delay(500)
    addTerminalLine('> Establishing contact protocol...')
    await delay(500)
    addTerminalLine('> Message transmitted successfully!')
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, reducedMotion ? 0 : ms))

  return (
    <div className="contact-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{'<contact>'}</span>
          <h2 className="section-title">Establish Connection</h2>
          <p className="section-subtitle">
            Ready to collaborate on ML projects
          </p>
        </div>

        <div className={`contact-grid ${isVisible ? 'visible' : ''}`}>
          {/* Contact Info */}
          <div className="contact-info">
            <div className="info-terminal">
              <div className="terminal-header-mini">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title-mini">contact_info.sh</span>
              </div>
              
              <div className="terminal-content">
                <div className="terminal-line">
                  <span className="prompt">$</span>
                  <span className="command">cat contact_details</span>
                </div>
                
                <div className="info-output">
                  <InfoItem 
                    icon="📧" 
                    label="Email" 
                    value={portfolioData.email}
                    link={`mailto:${portfolioData.email}`}
                  />
                  <InfoItem 
                    icon="📱" 
                    label="Phone" 
                    value={portfolioData.phone}
                    link={`tel:${portfolioData.phone}`}
                  />
                  <InfoItem 
                    icon="📍" 
                    label="Location" 
                    value={portfolioData.location}
                  />
                </div>

                <div className="terminal-line">
                  <span className="prompt">$</span>
                  <span className="command">ls ./social_links/</span>
                </div>

                <div className="social-links">
                  <a 
                    href={portfolioData.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link github"
                  >
                    <GitHubIcon />
                    <span>GitHub</span>
                  </a>
                  <a 
                    href={portfolioData.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link linkedin"
                  >
                    <LinkedInIcon />
                    <span>LinkedIn</span>
                  </a>
                </div>

                {/* Live terminal output */}
                <div className="live-output">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="output-line">{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-header">
                <span className="form-label">NEW_MESSAGE.init()</span>
                <span className={`form-status ${submitted ? 'success' : ''}`}>
                  {submitted ? 'SENT ✓' : 'READY'}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="name">
                  <span className="label-bracket">{'{'}</span>
                  name
                  <span className="label-bracket">{'}'}</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-bracket">{'{'}</span>
                  email
                  <span className="label-bracket">{'}'}</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <span className="label-bracket">{'{'}</span>
                  message
                  <span className="label-bracket">{'}'}</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  rows="5"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting || submitted}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" />
                    Transmitting...
                  </>
                ) : submitted ? (
                  <>
                    <span className="check">✓</span>
                    Message Sent
                  </>
                ) : (
                  <>
                    <span className="send-icon">→</span>
                    Send Message
                  </>
                )}
              </button>

              {submitted && (
                <p className="success-message">
                  Connection established! I'll respond within 24 hours.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="portfolio-footer">
          <div className="footer-content">
            <span className="copyright">
              © 2026 {portfolioData.name}. All systems operational.
            </span>
            <span className="built-with">
              Built with React, Three.js & ❤️
            </span>
          </div>
        </footer>

        <span className="section-tag closing">{'</contact>'}</span>
      </div>
    </div>
  )
}

// Info Item Component
const InfoItem = ({ icon, label, value, link }) => (
  <div className="info-item">
    <span className="info-icon">{icon}</span>
    <div className="info-content">
      <span className="info-label">{label}:</span>
      {link ? (
        <a href={link} className="info-value link">{value}</a>
      ) : (
        <span className="info-value">{value}</span>
      )}
    </div>
  </div>
)

// GitHub Icon
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

// LinkedIn Icon
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

export default Contact
