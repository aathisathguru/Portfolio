# Aathi Sathguru — Arctic Glass 3D Developer Portfolio

A personal developer portfolio for **Aathi Sathguru** (AI / ML Developer). Built with an **Arctic Glass 3D** aesthetic featuring Three.js, React Three Fiber, Framer Motion, Tailwind CSS, and Vite.

## ✨ Highlights & Architecture

- **Cinematic Arctic Glass Hero Section**:
  - Centerpiece realistic transparent 3D ice crystal with irregular faceted geometry, chromatic refraction, inner caustics, and cyan rim highlights.
  - Floating crystal fragments and dual-layer atmospheric particle field (`@react-three/drei`).
  - High-definition framed portrait composition featuring Aathi Sathguru in dark navy attire with cyan edge illumination.
  - Interactive mouse parallax across the 3D scene and frosted portrait card.
- **Glassmorphic Navigation Bar**:
  - Smooth scrolling, active intersection tracking, responsive mobile drawer, and keyboard accessibility.
- **Beyond the Code (About Section)**:
  - Highlights Aathi's foundation in B.E. Electronics and Electrical Engineering from Bannari Amman Institute of Technology, interest in AI/ML, and collaborative strengths.
- **My Technology Stack**:
  - Organized by Programming, Frontend, Database, and Professional strengths without invented percentage ratings.
- **Selected Works (Projects)**:
  - Three showcase cards with 3D perspective tilt, glare reflections, and clear editable placeholders.
- **Academic Journey (Education)**:
  - Vertical glass timeline featuring degree and institution with editable fields for graduation year, achievements, and coursework.
- **Contact & Direct Channels**:
  - Verified channels: Email (`aathiboopathymi@gmail.com`), GitHub (`github.com/aathisathguru`), LinkedIn (`linkedin.com/in/aathi-sathguru-m-7ab384300`).
  - Contact form with validation, loading indicator, verified success state, error fallback, and optional `VITE_CONTACT_FORM_ENDPOINT` webhook integration.
- **Resume Handling**:
  - Points to `public/Aathi-Sathguru-Resume.pdf`. If the PDF is pending upload, an Arctic Glass fallback modal allows requesting the resume directly via email.

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/aathisathguru/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🛠️ Production Build & Verification

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment Instructions

### 1. Deploying to Vercel (Recommended)

1. Push your repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: Arctic Glass 3D Developer Portfolio"
   git branch -M main
   git remote add origin https://github.com/aathisathguru/<repo-name>.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Keep the default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. *(Optional)* In **Environment Variables**, add:
   - `VITE_CONTACT_FORM_ENDPOINT`: Your Formspree, Web3Forms, or custom webhook URL (if using a form backend).
6. Click **Deploy**. Your portfolio will be live on a fast global CDN with automated HTTPS!

### 2. Deploying to GitHub Pages

1. In `vite.config.js`, set `base: '/<repo-name>/'` (if deploying to a subpath repository).
2. Install `gh-pages`:
   ```bash
   npm install -D gh-pages
   ```
3. Add deploy scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run:
   ```bash
   npm run deploy
   ```

---

## 📁 Project Structure

```
Portfolio/
├── public/
│   ├── images/
│   │   ├── aathi-portrait.webp   # Optimized WebP portrait
│   │   └── image.png            # Original high-res portrait
│   ├── favicon.svg              # Arctic Glass AS brand icon
│   └── Aathi-Sathguru-Resume.pdf # Place your verified PDF here
├── src/
│   ├── components/
│   │   ├── GlassNav.jsx         # Floating glass navigation bar
│   │   ├── HeroScene.jsx        # 3D irregular ice crystal & fragments
│   │   ├── PortraitCard.jsx     # Cinematic frosted portrait frame
│   │   ├── ProjectCard.jsx      # 3D tilting project showcase card
│   │   ├── ResumeDialog.jsx     # PDF pending & email request modal
│   │   └── SectionHeader.jsx    # Kinetic section headers
│   ├── data/
│   │   └── portfolio.js         # Single source of truth for portfolio data
│   ├── App.jsx                  # Root composition and section logic
│   ├── main.jsx                 # React root mount
│   └── styles.css               # Arctic Glass tokens, glow effects, responsive rules
├── index.html                   # HTML template with Space Grotesk & Inter fonts
├── tailwind.config.js           # Arctic design tokens & typography configuration
└── vite.config.js               # Vite build configuration
```

---

## 🎨 Arctic Glass Design Tokens

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Midnight Black** | `#070B12` | Deep space background |
| **Arctic Navy** | `#101D2C` | Secondary backdrop & deep shadows |
| **Deep Glacier** | `#172B3D` | Glass card surfaces & fills |
| **Ice Cyan** | `#7DEBFF` | Specular rim lighting & accent pulses |
| **Glacier Blue** | `#A8DFFF` | Refraction highlights & typography |
| **Crystal White** | `#F4FAFF` | Primary headlines & caustic sparks |
