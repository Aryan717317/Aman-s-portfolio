# Aryan's Matrix-Style ML Portfolio 🧠💚

A cutting-edge, Matrix-themed interactive Machine Learning portfolio website built with React, Three.js, and modern web technologies.

![Matrix Portfolio](./preview.png)

## 🌟 Features

### Core Experience
- **Matrix Loading Screen** - Full-screen Matrix rain animation with system boot logs
- **3D Neural Network Hero** - Interactive Three.js neural network visualization
- **Fully Functional CLI Terminal** - Real terminal with commands (try `help`, `neofetch`, `run model`)
- **Dark Mode Only** - True Matrix green aesthetic throughout

### Interactive Components
- **Skills Visualization** - Animated radar charts and progress bars
- **AI Lab Projects** - Interactive project cards with ML pipeline animations
- **ML Visualizations** - Live demos of neural networks, training curves, classification boundaries
- **System Boot Timeline** - Education & certifications as boot logs

### 2026 Advanced Features
- ✅ Performance-adaptive animations (detects reduced motion preference)
- ✅ Reduced-motion accessibility toggle
- ✅ Hidden terminal easter eggs (`hack`, `matrix`, `neofetch`)
- ✅ Mobile-responsive design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Three.js / React Three Fiber** - 3D graphics
- **Framer Motion** - Animations
- **CSS Variables** - Theming & styling

## 📁 Project Structure

```
src/
├── App.jsx                    # Main app with portfolio data
├── App.css
├── index.css                  # Global styles & CSS variables
├── main.jsx
└── components/
    ├── MatrixLoader/          # Loading screen with Matrix rain
    ├── Hero/                  # 3D neural network hero section
    ├── Terminal/              # Interactive CLI terminal
    ├── Skills/                # Animated skill visualizations
    ├── Projects/              # AI Lab project cards
    ├── MLVisuals/             # Interactive ML demonstrations
    ├── Experience/            # Education & certifications
    ├── Contact/               # Contact form & info
    ├── Navigation/            # Responsive navigation
    └── AccessibilityToggle/   # Motion preferences
```

## 🎮 Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Show all available commands |
| `about` | Display bio and summary |
| `skills` | Show technical skills matrix |
| `projects` | List all ML projects |
| `project [n]` | Show project details (1-4) |
| `education` | Academic background |
| `contact` | Contact information |
| `neofetch` | System info display |
| `whoami` | Identity display |
| `run model` | Simulate model training |
| `visualize` | Show embedding visualization |
| `hack` | Easter egg 😄 |
| `clear` | Clear terminal |
| `exit` | Close terminal |

## 🎨 Design System

### Colors
```css
--matrix-green: #00ff41
--matrix-green-dim: #00cc33
--bg-primary: #0a0a0a
--accent-cyan: #00ffff
--accent-purple: #bf00ff
```

### Fonts
- **Display**: Orbitron (headings)
- **Mono**: JetBrains Mono (terminal, code)

## 📱 Responsive Design

- Desktop: Full animations, 3D effects
- Tablet: Optimized layouts
- Mobile: Simplified animations, touch-friendly

## ♿ Accessibility

- Respects `prefers-reduced-motion` system setting
- Manual toggle for animation preferences
- Keyboard navigation support
- Semantic HTML structure

## 🔧 Customization

### Update Portfolio Data
Edit the `portfolioData` object in `src/App.jsx`:

```javascript
export const portfolioData = {
  name: "Your Name",
  title: "Your Title",
  email: "your@email.com",
  // ... more fields
}
```

### Modify Theme Colors
Update CSS variables in `src/index.css`:

```css
:root {
  --matrix-green: #00ff41;
  /* ... */
}
```

## 📄 License

MIT License - Feel free to use this as a template!

## 👤 Author

**Aryan Bharat Kumar**
- Machine Learning Engineer
- AI & Data Systems Specialist
- [GitHub](https://github.com/aryan-bharat)
- [LinkedIn](https://linkedin.com/in/aryan-bharat)

---

Built with React, Three.js & ❤️
