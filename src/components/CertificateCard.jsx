import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, ExternalLink, Calendar, Award, UploadCloud } from 'lucide-react'

export default function CertificateCard({ cert, onSelect, index = 0 }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <motion.article
      className="certificate-card glass-panel"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top Meta Bar */}
      <div className="cert-top-bar">
        <span className="cert-id-tag">CERT // 0{cert.id}</span>
        <span className="cert-status-dot" />
        <span className="cert-issuer-badge">{cert.issuer.replace(/\[|\]/g, '')}</span>
      </div>

      {/* Large Certificate Image Area (No cropping, object-fit: contain) */}
      <div
        className="certificate-image-container"
        onClick={() => onSelect(cert)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(cert)
          }
        }}
        aria-label={`View certificate preview: ${cert.title}`}
      >
        {!imgError ? (
          <>
            <img
              src={cert.image}
              alt={cert.title}
              className={`certificate-img ${imgLoaded ? 'is-loaded' : 'is-loading'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
            />
            {/* Hover overlay hint */}
            <div className="cert-hover-overlay" aria-hidden="true">
              <span className="cert-zoom-btn">
                <Eye size={18} />
                <span>Click to Expand</span>
              </span>
            </div>
          </>
        ) : (
          /* Upload Placeholder */
          <div className="cert-upload-placeholder">
            <div className="placeholder-watermark" aria-hidden="true" />
            <div className="placeholder-content">
              <div className="placeholder-icon-wrap">
                <UploadCloud size={28} className="upload-icon" />
              </div>
              <p className="placeholder-main-label">UPLOAD CERTIFICATE IMAGE</p>
              <span className="placeholder-path">{cert.image}</span>
              <span className="placeholder-tip">Click to view upload spec</span>
            </div>
            {/* Corner accents */}
            <span className="p-corner p-tl" />
            <span className="p-corner p-tr" />
            <span className="p-corner p-bl" />
            <span className="p-corner p-br" />
          </div>
        )}
      </div>

      {/* Certificate Information */}
      <div className="certificate-body">
        <div className="cert-date-row">
          <span className="cert-date">
            <Calendar size={13} className="date-icon" />
            <span>{cert.issueDate.replace(/\[|\]/g, '')}</span>
          </span>
          <span className="cert-status-tag">{cert.status || 'Verified Credential'}</span>
        </div>

        <h3 className="cert-title" onClick={() => onSelect(cert)}>
          {cert.title}
        </h3>

        <div className="cert-issuer-line">
          <Award size={14} className="issuer-icon" />
          <span>{cert.issuer}</span>
        </div>

        {/* Skills Covered */}
        {cert.skills && cert.skills.length > 0 && (
          <div className="cert-skills-wrap">
            <span className="skills-heading">SKILLS COVERED</span>
            <div className="cert-skills-list">
              {cert.skills.map((skill) => (
                <span key={skill} className="cert-skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="cert-action-row">
          <button
            type="button"
            className="button button-ghost cert-view-btn"
            onClick={() => onSelect(cert)}
          >
            <Eye size={14} />
            <span>View Certificate</span>
          </button>

          {cert.credentialUrl && cert.credentialUrl.trim() !== '' ? (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-verify-link"
              title="Verify credential at issuing organization"
            >
              <span>Verify</span>
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="cert-verify-link disabled" title="Credential URL can be added in certifications.js">
              <span>Verification Pending</span>
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
