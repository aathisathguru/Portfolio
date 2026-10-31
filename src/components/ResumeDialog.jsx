import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Mail, X, AlertCircle, ArrowUpRight } from 'lucide-react'

export default function ResumeDialog({ isOpen, onClose, email }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
          <motion.div
            className="modal-card glass-panel"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="modal-header">
              <div className="modal-badge">
                <FileText size={16} className="modal-icon" />
                <span>RESUME STATUS // PENDING</span>
              </div>
              <button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close dialog"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-callout">
                <AlertCircle size={20} className="callout-icon" />
                <div>
                  <h4>Verified PDF Pending Upload</h4>
                  <p>
                    The official resume PDF file (<code>public/Aathi-Sathguru-Resume.pdf</code>) is
                    staged and will be available once uploaded.
                  </p>
                </div>
              </div>

              <p className="modal-lead">
                In the meantime, you can request Aathi Sathguru's latest verified resume directly
                via email:
              </p>

              <div className="modal-actions">
                <a
                  className="button button-primary modal-email-btn"
                  href={`mailto:${email}?subject=Resume%20Request%20-%20Aathi%20Sathguru&body=Hello%20Aathi,%0D%0A%0D%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20resume.%0D%0A%0D%0AThank%20you.`}
                >
                  <Mail size={16} />
                  <span>Request Resume via Email</span>
                  <ArrowUpRight size={14} />
                </a>

                <button className="button button-ghost" onClick={onClose} type="button">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

