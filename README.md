# ⚡ MATLAB-Lite Control Systems IDE

A lightweight MATLAB-like IDE for Control Systems practicals with built-in tutorials and explanations.

![MATLAB-Lite](https://img.shields.io/badge/MATLAB-Lite-blue) ![Python](https://img.shields.io/badge/Python-3.8+-green) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- **📝 Code Editor** - MATLAB-like syntax with line numbers
- **📊 10 Practicals** - All control system experiments pre-loaded
- **📖 Theory & Explanations** - Detailed theory with LaTeX math formulas
- **🎓 Control System Tutor** - Step-by-step learning for viva preparation
- **💡 Explain Mode** - Line-by-line code explanations
- **📱 Mobile Responsive** - Works on phones and tablets
- **🌙 Dark Theme** - Easy on the eyes

## 🚀 Quick Start (Local)

### Option 1: Double-click (Windows)
```
Double-click start.bat
```

### Option 2: Command Line
```bash
cd labmat
pip install flask flask-cors numpy control matplotlib
python server.py
```

Then open **http://localhost:5000** in your browser.

## 📦 Supported MATLAB Commands

| Command | Description |
|---------|-------------|
| `tf(num, den)` | Create transfer function |
| `feedback(G, 1)` | Unity feedback closed-loop |
| `conv([1 2], [1 3])` | Multiply polynomials |
| `step(T)` | Step response plot |
| `impulse(T)` | Impulse response plot |
| `bode(G)` | Bode magnitude & phase plot |
| `margin(G)` | Bode with stability margins |
| `rlocus(G)` | Root locus plot |
| `nyquist(G)` | Nyquist diagram |
| `pzmap(G)` | Pole-zero map |
| `figure(n)` | Create new figure |
| `grid on` | Add grid to plot |
| `title('...')` | Set plot title |
| `hold on` | Overlay plots |

## 🎓 Control System Tutor

Click the **"🎓 Control System Tutor"** button in the sidebar to access:

1. Introduction to Control Systems
2. Transfer Functions
3. Poles & Zeros
4. Time Response
5. Steady-State Error
6. Stability Analysis
7. Root Locus Method
8. Bode Plots
9. Nyquist Criterion
10. PID Controllers
11. Lead-Lag Compensators
12. Common Viva Questions

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/matlab-lite.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

**Note:** For Vercel deployment, edit `main.js` and set:
```javascript
const CONFIG = {
    API_URL: '/api/run',
    LOCAL_API: 'http://localhost:5000/api/run',
    USE_LOCAL: false  // Change to false for Vercel
};
```

## 📱 Mobile Usage

- Tap the **☰** hamburger menu to open sidebar
- Tap a practical to load its code
- Tap **▶** to run code
- Swipe between Plots/Console/Theory tabs

## 📁 Project Structure

```
labmat/
├── index.html          # Main HTML file
├── style.css           # Styles (responsive)
├── main.js             # Application logic
├── server.py           # Local Flask server
├── start.bat           # Windows quick start
├── vercel.json         # Vercel configuration
├── requirements.txt    # Python dependencies
└── api/
    └── run.py          # Vercel serverless function
```

## 🔧 Requirements

- Python 3.8+
- Flask
- NumPy
- python-control
- Matplotlib

## 📄 License

MIT License - Use freely for your practicals!

---

**Good luck with your practical and viva! 🎯**