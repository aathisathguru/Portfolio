import { useState, useEffect } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { navItems } from '../data/portfolio.js'

export default function GlassNav({ activeSection, onNavigate }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleNavigate = (id) => {
    setOpen(false)
    onNavigate(id)
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className={`glass-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        {/* Brand identity button */}
        <button
          className="brand-mark"
          onClick={() => handleNavigate('home')}
          aria-label="Aathi Sathguru — Go to top of page"
        >
          <span className="brand-orbit" aria-hidden="true">
            <span />
          </span>
          <span className="brand-text">
            AS<span className="brand-dot">·</span>
          </span>
        </button>

        {/* Mobile menu toggle */}
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-links"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Nav Links */}
        <div className={`nav-links ${open ? 'menu-expanded' : ''}`} id="primary-links">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id
            return (
              <button
                className={`nav-link ${isActive ? 'active' : ''}`}
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-index">0{index + 1}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="active-indicator" aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        {/* Live Status Pill */}
        <div className="nav-status">
          <span className="status-pulse" aria-hidden="true" />
          <span>AI / ML Dev</span>
        </div>
      </nav>
    </header>
  )
}
