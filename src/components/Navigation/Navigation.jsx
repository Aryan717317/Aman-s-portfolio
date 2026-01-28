import { useState, useEffect } from 'react'
import './Navigation.css'

const Navigation = ({ activeSection, onNavigate, onTerminalToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'hero', label: 'Home', icon: '⌂' },
    { id: 'skills', label: 'Skills', icon: '◈' },
    { id: 'projects', label: 'Projects', icon: '▣' },
    { id: 'ml-visuals', label: 'ML Lab', icon: '◉' },
    { id: 'experience', label: 'Experience', icon: '▤' },
    { id: 'contact', label: 'Contact', icon: '✉' }
  ]

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => handleNavClick('hero')}>
          <span className="logo-bracket">{'<'}</span>
          <span className="logo-text">ABK</span>
          <span className="logo-bracket">{'/>'}</span>
        </div>

        {/* Desktop Nav */}
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Terminal Button */}
        <button className="terminal-toggle" onClick={onTerminalToggle}>
          <span className="terminal-icon">{'>'}_</span>
          <span className="terminal-label">Terminal</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        <button className="mobile-terminal-btn" onClick={() => { onTerminalToggle(); setIsMobileMenuOpen(false); }}>
          <span className="terminal-icon">{'>'}_</span>
          <span>Open Terminal</span>
        </button>
      </div>
    </nav>
  )
}

export default Navigation
