import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import { portfolioData, useMotion } from '../../App'
import * as THREE from 'three'
import './Hero.css'

// Error boundary component for 3D canvas
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    console.error('Canvas Error:', error)
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Canvas Error Details:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div className="canvas-fallback" style={{ 
        width: '100%', 
        height: '100%', 
        background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 100%)'
      }} />
    }
    return this.props.children
  }
}

// Neural Network Node with enhanced visuals
function NeuralNode({ position, delay = 0, size = 0.06, layer = 0 }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [pulsePhase] = useState(() => Math.random() * Math.PI * 2)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + delay
    
    // Organic floating motion
    meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + pulsePhase) * 0.15
    meshRef.current.position.x = position[0] + Math.cos(time * 0.8 + pulsePhase) * 0.05
    
    // Pulsing scale
    const pulse = 1 + Math.sin(time * 3 + pulsePhase) * 0.2
    meshRef.current.scale.setScalar(hovered ? 2 : pulse)
    
    // Glow effect
    if (glowRef.current) {
      glowRef.current.scale.setScalar(hovered ? 4 : 2 + Math.sin(time * 2) * 0.5)
      glowRef.current.material.opacity = hovered ? 0.4 : 0.15 + Math.sin(time * 3) * 0.1
    }
  })
  
  // Color based on layer depth
  const nodeColor = useMemo(() => {
    const colors = ['#00ff41', '#00ffaa', '#00ff41', '#41ff00', '#00ff41']
    return colors[layer % colors.length]
  }, [layer])
  
  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 3, 16, 16]} />
        <meshBasicMaterial 
          color={nodeColor}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
      
      {/* Main node */}
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered ? 3 : 1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

// Animated connection with data flow effect
function NeuralConnection({ start, end, delay = 0 }) {
  const lineRef = useRef()
  const particleRef = useRef()
  const flowPositionRef = useRef(Math.random())
  
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime + delay
    // Animate flow along the line
    flowPositionRef.current = (time * 0.5) % 1
    
    // Update particle position
    if (particleRef.current) {
      const startVec = new THREE.Vector3(...start)
      const endVec = new THREE.Vector3(...end)
      const pos = startVec.lerp(endVec, flowPositionRef.current)
      particleRef.current.position.copy(pos)
    }
  })
  
  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color="#00ff41"
        lineWidth={1}
        opacity={0.25}
        transparent
      />
      {/* Data flow particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#00ff41" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// Massive 3D Neural Network filling the entire screen
function NeuralNetwork() {
  const groupRef = useRef()
  const { reducedMotion } = useMotion()
  
  // Generate a massive, screen-filling neural network
  const layers = useMemo(() => {
    const nodes = []
    // Extended layers spread across the entire viewport
    const layerConfigs = [
      { count: 12, radius: 6, x: -18 },
      { count: 16, radius: 7, x: -14 },
      { count: 20, radius: 8, x: -10 },
      { count: 24, radius: 9, x: -6 },
      { count: 28, radius: 10, x: -2 },
      { count: 32, radius: 11, x: 2 },
      { count: 28, radius: 10, x: 6 },
      { count: 24, radius: 9, x: 10 },
      { count: 20, radius: 8, x: 14 },
      { count: 16, radius: 7, x: 18 },
    ]
    
    layerConfigs.forEach((config, layerIndex) => {
      for (let i = 0; i < config.count; i++) {
        const angle = (i / config.count) * Math.PI * 2
        const verticalSpread = (Math.random() - 0.5) * 4
        const y = Math.cos(angle) * config.radius + verticalSpread
        const z = Math.sin(angle) * config.radius + (Math.random() - 0.5) * 4
        
        nodes.push({
          position: [config.x, y, z],
          layer: layerIndex,
          index: i,
          size: 0.06 + Math.random() * 0.06
        })
      }
    })
    
    // Add many scattered ambient nodes across entire screen
    for (let i = 0; i < 150; i++) {
      nodes.push({
        position: [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20
        ],
        layer: Math.floor(Math.random() * 10),
        index: i,
        size: 0.03 + Math.random() * 0.05
      })
    }
    
    // Add edge nodes at corners
    const corners = [
      [-25, 12, -5], [25, 12, -5], [-25, -12, -5], [25, -12, -5],
      [-25, 12, 5], [25, 12, 5], [-25, -12, 5], [25, -12, 5],
      [-20, 15, 0], [20, 15, 0], [-20, -15, 0], [20, -15, 0],
    ]
    corners.forEach((pos, i) => {
      nodes.push({
        position: pos,
        layer: i % 10,
        index: i,
        size: 0.08 + Math.random() * 0.04
      })
    })
    
    return nodes
  }, [])
  
  // Generate more connections
  const connections = useMemo(() => {
    const conns = []
    layers.forEach((node, i) => {
      layers.forEach((other, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(node.position[0] - other.position[0], 2) +
            Math.pow(node.position[1] - other.position[1], 2) +
            Math.pow(node.position[2] - other.position[2], 2)
          )
          // Connect nearby nodes with increased distance threshold
          if (distance < 6 && Math.random() > 0.92) {
            conns.push({
              start: node.position,
              end: other.position,
              delay: Math.random() * 5
            })
          }
        }
      })
    })
    return conns
  }, [layers])
  
  useFrame((state) => {
    if (!reducedMotion && groupRef.current) {
      // Slow, majestic rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.08) * 0.05
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {layers.map((node, i) => (
        <NeuralNode 
          key={i} 
          position={node.position}
          size={node.size}
          layer={node.layer}
          delay={i * 0.05}
        />
      ))}
      
      {/* Connections */}
      {connections.map((conn, i) => (
        <NeuralConnection 
          key={i} 
          start={conn.start} 
          end={conn.end}
          delay={conn.delay}
        />
      ))}
      
      {/* Multiple light sources for depth */}
      <pointLight position={[0, 0, 0]} color="#00ff41" intensity={3} distance={10} />
      <pointLight position={[-5, 2, 0]} color="#00ffaa" intensity={1} distance={8} />
      <pointLight position={[5, -2, 0]} color="#41ff00" intensity={1} distance={8} />
    </group>
  )
}

// Enhanced floating particles - Matrix rain style covering full screen
function Particles({ count = 200 }) {
  const meshRef = useRef()
  const particlesRef = useRef([])
  
  // Initialize particles only once - spread across entire viewport
  useMemo(() => {
    particlesRef.current = []
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        position: [
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30
        ],
        speed: 0.02 + Math.random() * 0.05,
        size: 0.03 + Math.random() * 0.05
      })
    }
  }, [count])
  
  const positions = useMemo(() => {
    return new Float32Array(count * 3)
  }, [count])
  
  useFrame(() => {
    particlesRef.current.forEach((particle, i) => {
      particle.position[1] -= particle.speed
      if (particle.position[1] < -20) {
        particle.position[1] = 20
        particle.position[0] = (Math.random() - 0.5) * 60
        particle.position[2] = (Math.random() - 0.5) * 30
      }
      positions[i * 3] = particle.position[0]
      positions[i * 3 + 1] = particle.position[1]
      positions[i * 3 + 2] = particle.position[2]
    })
    
    if (meshRef.current && meshRef.current.geometry.attributes.position) {
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        color="#00ff41" 
        transparent 
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

// Grid floor for depth - expanded to fill screen
function GridFloor() {
  return (
    <group>
      <gridHelper 
        args={[80, 80, '#003311', '#001a09']} 
        position={[0, -15, 0]}
        rotation={[0, 0, 0]}
      />
      {/* Second tilted grid for more depth */}
      <gridHelper 
        args={[60, 40, '#002208', '#001105']} 
        position={[0, -20, -10]}
        rotation={[0.3, 0, 0]}
      />
    </group>
  )
}

// Simple mobile fallback background
function MobileFallback() {
  return (
    <div className="hero-mobile-bg">
      <div className="mobile-grid" />
      <div className="mobile-glow" />
    </div>
  )
}

const Hero = ({ onTerminalOpen, isMobile }) => {
  const { reducedMotion } = useMotion()
  
  const handleDownloadResume = () => {
    // Create a text-based resume download since we don't have the actual PDF
    const resumeContent = `
ARYAN BHARAT KUMAR
Aman Bharat Kumar
Machine Learning Engineer | AI & Data Systems

Contact: ar22073yan@gmail.com | +91 7906012018
Location: Dehradun, India

SUMMARY
${portfolioData.summary}

TECHNICAL SKILLS
- Data Analytics: Python, Pandas, NumPy, Scikit-learn, SQL, Advanced Excel
- Cloud & Tools: AWS (EC2, S3, RDS, Lambda), Docker, GitHub, Linux
- ML Frameworks: TensorFlow, Keras, BERT, NLTK, SpaCy

PROJECTS
${portfolioData.projects.map(p => `
${p.title} (${p.period})
${p.highlights.join('\n')}`).join('\n')}

EDUCATION
${portfolioData.education.map(e => `${e.degree} - ${e.institution} (${e.period}) - ${e.grade}`).join('\n')}

CERTIFICATIONS
${portfolioData.certifications.map(c => `- ${c.name} (${c.issuer})`).join('\n')}
    `.trim()
    
    const blob = new Blob([resumeContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Aryan_Bharat_Kumar_Resume.txt'
      a.download = 'Aman_Bharat_Kumar_Resume.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="hero">
      {/* 3D Canvas - Full Screen Background (disabled on mobile for performance) */}
      {!isMobile ? (
        <div className="hero-canvas">
          <CanvasErrorBoundary>
            <Canvas 
              camera={{ position: [0, 0, 25], fov: 90 }}
              dpr={[1, 1.5]}
              gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
              style={{ width: '100vw', height: '100vh' }}
              frameloop={reducedMotion ? 'demand' : 'always'}
            >
              <Suspense fallback={null}>
                <color attach="background" args={['#030303']} />
                <fog attach="fog" args={['#030303', 15, 60]} />
                
                <ambientLight intensity={0.2} />
                <pointLight position={[20, 15, 15]} color="#00ff41" intensity={1.2} />
                <pointLight position={[-20, -15, -15]} color="#00ffaa" intensity={0.8} />
                
                <NeuralNetwork />
                {!reducedMotion && <Particles count={200} />}
                <GridFloor />
                
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false}
                  autoRotate={!reducedMotion}
                  autoRotateSpeed={0.3}
                  maxPolarAngle={Math.PI / 1.8}
                  minPolarAngle={Math.PI / 3}
                />
              </Suspense>
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      ) : (
        <MobileFallback />
      )}
      
      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          <span>SYSTEM ONLINE</span>
        </div>
        
        <h1 className="hero-title">
          <span className="title-line">{portfolioData.name.split(' ')[0]}</span>
          <span className="title-line accent">{portfolioData.name.split(' ').slice(1).join(' ')}</span>
        </h1>
        
        <div className="hero-subtitle">
          <span className="typing-text">{portfolioData.title}</span>
          <span className="separator">|</span>
          <span className="typing-text">{portfolioData.subtitle}</span>
        </div>
        
        <p className="hero-description">
          Analytical AI & Machine Learning Engineer in training, operating at the intersection of data, systems, and intelligence.
          <br /><br />
          I build scalable ML and NLP solutions using Python, SQL, and cloud infrastructure to extract insight from complex datasets.
          <br /><br />
          Focused on turning raw data into high-impact, production-ready intelligent systems.
        </p>
        
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">4+</span>
            <span className="stat-label">ML Projects</span>
          </div>
          <div className="stat">
            <span className="stat-value">70%</span>
            <span className="stat-label">Efficiency Boost</span>
          </div>
          <div className="stat">
            <span className="stat-value">100K+</span>
            <span className="stat-label">Data Points</span>
          </div>
        </div>
        
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onTerminalOpen}>
            <span className="btn-icon">{'>'}_</span>
            Enter Terminal
          </button>
          <a href="#projects" className="btn btn-secondary">
            <span className="btn-icon">◈</span>
            View Projects
          </a>
          <button className="btn btn-outline" onClick={handleDownloadResume}>
            <span className="btn-icon">↓</span>
            Download Resume
          </button>
        </div>
        
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow" />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="hero-decorations">
        <div className="grid-overlay" />
        <div className="hex-pattern" />
      </div>
    </div>
  )
}

export default Hero
