import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Arham',
    role: 'Lead Developer & Co-Founder',
    avatar: 'A',
    color: '#2563EB',
    bio: 'Full-stack engineer with a passion for building scalable education platforms. Architected the entire LMS backend and real-time features.',
    skills: ['Node.js', 'React', 'MongoDB'],
  },
  {
    name: 'Ansir',
    role: 'UI/UX Designer & Co-Founder',
    avatar: 'An',
    color: '#7C3AED',
    bio: 'Designs intuitive, accessible interfaces that make learning feel effortless. Responsible for the entire design system and user experience.',
    skills: ['Figma', 'Tailwind', 'Framer Motion'],
  },
  {
    name: 'Ali',
    role: 'Data Engineer',
    avatar: 'Al',
    color: '#059669',
    bio: 'Builds the recommendation engine and analytics pipeline. Passionate about using data to personalise every learner\'s journey.',
    skills: ['Python', 'Machine Learning', 'Analytics'],
  },
];

const VALUES = [
  { icon: 'lightbulb',       title: 'Innovation First',    desc: 'We constantly push the boundaries of what an LMS can do — from progress tracking to real-time collaboration.' },
  { icon: 'people',          title: 'Community Driven',    desc: 'Learning is better together. Our platform is built around peer interaction, live chat, and shared progress.' },
  { icon: 'shield-check',    title: 'Quality Assured',     desc: 'Every course goes through a rigorous review process. We only publish content that meets our high standards.' },
  { icon: 'universal-access',title: 'Accessible to All',   desc: 'Education should have no barriers. We offer free courses, mobile-first design, and full accessibility support.' },
];

const MILESTONES = [
  { year: '2023', event: 'Platform founded by Arham, Ansir & Ali' },
  { year: 'Q1 2024', event: 'Launched with 20 courses and 100 beta students' },
  { year: 'Q3 2024', event: 'Reached 500 enrolled students across 6 categories' },
  { year: '2025', event: 'Introduced real-time chat, quizzes, and progress insights' },
  { year: 'Today', event: '1,200+ learners, 48 instructors, 120+ courses' },
];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

// ─── Component ────────────────────────────────────────────────────────────────
const About = () => (
  <>
    {/* ── Hero ── */}
    <section
      className="py-5"
      style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0f172a 100%)' }}
    >
      <div className="container py-4">
        <motion.div
          className="row justify-content-center text-center"
          initial="hidden" animate="visible" variants={fadeUp}
        >
          <div className="col-lg-7">
            <span className="badge bg-primary bg-opacity-25 text-primary fw-semibold px-3 py-2 mb-3">
              Our Story
            </span>
            <h1 className="display-5 fw-bold text-white mb-3">
              Built by Learners,<br />
              <span style={{ color: '#93C5FD' }}>for Learners</span>
            </h1>
            <p className="lead mb-4" style={{ color: '#94a3b8' }}>
              We started LMS because we experienced firsthand how hard it is to find
              quality, structured learning in one place. So we built it ourselves.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/courses" className="btn btn-primary btn-lg px-4">
                Explore Courses
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                Join Free
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Mission ── */}
    <section className="py-5" style={{ background: 'var(--lms-surface)' }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <motion.div
            className="col-lg-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-3">Mission</span>
            <h2 className="fw-bold mb-3">Making Quality Education Accessible to Everyone</h2>
            <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>
              We believe that where you were born or how much money you have should never
              determine the quality of education you receive. Our platform connects ambitious
              learners with world-class instructors — regardless of geography or background.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>
              From beginner-friendly introductions to advanced professional tracks, every
              course on our platform is crafted to deliver real, measurable outcomes.
            </p>
            <div className="d-flex gap-4">
              <div>
                <div className="fw-bold fs-4 text-primary">1,200+</div>
                <div className="text-muted small">Active Students</div>
              </div>
              <div>
                <div className="fw-bold fs-4 text-primary">120+</div>
                <div className="text-muted small">Courses</div>
              </div>
              <div>
                <div className="fw-bold fs-4 text-primary">94%</div>
                <div className="text-muted small">Completion Rate</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col-lg-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <div className="row g-3">
              {[
                { icon: 'mortarboard', label: 'Expert-Led Courses',    color: '#EFF6FF', iconColor: '#2563EB' },
                { icon: 'graph-up',    label: 'Progress Tracking',     color: '#F5F3FF', iconColor: '#7C3AED' },
                { icon: 'chat-dots',   label: 'Real-Time Chat',        color: '#ECFDF5', iconColor: '#059669' },
                { icon: 'graph-up',    label: 'Progress Insights',     color: '#FEF2F2', iconColor: '#DC2626' },
                { icon: 'pencil-square', label: 'Timed Quizzes',       color: '#FFFBEB', iconColor: '#D97706' },
                { icon: 'shield-check', label: 'Secure & Private',     color: '#ECFEFF', iconColor: '#0891B2' },
              ].map((f) => (
                <div key={f.label} className="col-6">
                  <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
                    <div
                      className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 40, height: 40, background: f.color }}
                    >
                      <i className={`bi bi-${f.icon}`} style={{ color: f.iconColor, fontSize: 18 }} />
                    </div>
                    <span className="fw-semibold small">{f.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Values ── */}
    <section className="py-5" style={{ background: 'var(--lms-bg)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">Values</span>
          <h2 className="fw-bold">What We Stand For</h2>
          <p className="text-muted">The principles that guide every decision we make</p>
        </div>
        <motion.div
          className="row g-4"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          {VALUES.map((v) => (
            <motion.div key={v.title} className="col-md-6 col-lg-3" variants={fadeUp}>
              <div className="card border-0 shadow-sm h-100 text-center p-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 56, height: 56, background: '#EFF6FF' }}
                >
                  <i className={`bi bi-${v.icon} fs-4 text-primary`} />
                </div>
                <h6 className="fw-bold mb-2">{v.title}</h6>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Team ── */}
    <section className="py-5" style={{ background: 'var(--lms-surface)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">Team</span>
          <h2 className="fw-bold">Meet the Builders</h2>
          <p className="text-muted">Three friends who turned a frustration into a platform</p>
        </div>
        <motion.div
          className="row g-4 justify-content-center"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        >
          {TEAM.map((member) => (
            <motion.div key={member.name} className="col-md-4" variants={fadeUp}>
              <div className="card border-0 shadow-sm h-100 text-center p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold"
                  style={{ width: 72, height: 72, background: member.color, fontSize: 22 }}
                >
                  {member.avatar}
                </div>
                <h5 className="fw-bold mb-1">{member.name}</h5>
                <p className="text-primary small fw-semibold mb-3">{member.role}</p>
                <p className="text-muted small mb-3" style={{ lineHeight: 1.7 }}>{member.bio}</p>
                <div className="d-flex flex-wrap gap-1 justify-content-center">
                  {member.skills.map((s) => (
                    <span key={s} className="badge bg-light text-muted" style={{ fontSize: 11 }}>{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Timeline ── */}
    <section className="py-5" style={{ background: 'var(--lms-bg)' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">Journey</span>
          <h2 className="fw-bold">Our Milestones</h2>
          <p className="text-muted">From idea to impact</p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="position-relative">
              {/* Vertical line */}
              <div
                className="position-absolute"
                style={{ left: 20, top: 0, bottom: 0, width: 2, background: 'var(--lms-border)' }}
              />
              <motion.div
                className="d-flex flex-column gap-4"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              >
                {MILESTONES.map((m, idx) => (
                  <motion.div key={m.year} className="d-flex gap-4 align-items-start" variants={fadeUp}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0 position-relative"
                      style={{ width: 40, height: 40, background: '#2563EB', fontSize: 11, zIndex: 1 }}
                    >
                      {idx + 1}
                    </div>
                    <div className="card border-0 shadow-sm flex-grow-1 p-3">
                      <div className="fw-bold text-primary small mb-1">{m.year}</div>
                      <div className="fw-semibold">{m.event}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
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
          <h2 className="fw-bold text-white mb-3">Be Part of Our Story</h2>
          <p className="text-white mb-4" style={{ opacity: 0.85, maxWidth: 500, margin: '0 auto 1.5rem' }}>
            Whether you're here to learn or to teach, there's a place for you on our platform.
            Join the community today.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/register" className="btn btn-light btn-lg fw-semibold px-4">
              Join as Student
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4">
              Become an Instructor
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

export default About;
