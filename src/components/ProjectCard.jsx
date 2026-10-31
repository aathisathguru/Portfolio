import { useState } from 'react'
import { ArrowUpRight, Github, ExternalLink, Code2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProjectCard({ project, index = 0, reducedMotion }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMove = (event) => {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8
    const glareX = ((event.clientX - rect.left) / rect.width) * 100
    const glareY = ((event.clientY - rect.top) / rect.height) * 100
    setTilt({ x, y })
    setGlare({ x: glareX, y: glareY, opacity: 0.15 })
  }

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }

  const hasGithub = Boolean(project.github && project.github.trim() !== '')
  const hasLive = Boolean(project.live && project.live.trim() !== '')

  return (
    <motion.article
      className={`project-card project-${project.accent || 'cyan'}`}
      style={{
        transform: reducedMotion
          ? 'none'
          : `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glare reflection overlay */}
      <div
        className="project-glare"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(125, 235, 255, ${glare.opacity}), transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Visual / Screenshot area */}
      <div
        className="project-visual"
        role="img"
        aria-label={project.screenshot ? project.name : 'Project visual placeholder'}
      >
        {project.screenshot ? (
          <img
            src={project.screenshot}
            alt={project.name}
            className="project-image"
            loading="lazy"
          />
        ) : (
          <div className="project-placeholder-visual">
            <div className="project-grid" />
            <div className="project-orbit orbit-one" />
            <div className="project-orbit orbit-two" />
            <div className="project-hud-code">
              <Code2 size={24} className="hud-code-icon" />
              <span className="project-placeholder-text">ADD SCREENSHOT / PREVIEW</span>
              <span className="project-placeholder-sub">EDITABLE ASSET</span>
            </div>
          </div>
        )}
        <span className="project-number">{project.number}</span>
      </div>

      {/* Card Content Body */}
      <div className="project-body">
        <div className="project-meta">
          <span className="project-tagline">{project.tagline || `PROJECT ${project.number}`}</span>
          <span className="meta-dot" />
          <span className="meta-editable">EDITABLE SPEC</span>
        </div>

        <h3 className="project-title">{project.name}</h3>
        <p className="project-desc">{project.description}</p>

        {/* Tech Stack Pills */}
        <div className="project-stack">
          {Array.isArray(project.stack) ? (
            project.stack.map((tech) => (
              <span key={tech} className="tech-chip">
                {tech}
              </span>
            ))
          ) : (
            <span className="tech-chip">{project.stack}</span>
          )}
        </div>

        {/* Links: real links when provided, clearly marked disabled placeholders when missing */}
        <div className="project-links">
          {hasGithub ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn active"
            >
              <Github size={14} />
              <span>GitHub</span>
              <ArrowUpRight size={13} />
            </a>
          ) : (
            <span
              className="project-btn disabled"
              title="GitHub repository link will be added when public"
            >
              <Github size={14} />
              <span>Repository Pending</span>
            </span>
          )}

          {hasLive ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn active live-btn"
            >
              <ExternalLink size={14} />
              <span>Live Demo</span>
              <ArrowUpRight size={13} />
            </a>
          ) : (
            <span
              className="project-btn disabled"
              title="Live deployment URL will be added when deployed"
            >
              <ExternalLink size={14} />
              <span>Demo Pending</span>
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
