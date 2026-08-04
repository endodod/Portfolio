"use client";
import { useEffect } from "react";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!project) return null;

  const filename = project.dir.replace(/\/$/, "") + ".txt";

  return (
    <div className="proj-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="proj-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.dir} project details`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="console-header">
          <span className="console-dot console-dot--red" />
          <span className="console-dot console-dot--yellow" />
          <span className="console-dot console-dot--green" />
          <span className="console-title">cat {filename} — paul @ portfolio</span>
        </div>

        <div className="proj-modal-body">
          <div className="about-field">
            <span className="about-key">name</span>
            <span className="about-sep">:</span>
            <span className="about-value about-value--accent">{project.dir}</span>
          </div>

          <div className="about-field proj-modal-field--wrap">
            <span className="about-key">description</span>
            <span className="about-sep">:</span>
            <span className="about-value">{project.description}</span>
          </div>

          <div className="about-field proj-modal-field--tags">
            <span className="about-key">stack</span>
            <span className="about-sep">:</span>
            <span className="about-value">
              {project.stack.map((t) => (
                <span className="about-tag" key={t}>{t}</span>
              ))}
            </span>
          </div>

          {project.repos ? (
            project.repos.map((r) => (
              <div className="about-field" key={r.label}>
                <span className="about-key">{r.label}</span>
                <span className="about-sep">:</span>
                <a
                  className="about-value about-value--link"
                  href={r.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.github}
                </a>
              </div>
            ))
          ) : (
            <div className="about-field">
              <span className="about-key">github</span>
              <span className="about-sep">:</span>
              <a
                className="about-value about-value--link"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.github}
              </a>
            </div>
          )}

          {project.live && (
            <div className="about-field">
              <span className="about-key">live</span>
              <span className="about-sep">:</span>
              <a
                className="about-value about-value--link"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.live}
              </a>
            </div>
          )}

          <p className="proj-modal-hint">press [esc] or click outside to close</p>

          <button className="proj-modal-back" onClick={onClose}>
            ← back
          </button>
        </div>
      </div>
    </div>
  );
}
