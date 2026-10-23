import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Programming', icon: 'code-slash',  color: '#2563EB', bg: '#EFF6FF' },
  { name: 'Design',      icon: 'palette',     color: '#7C3AED', bg: '#F5F3FF' },
  { name: 'Marketing',   icon: 'graph-up',    color: '#059669', bg: '#ECFDF5' },
  { name: 'Business',    icon: 'briefcase',   color: '#D97706', bg: '#FFFBEB' },
  { name: 'Data Science',icon: 'bar-chart',   color: '#0891B2', bg: '#ECFEFF' },
];

const STATS = [
  { label: 'Students Enrolled', value: 1200, suffix: '+', icon: 'people' },
  { label: 'Expert Instructors', value: 48,  suffix: '+', icon: 'person-badge' },
  { label: 'Courses Available',  value: 120, suffix: '+', icon: 'book' },
  { label: 'Completion Rate',    value: 94,  suffix: '%', icon: 'trophy' },
];

const REVIEWS = [
  {
    name: 'Arham',
    role: 'Full Stack Developer',
    avatar: 'A',
    color: '#2563EB',
    stars: 5,
    text: '"The course structure is outstanding. I went from zero to building full-stack apps in just 8 weeks. Best investment I\'ve made in my career."',
  },
  {
    name: 'Ansir',
    role: 'UI/UX Designer',
    avatar: 'An',
    color: '#7C3AED',
    stars: 5,
    text: '"Real-world projects, live feedback, and an incredibly supportive community. This platform completely changed how I approach design."',
  },
  {
    name: 'Ali',
    role: 'Data Scientist',
    avatar: 'Al',
    color: '#059669',
    stars: 5,
    text: '"The Data Science tracks are top-notch. The instructors explain complex concepts in a way that actually sticks. Highly recommended!"',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create an Account', desc: 'Sign up in seconds as a student or instructor. No credit card required to get started.', icon: 'person-plus' },
  { step: '02', title: 'Browse & Enroll',   desc: 'Explore hundreds of courses across categories. Enroll with one click and start immediately.', icon: 'search' },
  { step: '03', title: 'Learn & Progress',  desc: 'Watch lessons, complete quizzes, and track your progress with our smart dashboard.', icon: 'play-circle' },
  { step: '04', title: 'Earn & Grow',       desc: 'Complete courses, earn certificates, and showcase your new skills to the world.', icon: 'award' },
];

// ─── Animated counter ─────────────────────────────────────────────────────────
const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

const StatItem = ({ stat, animate }) => {
  const count = useCounter(stat.value, 1600, animate);
  return (
    <div className="text-center">
      <div
        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
        style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)' }}
      >
        <i className={`bi bi-${stat.icon} fs-4 text-white`} />
      </div>
      <div className="display-6 fw-bold text-white">
        {count}{stat.suffix}
      </div>
      <div className="text-white-50 small mt-1">{stat.label}</div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    getCourses()
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Trigger counter when stats section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const featuredCourses = courses.slice(0, 6);

  const fadeUp = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section position-relative overflow-hidden">
        {/* Decorative blobs */}
        <div
          className="position-absolute rounded-circle"
          style={{ width: 400, height: 400, background: 'rgba(255,255,255,0.05)', top: -100, right: -100, pointerEvents: 'none' }}
        />
        <div
          className="position-absolute rounded-circle"
          style={{ width: 200, height: 200, background: 'rgba(255,255,255,0.07)', bottom: 20, left: -60, pointerEvents: 'none' }}
        />

        <div className="container position-relative">
          <div className="row align-items-center py-3">
            <motion.div
              className="col-lg-7"
              initial="hidden" animate="visible" variants={fadeUp}
            >
              <span className="badge bg-white text-primary fw-semibold px-3 py-2 mb-3 d-inline-block" style={{ fontSize: 13 }}>
                <i className="bi bi-lightning-charge-fill me-1" />
                #1 Online Learning Platform
              </span>
              <h1 className="display-4 fw-bold mb-3 lh-sm">
                Unlock Your Potential<br />
                <span style={{ color: '#93C5FD' }}>One Course at a Time</span>
              </h1>
              <p className="lead mb-4" style={{ opacity: 0.9 }}>
                Join over 1,200 learners mastering in-demand skills with expert-led courses,
                real projects, and a community that grows with you.
              </p>

              <form onSubmit={handleSearch} className="d-flex gap-2 mb-4" style={{ maxWidth: 480 }}>
                <div className="input-group input-group-lg shadow-sm">
                  <span className="input-group-text bg-white border-0">
                    <i className="bi bi-search text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 ps-0"
                    placeholder="What do you want to learn?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    Search
                  </button>
                </div>
              </form>

              <div className="d-flex flex-wrap gap-2">
                {!user && (
                  <Link to="/register" className="btn btn-light btn-lg fw-semibold px-4">
                    Start for Free
                  </Link>
                )}
                <Link to="/courses" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-play-circle me-2" />Browse Courses
                </Link>
              </div>

              <div className="d-flex gap-4 mt-4">
                {['No credit card', 'Cancel anytime', '48h support'].map((t) => (
                  <span key={t} className="text-white-50 small d-flex align-items-center gap-1">
                    <i className="bi bi-check-circle-fill text-white" style={{ fontSize: 12 }} />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        ref={statsRef}
        style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0f172a 100%)' }}
        className="py-5"
      >
        <div className="container">
          <div className="row g-4 justify-content-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="col-6 col-md-3">
                <StatItem stat={stat} animate={statsVisible} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-5" style={{ background: 'var(--lms-bg)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">How It Works</span>
            <h2 className="fw-bold">Get Started in 4 Simple Steps</h2>
            <p className="text-muted">Everything you need to go from beginner to expert</p>
          </div>
          <motion.div
            className="row g-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div key={item.step} className="col-md-3" variants={fadeUp}>
                <div className="text-center position-relative">
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div
                      className="d-none d-md-block position-absolute"
                      style={{ top: 28, left: '60%', width: '80%', height: 2, background: 'var(--lms-border)', zIndex: 0 }}
                    />
                  )}
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 position-relative"
                    style={{ width: 56, height: 56, background: '#EFF6FF', zIndex: 1 }}
                  >
                    <i className={`bi bi-${item.icon} fs-5 text-primary`} />
                  </div>
                  <div className="fw-bold text-primary small mb-1">Step {item.step}</div>
                  <h6 className="fw-bold mb-2">{item.title}</h6>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="py-5" style={{ background: 'var(--lms-surface)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">Courses</span>
              <h2 className="fw-bold mb-0">Featured Courses</h2>
            </div>
            <Link to="/courses" className="btn btn-outline-primary d-none d-md-inline-flex align-items-center gap-1">
              View All <i className="bi bi-arrow-right" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-book display-4 d-block mb-3" />
              No courses yet. Check back soon!
            </div>
          ) : (
            <motion.div
              className="row g-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
            >
              {featuredCourses.map((course) => (
                <motion.div key={course._id} className="col-md-6 col-lg-4" variants={fadeUp}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-4 d-md-none">
            <Link to="/courses" className="btn btn-primary">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-5" style={{ background: 'var(--lms-bg)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">Explore</span>
            <h2 className="fw-bold">Browse by Category</h2>
            <p className="text-muted">Find the perfect course in your area of interest</p>
          </div>
          <motion.div
            className="row g-3"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.name} className="col-6 col-md-4 col-lg-2" variants={fadeUp}>
                <Link
                  to={`/courses?category=${cat.name}`}
                  className="card text-decoration-none h-100 border-0 shadow-sm category-card"
                  style={{ '--cat-color': cat.color }}
                >
                  <div className="card-body text-center py-4 px-2">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: 52, height: 52, background: cat.bg }}
                    >
                      <i className={`bi bi-${cat.icon} fs-4`} style={{ color: cat.color }} />
                    </div>
                    <div className="fw-semibold small">{cat.name}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-5" style={{ background: 'var(--lms-surface)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2 mb-2">Testimonials</span>
            <h2 className="fw-bold">What Our Students Say</h2>
            <p className="text-muted">Real stories from real learners</p>
          </div>
          <motion.div
            className="row g-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={stagger}
          >
            {REVIEWS.map((r) => (
              <motion.div key={r.name} className="col-md-4" variants={fadeUp}>
                <div className="card border-0 shadow-sm h-100 p-1">
                  <div className="card-body p-4">
                    {/* Stars */}
                    <div className="mb-3">
                      {[...Array(r.stars)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-warning me-1" style={{ fontSize: 13 }} />
                      ))}
                    </div>
                    <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>{r.text}</p>
                    <div className="d-flex align-items-center gap-3 mt-auto">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                        style={{ width: 44, height: 44, background: r.color, fontSize: 14 }}
                      >
                        {r.avatar}
                      </div>
                      <div>
                        <div className="fw-bold">{r.name}</div>
                        <div className="text-muted small">{r.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-5"
        style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
      >
        <div className="container">
          <motion.div
            className="row align-items-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="col-lg-8 mb-4 mb-lg-0">
              <h2 className="fw-bold text-white mb-2">Ready to Transform Your Career?</h2>
              <p className="text-white mb-0" style={{ opacity: 0.85 }}>
                Join 1,200+ learners already building the future. Start your first course today — it's free.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end d-flex gap-2 justify-content-lg-end">
              {!user ? (
                <>
                  <Link to="/register" className="btn btn-light btn-lg fw-semibold px-4">
                    Get Started Free
                  </Link>
                  <Link to="/courses" className="btn btn-outline-light btn-lg px-4">
                    Browse
                  </Link>
                </>
              ) : (
                <Link to="/courses" className="btn btn-light btn-lg fw-semibold px-4">
                  <i className="bi bi-arrow-right me-2" />Explore Courses
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
