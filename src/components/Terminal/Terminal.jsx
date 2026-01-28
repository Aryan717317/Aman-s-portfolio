import { useState, useRef, useEffect } from 'react'
import { portfolioData } from '../../App'
import './Terminal.css'

const Terminal = ({ onClose, onNavigate }) => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)

  const commands = {
    help: () => ({
      type: 'help',
      content: `
┌─────────────────────────────────────────────────────────────┐
│                    AVAILABLE COMMANDS                        │
├─────────────────────────────────────────────────────────────┤
│  help          - Show this help message                     │
│  about         - Display summary and bio                    │
│  skills        - Show technical skills matrix               │
│  projects      - List all ML projects                       │
│  project [n]   - Show details of project n (1-4)           │
│  experience    - Show education & certifications            │
│  education     - Display academic background                │
│  contact       - Show contact information                   │
│  clear         - Clear terminal screen                      │
├─────────────────────────────────────────────────────────────┤
│                    ADVANCED COMMANDS                         │
├─────────────────────────────────────────────────────────────┤
│  neofetch      - System information display                 │
│  whoami        - Display identity                           │
│  run model     - Simulate ML model training                 │
│  visualize     - Show embedding visualization               │
│  matrix        - Toggle matrix rain effect                  │
│  hack          - ??? (try it)                               │
│  exit          - Close terminal                             │
└─────────────────────────────────────────────────────────────┘
`
    }),

    about: () => ({
      type: 'about',
      content: `
╔═══════════════════════════════════════════════════════════════╗
║                         ABOUT ME                               ║
╚═══════════════════════════════════════════════════════════════╝

Name: ${portfolioData.name}
Role: ${portfolioData.title}
Location: ${portfolioData.location}

──────────────────────────────────────────────────────────────────

${portfolioData.summary}

──────────────────────────────────────────────────────────────────
Type 'skills' to see my technical stack
Type 'projects' to see my work
`
    }),

    skills: () => ({
      type: 'skills',
      content: `
╔═══════════════════════════════════════════════════════════════╗
║                     TECHNICAL SKILLS                           ║
╚═══════════════════════════════════════════════════════════════╝

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░ 95% │ DATA ANALYTICS
├── Python (Pandas, NumPy, Scikit-learn)
├── SQL (MySQL, PostgreSQL)
└── Advanced Excel (Pivot Tables, VLOOKUP, Power Query)

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░ 90% │ ML FRAMEWORKS
├── TensorFlow & Keras
├── BERT & Transformers
├── NLTK & SpaCy
└── React & Flask

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 88% │ BUSINESS INTELLIGENCE
├── Statistical Modeling
├── ETL Pipelines
└── System Design

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░ 85% │ CLOUD & DEVOPS
├── AWS (EC2, S3, RDS, Lambda)
├── Docker
└── Linux
`
    }),

    projects: () => ({
      type: 'projects',
      content: `
╔═══════════════════════════════════════════════════════════════╗
║                       ML PROJECTS                              ║
╚═══════════════════════════════════════════════════════════════╝

${portfolioData.projects.map((p, i) => `
[${i + 1}] ${p.title}
    Period: ${p.period}
    Tech: ${p.tech.join(', ')}
    Category: ${p.category}
`).join('\n')}

──────────────────────────────────────────────────────────────────
Type 'project [number]' for detailed info (e.g., 'project 1')
`
    }),

    education: () => ({
      type: 'education',
      content: `
╔═══════════════════════════════════════════════════════════════╗
║                        EDUCATION                               ║
╚═══════════════════════════════════════════════════════════════╝

${portfolioData.education.map(e => `
┌─ ${e.institution}
│  ${e.degree}
│  ${e.period}
└─ Grade: ${e.grade}
`).join('\n')}

══════════════════════ CERTIFICATIONS ═══════════════════════════

${portfolioData.certifications.map(c => `  ✓ ${c.name}
    Issued by: ${c.issuer}`).join('\n\n')}
`
    }),

    experience: () => commands.education(),

    contact: () => ({
      type: 'contact',
      content: `
╔═══════════════════════════════════════════════════════════════╗
║                    CONTACT INFORMATION                         ║
╚═══════════════════════════════════════════════════════════════╝

  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │   📧 Email:    ${portfolioData.email}                │
  │                                                            │
  │   📱 Phone:    ${portfolioData.phone}                      │
  │                                                            │
  │   📍 Location: ${portfolioData.location}                   │
  │                                                            │
  │   🔗 GitHub:   github.com/aryan-bharat                     │
  │                                                            │
  │   💼 LinkedIn: linkedin.com/in/aryan-bharat                │
  │                                                            │
  └────────────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────────────
Ready to collaborate on ML projects!
`
    }),

    neofetch: () => ({
      type: 'neofetch',
      content: `
        ██╗███╗   ███╗██╗          aryan@ml-portfolio
        ███║████╗ ████║██║          ──────────────────
        ╚██║██╔████╔██║██║          OS: Neural Network v2.0
         ██║██║╚██╔╝██║██║          Host: Brain.exe
         ██║██║ ╚═╝ ██║███████╗     Kernel: Python 3.11
         ╚═╝╚═╝     ╚═╝╚══════╝     Shell: TensorFlow/Keras
                                    Resolution: 1920x1080
        ┌────────────────────┐      DE: React 18
        │  ARYAN BHARAT      │      WM: Vite
        │  ML ENGINEER       │      Theme: Matrix [Dark]
        │  AI SPECIALIST     │      Terminal: Custom Shell
        └────────────────────┘      CPU: 8.5 CGPA @ CU
                                    GPU: AWS Lambda
                                    Memory: 100K+ Data Points
        ████████████████████████
`
    }),

    whoami: () => ({
      type: 'whoami',
      content: `
┌─────────────────────────────────────────────────────────────┐
│  User: aryan_bharat                                         │
│  Role: Machine Learning Engineer                            │
│  Access Level: ADMIN                                        │
│  Status: ACTIVE                                             │
│  Projects: 4                                                │
│  Efficiency Rating: 70%+ improvement achieved               │
│  Data Processed: 100K+ records                              │
│  Model Accuracy: Up to 88%                                  │
└─────────────────────────────────────────────────────────────┘
`
    }),

    'run': (args) => {
      if (args === 'model') {
        return {
          type: 'model',
          content: 'training',
          isAnimated: true
        }
      }
      return { type: 'error', content: `Unknown command: run ${args}` }
    },

    visualize: () => ({
      type: 'visualize',
      content: 'embeddings',
      isAnimated: true
    }),

    matrix: () => ({
      type: 'matrix',
      content: `
┌─────────────────────────────────────────────────────────────┐
│                    MATRIX MODE ACTIVATED                     │
│                                                             │
│     "The Matrix is everywhere. It is all around us."        │
│                        - Morpheus                           │
│                                                             │
│              Wake up, Neo... Follow the white rabbit.       │
└─────────────────────────────────────────────────────────────┘
`
    }),

    hack: () => ({
      type: 'hack',
      content: `
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                                                              
   ACCESS DENIED                                              
                                                              
   Just kidding! 😄                                           
                                                              
   This is a portfolio, not a mainframe.                     
   But I appreciate the hacker spirit!                        
                                                              
   Try 'projects' to see real ML work instead.               
                                                              
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
`,
      isAnimated: true
    }),

    clear: () => ({ type: 'clear' }),

    exit: () => ({ type: 'exit' })
  }

  const processCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const parts = trimmed.split(' ')
    const mainCmd = parts[0]
    const args = parts.slice(1).join(' ')

    // Handle project [n] command
    if (mainCmd === 'project' && args) {
      const projectNum = parseInt(args)
      if (projectNum >= 1 && projectNum <= portfolioData.projects.length) {
        const p = portfolioData.projects[projectNum - 1]
        return {
          type: 'project-detail',
          content: `
╔═══════════════════════════════════════════════════════════════╗
║  PROJECT ${projectNum}: ${p.title.toUpperCase()}
╚═══════════════════════════════════════════════════════════════╝

Period: ${p.period}
Category: ${p.category}

TECH STACK:
${p.tech.map(t => `  • ${t}`).join('\n')}

ARCHITECTURE PIPELINE:
${p.architecture.map((a, i) => `  [${i + 1}] ${a}`).join(' → \n')}

KEY ACHIEVEMENTS:
${p.highlights.map(h => `  ► ${h}`).join('\n\n')}

METRICS:
${Object.entries(p.metrics).map(([k, v]) => `  ${k.toUpperCase()}: ${v}`).join('\n')}
`
        }
      }
      return { type: 'error', content: `Project ${args} not found. Use 1-${portfolioData.projects.length}` }
    }

    // Handle run model
    if (mainCmd === 'run') {
      return commands.run(args)
    }

    if (commands[mainCmd]) {
      return commands[mainCmd]()
    }

    // Navigation commands
    const navCommands = {
      'goto skills': 'skills',
      'goto projects': 'projects',
      'goto contact': 'contact',
      'goto experience': 'experience'
    }
    
    if (navCommands[trimmed]) {
      onNavigate(navCommands[trimmed])
      return { type: 'nav', content: `Navigating to ${navCommands[trimmed]}...` }
    }

    return { type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const result = processCommand(input)
    
    // Add to command history
    setCommandHistory(prev => [...prev, input])
    setHistoryIndex(-1)

    if (result.type === 'clear') {
      setHistory([])
    } else if (result.type === 'exit') {
      onClose()
    } else {
      setHistory(prev => [...prev, { input, ...result }])
    }
    
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Welcome message
  useEffect(() => {
    setHistory([{
      type: 'welcome',
      content: `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     █████╗ ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗               ║
║    ██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║               ║
║    ███████║██████╔╝ ╚████╔╝ ███████║██╔██╗ ██║               ║
║    ██╔══██║██╔══██╗  ╚██╔╝  ██╔══██║██║╚██╗██║               ║
║    ██║  ██║██║  ██║   ██║   ██║  ██║██║ ╚████║               ║
║    ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝               ║
║                                                               ║
║           MACHINE LEARNING ENGINEER TERMINAL v2.0             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

Welcome to Aryan's interactive portfolio terminal.
Type 'help' to see available commands.
Press ESC to close this terminal.
`
    }])
  }, [])

  return (
    <div className="terminal-overlay" onClick={onClose}>
      <div className="terminal-container" onClick={e => e.stopPropagation()}>
        <div className="terminal-header">
          <div className="terminal-buttons">
            <button className="terminal-btn close" onClick={onClose} />
            <button className="terminal-btn minimize" />
            <button className="terminal-btn maximize" />
          </div>
          <div className="terminal-title">aryan@ml-portfolio: ~</div>
          <div className="terminal-actions">
            <button className="terminal-close-btn" onClick={onClose}>×</button>
          </div>
        </div>
        
        <div className="terminal-body" ref={terminalRef}>
          {history.map((item, index) => (
            <div key={index} className="terminal-entry">
              {item.input && (
                <div className="terminal-input-line">
                  <span className="prompt">aryan@portfolio:~$</span>
                  <span className="input-text">{item.input}</span>
                </div>
              )}
              <div className={`terminal-output ${item.type} ${item.isAnimated ? 'animated' : ''}`}>
                {item.type === 'model' ? (
                  <ModelTrainingAnimation />
                ) : item.type === 'visualize' ? (
                  <EmbeddingVisualization />
                ) : (
                  <pre>{item.content}</pre>
                )}
              </div>
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="prompt">aryan@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-input"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

// Model Training Animation Component
const ModelTrainingAnimation = () => {
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState(1.0)
  const [accuracy, setAccuracy] = useState(0.5)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEpoch(prev => {
        if (prev >= 10) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
      setLoss(prev => Math.max(0.1, prev - 0.08 + Math.random() * 0.02))
      setAccuracy(prev => Math.min(0.95, prev + 0.04 + Math.random() * 0.01))
    }, 500)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="model-training">
      <pre>
{`
╔═══════════════════════════════════════════════════════════════╗
║                    MODEL TRAINING SIMULATION                   ║
╚═══════════════════════════════════════════════════════════════╝

Initializing Neural Network...
Loading training data... ✓
Compiling model... ✓

Training Progress:
═══════════════════════════════════════════════════════════════

Epoch ${epoch}/10
${'█'.repeat(epoch * 6)}${'░'.repeat(60 - epoch * 6)} ${epoch * 10}%

Loss:     ${loss.toFixed(4)} ${'▓'.repeat(Math.round((1 - loss) * 20))}${'░'.repeat(20 - Math.round((1 - loss) * 20))}
Accuracy: ${(accuracy * 100).toFixed(2)}% ${'▓'.repeat(Math.round(accuracy * 20))}${'░'.repeat(20 - Math.round(accuracy * 20))}

${epoch >= 10 ? `
✓ Training Complete!
✓ Model saved to: ./models/aryan_nn_v1.h5
✓ Best accuracy achieved: 95.2%
` : 'Training in progress...'}
`}
      </pre>
    </div>
  )
}

// Embedding Visualization Component
const EmbeddingVisualization = () => {
  const [dots, setDots] = useState([])
  
  useEffect(() => {
    const newDots = []
    for (let i = 0; i < 50; i++) {
      newDots.push({
        x: Math.random() * 50 + 5,
        y: Math.random() * 15 + 2,
        cluster: Math.floor(Math.random() * 3)
      })
    }
    setDots(newDots)
  }, [])
  
  const clusterChars = ['●', '◆', '■']
  const grid = Array(20).fill(null).map(() => Array(60).fill(' '))
  
  dots.forEach(dot => {
    const x = Math.floor(dot.x)
    const y = Math.floor(dot.y)
    if (y < 20 && x < 60) {
      grid[y][x] = clusterChars[dot.cluster]
    }
  })
  
  return (
    <div className="embedding-viz">
      <pre>
{`
╔═══════════════════════════════════════════════════════════════╗
║                   NLP EMBEDDING VISUALIZATION                  ║
╚═══════════════════════════════════════════════════════════════╝

2D t-SNE Projection of BERT Embeddings:
┌────────────────────────────────────────────────────────────────┐
${grid.map(row => '│' + row.join('') + '│').join('\n')}
└────────────────────────────────────────────────────────────────┘

Legend:
  ● Cluster 1: Technical Skills
  ◆ Cluster 2: Project Descriptions  
  ■ Cluster 3: Education & Certifications

Embedding Dimensions: 768 → 2 (t-SNE reduced)
Total Vectors: ${dots.length}
`}
      </pre>
    </div>
  )
}

export default Terminal
