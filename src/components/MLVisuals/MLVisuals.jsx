import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Text } from '@react-three/drei'
import { useMotion } from '../../App'
import * as THREE from 'three'
import './MLVisuals.css'

const MLVisuals = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeDemo, setActiveDemo] = useState('neural')
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

  const demos = [
    { id: 'neural', label: 'Neural Network', icon: '🧠' },
    { id: 'cnn', label: 'CNN Architecture', icon: '🔍' },
    { id: 'loss', label: 'Training Loss', icon: '📉' },
    { id: 'classification', label: 'Classification', icon: '🎯' },
    { id: 'embeddings', label: 'NLP Embeddings', icon: '📊' }
  ]

  return (
    <div className="ml-visuals-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{'<ml-visualizations>'}</span>
          <h2 className="section-title">Interactive ML Lab</h2>
          <p className="section-subtitle">
            Explore machine learning concepts in action
          </p>
        </div>

        {/* Demo Selector */}
        <div className="demo-selector">
          {demos.map((demo, index) => (
            <button
              key={demo.id}
              className={`demo-btn ${activeDemo === demo.id ? 'active' : ''}`}
              onClick={() => setActiveDemo(demo.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="demo-icon">{demo.icon}</span>
              <span className="demo-label">{demo.label}</span>
              <div className="demo-btn-glow" />
            </button>
          ))}
        </div>

        {/* Visualization Area */}
        <div className={`visualization-container ${isVisible ? 'visible' : ''}`}>
          {activeDemo === 'neural' && (
            <NeuralNetworkDemo reducedMotion={reducedMotion} />
          )}
          {activeDemo === 'cnn' && (
            <CNNDemo reducedMotion={reducedMotion} />
          )}
          {activeDemo === 'loss' && (
            <TrainingLossDemo reducedMotion={reducedMotion} />
          )}
          {activeDemo === 'classification' && (
            <ClassificationDemo reducedMotion={reducedMotion} />
          )}
          {activeDemo === 'embeddings' && (
            <EmbeddingsDemo reducedMotion={reducedMotion} />
          )}
        </div>

        <span className="section-tag closing">{'</ml-visualizations>'}</span>
      </div>
    </div>
  )
}

// Enhanced Neural Network Demo with better animations
const NeuralNetworkDemo = ({ reducedMotion }) => {
  const layers = [4, 6, 8, 6, 4, 3]
  const [signals, setSignals] = useState([])
  const [hoveredNode, setHoveredNode] = useState(null)
  const [isForwardPass, setIsForwardPass] = useState(true)
  const signalIdRef = useRef(0)
  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ width: 600, height: 300 })

  // Measure container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: Math.max(300, rect.height) })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Create signal pulses that travel through the network
  useEffect(() => {
    if (reducedMotion) return
    
    const interval = setInterval(() => {
      const startLayer = isForwardPass ? 0 : layers.length - 1
      const endLayer = isForwardPass ? 1 : layers.length - 2
      const newSignal = {
        id: signalIdRef.current++,
        fromLayer: startLayer,
        toLayer: endLayer,
        fromNode: Math.floor(Math.random() * layers[startLayer]),
        toNode: Math.floor(Math.random() * layers[endLayer]),
        progress: 0,
        color: isForwardPass ? '#00ff41' : '#ff6600'
      }
      
      setSignals(prev => [...prev.slice(-12), newSignal])
      
      if (Math.random() > 0.92) {
        setIsForwardPass(prev => !prev)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [reducedMotion, isForwardPass, layers])

  // Update signal progress
  useEffect(() => {
    if (reducedMotion || signals.length === 0) return
    
    const animFrame = setInterval(() => {
      setSignals(prev => {
        return prev.map(s => {
          const newProgress = s.progress + 0.06
          if (newProgress >= 1) {
            const nextLayer = isForwardPass 
              ? Math.min(s.toLayer + 1, layers.length - 1)
              : Math.max(s.toLayer - 1, 0)
            if (nextLayer === s.toLayer) return null
            return {
              ...s,
              fromLayer: s.toLayer,
              toLayer: nextLayer,
              fromNode: s.toNode,
              toNode: Math.floor(Math.random() * layers[nextLayer]),
              progress: 0
            }
          }
          return { ...s, progress: newProgress }
        }).filter(Boolean)
      })
    }, 30)

    return () => clearInterval(animFrame)
  }, [reducedMotion, signals.length, isForwardPass, layers])

  const getNodePosition = useCallback((layerIdx, nodeIdx, totalNodes) => {
    const padding = 50
    const usableWidth = containerSize.width - padding * 2
    const usableHeight = containerSize.height - 60
    const x = padding + (usableWidth / (layers.length - 1)) * layerIdx
    const nodeSpacing = usableHeight / (totalNodes + 1)
    const y = 30 + nodeSpacing * (nodeIdx + 1)
    return { x, y }
  }, [containerSize, layers.length])

  const getSignalPosition = useCallback((signal) => {
    if (!layers[signal.fromLayer] || !layers[signal.toLayer]) return { x: 0, y: 0 }
    const from = getNodePosition(signal.fromLayer, signal.fromNode, layers[signal.fromLayer])
    const to = getNodePosition(signal.toLayer, signal.toNode, layers[signal.toLayer])
    return {
      x: from.x + (to.x - from.x) * signal.progress,
      y: from.y + (to.y - from.y) * signal.progress
    }
  }, [getNodePosition, layers])

  const layerNames = ['Input', 'H1', 'H2', 'H3', 'H4', 'Output']

  return (
    <div className="demo-content neural-demo-enhanced">
      <div className="demo-header">
        <h3>Deep Neural Network</h3>
        <p>Watch data flow through layers with backpropagation</p>
      </div>
      
      <div className="neural-network-viz enhanced" ref={containerRef}>
        <svg 
          className="nn-svg-full" 
          viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Draw connections */}
          {layers.map((nodeCount, layerIdx) => {
            if (layerIdx === layers.length - 1) return null
            const nextLayerNodes = layers[layerIdx + 1]
            
            return Array.from({ length: nodeCount }).map((_, nodeIdx) => {
              const from = getNodePosition(layerIdx, nodeIdx, nodeCount)
              
              return Array.from({ length: nextLayerNodes }).map((_, nextNodeIdx) => {
                const to = getNodePosition(layerIdx + 1, nextNodeIdx, nextLayerNodes)
                const isHighlighted = hoveredNode?.layer === layerIdx && hoveredNode?.node === nodeIdx
                
                return (
                  <line
                    key={`conn-${layerIdx}-${nodeIdx}-${nextNodeIdx}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHighlighted ? '#00ff41' : 'rgba(0, 255, 65, 0.12)'}
                    strokeWidth={isHighlighted ? 2 : 0.5}
                  />
                )
              })
            })
          })}
          
          {/* Draw signal pulses */}
          {signals.map(signal => {
            const pos = getSignalPosition(signal)
            if (!pos.x && !pos.y) return null
            return (
              <g key={signal.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="10"
                  fill={signal.color}
                  opacity={0.25}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="5"
                  fill={signal.color}
                />
              </g>
            )
          })}
          
          {/* Draw nodes */}
          {layers.map((nodeCount, layerIdx) => (
            <g key={`layer-${layerIdx}`}>
              {/* Layer label */}
              <text
                x={getNodePosition(layerIdx, 0, nodeCount).x}
                y={15}
                textAnchor="middle"
                fill="rgba(0, 255, 65, 0.6)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {layerNames[layerIdx]}
              </text>
              
              {/* Nodes */}
              {Array.from({ length: nodeCount }).map((_, nodeIdx) => {
                const pos = getNodePosition(layerIdx, nodeIdx, nodeCount)
                const hasActiveSignal = signals.some(
                  s => (s.fromLayer === layerIdx && s.fromNode === nodeIdx) ||
                       (s.toLayer === layerIdx && s.toNode === nodeIdx && s.progress > 0.7)
                )
                const isHovered = hoveredNode?.layer === layerIdx && hoveredNode?.node === nodeIdx
                
                return (
                  <g key={`node-${layerIdx}-${nodeIdx}`}>
                    {/* Glow effect */}
                    {(hasActiveSignal || isHovered) && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="12"
                        fill="none"
                        stroke="#00ff41"
                        strokeWidth="1"
                        opacity={0.5}
                      />
                    )}
                    {/* Main node */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="8"
                      fill={hasActiveSignal ? '#00ff41' : '#0a0a0a'}
                      stroke={hasActiveSignal || isHovered ? '#00ff41' : '#00aa30'}
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredNode({ layer: layerIdx, node: nodeIdx })}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                  </g>
                )
              })}
            </g>
          ))}
        </svg>
      </div>
      
      <div className="demo-stats enhanced">
        <div className="stat-item">
          <span className="stat-label">Architecture</span>
          <span className="stat-value">{layers.join('-')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Parameters</span>
          <span className="stat-value animated-number">~850</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mode</span>
          <span className="stat-value" style={{ color: isForwardPass ? '#00ff41' : '#ff6600' }}>
            {isForwardPass ? 'Forward' : 'Backward'}
          </span>
        </div>
        <div className="stat-item clickable" onClick={() => setIsForwardPass(!isForwardPass)}>
          <span className="stat-label">Toggle</span>
          <span className="stat-value toggle-btn">⟳</span>
        </div>
      </div>
    </div>
  )
}

// NEW: CNN Demo with feature maps and pooling visualization
const CNNDemo = ({ reducedMotion }) => {
  const [activeLayer, setActiveLayer] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)
  const [featureMapData, setFeatureMapData] = useState([])
  const canvasRef = useRef(null)

  const cnnLayers = [
    { name: 'Input', size: 32, channels: 3, type: 'input', color: '#00ff41' },
    { name: 'Conv2D', size: 30, channels: 32, type: 'conv', color: '#00ffff' },
    { name: 'MaxPool', size: 15, channels: 32, type: 'pool', color: '#bf00ff' },
    { name: 'Conv2D', size: 13, channels: 64, type: 'conv', color: '#00ffff' },
    { name: 'MaxPool', size: 6, channels: 64, type: 'pool', color: '#bf00ff' },
    { name: 'Conv2D', size: 4, channels: 128, type: 'conv', color: '#00ffff' },
    { name: 'Flatten', size: 2048, channels: 1, type: 'flatten', color: '#ff6600' },
    { name: 'Dense', size: 256, channels: 1, type: 'dense', color: '#ffff00' },
    { name: 'Output', size: 10, channels: 1, type: 'output', color: '#00ff41' }
  ]

  // Animate through layers
  useEffect(() => {
    if (reducedMotion || !isProcessing) return
    
    const interval = setInterval(() => {
      setActiveLayer(prev => (prev + 1) % cnnLayers.length)
    }, 800)

    return () => clearInterval(interval)
  }, [reducedMotion, isProcessing])

  // Generate feature map visualization data
  useEffect(() => {
    const generateFeatureMap = () => {
      const data = []
      for (let i = 0; i < 64; i++) {
        data.push(Math.random())
      }
      return data
    }
    
    setFeatureMapData(generateFeatureMap())
    
    if (reducedMotion) return
    
    const interval = setInterval(() => {
      setFeatureMapData(generateFeatureMap())
    }, 500)

    return () => clearInterval(interval)
  }, [reducedMotion])

  // Draw feature map on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const size = 8
    const cellSize = Math.floor(canvas.width / size)
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    featureMapData.forEach((value, idx) => {
      const x = (idx % size) * cellSize
      const y = Math.floor(idx / size) * cellSize
      
      const intensity = Math.floor(value * 255)
      ctx.fillStyle = `rgba(0, ${intensity}, ${Math.floor(intensity * 0.25)}, 1)`
      ctx.fillRect(x, y, cellSize - 1, cellSize - 1)
    })
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i <= size; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvas.width, i * cellSize)
      ctx.stroke()
    }
  }, [featureMapData])

  return (
    <div className="demo-content cnn-demo">
      <div className="demo-header">
        <h3>Convolutional Neural Network</h3>
        <p>Image classification architecture with feature extraction</p>
      </div>
      
      <div className="cnn-architecture">
        {/* Input Image */}
        <div className="cnn-input-section">
          <div className="input-image">
            <canvas 
              ref={canvasRef} 
              width={160} 
              height={160} 
              className="feature-map-canvas"
            />
            <div className="input-label">Feature Map</div>
          </div>
        </div>

        {/* Layer Pipeline */}
        <div className="cnn-pipeline">
          {cnnLayers.map((layer, idx) => (
            <div 
              key={idx}
              className={`cnn-layer-block ${activeLayer === idx ? 'active' : ''} ${activeLayer > idx ? 'completed' : ''}`}
              style={{ 
                '--layer-color': layer.color,
                animationDelay: `${idx * 0.1}s`
              }}
              onClick={() => {
                setActiveLayer(idx)
                setIsProcessing(false)
              }}
            >
              <div className="layer-visual">
                {layer.type === 'input' && (
                  <div className="layer-cube input-cube">
                    <div className="cube-face">32×32×3</div>
                  </div>
                )}
                {layer.type === 'conv' && (
                  <div className="layer-cube conv-cube">
                    <div className="cube-face">{layer.size}×{layer.size}</div>
                    <div className="kernel-indicator">3×3</div>
                  </div>
                )}
                {layer.type === 'pool' && (
                  <div className="layer-cube pool-cube">
                    <div className="cube-face">{layer.size}×{layer.size}</div>
                    <div className="pool-indicator">↓2×2</div>
                  </div>
                )}
                {layer.type === 'flatten' && (
                  <div className="layer-flat flatten-block">
                    <div className="flat-label">{layer.size}</div>
                  </div>
                )}
                {layer.type === 'dense' && (
                  <div className="layer-flat dense-block">
                    <div className="flat-label">{layer.size}</div>
                  </div>
                )}
                {layer.type === 'output' && (
                  <div className="layer-flat output-block">
                    <div className="flat-label">{layer.size}</div>
                  </div>
                )}
              </div>
              <div className="layer-info">
                <span className="layer-name">{layer.name}</span>
                <span className="layer-channels">{layer.channels}ch</span>
              </div>
              {idx < cnnLayers.length - 1 && (
                <div className={`layer-arrow ${activeLayer === idx ? 'active' : ''}`}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M8 4l8 8-8 8" stroke="currentColor" fill="none" strokeWidth="2"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Data Flow Animation */}
        <div className="data-flow-indicator">
          <div 
            className="flow-progress" 
            style={{ width: `${(activeLayer / (cnnLayers.length - 1)) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="demo-stats cnn-stats">
        <div className="stat-item">
          <span className="stat-label">Current Layer</span>
          <span className="stat-value" style={{ color: cnnLayers[activeLayer].color }}>
            {cnnLayers[activeLayer].name}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Output Shape</span>
          <span className="stat-value">
            {cnnLayers[activeLayer].type === 'flatten' || cnnLayers[activeLayer].type === 'dense' || cnnLayers[activeLayer].type === 'output'
              ? cnnLayers[activeLayer].size
              : `${cnnLayers[activeLayer].size}×${cnnLayers[activeLayer].size}×${cnnLayers[activeLayer].channels}`
            }
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Parameters</span>
          <span className="stat-value">~2.4M</span>
        </div>
        <div 
          className="stat-item clickable" 
          onClick={() => setIsProcessing(!isProcessing)}
        >
          <span className="stat-label">Animation</span>
          <span className="stat-value toggle-btn">
            {isProcessing ? '⏸' : '▶'}
          </span>
        </div>
      </div>
    </div>
  )
}

// Enhanced Training Loss Demo
const TrainingLossDemo = ({ reducedMotion }) => {
  const canvasRef = useRef(null)
  const [epoch, setEpoch] = useState(0)
  const [metrics, setMetrics] = useState({ loss: 1.0, accuracy: 0.1, valLoss: 1.1, valAcc: 0.08 })
  const dataRef = useRef({ lossData: [], accData: [], valLossData: [], valAccData: [] })

  useEffect(() => {
    if (reducedMotion) return
    
    const interval = setInterval(() => {
      setEpoch(prev => {
        if (prev >= 50) {
          dataRef.current = { lossData: [], accData: [], valLossData: [], valAccData: [] }
          return 0
        }
        
        const progress = prev / 50
        const noise = (Math.random() - 0.5) * 0.1
        const valNoise = (Math.random() - 0.5) * 0.15
        
        const newLoss = Math.max(0.05, 0.9 * Math.exp(-3 * progress) + noise)
        const newAcc = Math.min(0.98, 0.1 + 0.85 * (1 - Math.exp(-4 * progress)) + noise)
        const newValLoss = Math.max(0.08, 0.95 * Math.exp(-2.5 * progress) + valNoise)
        const newValAcc = Math.min(0.95, 0.08 + 0.8 * (1 - Math.exp(-3.5 * progress)) + valNoise)
        
        dataRef.current.lossData.push(newLoss)
        dataRef.current.accData.push(newAcc)
        dataRef.current.valLossData.push(newValLoss)
        dataRef.current.valAccData.push(newValAcc)
        
        setMetrics({ loss: newLoss, accuracy: newAcc, valLoss: newValLoss, valAcc: newValAcc })
        
        return prev + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [reducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const padding = 50

    ctx.clearRect(0, 0, width, height)

    // Draw grid with glow effect
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - padding * 2) * (i / 5)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      
      // Y-axis labels
      ctx.fillStyle = 'rgba(0, 255, 65, 0.5)'
      ctx.font = '10px JetBrains Mono'
      ctx.fillText((1 - i / 5).toFixed(1), 15, y + 4)
    }
    
    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const x = padding + (width - padding * 2) * (i / 5)
      ctx.fillText(`${i * 10}`, x - 5, height - 15)
    }

    const drawCurve = (data, color, isDashed = false) => {
      if (data.length < 2) return
      
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      if (isDashed) ctx.setLineDash([5, 5])
      else ctx.setLineDash([])
      
      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      
      data.forEach((value, i) => {
        const x = padding + (width - padding * 2) * (i / 50)
        const y = padding + (height - padding * 2) * value
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Draw curves
    drawCurve(dataRef.current.lossData, '#ff6600')
    drawCurve(dataRef.current.valLossData, '#ff6600', true)
    drawCurve(dataRef.current.accData.map(v => 1 - v), '#00ff41')
    drawCurve(dataRef.current.valAccData.map(v => 1 - v), '#00ff41', true)

    // Labels
    ctx.font = '12px JetBrains Mono'
    ctx.fillStyle = '#00ff41'
    ctx.shadowBlur = 0
    ctx.setLineDash([])
    ctx.fillText('Epoch', width / 2 - 20, height - 5)
    
    ctx.save()
    ctx.translate(10, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Value', -15, 0)
    ctx.restore()

  }, [epoch])

  return (
    <div className="demo-content loss-demo enhanced">
      <div className="demo-header">
        <h3>Training Progress</h3>
        <p>Real-time model training with validation metrics</p>
      </div>
      
      <div className="chart-container enhanced">
        <canvas ref={canvasRef} width={600} height={350} className="loss-canvas" />
        
        <div className="chart-legend enhanced">
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ff6600' }} />
            <span>Train Loss</span>
          </div>
          <div className="legend-item">
            <span className="legend-color dashed" style={{ background: '#ff6600' }} />
            <span>Val Loss</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#00ff41' }} />
            <span>Train Acc</span>
          </div>
          <div className="legend-item">
            <span className="legend-color dashed" style={{ background: '#00ff41' }} />
            <span>Val Acc</span>
          </div>
        </div>
      </div>
      
      <div className="demo-stats enhanced">
        <div className="stat-item">
          <span className="stat-label">Epoch</span>
          <span className="stat-value">{epoch}/50</span>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${(epoch / 50) * 100}%` }} />
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-label">Train Loss</span>
          <span className="stat-value" style={{ color: '#ff6600' }}>{metrics.loss.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Val Loss</span>
          <span className="stat-value" style={{ color: '#ff8844' }}>{metrics.valLoss.toFixed(4)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Train Acc</span>
          <span className="stat-value">{(metrics.accuracy * 100).toFixed(1)}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Val Acc</span>
          <span className="stat-value" style={{ color: '#66ff66' }}>{(metrics.valAcc * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

// Enhanced Classification Demo with interactive boundary
const ClassificationDemo = ({ reducedMotion }) => {
  const canvasRef = useRef(null)
  const [points, setPoints] = useState([])
  const [boundary, setBoundary] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [modelType, setModelType] = useState('linear')

  useEffect(() => {
    const newPoints = []
    for (let i = 0; i < 80; i++) {
      const isClassA = Math.random() > 0.5
      const spread = modelType === 'linear' ? 35 : 25
      newPoints.push({
        x: isClassA ? 15 + Math.random() * spread : 60 + Math.random() * spread,
        y: 10 + Math.random() * 80,
        class: isClassA ? 'A' : 'B'
      })
    }
    setPoints(newPoints)
  }, [modelType])

  useEffect(() => {
    if (reducedMotion || isDragging) return
    
    const interval = setInterval(() => {
      setBoundary(prev => {
        const target = 50
        const diff = target - prev
        if (Math.abs(diff) < 0.5) return target
        return prev + diff * 0.1 + (Math.random() - 0.5) * 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [reducedMotion, isDragging])

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setBoundary(x)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    const boundaryX = (boundary / 100) * width
    
    // Gradient regions
    const gradientA = ctx.createLinearGradient(0, 0, boundaryX, 0)
    gradientA.addColorStop(0, 'rgba(0, 255, 255, 0.15)')
    gradientA.addColorStop(1, 'rgba(0, 255, 255, 0.05)')
    ctx.fillStyle = gradientA
    ctx.fillRect(0, 0, boundaryX, height)
    
    const gradientB = ctx.createLinearGradient(boundaryX, 0, width, 0)
    gradientB.addColorStop(0, 'rgba(191, 0, 255, 0.05)')
    gradientB.addColorStop(1, 'rgba(191, 0, 255, 0.15)')
    ctx.fillStyle = gradientB
    ctx.fillRect(boundaryX, 0, width - boundaryX, height)
    
    // Animated boundary line
    ctx.beginPath()
    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 3
    ctx.shadowColor = '#00ff41'
    ctx.shadowBlur = 15
    ctx.setLineDash([10, 5])
    ctx.moveTo(boundaryX, 0)
    ctx.lineTo(boundaryX, height)
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.setLineDash([])

    // Draw points with animation
    points.forEach((point, idx) => {
      const x = (point.x / 100) * width
      const y = (point.y / 100) * height
      
      const predictedClass = point.x < boundary ? 'A' : 'B'
      const isCorrect = predictedClass === point.class
      
      // Outer glow for correct predictions
      if (isCorrect) {
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fillStyle = point.class === 'A' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(191, 0, 255, 0.2)'
        ctx.fill()
      }
      
      // Main point
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = point.class === 'A' ? '#00ffff' : '#bf00ff'
      ctx.fill()
      
      // Error indicator
      if (!isCorrect) {
        ctx.strokeStyle = '#ff0040'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // X mark for misclassified
        ctx.beginPath()
        ctx.moveTo(x - 4, y - 4)
        ctx.lineTo(x + 4, y + 4)
        ctx.moveTo(x + 4, y - 4)
        ctx.lineTo(x - 4, y + 4)
        ctx.strokeStyle = '#ff0040'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    })

  }, [points, boundary])

  const accuracy = useMemo(() => {
    if (points.length === 0) return 0
    const correct = points.filter(p => 
      (p.x < boundary && p.class === 'A') || (p.x >= boundary && p.class === 'B')
    ).length
    return (correct / points.length * 100).toFixed(1)
  }, [points, boundary])

  return (
    <div className="demo-content classification-demo enhanced">
      <div className="demo-header">
        <h3>Binary Classification</h3>
        <p>Click and drag to adjust the decision boundary</p>
      </div>
      
      <div className="chart-container enhanced interactive">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={350} 
          className="classification-canvas"
          onClick={handleCanvasClick}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={(e) => isDragging && handleCanvasClick(e)}
          style={{ cursor: 'ew-resize' }}
        />
        
        <div className="chart-legend enhanced">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#00ffff' }} />
            <span>Class A</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#bf00ff' }} />
            <span>Class B</span>
          </div>
          <div className="legend-item">
            <span className="legend-line" />
            <span>Decision Boundary</span>
          </div>
        </div>
      </div>
      
      <div className="demo-stats enhanced">
        <div className="stat-item">
          <span className="stat-label">Data Points</span>
          <span className="stat-value">{points.length}</span>
        </div>
        <div className="stat-item highlight">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value" style={{ 
            color: parseFloat(accuracy) > 80 ? '#00ff41' : parseFloat(accuracy) > 60 ? '#ffff00' : '#ff6600'
          }}>
            {accuracy}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Boundary</span>
          <span className="stat-value">{boundary.toFixed(0)}%</span>
        </div>
        <div className="stat-item clickable" onClick={() => setModelType(modelType === 'linear' ? 'tight' : 'linear')}>
          <span className="stat-label">Model</span>
          <span className="stat-value toggle-btn">{modelType === 'linear' ? 'Linear' : 'Tight'}</span>
        </div>
      </div>
    </div>
  )
}

// Enhanced Embeddings Demo (3D)
const EmbeddingsDemo = ({ reducedMotion }) => {
  const [selectedCluster, setSelectedCluster] = useState(null)
  
  return (
    <div className="demo-content embeddings-demo enhanced">
      <div className="demo-header">
        <h3>NLP Word Embeddings</h3>
        <p>3D t-SNE visualization of BERT embeddings - click and drag to explore</p>
      </div>
      
      <div className="embeddings-canvas enhanced">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} color="#00ff41" intensity={0.6} />
          <pointLight position={[-10, -10, -10]} color="#bf00ff" intensity={0.3} />
          <EmbeddingPoints reducedMotion={reducedMotion} setSelectedCluster={setSelectedCluster} />
          <OrbitControls 
            enableZoom={true} 
            autoRotate={!reducedMotion}
            autoRotateSpeed={0.8}
            minDistance={5}
            maxDistance={20}
          />
        </Canvas>
        
        <div className="cluster-labels">
          <span className="cluster-label" style={{ color: '#00ffff' }}>Technology</span>
          <span className="cluster-label" style={{ color: '#bf00ff' }}>Science</span>
          <span className="cluster-label" style={{ color: '#ff6600' }}>Nature</span>
        </div>
      </div>
      
      <div className="demo-stats enhanced">
        <div className="stat-item">
          <span className="stat-label">Word Vectors</span>
          <span className="stat-value">150</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Dimensions</span>
          <span className="stat-value">768 → 3</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Clusters</span>
          <span className="stat-value">3</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Model</span>
          <span className="stat-value">BERT-base</span>
        </div>
      </div>
    </div>
  )
}

// Enhanced 3D Embedding Points with hover effects
const EmbeddingPoints = ({ reducedMotion, setSelectedCluster }) => {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(null)
  
  const clusters = useMemo(() => [
    { center: [-3, 0, 0], color: '#00ffff', name: 'Technology', words: ['AI', 'code', 'data', 'neural', 'algorithm'] },
    { center: [3, 1, 0], color: '#bf00ff', name: 'Science', words: ['physics', 'quantum', 'research', 'theory', 'experiment'] },
    { center: [0, -3, 2], color: '#ff6600', name: 'Nature', words: ['forest', 'ocean', 'mountain', 'river', 'wildlife'] }
  ], [])
  
  const points = useMemo(() => {
    const pts = []
    
    clusters.forEach((cluster, clusterIdx) => {
      for (let i = 0; i < 50; i++) {
        pts.push({
          position: [
            cluster.center[0] + (Math.random() - 0.5) * 2.5,
            cluster.center[1] + (Math.random() - 0.5) * 2.5,
            cluster.center[2] + (Math.random() - 0.5) * 2.5
          ],
          color: cluster.color,
          cluster: clusterIdx,
          word: cluster.words[i % cluster.words.length]
        })
      }
    })
    return pts
  }, [clusters])

  useFrame((state) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <mesh 
          key={i} 
          position={point.position}
          onPointerOver={() => {
            setHovered(i)
            setSelectedCluster(point.cluster)
          }}
          onPointerOut={() => {
            setHovered(null)
            setSelectedCluster(null)
          }}
          scale={hovered === i ? 1.5 : 1}
        >
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial 
            color={point.color} 
            emissive={point.color}
            emissiveIntensity={hovered === i ? 0.8 : 0.3}
          />
        </mesh>
      ))}
      
      {/* Cluster center indicators */}
      {clusters.map((cluster, i) => (
        <mesh key={`center-${i}`} position={cluster.center}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color={cluster.color} 
            emissive={cluster.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

export default MLVisuals
