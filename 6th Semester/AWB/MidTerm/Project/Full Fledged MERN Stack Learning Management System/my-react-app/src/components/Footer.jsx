import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#0f172a', color: '#94a3b8' }}>
    {/* Main footer */}
    <div className="container py-5">
      <div className="row g-4">

        {/* Brand */}
        <div className="col-lg-4 col-md-6">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div
              className="rounded d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, background: '#2563EB' }}
            >
              <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: 18 }} />
            </div>
            <span className="text-white fw-bold fs-5">LMS Platform</span>
          </div>
          <p className="small mb-4" style={{ lineHeight: 1.8 }}>
            Empowering learners worldwide with expert-led courses, real-time collaboration,
            and practical progress tracking. Start learning today — it's free.
          </p>
          {/* Social icons */}
          <div className="d-flex gap-2">
            {[
              { icon: 'github',    href: '#', label: 'GitHub'    },
              { icon: 'linkedin', href: '#', label: 'LinkedIn'  },
              { icon: 'twitter-x',href: '#', label: 'Twitter'   },
              { icon: 'youtube',  href: '#', label: 'YouTube'   },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: 36, height: 36,
                  background: 'rgba(255,255,255,0.07)',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <i className={`bi bi-${s.icon}`} style={{ fontSize: 15 }} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-lg-2 col-md-3 col-6">
          <h6 className="text-white fw-semibold mb-3">Platform</h6>
          <ul className="list-unstyled mb-0">
            {[
              { label: 'Home',    to: '/'        },
              { label: 'Courses', to: '/courses' },
              { label: 'About',   to: '/about'   },
              { label: 'Contact', to: '/contact' },
              { label: 'Login',   to: '/login'   },
              { label: 'Register',to: '/register'},
            ].map((l) => (
              <li key={l.label} className="mb-2">
                <Link
                  to={l.to}
                  className="text-decoration-none small"
                  style={{ color: '#94a3b8', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="col-lg-2 col-md-3 col-6">
          <h6 className="text-white fw-semibold mb-3">Categories</h6>
          <ul className="list-unstyled mb-0">
            {['Programming', 'Design', 'Marketing', 'Business', 'Data Science'].map((cat) => (
              <li key={cat} className="mb-2">
                <Link
                  to={`/courses?category=${cat}`}
                  className="text-decoration-none small"
                  style={{ color: '#94a3b8', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-lg-4 col-md-6">
          <h6 className="text-white fw-semibold mb-3">Stay in the Loop</h6>
          <p className="small mb-3">
            Get notified about new courses, features, and learning tips — no spam, ever.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="d-flex gap-2"
          >
            <input
              type="email"
              className="form-control form-control-sm"
              placeholder="your@email.com"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e2e8f0',
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm px-3 flex-shrink-0">
              Subscribe
            </button>
          </form>
          <p className="mt-3 small" style={{ color: '#475569' }}>
            <i className="bi bi-shield-check me-1" />
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="container py-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="small mb-0" style={{ color: '#475569' }}>
            &copy; {new Date().getFullYear()} LMS Platform. Built by{' '}
            <span className="text-primary fw-semibold">Arham, Ansir &amp; Ali</span>.
            All rights reserved.
          </p>
          <div className="d-flex gap-3">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
              <a
                key={t}
                href="#"
                className="text-decoration-none small"
                style={{ color: '#475569', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
