import { useState, useEffect, useRef } from 'react'
import { portfolioData, useMotion } from '../../App'
import './Skills.css'

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const sectionRef = useRef(null)
  const { reducedMotion } = useMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const skillCategories = Object.entries(portfolioData.skills)

  return (
    <div className="skills-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{'<skills>'}</span>
          <h2 className="section-title">Technical Arsenal</h2>
          <p className="section-subtitle">
            Core competencies powering ML solutions
          </p>
        </div>

        {/* Radar Chart */}
        <div className={`skills-radar ${isVisible ? 'visible' : ''}`}>
          <RadarChart 
            skills={skillCategories} 
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Skill Cards */}
        <div className="skills-grid">
          {skillCategories.map(([key, category], index) => (
            <SkillCard
              key={key}
              category={category}
              index={index}
              isVisible={isVisible}
              isActive={activeCategory === key}
              onHover={() => setActiveCategory(key)}
              onLeave={() => setActiveCategory(null)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Tech Stack Flow */}
        <div className={`tech-flow ${isVisible ? 'visible' : ''}`}>
          <h3 className="tech-flow-title">Technology Pipeline</h3>
          <div className="tech-pipeline">
            <PipelineNode label="Data Ingestion" icon="📥" delay={0} />
            <PipelineConnector />
            <PipelineNode label="Processing" icon="⚙️" delay={100} />
            <PipelineConnector />
            <PipelineNode label="ML Models" icon="🧠" delay={200} />
            <PipelineConnector />
            <PipelineNode label="Deployment" icon="🚀" delay={300} />
            <PipelineConnector />
            <PipelineNode label="Insights" icon="📊" delay={400} />
          </div>
        </div>

        <span className="section-tag closing">{'</skills>'}</span>
      </div>
    </div>
  )
}

// Radar Chart Component
const RadarChart = ({ skills, reducedMotion }) => {
  const canvasRef = useRef(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [scanAngle, setScanAngle] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setAnimationProgress(1)
      return
    }

    let progress = 0
    const animate = () => {
      progress += 0.015
      if (progress >= 1) {
        setAnimationProgress(1)
        return
      }
      setAnimationProgress(progress)
      requestAnimationFrame(animate)
    }
    animate()
  }, [reducedMotion])

  // Scanning animation
  useEffect(() => {
    if (reducedMotion) return
    
    const scanInterval = setInterval(() => {
      setScanAngle(prev => (prev + 2) % 360)
    }, 30)
    
    return () => clearInterval(scanInterval)
  }, [reducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 80

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw scanning effect
    if (!reducedMotion) {
      const scanGradient = ctx.createConicalGradient 
        ? ctx.createConicalGradient(centerX, centerY, (scanAngle * Math.PI) / 180)
        : ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      const scanRad = (scanAngle * Math.PI) / 180 - Math.PI / 2
      ctx.arc(centerX, centerY, radius, scanRad, scanRad + Math.PI / 4)
      ctx.closePath()
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, 'rgba(0, 255, 65, 0.15)')
      gradient.addColorStop(1, 'rgba(0, 255, 65, 0)')
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw concentric circles with glow
    const layers = 5
    for (let i = layers; i >= 1; i--) {
      const layerRadius = (radius / layers) * i
      ctx.beginPath()
      ctx.arc(centerX, centerY, layerRadius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0, 255, 65, ${0.08 + (i / layers) * 0.12})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw polygon grid layers
    for (let i = layers; i >= 1; i--) {
      const layerRadius = (radius / layers) * i
      ctx.beginPath()
      for (let j = 0; j < skills.length; j++) {
        const angle = (Math.PI * 2 * j) / skills.length - Math.PI / 2
        const x = centerX + Math.cos(angle) * layerRadius
        const y = centerY + Math.sin(angle) * layerRadius
        if (j === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(0, 255, 65, ${0.15 + (i / layers) * 0.1})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw axis lines with gradient
    skills.forEach(([key, category], i) => {
      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      const gradient = ctx.createLinearGradient(centerX, centerY, x, y)
      gradient.addColorStop(0, 'rgba(0, 255, 65, 0.1)')
      gradient.addColorStop(1, 'rgba(0, 255, 65, 0.4)')
      
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw labels with better positioning
      const labelRadius = radius + 45
      const labelX = centerX + Math.cos(angle) * labelRadius
      const labelY = centerY + Math.sin(angle) * labelRadius
      
      // Label background
      ctx.font = 'bold 13px JetBrains Mono'
      const label = category.name
      const textWidth = ctx.measureText(label).width
      
      ctx.fillStyle = 'rgba(10, 10, 10, 0.8)'
      ctx.fillRect(labelX - textWidth / 2 - 8, labelY - 10, textWidth + 16, 20)
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)'
      ctx.lineWidth = 1
      ctx.strokeRect(labelX - textWidth / 2 - 8, labelY - 10, textWidth + 16, 20)
      
      // Label text
      ctx.fillStyle = '#00ff41'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, labelX, labelY)
      
      // Level percentage
      ctx.font = '10px JetBrains Mono'
      ctx.fillStyle = 'rgba(0, 255, 65, 0.6)'
      ctx.fillText(`${category.level}%`, labelX, labelY + 18)
    })

    // Draw data polygon with animation
    ctx.beginPath()
    skills.forEach(([key, category], i) => {
      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
      const value = (category.level / 100) * radius * animationProgress
      const x = centerX + Math.cos(angle) * value
      const y = centerY + Math.sin(angle) * value
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    
    // Fill with gradient
    const fillGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
    fillGradient.addColorStop(0, 'rgba(0, 255, 65, 0.5)')
    fillGradient.addColorStop(0.5, 'rgba(0, 255, 65, 0.25)')
    fillGradient.addColorStop(1, 'rgba(0, 255, 65, 0.1)')
    ctx.fillStyle = fillGradient
    ctx.fill()
    
    // Outer glow stroke
    ctx.shadowColor = '#00ff41'
    ctx.shadowBlur = 15
    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw data points with pulsing effect
    skills.forEach(([key, category], i) => {
      const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2
      const value = (category.level / 100) * radius * animationProgress
      const x = centerX + Math.cos(angle) * value
      const y = centerY + Math.sin(angle) * value
      
      // Outer glow
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      const pointGlow = ctx.createRadialGradient(x, y, 0, x, y, 10)
      pointGlow.addColorStop(0, 'rgba(0, 255, 65, 0.5)')
      pointGlow.addColorStop(1, 'rgba(0, 255, 65, 0)')
      ctx.fillStyle = pointGlow
      ctx.fill()
      
      // Inner point
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#00ff41'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Center point
    ctx.beginPath()
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#00ff41'
    ctx.fill()

  }, [skills, animationProgress, scanAngle, reducedMotion])

  return (
    <div className="radar-container">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500}
        className="radar-canvas"
      />
      <div className="radar-center-label">
        <span className="radar-title">SKILL MATRIX</span>
        <span className="radar-subtitle">Proficiency Analysis</span>
      </div>
    </div>
  )
}

// Skill Card Component
const SkillCard = ({ category, index, isVisible, isActive, onHover, onLeave, reducedMotion }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    
    const delay = reducedMotion ? 0 : index * 150
    const timer = setTimeout(() => {
      if (reducedMotion) {
        setProgress(category.level)
        return
      }
      
      let current = 0
      const increment = category.level / 30
      const animate = () => {
        current += increment
        if (current >= category.level) {
          setProgress(category.level)
          return
        }
        setProgress(Math.round(current))
        requestAnimationFrame(animate)
      }
      animate()
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, category.level, index, reducedMotion])

  return (
    <div 
      className={`skill-card ${isVisible ? 'visible' : ''} ${isActive ? 'active' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="skill-card-header">
        <h3 className="skill-name">{category.name}</h3>
        <span className="skill-level">{progress}%</span>
      </div>
      
      <div className="skill-progress-bar">
        <div 
          className="skill-progress-fill"
          style={{ width: `${progress}%` }}
        />
        <div className="skill-progress-glow" style={{ left: `${progress}%` }} />
      </div>

      <div className="skill-items">
        {category.items.map((item, i) => (
          <span 
            key={i} 
            className="skill-tag"
            style={{ animationDelay: `${(index * 0.1) + (i * 0.05)}s` }}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="skill-card-decoration">
        <div className="decoration-line" />
        <div className="decoration-dot" />
      </div>
    </div>
  )
}

// Pipeline Node Component
const PipelineNode = ({ label, icon, delay }) => (
  <div 
    className="pipeline-node"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="node-icon">{icon}</div>
    <span className="node-label">{label}</span>
  </div>
)

// Pipeline Connector Component
const PipelineConnector = () => (
  <div className="pipeline-connector">
    <div className="connector-line" />
    <div className="connector-arrow">→</div>
  </div>
)

export default Skills
