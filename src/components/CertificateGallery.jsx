import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Award, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import CertificateCard from './CertificateCard.jsx'
import CertificatePreviewModal from './CertificatePreviewModal.jsx'
import { certifications } from '../data/certifications.js'

export default function CertificateGallery() {
  const [selectedCert, setSelectedCert] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const trackRef = useRef(null)

  // Drag state
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeftPos = useRef(0)
  const hasMoved = useRef(false)

  const updateScrollState = useCallback(() => {
    if (!trackRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

    // Calculate active index based on scroll position
    const card = trackRef.current.querySelector('.certificate-card')
    if (card) {
      const cardWidth = card.offsetWidth + 24 // card width + gap
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(certifications.length - 1, Math.max(0, index)))
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    updateScrollState()
    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollByAmount = (direction) => {
    if (!trackRef.current) return
    const card = trackRef.current.querySelector('.certificate-card')
    const scrollAmount = card ? (card.offsetWidth + 24) * direction : 380 * direction
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const scrollToIndex = (index) => {
    if (!trackRef.current) return
    const cards = trackRef.current.querySelectorAll('.certificate-card')
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }
  }

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e) => {
    if (!trackRef.current) return
    // Don't drag if clicking buttons or links
    if (e.target.closest('button') || e.target.closest('a')) return

    isDown.current = true
    hasMoved.current = false
    startX.current = e.pageX - trackRef.current.offsetLeft
    scrollLeftPos.current = trackRef.current.scrollLeft
    trackRef.current.classList.add('is-dragging')
  }

  const handleMouseMove = (e) => {
    if (!isDown.current || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.4 // scroll speed multiplier
    if (Math.abs(walk) > 4) {
      hasMoved.current = true
    }
    trackRef.current.scrollLeft = scrollLeftPos.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDown.current = false
    if (trackRef.current) {
      trackRef.current.classList.remove('is-dragging')
    }
  }

  const handleCardSelect = (cert) => {
    // If user was dragging, don't trigger modal
    if (hasMoved.current) return
    setSelectedCert(cert)
  }

  return (
    <div className="cert-gallery-wrapper">
      {/* Gallery Header Controls */}
      <div className="cert-gallery-controls">
        <div className="cert-counter-badge">
          <Award size={15} className="badge-icon" />
          <span>VERIFIED CREDENTIAL GALLERY ({certifications.length})</span>
        </div>

        <div className="cert-nav-arrows">
          <button
            type="button"
            className="cert-nav-btn prev-btn"
            onClick={() => scrollByAmount(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous certificates"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="cert-nav-btn next-btn"
            onClick={() => scrollByAmount(1)}
            disabled={!canScrollRight}
            aria-label="Next certificates"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        className="cert-scroll-track"
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        tabIndex={0}
        aria-label="Certificates gallery. Use arrow keys or scroll horizontally to browse."
      >
        {certifications.map((cert, index) => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            index={index}
            onSelect={handleCardSelect}
          />
        ))}
      </div>

      {/* Pagination Indicators & Swipe Hint */}
      <div className="cert-gallery-footer">
        <div className="cert-dots-indicator" role="tablist" aria-label="Certificate navigation">
          {certifications.map((cert, i) => (
            <button
              key={cert.id}
              type="button"
              className={`cert-dot ${activeIndex === i ? 'is-active' : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Jump to certificate 0${cert.id}`}
              aria-selected={activeIndex === i}
            />
          ))}
        </div>

        <div className="cert-swipe-hint">
          <ShieldCheck size={14} className="hint-icon" />
          <span>DRAG / SWIPE HORIZONTALLY TO BROWSE CREDENTIALS</span>
        </div>
      </div>

      {/* Full Resolution Preview Modal */}
      <CertificatePreviewModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  )
}
