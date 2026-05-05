import { useState, useEffect, useRef } from 'react'
import { portfolioData, useMotion } from '../../App'
import './Experience.css'

const Experience = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [bootProgress, setBootProgress] = useState(0)
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

  useEffect(() => {
    if (!isVisible) return
    if (reducedMotion) {
      setBootProgress(100)
      return
    }

    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      if (progress >= 100) {
        clearInterval(interval)
        setBootProgress(100)
      } else {
        setBootProgress(progress)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isVisible, reducedMotion])

  const timelineItems = [
    ...portfolioData.education.map((edu, i) => ({
      type: 'education',
      title: edu.degree,
      subtitle: edu.institution,
      period: edu.period,
      grade: edu.grade,
      icon: '🎓',
      order: i
    })),
    ...portfolioData.certifications.map((cert, i) => ({
      type: 'certification',
      title: cert.name,
      subtitle: cert.issuer,
      icon: '📜',
      order: portfolioData.education.length + i
    }))
  ]

  return (
    <div className="experience-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{'<system_boot>'}</span>
          <h2 className="section-title">System Boot Log</h2>
          <p className="section-subtitle">
            Education & Certification Timeline
          </p>
        </div>

        {/* Boot Progress */}
        <div className={`boot-screen ${isVisible ? 'visible' : ''}`}>
          <div className="boot-header">
            <span className="boot-label">ARYAN_OS v2.0</span>
                        <span className="boot-label">AMAN_OS v2.0</span>
            <span className="boot-status">
              {bootProgress < 100 ? 'BOOTING...' : 'READY'}
            </span>
          </div>
          
          <div className="boot-progress">
            <div 
              className="boot-progress-fill"
              style={{ width: `${bootProgress}%` }}
            />
          </div>

          <div className="boot-logs">
            <LogEntry 
              show={bootProgress > 10}
              text="[OK] Loading education modules..."
              delay={0}
            />
            <LogEntry 
              show={bootProgress > 25}
              text="[OK] Initializing knowledge base..."
              delay={100}
            />
            <LogEntry 
              show={bootProgress > 40}
              text="[OK] Certifications verified..."
              delay={200}
            />
            <LogEntry 
              show={bootProgress > 60}
              text="[OK] Skills matrix loaded..."
              delay={300}
            />
            <LogEntry 
              show={bootProgress > 80}
              text="[OK] System ready for deployment..."
              delay={400}
            />
            <LogEntry 
              show={bootProgress >= 100}
              text="[COMPLETE] All systems operational."
              delay={500}
              isSuccess
            />
          </div>
        </div>

        {/* Timeline */}
        <div className={`timeline ${bootProgress >= 100 ? 'visible' : ''}`}>
          {/* Education Section */}
          <div className="timeline-section">
            <h3 className="timeline-section-title">
              <span className="section-icon">🎓</span>
              Education
            </h3>
            
            {portfolioData.education.map((edu, index) => (
              <TimelineCard
                key={index}
                item={{
                  title: edu.degree,
                  subtitle: edu.institution,
                  period: edu.period,
                  badge: edu.grade
                }}
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          {/* Certifications Section */}
          <div className="timeline-section">
            <h3 className="timeline-section-title">
              <span className="section-icon">📜</span>
              Certifications
            </h3>
            
            <div className="certifications-grid">
              {portfolioData.certifications.map((cert, index) => (
                <CertificationCard
                  key={index}
                  cert={cert}
                  index={index}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>
        </div>

        <span className="section-tag closing">{'</system_boot>'}</span>
      </div>
    </div>
  )
}

// Log Entry Component
const LogEntry = ({ show, text, delay, isSuccess }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [show, delay])

  if (!visible) return null

  return (
    <div className={`log-entry ${isSuccess ? 'success' : ''}`}>
      <span className="log-time">{new Date().toLocaleTimeString()}</span>
      <span className="log-text">{text}</span>
    </div>
  )
}

// Timeline Card Component
const TimelineCard = ({ item, index, reducedMotion }) => {
  return (
    <div 
      className="timeline-card"
      style={{ animationDelay: reducedMotion ? '0s' : `${index * 0.2}s` }}
    >
      <div className="card-timeline-dot" />
      <div className="card-content">
        <div className="card-header">
          <h4 className="card-title">{item.title}</h4>
          {item.badge && <span className="card-badge">{item.badge}</span>}
        </div>
        <p className="card-subtitle">{item.subtitle}</p>
        <span className="card-period">{item.period}</span>
      </div>
    </div>
  )
}

// Certification Card Component
const CertificationCard = ({ cert, index, reducedMotion }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`certification-card ${isHovered ? 'hovered' : ''}`}
      style={{ animationDelay: reducedMotion ? '0s' : `${index * 0.15}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cert-icon">✓</div>
      <div className="cert-content">
        <h4 className="cert-name">{cert.name}</h4>
        <span className="cert-issuer">{cert.issuer}</span>
      </div>
      <div className="cert-glow" />
    </div>
  )
}

export default Experience
