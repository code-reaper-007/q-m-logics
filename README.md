# Q-M Logics

> A dual-mode Boolean optimization suite that transforms raw logic requirements into highly optimized, interactive circuit schematics using the **Quine-McCluskey algorithm**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![Node](https://img.shields.io/badge/Node-%3E%3D18-339933)

---

##  Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Algorithm](#-algorithm)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

---

##  Features

###  Logic Engine
- **Quine-McCluskey algorithm** implemented in a **Web Worker** for non-blocking computation
- **Bitmasking & integer comparisons** for O(3ⁿ) efficiency
- Supports up to **10 variables** (1024-row truth tables)
- **Dual-mode optimization:**
  - **SOP** (Sum of Products) — optimizes for logic `1`s (Minterms)
  - **POS** (Product of Sums) — optimizes for logic `0`s (Maxterms)
- Don't Care conditions support for further simplification

###  UI/UX Design
- **Deep nocturnal cyber-minimalist** aesthetic (`#050505` background)
- **Mode-aware accent colors:**
  - SOP → Cyan (`#00f3ff`) glow & highlights
  - POS → Neon Purple (`#bc13fe`) glow & highlights
- **Glassmorphism** cards with `backdrop-blur` effects
- **Framer Motion** spring-loaded entry animations on all tables and results
- Responsive layout with professional dark theme

###  Interactive Logic Canvas
- **React Flow**-based circuit visualization
- **IEEE-standard SVG logic gate symbols** (AND, OR, NOT, NAND, NOR, XOR, XNOR)
- **Live signal simulation:**
  - Click input nodes to toggle `0`/`1`
  - Real-time forward propagation through gates
  - **Animated wire pulse** — glowing when signal is High, dim when Low
- Zoom, pan, and minimap navigation
- Export circuit as **PNG** or **SVG**

###  Student Learning Tools
- **Interactive tutorial** (React Joyride) — 8-step guided walkthrough
- **Algorithm Walkthrough panel** — 6 expandable steps:
  1. Input Specification
  2. Binary Grouping by 1s Count
  3. Iterative Combination
  4. Prime Implicant Chart
  5. Final Terms & Expression
  6. LaTeX output (copy-paste for homework)
- **Truth Table** view with hover highlighting and mode indicators
- **Gate Reduction** analytics — percentage saved vs. unoptimized
- **Transistor count** estimation

###  Export
- **Lab Report** download — full `.txt` report with all algorithm steps, truth table, and LaTeX expression
- **Circuit PNG/SVG** export for documentation

---

##  Screenshots

| SOP Mode (Cyan) | POS Mode (Purple) |
|-----------------|-------------------|
| Circuit canvas with live simulation | Product of Sums optimization |
| Interactive truth table | Algorithm walkthrough steps |

---

## 👥 Team — SP3

<p align="center">

![Team SP3](./public/050927c5-736a-4fad-90be-c5679b1e024b.png)

| Roll Number | Name |
|-------------|------|
| RA2511036010519 | SOUJATA MAJI |
| RA2511036010534 | PRANAY KUMAR SINGH |
| RA2511036010537 | PRASHANT KUMAR DAS |
| RA2511036010542 | PIYUSH RAJ |

</p>

---

##  Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, Vite 8 |
| **UI Library** | Tailwind CSS, Framer Motion |
| **Circuit Canvas** | React Flow 11 |
| **Tutorial** | React Joyride 3 |
| **Export** | html-to-image |
| **Icons** | Lucide React |
| **Algorithm** | Web Worker (vanilla JS) |
| **Build** | Rolldown (Vite 8) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/noctis-logic-synthesizer.git
cd noctis-logic-synthesizer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
```

Output is generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

##  Usage Guide

### 1. Select Optimization Mode

Toggle between **SOP** (Sum of Products) and **POS** (Product of Sums) in the sidebar:
- **SOP**: Enter minterms — indices where output = `1`
- **POS**: Enter maxterms — indices where output = `0`

### 2. Set Variables

Use the slider to choose **2–10 variables**. More variables = exponentially larger truth tables.

### 3. Enter Terms

**Minterms/Maxterms**: Comma-separated decimal indices.
```
0, 1, 3, 7
```

**Don't Cares** (optional): Indices where output doesn't matter.
```
2, 5
```

### 4. Synthesize

Click **Synthesize** to run the Quine-McCluskey algorithm. Results appear instantly across 4 tabs:

| Tab | Description |
|-----|-------------|
| **Circuit** | Interactive gate diagram with live simulation |
| **Steps** | Grouping tables and Prime Implicant chart |
| **Walkthrough** | Step-by-step algorithm guide with LaTeX |
| **Table** | Full truth table with mode-colored outputs |

### 5. Simulate & Export

- **Click input nodes** (A, B, C...) to toggle values and watch signal propagation
- **Download Lab Report** for homework submission
- **Export circuit** as PNG/SVG for documentation

---

##  Algorithm

### Quine-McCluskey Method

1. **Group minterms** by number of `1`s in binary representation
2. **Compare adjacent groups** — combine terms differing by exactly one bit
3. **Iterate** until no more combinations possible → **Prime Implicants**
4. **Build Prime Implicant Chart** — rows = PIs, columns = minterms
5. **Identify Essential Prime Implicants** — unique coverage
6. **Greedy cover** for remaining minterms → **Final minimized expression**

### Complexity

- **Time**: O(3ⁿ) where n = number of variables
- **Space**: O(2ⁿ) for grouping tables
- **Max variables**: 10 (tested and working)

### Bitmask Optimization

The engine uses integer bitwise operations instead of string manipulation:
```js
// XOR to find differing bit
let diff = t1.value ^ t2.value;
// Check single bit difference
if (isPowerOfTwo(diff)) { /* can combine */ }
// Create combined mask
let newMask = t1.mask | diff;
```

---

##  Project Structure

```
noctis-logic-synthesizer/
├── public/                  # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/          # React components
│   │   ├── AnalyticsHUD.jsx       # Gate reduction & transistor count
│   │   ├── CircuitCanvas.jsx      # React Flow circuit visualization
│   │   ├── Dashboard.jsx          # Expression & gate count display
│   │   ├── GateNode.jsx           # Custom React Flow node wrapper
│   │   ├── GateSymbols.jsx        # IEEE-standard SVG gate symbols
│   │   ├── GroupingTables.jsx     # QM algorithm grouping steps
│   │   ├── LabReportExport.jsx    # Report & circuit export
│   │   ├── Sidebar.jsx            # Input controls & mode toggle
│   │   ├── TruthTable.jsx         # Full truth table view
│   │   ├── Tutorial.jsx           # React Joyride tutorial
│   │   └── Walkthrough.jsx        # Step-by-step algorithm guide
│   ├── logic/               # Algorithm engine
│   │   ├── qm.worker.js          # Web Worker entry point
│   │   └── qmEngine.js           # Bitmasking QM implementation
│   ├── App.jsx              # Main app & state management
│   ├── index.css            # Global styles & animations
│   └── main.jsx             # React entry point
├── .gitignore
├── package.json
├── requirements.txt
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

##  Configuration

### Theme Colors

Defined in `tailwind.config.js`:

```js
colors: {
  background: "#050505",
  accent: {
    cyan: "#00f3ff",    // SOP mode
    purple: "#bc13fe",  // POS mode
    pink: "#ff00ff",    // NOT gates
  },
}
```

### Environment Variables

No environment variables required. The app runs entirely client-side.

---

##  Testing the Algorithm

Run the included test script:

```bash
node test_qm.js
```

Or test manually in Node.js:

```js
const { QMEngine } = require('./src/logic/qmEngine.js');

// SOP: m(0,1,3,7) with 3 variables → A'B' + BC
const sop = new QMEngine(3, [0,1,3,7], [], 'SOP');
console.log(sop.solve().expression); // A'B' + BC

// POS: F=0 at {2,4,5,6} → (B' + C) · (A' + B)
const pos = new QMEngine(3, [2,4,5,6], [], 'POS');
console.log(pos.solve().expression); // (B' + C) · (A' + B)
```

---

##  Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow existing code style (no comments unless asked)
- Test algorithm changes with `test_qm.js`
- Update README for new features
- Build must pass: `npm run build`

---

##  License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

- **Quine-McCluskey algorithm** — W.V. Quine (1952), Edward J. McCluskey (1956)
- **React Flow** — [reactflow.dev](https://reactflow.dev)
- **Framer Motion** — [framer.com/motion](https://www.framer.com/motion/)
- **Lucide Icons** — [lucide.dev](https://lucide.dev)

---

<p align="center">
  Built with ⚡ React + Vite &nbsp;|&nbsp; Q-M Logics © 2026
</p>
