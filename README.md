# 3D Lanyard Badge Studio 🪪

An interactive 3D ID Badge showcase featuring realistic rope physics, real-time texture generation, and an interactive WebGL2 pixel fluid background.

[**🌐 Live Online Demo**](https://tree-oil.github.io/lanyard-showcase/)

---

## ✨ Features

- **Realistic 3D Physics Simulation**: Hanging badge and strap driven by `@react-three/rapier` rigid bodies and rope joint constraints.
- **Interactive WebGL2 Pixel Fluid**: Dynamic animal silhouettes (Deer, Whale, Fox) with Bayer halftoning dithering that fluidly disperses when mouse sweeps past.
- **Central Protection Zone**: Smart density masking to keep the central 3D badge completely unobstructed and crystal clear.
- **Real-time Badge Customizer**:
  - Live 2D HTML5 Canvas texture baking for front face, back face, and woven lanyard strap.
  - Smart chip styling (Titanium, Silver, Stealth, Gold) and NFC wave indicators.
  - Custom photo avatar and texture upload support.
- **Multi-Gravity Engine**: Switch dynamically between 1.0G (Earth), 0.16G (Moon), 0.0G (Zero-G Space), and 2.0G (Heavy Gravity).
- **Physical Impulse & Export**: Shake impulse trigger, and high-resolution front/back PNG badge exporter.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D & Physics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei) + [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) + [meshline](https://github.com/spite/meshline)
- **Background Shader**: Custom WebGL2 Bayer Dithering & Fluid Velocity Field Simulator
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Effects**: [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/Tree-oil/lanyard-showcase.git
cd lanyard-showcase

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### Production Build

```bash
npm run build
```

---

## 📄 License

MIT License. Designed with minimal aesthetics.
