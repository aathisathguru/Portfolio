import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck } from 'lucide-react'

export default function PortraitCard({ reducedMotion = false }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      className="portrait-card-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: reducedMotion
          ? 'none'
          : `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="portrait-glass-frame">
        {/* Corner HUD Reticles */}
        <span className="hud-corner top-left" aria-hidden="true" />
        <span className="hud-corner top-right" aria-hidden="true" />
        <span className="hud-corner bottom-left" aria-hidden="true" />
        <span className="hud-corner bottom-right" aria-hidden="true" />

        {/* Top Identification Bar */}
        <div className="portrait-header-bar">
          <div className="portrait-status-indicator">
            <span className="status-pulse-cyan" aria-hidden="true" />
            <span className="status-label">AATHI SATHGURU</span>
          </div>
          <span className="portrait-code-badge">AI / ML DEV</span>
        </div>

        {/* Cinematic Rectangular Portrait Photo */}
        <div className="portrait-image-wrapper">
          <picture>
            <source srcSet="/images/aathi-portrait.webp" type="image/webp" />
            <img
              src="/images/image.png"
              alt="Aathi Sathguru — AI / ML Developer"
              className="portrait-img"
              width={1254}
              height={1254}
              loading="eager"
            />
          </picture>
          <div className="portrait-cyan-edge-glow" aria-hidden="true" />
        </div>

        {/* Bottom Frosted Glass Identity Plate */}
        <div className="portrait-footer-plate">
          <div className="footer-plate-left">
            <p className="plate-title">B.E. Electronics & Electrical Engineering</p>
            <p className="plate-sub">Bannari Amman Institute of Technology</p>
          </div>
          <div className="footer-plate-tag">
            <ShieldCheck size={14} className="tag-icon" />
            <span>VERIFIED</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
