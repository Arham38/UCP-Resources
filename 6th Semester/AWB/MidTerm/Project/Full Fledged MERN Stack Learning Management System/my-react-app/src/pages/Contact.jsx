import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACT_INFO = [
  {
    icon: 'envelope',
    label: 'Email Us',
    value: 'support@lmsplatform.com',
    sub: 'We reply within 24 hours',
    color: '#2563EB',
    bg: '#EFF6FF',
    href: 'mailto:support@lmsplatform.com',
  },
  {
    icon: 'telephone',
    label: 'Call Us',
    value: '+92 300 1234567',
    sub: 'Mon – Fri, 9 AM – 6 PM PKT',
    color: '#059669',
    bg: '#ECFDF5',
    href: 'tel:+923001234567',
  },
  {
    icon: 'geo-alt',
    label: 'Our Office',
    value: 'Lahore, Pakistan',
    sub: 'Punjab University Campus',
    color: '#DC2626',
    bg: '#FEF2F2',
    href: 'https://maps.google.com',
  },
  {
    icon: 'clock',
    label: 'Working Hours',
    value: 'Mon – Fri: 9 AM – 6 PM',
    sub: 'Sat: 10 AM – 2 PM',
    color: '#D97706',
    bg: '#FFFBEB',
    href: null,
  },
];

const TEAM_CONTACTS = [
  {
    name: 'Arham',
    role: 'Lead Developer',
    avatar: 'A',
    color: '#2563EB',
    email: 'arham@lmsplatform.com',
    topic: 'Technical issues, API, backend',
  },
  {
    name: 'Ansir',
    role: 'UI/UX Designer',
    avatar: 'An',
    color: '#7C3AED',
    email: 'ansir@lmsplatform.com',
    topic: 'Design feedback, accessibility',
  },
  {
    name: 'Ali',
    role: 'Data Engineer',
    avatar: 'Al',
    color: '#059669',
    email: 'ali@lmsplatform.com',
    topic: 'Analytics, reporting',
  },
];

const FAQ = [
  {
    q: 'How do I enroll in a course?',
    a: 'Register for a free account, browse our course catalog, and click "Enroll Now" on any course page. You\'ll get instant access.',
  },
  {
    q: 'Can I become an instructor?',
    a: 'Yes! Register with the "Instructor" role, then create and publish your courses directly from your instructor dashboard.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'We offer a 7-day money-back guarantee on all paid courses. Contact us within 7 days of purchase for a full refund.',
  },
  {
    q: 'How does the quiz system work?',
    a: 'Each course can have timed quizzes with multiple-choice questions. Results are auto-graded and you can retake up to the allowed attempts.',
  },
  {
    q: 'Can I download course videos?',
    a: 'Currently, videos are available for streaming only. Offline download support is on our roadmap for Q3 2025.',
  },
];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="card border-0 shadow-sm mb-2 overflow-hidden">
      <button
        className="w-100 text-start d-flex justify-content-between align-items-center p-4 border-0 bg-transparent fw-semibold"
        style={{ color: 'var(--lms-text)', cursor: 'pointer' }}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <i
          className={`bi bi-chevron-${open ? 'up' : 'down'} flex-shrink-0 ms-3 text-primary`}
          style={{ transition: 'transform 0.2s' }}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4"
        >
          <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>{item.a}</p>
        </motion.div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', category: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.message.trim() || form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('sending');
    // Simulate async send (replace with real API call)
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', category: '', message: '' });
    }, 1400);
  };

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="py-5"
        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0f172a 100%)' }}
      >
        <div className="container py-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="badge bg-primary bg-opacity-25 text-primary fw-semibold px-3 py-2 mb-3">
              Get in Touch
            </span>
            <h1 className="display-5 fw-bold text-white mb-3">
              We'd Love to <span style={{ color: '#93C5FD' }}>Hear From You</span>
            </h1>
            <p className="lead mb-0" style={{ color: '#94a3b8', maxWidth: 520, margin: '0 auto' }}>
              Have a question, feedback, or just want to say hello?
              Our team is here and ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="py-5" style={{ background: 'var(--lms-bg)' }}>
        <div className="container">
          <motion.div
            className="row g-3"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {CONTACT_INFO.map((info) => (
              <motion.div key={info.label} className="col-md-6 col-lg-3" variants={fadeUp}>
                <div className="card border-0 shadow-sm h-100 p-4">
                  <div
                    className="rounded d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 48, height: 48, background: info.bg }}
                  >
                    <i className={`bi bi-${info.icon} fs-5`} style={{ color: info.color }} />
                  </div>
                  <div className="text-muted small fw-semibold mb-1">{info.label}</div>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="fw-bold text-decoration-none mb-1 d-block"
                      style={{ color: 'var(--lms-text)' }}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <div className="fw-bold mb-1">{info.value}</div>
                  )}
                  <div className="text-muted small">{info.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Form + Team ── */}
      <section className="py-5" style={{ background: 'var(--lms-surface)' }}>
        <div className="container">
          <div className="row g-5">

            {/* Contact Form */}
            <motion.div
              className="col-lg-7"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            >
              <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-3">Message Us</span>
              <h2 className="fw-bold mb-1">Send a Message</h2>
              <p className="text-muted mb-4">Fill in the form and we'll get back to you within 24 hours.</p>

              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card border-0 shadow-sm text-center p-5"
                >
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{ width: 72, height: 72, background: '#ECFDF5' }}
                  >
                    <i className="bi bi-check-circle-fill fs-2 text-success" />
                  </div>
                  <h4 className="fw-bold mb-2">Message Sent!</h4>
                  <p className="text-muted mb-4">
                    Thanks for reaching out. We'll reply to your email within 24 hours.
                  </p>
                  <button
                    className="btn btn-primary px-4"
                    onClick={() => setStatus(null)}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <div className="card border-0 shadow-sm p-4">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          placeholder="Arham Bhatti"
                          value={form.name}
                          onChange={handleChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                          placeholder="How can we help?"
                          value={form.subject}
                          onChange={handleChange}
                        />
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Category</label>
                        <select
                          name="category"
                          className="form-select"
                          value={form.category}
                          onChange={handleChange}
                        >
                          <option value="">Select a topic...</option>
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="courses">Course Content</option>
                          <option value="instructor">Become an Instructor</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold small">
                        Message <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                        placeholder="Tell us more about your question or feedback..."
                        value={form.message}
                        onChange={handleChange}
                      />
                      <div className="d-flex justify-content-between">
                        {errors.message
                          ? <div className="invalid-feedback d-block">{errors.message}</div>
                          : <div className="form-text">Minimum 20 characters</div>
                        }
                        <div className="form-text">{form.message.length} chars</div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary px-5 py-2 fw-semibold"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                      ) : (
                        <><i className="bi bi-send me-2" />Send Message</>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>

            {/* Right column — team + social */}
            <motion.div
              className="col-lg-5"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            >
              {/* Direct team contacts */}
              <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-3">Direct Contact</span>
              <h2 className="fw-bold mb-1">Talk to the Team</h2>
              <p className="text-muted mb-4">Reach the right person directly for faster help.</p>

              <div className="d-flex flex-column gap-3 mb-5">
                {TEAM_CONTACTS.map((m) => (
                  <div key={m.name} className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                      style={{ width: 48, height: 48, background: m.color, fontSize: 14 }}
                    >
                      {m.avatar}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-bold">{m.name}</div>
                      <div className="text-muted small">{m.role}</div>
                      <div className="text-muted small text-truncate">{m.topic}</div>
                    </div>
                    <a
                      href={`mailto:${m.email}`}
                      className="btn btn-sm btn-outline-primary flex-shrink-0"
                      title={m.email}
                    >
                      <i className="bi bi-envelope" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="card border-0 shadow-sm p-4">
                <h6 className="fw-bold mb-3">Follow Us</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { icon: 'github',     label: 'GitHub',    handle: '@lms-platform',  href: '#', color: '#1f2328' },
                    { icon: 'linkedin',   label: 'LinkedIn',  handle: 'LMS Platform',   href: '#', color: '#0A66C2' },
                    { icon: 'twitter-x',  label: 'Twitter/X', handle: '@lmsplatform',   href: '#', color: '#000' },
                    { icon: 'youtube',    label: 'YouTube',   handle: 'LMS Tutorials',  href: '#', color: '#FF0000' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="d-flex align-items-center gap-3 text-decoration-none p-2 rounded"
                      style={{ color: 'var(--lms-text)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--lms-border)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 36, height: 36, background: s.color }}
                      >
                        <i className={`bi bi-${s.icon} text-white`} style={{ fontSize: 15 }} />
                      </div>
                      <div>
                        <div className="fw-semibold small">{s.label}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{s.handle}</div>
                      </div>
                      <i className="bi bi-arrow-right ms-auto text-muted small" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-5" style={{ background: 'var(--lms-bg)' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">FAQ</span>
                <h2 className="fw-bold">Frequently Asked Questions</h2>
                <p className="text-muted">Quick answers to the most common questions</p>
              </div>
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              >
                {FAQ.map((item, i) => (
                  <motion.div key={i} variants={fadeUp}>
                    <FaqItem item={item} index={i} />
                  </motion.div>
                ))}
              </motion.div>
              <div className="text-center mt-4">
                <p className="text-muted small">
                  Still have questions?{' '}
                  <a href="mailto:support@lmsplatform.com" className="text-primary fw-semibold text-decoration-none">
                    Email us directly
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-5"
        style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
      >
        <div className="container text-center py-3">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="fw-bold text-white mb-3">Ready to Start Learning?</h2>
            <p className="text-white mb-4" style={{ opacity: 0.85 }}>
              Don't wait — join 1,200+ learners already building their future.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/register" className="btn btn-light btn-lg fw-semibold px-4">
                Get Started Free
              </Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg px-4">
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
