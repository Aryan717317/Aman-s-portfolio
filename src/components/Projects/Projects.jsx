import { useState, useEffect, useRef } from 'react'
import { portfolioData, useMotion } from '../../App'
import './Projects.css'

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('all')
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

  const categories = ['all', ...new Set(portfolioData.projects.map(p => p.category))]
  
  const filteredProjects = filter === 'all' 
    ? portfolioData.projects 
    : portfolioData.projects.filter(p => p.category === filter)

  return (
    <div className="projects-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{'<projects>'}</span>
          <h2 className="section-title">AI Lab Projects</h2>
          <p className="section-subtitle">
            Real-world ML solutions with measurable impact
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="project-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
              onSelect={() => setSelectedProject(project)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <span className="section-tag closing">{'</projects>'}</span>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  )
}

// Project Card Component
const ProjectCard = ({ project, index, isVisible, onSelect, reducedMotion }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getCategoryColor = (category) => {
    const colors = {
      'NLP': '#00ffff',
      'Classification': '#bf00ff',
      'Data Mining': '#ff6600'
    }
    return colors[category] || '#00ff41'
  }

  return (
    <div 
      className={`project-card ${isVisible ? 'visible' : ''}`}
      style={{ 
        animationDelay: reducedMotion ? '0s' : `${index * 0.15}s`,
        '--category-color': getCategoryColor(project.category)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Card Header */}
      <div className="card-header">
        <span className="project-category" style={{ color: getCategoryColor(project.category) }}>
          {project.category}
        </span>
        <span className="project-period">{project.period}</span>
      </div>

      {/* Card Title */}
      <h3 className="project-title">{project.title}</h3>

      {/* Mini Pipeline Animation */}
      <div className="mini-pipeline">
        {project.architecture.slice(0, 3).map((step, i) => (
          <div key={i} className="mini-step">
            <div className={`step-dot ${isHovered ? 'active' : ''}`} style={{ animationDelay: `${i * 0.2}s` }} />
            <span className="step-label">{step.split(' ')[0]}</span>
          </div>
        ))}
        <span className="more-steps">+{project.architecture.length - 3}</span>
      </div>

      {/* Tech Stack */}
      <div className="project-tech">
        {project.tech.slice(0, 4).map((tech, i) => (
          <span key={i} className="tech-badge">{tech}</span>
        ))}
        {project.tech.length > 4 && (
          <span className="tech-badge more">+{project.tech.length - 4}</span>
        )}
      </div>

      {/* Key Metrics */}
      <div className="project-metrics">
        {Object.entries(project.metrics).slice(0, 3).map(([key, value]) => (
          <div key={key} className="metric">
            <span className="metric-value">{value}</span>
            <span className="metric-label">{key}</span>
          </div>
        ))}
      </div>

      {/* Hover Overlay */}
      <div className="card-overlay">
        <span className="view-details">View Details →</span>
      </div>

      {/* Corner Decoration */}
      <div className="card-corner top-left" />
      <div className="card-corner top-right" />
      <div className="card-corner bottom-left" />
      <div className="card-corner bottom-right" />
    </div>
  )
}

// Project Modal Component
const ProjectModal = ({ project, onClose, reducedMotion }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [pipelineStep, setPipelineStep] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    
    const interval = setInterval(() => {
      setPipelineStep(prev => (prev + 1) % project.architecture.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [project.architecture.length, reducedMotion])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {/* Modal Header */}
        <div className="modal-header">
          <span className="modal-category">{project.category}</span>
          <h2 className="modal-title">{project.title}</h2>
          <span className="modal-period">{project.period}</span>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {['overview', 'architecture', 'results'].map(tab => (
            <button
              key={tab}
              className={`modal-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="modal-content">
          {activeTab === 'overview' && (
            <div className="tab-overview">
              <div className="overview-section">
                <h4>Problem Statement</h4>
                <p>{project.highlights[0]}</p>
              </div>
              
              <div className="overview-section">
                <h4>Solution Approach</h4>
                <p>{project.highlights[1]}</p>
              </div>
              
              <div className="overview-section">
                <h4>Technologies Used</h4>
                <div className="tech-list">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-item">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="tab-architecture">
              <h4>ML Pipeline Architecture</h4>
              <div className="pipeline-diagram">
                {project.architecture.map((step, i) => (
                  <div 
                    key={i} 
                    className={`pipeline-step ${i === pipelineStep ? 'active' : ''} ${i < pipelineStep ? 'completed' : ''}`}
                  >
                    <div className="step-number">{i + 1}</div>
                    <div className="step-content">
                      <span className="step-name">{step}</span>
                      {i === pipelineStep && (
                        <div className="step-indicator">
                          <span className="processing">Processing...</span>
                        </div>
                      )}
                    </div>
                    {i < project.architecture.length - 1 && (
                      <div className="step-connector">
                        <div className={`connector-fill ${i < pipelineStep ? 'filled' : ''}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="tab-results">
              <h4>Key Achievements</h4>
              <div className="results-list">
                {project.highlights.map((highlight, i) => (
                  <div key={i} className="result-item">
                    <span className="result-icon">✓</span>
                    <p>{highlight}</p>
                  </div>
                ))}
              </div>
              
              <h4>Metrics</h4>
              <div className="metrics-grid">
                {Object.entries(project.metrics).map(([key, value]) => (
                  <div key={key} className="metric-card">
                    <span className="metric-value-large">{value}</span>
                    <span className="metric-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects
