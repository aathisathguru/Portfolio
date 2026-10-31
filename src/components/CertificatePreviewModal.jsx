import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Calendar, Award, CheckCircle2, UploadCloud, Info } from 'lucide-react'

export default function CertificatePreviewModal({ cert, onClose }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (cert) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [cert, onClose])

  if (!cert) return null

  return (
    <AnimatePresence>
      <div
        className="modal-backdrop cert-preview-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-cert-title"
      >
        <motion.div
          className="cert-preview-card glass-panel"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Modal Header */}
          <div className="cert-preview-header">
            <div className="preview-header-meta">
              <span className="cert-id-tag">CERTIFICATE // 0{cert.id}</span>
              <span className="preview-issuer">{cert.issuer.replace(/\[|\]/g, '')}</span>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close certificate preview"
            >
              <X size={20} />
            </button>
          </div>

          {/* Complete Uncropped Certificate Visual Area */}
          <div className="cert-modal-visual-area">
            {!imgError ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="cert-modal-full-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="cert-modal-placeholder-notice">
                <UploadCloud size={44} className="placeholder-big-icon" />
                <h3>UPLOAD CERTIFICATE IMAGE</h3>
                <p className="modal-path-code">
                  Target File: <code>public{cert.image}</code>
                </p>
                <div className="modal-upload-instructions">
                  <div className="instruction-item">
                    <CheckCircle2 size={15} />
                    <span>Drop your landscape certificate image (PNG, JPG, or WEBP) into <code>public/certificates/</code></span>
                  </div>
                  <div className="instruction-item">
                    <CheckCircle2 size={15} />
                    <span>Name it <code>certificate-0{cert.id}.png</code></span>
                  </div>
                  <div className="instruction-item">
                    <CheckCircle2 size={15} />
                    <span>The portfolio gallery will automatically load and showcase your high-resolution certificate here!</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Certificate Metadata & Footer */}
          <div className="cert-modal-footer">
            <div className="cert-modal-info">
              <h2 id="preview-cert-title" className="modal-cert-title">
                {cert.title}
              </h2>
              <div className="modal-cert-sub">
                <span className="sub-item">
                  <Award size={14} />
                  <span>{cert.issuer}</span>
                </span>
                <span className="sub-item">
                  <Calendar size={14} />
                  <span>{cert.issueDate}</span>
                </span>
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="modal-skills-list">
                  {cert.skills.map((s) => (
                    <span key={s} className="cert-skill-chip">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="cert-modal-actions">
              {cert.credentialUrl && cert.credentialUrl.trim() !== '' ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-primary"
                >
                  <span>Verify Original</span>
                  <ExternalLink size={15} />
                </a>
              ) : (
                <a
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-ghost"
                  title="Open full image in new tab if uploaded"
                >
                  <span>View Original Image</span>
                  <ExternalLink size={14} />
                </a>
              )}

              <button type="button" className="button button-ghost" onClick={onClose}>
                Close Preview
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
