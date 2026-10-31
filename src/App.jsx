import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  Cpu,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Users,
  AlertCircle,
  Loader2,
  ExternalLink,
  BookOpen,
  Award,
} from 'lucide-react'
import GlassNav from './components/GlassNav.jsx'
import ProjectCard from './components/ProjectCard.jsx'
import SectionHeader from './components/SectionHeader.jsx'
import PortraitCard from './components/PortraitCard.jsx'
import ResumeDialog from './components/ResumeDialog.jsx'
import CertificateGallery from './components/CertificateGallery.jsx'
import { navItems, portfolio } from './data/portfolio.js'

const HeroScene = lazy(() => import('./components/HeroScene.jsx'))

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function App() {
  const reducedMotion = useReducedMotion()
  const [activeSection, setActiveSection] = useState('home')
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false)

  // Form state
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [formErrors, setFormErrors] = useState({})
  const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' })

  useEffect(() => {
    const sections = navItems.map(({ id }) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0.08, 0.3, 0.6] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const navigateTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  const handleResumeDownload = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(portfolio.resume.path, { method: 'HEAD' })
      if (res.ok && res.headers.get('content-type')?.includes('pdf')) {
        const link = document.createElement('a')
        link.href = portfolio.resume.path
        link.download = portfolio.resume.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        setResumeDialogOpen(true)
      }
    } catch {
      setResumeDialogOpen(true)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formState.name.trim() || formState.name.trim().length < 2) {
      errors.name = 'Please enter your name (minimum 2 characters)'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formState.email.trim() || !emailRegex.test(formState.email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formState.message.trim() || formState.message.trim().length < 10) {
      errors.message = 'Please enter a message (minimum 10 characters)'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT

    if (endpoint) {
      setFormStatus({ state: 'loading', message: 'Sending message...' })
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        })
        if (!response.ok) throw new Error('Form service rejected the submission')
        setFormStatus({
          state: 'success',
          message: 'Thank you! Your message has been sent successfully.',
        })
        setFormState({ name: '', email: '', message: '' })
        setFormErrors({})
      } catch {
        setFormStatus({
          state: 'error',
          message:
            'Unable to reach form endpoint. Please click below to send via your email client.',
        })
      }
    } else {
      // Honest fallback when no external webhook is configured
      setFormStatus({
        state: 'ready',
        message: 'Opening your default email client to send your message to Aathi Sathguru...',
      })
      const mailtoUrl = `mailto:${portfolio.contact.email}?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${formState.name}`,
      )}&body=${encodeURIComponent(
        `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`,
      )}`
      window.location.href = mailtoUrl
    }
  }

  return (
    <div className="site-shell">
      {/* Arctic atmospheric background glows */}
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="ambient ambient-three" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* Floating Glass Navigation */}
      <GlassNav activeSection={activeSection} onNavigate={navigateTo} />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section id="home" className="hero-section page-section">
          <div className="hero-content">
            <motion.div initial="hidden" animate="show" variants={reveal} transition={{ delay: 0.08 }}>
              <p className="eyebrow hero-eyebrow">
                <span className="eyebrow-line" /> ARCTIC GLASS 3D PORTFOLIO
              </p>
              <h2 className="hero-name">{portfolio.name}</h2>
              <p className="hero-role">{portfolio.role}</p>
            </motion.div>

            <motion.h1
              className="hero-headline"
              initial="hidden"
              animate="show"
              variants={reveal}
              transition={{ delay: 0.16 }}
            >
              {portfolio.headline.primary}
              <br />
              <span className="hero-headline-accent">{portfolio.headline.secondary}</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial="hidden"
              animate="show"
              variants={reveal}
              transition={{ delay: 0.24 }}
            >
              {portfolio.heroDescription}
            </motion.p>

            <motion.div
              className="hero-actions"
              initial="hidden"
              animate="show"
              variants={reveal}
              transition={{ delay: 0.32 }}
            >
              <button
                className="button button-primary"
                onClick={() => navigateTo('projects')}
                type="button"
              >
                <span>Explore Projects</span>
                <ArrowDownRight size={16} />
              </button>

              <button
                className="button button-ghost"
                onClick={handleResumeDownload}
                type="button"
                title="Download verified resume or request via email"
              >
                <span>Download Resume</span>
                <Download size={15} />
              </button>
            </motion.div>

            {/* Quick Hero Social Connections */}
            <motion.div
              className="hero-social-links"
              initial="hidden"
              animate="show"
              variants={reveal}
              transition={{ delay: 0.4 }}
            >
              <a
                href={portfolio.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="GitHub Profile"
              >
                <Github size={16} />
                <span>GitHub</span>
                <ArrowUpRight size={12} />
              </a>

              <a
                href={portfolio.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
                <ArrowUpRight size={12} />
              </a>

              <a
                href={`mailto:${portfolio.contact.email}`}
                className="hero-social-link"
                aria-label="Send direct email"
              >
                <Mail size={16} />
                <span>Email</span>
                <ArrowUpRight size={12} />
              </a>
            </motion.div>

            <motion.div
              className="hero-footnote"
              initial="hidden"
              animate="show"
              variants={reveal}
              transition={{ delay: 0.48 }}
            >
              <span>SCROLL TO EXPLORE</span>
              <span className="footnote-rule" />
              <span>01 — 07</span>
            </motion.div>
          </div>

          {/* RIGHT SIDE: 3D Composition & Cinematic Frosted Portrait */}
          <motion.div
            className="hero-stage"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="stage-label stage-label-top">
              <span className="status-pulse" /> ARCTIC ENVIRONMENT // 3D CRYSTAL
            </div>

            <div className="stage-ring ring-one" aria-hidden="true" />
            <div className="stage-ring ring-two" aria-hidden="true" />
            <div className="stage-crosshair crosshair-one" aria-hidden="true" />
            <div className="stage-crosshair crosshair-two" aria-hidden="true" />

            {/* Three.js 3D Canvas Scene: Giant Ice Crystal + Fragments + Particles */}
            <div className="hero-3d-canvas-wrap">
              <Suspense
                fallback={
                  <div className="scene-loading" role="status">
                    <span>LOADING ARCTIC CRYSTAL SCENE</span>
                    <span className="loading-dots">···</span>
                  </div>
                }
              >
                <HeroScene reducedMotion={reducedMotion} />
              </Suspense>
            </div>

            {/* Cinematic Frosted Glass Portrait Card */}
            <div className="hero-portrait-layer">
              <PortraitCard reducedMotion={reducedMotion} />
            </div>

            <div className="stage-caption">
              <span>FROZEN GLASS ARCHITECTURE</span>
              <span>AUTHENTIC PORTRAIT · REALISTIC REFRACTION</span>
            </div>
          </motion.div>

          <div className="hero-side-note" aria-hidden="true">
            / ELECTRONICS & ELECTRICAL FOUNDATION
            <br />
            / ARTIFICIAL INTELLIGENCE & SOFTWARE
          </div>
        </section>

        {/* ================= ABOUT SECTION ================= */}
        <section id="about" className="content-section page-section about-section">
          <div className="section-index">
            01 <span>/</span> ABOUT
          </div>
          <SectionHeader
            eyebrow="THE HUMAN LAYER"
            title={
              <>
                BEYOND
                <br />
                <em>THE CODE.</em>
              </>
            }
            copy="A practical, curious approach to technology — grounded in engineering principles and dedicated to building thoughtful digital solutions."
          />

          <div className="about-grid">
            <motion.div
              className="about-statement glass-panel"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="quote-mark" aria-hidden="true">
                “
              </div>
              <p className="statement-text">{portfolio.about.intro}</p>
              <div className="signature-line">
                <span className="sig-initials">AS</span>
                <div className="sig-meta">
                  <span className="sig-name">{portfolio.name}</span>
                  <span className="sig-role">{portfolio.role}</span>
                </div>
              </div>
            </motion.div>

            <div className="about-details">
              <motion.div
                className="detail-card glass-panel"
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.08 }}
              >
                <div className="detail-icon">
                  <Cpu size={20} />
                </div>
                <div>
                  <span className="card-kicker">ENGINEERING FOUNDATION</span>
                  <h3>{portfolio.about.background}</h3>
                  <p>
                    College: <strong>{portfolio.about.college}</strong>. An analytical electrical
                    and systems background bridging physical engineering principles with modern
                    computational methods.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="detail-card glass-panel"
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.16 }}
              >
                <div className="detail-icon">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <span className="card-kicker">TECHNICAL PASSION</span>
                  <h3>AI, Machine Learning & Software</h3>
                  <p>
                    {portfolio.about.interests} Passionate about building algorithms and models that
                    solve real-world challenges with measurable impact.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="detail-card glass-panel"
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.24 }}
              >
                <div className="detail-icon">
                  <Users size={20} />
                </div>
                <div>
                  <span className="card-kicker">PROFESSIONAL STRENGTHS</span>
                  <h3>Problem Solving, Leadership & Collaboration</h3>
                  <p>
                    Structured problem solver, experienced in cross-functional collaboration, and
                    driven by a proactive mindset to deliver results as a team.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= SKILLS SECTION ================= */}
        <section id="skills" className="content-section page-section skills-section">
          <div className="section-index">
            02 <span>/</span> SKILLS
          </div>
          <SectionHeader
            eyebrow="THE TOOLKIT"
            title={
              <>
                MY TECHNOLOGY
                <br />
                <em>STACK.</em>
              </>
            }
            copy="A grounded technical toolkit organized across programming, frontend engineering, databases, and core professional strengths."
          />

          <div className="skills-layout">
            <div className="skills-intro glass-panel">
              <Sparkles size={22} className="intro-icon" />
              <p>Tools are instruments. Curiosity and problem-solving drive execution.</p>
              <span className="mini-rule" />
              <small>
                VERIFIED TECHNICAL COMPETENCIES
                <br />
                NO FABRICATED PROFICIENCY SCORES
              </small>
            </div>

            <div className="skill-groups">
              {portfolio.skillCategories.map((group) => {
                const groupSkills = portfolio.skills.filter((skill) => skill.group === group)
                return (
                  <motion.div
                    className="skill-group glass-panel"
                    key={group}
                    initial="hidden"
                    whileInView="show"
                    variants={reveal}
                    viewport={{ once: true, margin: '-60px' }}
                  >
                    <div className="skill-group-heading">
                      <span className="group-title">{group}</span>
                      <span className="group-count">
                        {groupSkills.length.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="skill-list">
                      {groupSkills.map((skill) => (
                        <div className="skill-chip" key={skill.label}>
                          <span className="skill-icon">{skill.icon}</span>
                          <div className="skill-info">
                            <span className="skill-name">{skill.label}</span>
                            {skill.note && <span className="skill-note">{skill.note}</span>}
                          </div>
                          <span className="chip-arrow" aria-hidden="true">
                            <ArrowUpRight size={14} />
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================= PROJECTS SECTION ================= */}
        <section id="projects" className="content-section page-section projects-section">
          <div className="section-index">
            03 <span>/</span> PROJECTS
          </div>
          <SectionHeader
            eyebrow="SELECTED PORTFOLIO"
            title={
              <>
                SELECTED
                <br />
                <em>WORKS.</em>
              </>
            }
            copy="Three dedicated showcase frames for featured projects. All details, repositories, and screenshots are structured for easy real-world customization."
          />

          <div className="projects-grid">
            {portfolio.projects.map((project, idx) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={idx}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </section>

        {/* ================= CERTIFICATIONS SECTION ================= */}
        <section id="certifications" className="content-section page-section certifications-section">
          <div className="section-index">
            04 <span>/</span> CERTIFICATIONS
          </div>
          <SectionHeader
            eyebrow="ACCREDITED EXPERTISE"
            title={
              <>
                VERIFIED
                <br />
                <em>CREDENTIALS.</em>
              </>
            }
            copy="A dedicated gallery of professional certifications and continuous learning milestones. Upload your certificate photos directly to showcase high-resolution credentials."
          />

          <CertificateGallery />
        </section>

        {/* ================= EDUCATION SECTION ================= */}
        <section id="education" className="content-section page-section education-section">
          <div className="section-index">
            05 <span>/</span> EDUCATION
          </div>
          <SectionHeader
            eyebrow="ACADEMIC FOUNDATION"
            title={
              <>
                ACADEMIC
                <br />
                <em>JOURNEY.</em>
              </>
            }
            copy="Core engineering training in Electronics and Electrical Engineering, providing mathematical depth and systemic problem-solving habits."
          />

          <div className="education-layout">
            <div className="education-aside glass-panel">
              <GraduationCap size={32} className="edu-icon" />
              <span className="edu-code">DEGREE RECORD // 001</span>
              <p>Engineering disciplines build foundational models for computational intelligence.</p>
            </div>

            <div className="timeline">
              <div className="timeline-line" />

              <motion.article
                className="timeline-item glass-panel"
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
              >
                <div className="timeline-dot" />

                <div className="timeline-meta">
                  <span className="timeline-badge">UNDERGRADUATE DEGREE</span>
                  <span className="timeline-year">{portfolio.education.timeline}</span>
                </div>

                <h3 className="timeline-degree">{portfolio.education.degree}</h3>

                <div className="timeline-institution">
                  <span className="inst-label">COLLEGE:</span>
                  <span className="inst-val">{portfolio.education.college}</span>
                </div>

                <div className="timeline-content-block">
                  <div className="timeline-field">
                    <span className="field-label">
                      <Award size={14} /> Academic Achievements:
                    </span>
                    <p className="field-text">{portfolio.education.achievements}</p>
                  </div>

                  <div className="timeline-field">
                    <span className="field-label">
                      <BookOpen size={14} /> Relevant Coursework:
                    </span>
                    <p className="field-text">{portfolio.education.coursework}</p>
                  </div>
                </div>

                <div className="timeline-tag-footer">
                  <span className="timeline-tag">B.E. EEE</span>
                  <span className="timeline-tag">AI / ML ASPIRANT</span>
                  <span className="timeline-tag">BANNARI AMMAN INST. OF TECH</span>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="content-section page-section contact-section">
          <div className="section-index">
            06 <span>/</span> CONTACT
          </div>
          <SectionHeader
            eyebrow="THE DIRECT CHANNEL"
            title={
              <>
                LET'S BUILD
                <br />
                <em>SOMETHING INTELLIGENT.</em>
              </>
            }
            copy="Open for AI/ML engineering opportunities, collaborative projects, and impactful technological challenges."
          />

          <div className="contact-grid">
            {/* Contact Information Card */}
            <motion.div
              className="contact-card glass-panel"
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="contact-card-top">
                <span className="status-pulse" /> SIGNAL OPEN FOR OPPORTUNITIES
              </div>

              <h3 className="contact-lead">
                Connect directly for AI/ML development, collaborations, or engineering conversations.
              </h3>

              <div className="contact-links">
                <a
                  href={`mailto:${portfolio.contact.email}`}
                  className="contact-link-item"
                  title="Send direct email"
                >
                  <span className="contact-icon">
                    <Mail size={17} />
                  </span>
                  <div className="contact-link-text">
                    <small>DIRECT EMAIL</small>
                    <span>{portfolio.contact.email}</span>
                  </div>
                  <ArrowUpRight size={15} />
                </a>

                <a
                  href={portfolio.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link-item"
                  title="Open GitHub profile"
                >
                  <span className="contact-icon">
                    <Github size={17} />
                  </span>
                  <div className="contact-link-text">
                    <small>GITHUB REPOSITORIES</small>
                    <span>github.com/aathisathguru</span>
                  </div>
                  <ArrowUpRight size={15} />
                </a>

                <a
                  href={portfolio.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link-item"
                  title="Open LinkedIn profile"
                >
                  <span className="contact-icon">
                    <Linkedin size={17} />
                  </span>
                  <div className="contact-link-text">
                    <small>LINKEDIN PROFILE</small>
                    <span>linkedin.com/in/aathi-sathguru-m-7ab384300</span>
                  </div>
                  <ArrowUpRight size={15} />
                </a>
              </div>

              <div className="contact-location">
                <MapPin size={15} />
                <span>Location: {portfolio.contact.location}</span>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              className="contact-form glass-panel"
              onSubmit={handleSubmit}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.1 }}
              noValidate
            >
              <div className="form-heading">
                <span>SEND DIRECT MESSAGE</span>
                <span>INBOX // 001</span>
              </div>

              <label>
                <span>Name</span>
                <input
                  name="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
                {formErrors.email && <span className="field-error">{formErrors.email}</span>}
              </label>

              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell me about your project, opportunity, or idea..."
                  rows={4}
                  required
                />
                {formErrors.message && <span className="field-error">{formErrors.message}</span>}
              </label>

              <button
                className="button button-primary form-submit"
                type="submit"
                disabled={formStatus.state === 'loading'}
              >
                {formStatus.state === 'loading' ? (
                  <>
                    <Loader2 size={15} className="spinner" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={15} />
                  </>
                )}
              </button>

              {formStatus.state === 'success' && (
                <div className="form-status success" role="status">
                  <Check size={16} />
                  <span>{formStatus.message}</span>
                </div>
              )}

              {formStatus.state === 'error' && (
                <div className="form-status error" role="alert">
                  <AlertCircle size={16} />
                  <span>{formStatus.message}</span>
                </div>
              )}

              {formStatus.state === 'ready' && (
                <div className="form-status ready" role="status">
                  <Check size={16} />
                  <span>{formStatus.message}</span>
                </div>
              )}
            </motion.form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-left">
          <span className="footer-copyright">
            © {new Date().getFullYear()} {portfolio.name}
          </span>
          <span className="footer-divider">·</span>
          <span className="footer-degree">B.E. EEE · Bannari Amman Institute of Technology</span>
        </div>
        <div className="footer-center">
          <span className="footer-tag">ARCTIC GLASS // THREE.JS 3D PORTFOLIO</span>
        </div>
        <button
          className="footer-top-btn"
          onClick={() => navigateTo('home')}
          type="button"
          aria-label="Scroll back to top"
        >
          <span>BACK TO TOP</span>
          <ArrowUpRight size={14} />
        </button>
      </footer>

      {/* Resume Pending Dialog */}
      <ResumeDialog
        isOpen={resumeDialogOpen}
        onClose={() => setResumeDialogOpen(false)}
        email={portfolio.contact.email}
      />
    </div>
  )
}

export default App
