import { useEffect, useRef, useState } from 'react'
import { useMotion } from '../../App'
import './MatrixLoader.css'

const MatrixLoader = ({ onComplete }) => {
  const canvasRef = useRef(null)
  const [loadingText, setLoadingText] = useState('')
  const [systemLogs, setSystemLogs] = useState([])
  const [progress, setProgress] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)
  const { reducedMotion } = useMotion()

  const mainText = "Initializing Aman's Portfolio..."
  
  const logs = [
    ">> Booting neural network subsystem...",
    ">> Loading TensorFlow modules [OK]",
    ">> Initializing BERT embeddings...",
    ">> Connecting to ML pipeline...",
    ">> Loading project data [4 projects found]",
    ">> Calibrating skill matrices...",
    ">> AWS Lambda functions ready",
    ">> NLP engines initialized",
    ">> Rendering 3D neural network...",
    ">> System ready. Welcome, User."
  ]

  // Matrix rain effect
  useEffect(() => {
    if (reducedMotion) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/*-+=%$#@!&'
    const charArray = chars.split('')
    
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns).fill(1)
    
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff41'
      ctx.font = `${fontSize}px monospace`
      
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        
        // Varying brightness
        const brightness = Math.random()
        if (brightness > 0.95) {
          ctx.fillStyle = '#ffffff'
        } else if (brightness > 0.8) {
          ctx.fillStyle = '#00ff41'
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.3 + brightness * 0.5})`
        }
        
        ctx.fillText(char, x, y)
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    const interval = setInterval(draw, 33)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [reducedMotion])

  // Typing effect
  useEffect(() => {
    let index = 0
    const typeInterval = setInterval(() => {
      if (index <= mainText.length) {
        setLoadingText(mainText.slice(0, index))
        index++
      } else {
        clearInterval(typeInterval)
      }
    }, 80)
    
    return () => clearInterval(typeInterval)
  }, [])

  // System logs
  useEffect(() => {
    let logIndex = 0
    const logInterval = setInterval(() => {
      if (logIndex < logs.length) {
        const currentLog = logs[logIndex]
        if (currentLog) {
          setSystemLogs(prev => [...prev, currentLog])
          setProgress(((logIndex + 1) / logs.length) * 100)
        }
        logIndex++
      } else {
        clearInterval(logInterval)
        // Trigger glitch effect before transition
        setGlitchActive(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    }, 400)
    
    return () => clearInterval(logInterval)
  }, [onComplete])

  // Random glitch effect
  useEffect(() => {
    if (reducedMotion) return
    
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 100)
      }
    }, 500)
    
    return () => clearInterval(glitchInterval)
  }, [reducedMotion])

  return (
    <div className={`matrix-loader ${glitchActive ? 'glitch' : ''}`}>
      <canvas ref={canvasRef} className="matrix-rain" />
      
      <div className="loader-content">
        <div className="loader-header">
          <div className="system-icon">
            <div className="icon-ring" />
            <div className="icon-ring" />
            <div className="icon-ring" />
            <span className="icon-text">AI</span>
          </div>
        </div>
        
        <h1 className={`loading-text ${glitchActive ? 'glitch-text' : ''}`}>
          {loadingText}
          <span className="cursor">_</span>
        </h1>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
        
        <div className="system-logs">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="terminal-title">system_init.sh</span>
            <div className="terminal-status">
              <span className="status-indicator"></span>
              LIVE
            </div>
          </div>
          <div className="logs-content">
            <div className="scan-line"></div>
            {systemLogs.filter(log => log).map((log, index) => {
              const isSuccess = log.includes('[OK]') || log.includes('ready') || log.includes('initialized');
              const isLoading = log.includes('...');
              return (
                <div 
                  key={index} 
                  className={`log-entry ${isSuccess ? 'success' : ''} ${isLoading && index === systemLogs.length - 1 ? 'loading' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="log-prefix">{String(index + 1).padStart(2, '0')}</span>
                  <span className="log-icon">{isSuccess ? '✓' : isLoading ? '⟳' : '›'}</span>
                  <span className="log-text">{log.replace('>>', '').trim()}</span>
                  {isSuccess && <span className="log-status">DONE</span>}
                </div>
              );
            })}
            <div className="cursor-line">
              <span className="prompt">aryan@ml-system:~$</span>
              <span className="cursor-block">_</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="corner-decorations">
        <div className="corner top-left" />
        <div className="corner top-right" />
        <div className="corner bottom-left" />
        <div className="corner bottom-right" />
      </div>
    </div>
  )
}

export default MatrixLoader
