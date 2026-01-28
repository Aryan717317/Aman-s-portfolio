import { useState, useEffect, createContext, useContext, useRef } from 'react'
import MatrixLoader from './components/MatrixLoader/MatrixLoader'
import Hero from './components/Hero/Hero'
import Terminal from './components/Terminal/Terminal'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import MLVisuals from './components/MLVisuals/MLVisuals'
import Experience from './components/Experience/Experience'
import Contact from './components/Contact/Contact'
import Navigation from './components/Navigation/Navigation'
import AccessibilityToggle from './components/AccessibilityToggle/AccessibilityToggle'
import './App.css'

// Context for reduced motion preference
export const MotionContext = createContext({
  reducedMotion: false,
  setReducedMotion: () => {}
})

export const useMotion = () => useContext(MotionContext)

// Portfolio data from resume
export const portfolioData = {
  name: "Aryan Bharat Kumar",
  title: "Machine Learning Engineer",
  subtitle: "AI & Data Systems Specialist",
  location: "Dehradun, India",
  phone: "+91 7906012018",
  email: "ar22073yan@gmail.com",
  linkedin: "https://linkedin.com/in/aryan-bharat",
  github: "https://github.com/aryan-bharat",
  
  summary: `Analytical Computer Science Engineering student specializing in AI & ML with expertise in SQL data extraction and Python analytics. Proven track record of transforming complex datasets into actionable business insights and improving process efficiency by up to 70%. Skilled in Advanced Excel, statistical modeling, and AWS cloud tools.`,
  
  skills: {
    dataAnalytics: {
      name: "Data Analytics",
      items: ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL", "MySQL", "PostgreSQL", "Advanced Excel", "Pivot Tables", "VLOOKUP", "Power Query"],
      level: 95
    },
    businessIntelligence: {
      name: "Business Intelligence",
      items: ["Statistical Modeling", "ETL Pipelines", "Data Extraction", "Data Transformation", "System Design"],
      level: 88
    },
    cloudTools: {
      name: "Cloud & DevOps",
      items: ["AWS EC2", "AWS S3", "AWS RDS", "AWS Lambda", "Docker", "GitHub", "Linux"],
      level: 85
    },
    frameworks: {
      name: "ML Frameworks",
      items: ["TensorFlow", "Keras", "NLTK", "SpaCy", "BERT", "React", "Flask"],
      level: 90
    }
  },
  
  projects: [
    {
      id: 1,
      title: "AI-Powered Job Recommendation System",
      period: "Mar 2025 – June 2025",
      tech: ["BERT", "TF-IDF", "React", "Flask", "Python"],
      highlights: [
        "Developed a recommendation engine using BERT and TF-IDF to match 100K+ candidate profiles with business needs",
        "Improved recruitment efficiency and job relevance by 28% through content-based filtering",
        "Built an interactive React and Flask dashboard for stakeholder data visualization and reporting"
      ],
      metrics: { accuracy: "28%", dataPoints: "100K+", improvement: "28%" },
      category: "NLP",
      architecture: ["Data Ingestion", "BERT Embeddings", "TF-IDF Vectorization", "Content Filtering", "React Dashboard"]
    },
    {
      id: 2,
      title: "Customer Churn Analysis & Revenue Retention",
      period: "Jan 2025 – Present",
      tech: ["Python", "SQL", "Logistic Regression", "ETL", "Excel"],
      highlights: [
        "Engineered SQL ETL pipelines to consolidate customer demographic data into a unified 'Customer Lifetime Value' view",
        "Built a Logistic Regression model in Python to identify churn drivers with 88% prediction accuracy",
        "Recommended a retention strategy via an Excel report projected to save $50K in monthly recurring revenue"
      ],
      metrics: { accuracy: "88%", revenue: "$50K", improvement: "MRR" },
      category: "Classification",
      architecture: ["SQL ETL", "Data Consolidation", "Feature Engineering", "Logistic Regression", "Business Reporting"]
    },
    {
      id: 3,
      title: "E-commerce Market Basket Analysis",
      period: "Sep 2024 – Dec 2024",
      tech: ["Python", "Pandas", "Apriori Algorithm", "Data Mining"],
      highlights: [
        "Analyzed 50K+ transactions using Python Pandas to uncover hidden product purchase correlations",
        "Applied the Apriori Algorithm to identify product pairings that increased purchase probability by 40%",
        "Proposed data-backed 'Frequently Bought Together' bundles to increase Average Order Value (AOV) by 12%"
      ],
      metrics: { transactions: "50K+", probability: "40%", aov: "12%" },
      category: "Data Mining",
      architecture: ["Transaction Data", "Pandas Processing", "Apriori Mining", "Association Rules", "Bundle Recommendations"]
    },
    {
      id: 4,
      title: "Real-Time Resume Screening with NLP",
      period: "Sep 2024 – Jan 2025",
      tech: ["SpaCy", "BERT", "AWS Lambda", "AWS RDS", "NLP"],
      highlights: [
        "Engineered an automated parser using SpaCy and BERT for high-speed skill extraction and ranking",
        "Reduced manual screening effort by 70% and improved candidate-to-role match accuracy by 24%",
        "Deployed a scalable cloud backend on AWS Lambda and RDS to manage high-volume data streams"
      ],
      metrics: { efficiency: "70%", accuracy: "24%", platform: "AWS" },
      category: "NLP",
      architecture: ["Document Ingestion", "SpaCy NER", "BERT Classification", "Lambda Processing", "RDS Storage"]
    }
  ],
  
  education: [
    {
      institution: "Chandigarh University",
      degree: "Bachelor of Engineering in Computer Science (AI & ML)",
      period: "Sep 2022 – Jul 2026",
      grade: "CGPA: 8.5/10"
    },
    {
      institution: "International Indian School",
      degree: "Higher Secondary (CBSE, Class 12)",
      period: "Apr 2021 – Mar 2022",
      grade: "91.6%"
    }
  ],
  
  certifications: [
    { name: "Oracle Cloud Infrastructure 2024 Generative AI Professional", issuer: "Oracle" },
    { name: "Microsoft Azure AI-900: AI Fundamentals", issuer: "Microsoft" },
    { name: "Introduction to Big Data", issuer: "UC San Diego" },
    { name: "Applied Machine Learning", issuer: "University of Michigan" }
  ]
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Scroll spy - update active section based on scroll position
  useEffect(() => {
    if (isLoading) return

    const sections = ['hero', 'skills', 'projects', 'ml-visuals', 'experience', 'contact']
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading])

  // Intersection Observer for section animations
  useEffect(() => {
    if (isLoading || reducedMotion) return

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible')
        }
      })
    }, observerOptions)

    // Observe all sections with animation class
    const sections = document.querySelectorAll('.section-animate')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [isLoading, reducedMotion])

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <MotionContext.Provider value={{ reducedMotion, setReducedMotion }}>
      <div className="app">
        {isLoading ? (
          <MatrixLoader onComplete={handleLoadComplete} />
        ) : (
          <>
            {/* Overlay Effects */}
            {!reducedMotion && (
              <>
                <div className="scanline-overlay" />
                <div className="noise-overlay" />
              </>
            )}
            
            {/* Navigation */}
            <Navigation 
              activeSection={activeSection} 
              onNavigate={scrollToSection}
              onTerminalToggle={() => setTerminalOpen(!terminalOpen)}
            />
            
            {/* Accessibility Toggle */}
            <AccessibilityToggle />
            
            {/* Terminal Overlay */}
            {terminalOpen && (
              <Terminal 
                onClose={() => setTerminalOpen(false)}
                onNavigate={scrollToSection}
              />
            )}
            
            {/* Main Content */}
            <main>
              <section id="hero" className="section-animate">
                <Hero onTerminalOpen={() => setTerminalOpen(true)} isMobile={isMobile} />
              </section>
              
              <section id="skills" className="section-animate">
                <Skills />
              </section>
              
              <section id="projects" className="section-animate">
                <Projects />
              </section>
              
              <section id="ml-visuals" className="section-animate">
                <MLVisuals isMobile={isMobile} />
              </section>
              
              <section id="experience" className="section-animate">
                <Experience />
              </section>
              
              <section id="contact" className="section-animate">
                <Contact />
              </section>
            </main>
          </>
        )}
      </div>
    </MotionContext.Provider>
  )
}

export default App
