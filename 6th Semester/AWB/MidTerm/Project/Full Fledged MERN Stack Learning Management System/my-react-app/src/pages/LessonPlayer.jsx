import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCourseById, getLessons } from '../services/courseService';
import { getMyCourses } from '../services/enrollmentService';
import { getCourseProgress, markLessonComplete } from '../services/progressService';
import { generateCertificate } from '../services/certificateService';
import { getImageUrl, getVideoUrl } from '../utils/imageUrl';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toEmbedUrl = (url) => {
  if (!url || !url.startsWith('http')) return url;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return url;
};
const isEmbedUrl = (url) =>
  url && (url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo'));

const getVideoSrc = (lesson) => {
  const src = lesson?.videoFile || lesson?.videoUrl || null;
  return src ? getVideoUrl(src) : null;
};

// ─── Component ────────────────────────────────────────────────────────────────
const LessonPlayer = () => {
  const { courseId, lessonId } = useParams(); // lessonId is optional
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse]                   = useState(null);
  const [lessons, setLessons]                 = useState([]);
  const [selectedLesson, setSelectedLesson]   = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progress, setProgress]               = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen]         = useState(true);
  const [error, setError]                     = useState('');
  const [claimingCertificate, setClaimingCertificate] = useState(false);

  // ── Load course + lessons + progress ──────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const load = async () => {
      try {
        const [courseRes, lessonsRes, enrollRes, progressRes] = await Promise.allSettled([
          getCourseById(courseId),
          getLessons(courseId),
          getMyCourses(),
          getCourseProgress(courseId),
        ]);

        if (courseRes.status === 'rejected') { setError('Course not found'); return; }
        const courseData  = courseRes.value.data.course;
        const lessonList  = lessonsRes.status === 'fulfilled' ? (lessonsRes.value.data.lessons || []) : [];

        setCourse(courseData);
        setLessons(lessonList);

        // Verify enrollment
        if (enrollRes.status === 'fulfilled') {
          const enrolled = (enrollRes.value.data.enrollments || []).some(
            (e) => e.course?._id === courseId || e.course === courseId
          );
          if (!enrolled) {
            toast.error('You are not enrolled in this course.');
            navigate(`/course/${courseId}`);
            return;
          }
        }

        // Restore progress
        let completedSet = new Set();
        let lastWatched  = null;
        if (progressRes.status === 'fulfilled' && progressRes.value.data.progress) {
          const p = progressRes.value.data.progress;
          setProgress(p);
          completedSet = new Set(p.completedLessons?.map((l) => l._id || l) || []);
          setCompletedLessons(completedSet);
          lastWatched = p.lastWatchedLesson?._id || p.lastWatchedLesson;
        }

        // Pick which lesson to open:
        // 1. URL param lessonId  2. lastWatchedLesson  3. first incomplete  4. first lesson
        if (lessonList.length) {
          const byId      = lessonId && lessonList.find((l) => l._id === lessonId);
          const byLast    = lastWatched && lessonList.find((l) => l._id === lastWatched);
          const firstIncomplete = lessonList.find((l) => !completedSet.has(l._id));
          setSelectedLesson(byId || byLast || firstIncomplete || lessonList[0]);
        }
      } catch {
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, lessonId, user, navigate]);

  // ── Mark lesson complete ───────────────────────────────────────────────────
  const handleMarkComplete = useCallback(async () => {
    if (!selectedLesson || markingComplete) return;
    setMarkingComplete(true);
    try {
      const { data } = await markLessonComplete(courseId, selectedLesson._id);
      const newCompleted = new Set(data.progress.completedLessons?.map((l) => l._id || l));
      setCompletedLessons(newCompleted);
      setProgress(data.progress);
      toast.success('Lesson completed!');

      // Auto-advance to next lesson
      const currentIdx = lessons.findIndex((l) => l._id === selectedLesson._id);
      if (currentIdx < lessons.length - 1) {
        setTimeout(() => setSelectedLesson(lessons[currentIdx + 1]), 600);
      } else {
        toast.success('You completed the entire course!', { duration: 4000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark complete');
    } finally {
      setMarkingComplete(false);
    }
  }, [selectedLesson, markingComplete, courseId, lessons]);

  // ── Navigate lessons ───────────────────────────────────────────────────────
  const currentIdx  = lessons.findIndex((l) => l._id === selectedLesson?._id);
  const prevLesson  = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson  = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;
  const isCompleted = selectedLesson && completedLessons.has(selectedLesson._id);
  const videoSrc    = getVideoSrc(selectedLesson);
  const progressPct = progress?.percentage || 0;

  const handleClaimCertificate = async () => {
    if (claimingCertificate) return;
    setClaimingCertificate(true);
    try {
      await generateCertificate(courseId);
      toast.success('Certificate generated! Check My Certificates.');
      navigate('/student/certificates');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim certificate');
    } finally {
      setClaimingCertificate(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle display-4 text-danger mb-3 d-block" />
        <h5>{error}</h5>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/student/courses')}>
          Back to My Courses
        </button>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-camera-video display-4 text-muted mb-3 d-block" />
        <h5 className="fw-bold">No lessons yet</h5>
        <p className="text-muted">The instructor hasn't added any lessons to this course yet.</p>
        <button className="btn btn-outline-primary mt-2" onClick={() => navigate('/student/courses')}>
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', background: 'var(--lms-bg)' }}>

      {/* ── Top bar ── */}
      <div
        className="d-flex align-items-center gap-3 px-3 py-2 border-bottom"
        style={{ background: 'var(--lms-surface)', position: 'sticky', top: 0, zIndex: 100 }}
      >
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate('/student/courses')}
          title="Back to My Courses"
        >
          <i className="bi bi-arrow-left me-1" />
          <span className="d-none d-md-inline">My Courses</span>
        </button>

        <div className="flex-grow-1 min-w-0">
          <div className="fw-semibold text-truncate small">{course?.title}</div>
          <div className="d-flex align-items-center gap-2">
            <div className="progress flex-grow-1" style={{ height: 4, maxWidth: 200 }}>
              <div
                className={`progress-bar ${progressPct >= 100 ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-muted" style={{ fontSize: 11 }}>
              {completedLessons.size}/{lessons.length} lessons · {progressPct}%
            </span>
          </div>
        </div>

        <div className="d-flex gap-2 ms-auto">
          <Link
            to={`/student/quiz/${courseId}`}
            className="btn btn-sm btn-outline-info"
            title="Take Quiz"
          >
            <i className="bi bi-pencil-square me-1" />
            <span className="d-none d-md-inline">Quiz</span>
          </Link>
          <Link
            to={`/student/chat/${courseId}`}
            className="btn btn-sm btn-outline-secondary"
            title="Course Chat"
          >
            <i className="bi bi-chat me-1" />
            <span className="d-none d-md-inline">Chat</span>
          </Link>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? 'Hide lessons' : 'Show lessons'}
          >
            <i className={`bi bi-layout-sidebar-reverse${sidebarOpen ? '' : '-reverse'}`} />
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="d-flex flex-grow-1 overflow-hidden">

        {/* ── Video area ── */}
        <div className="flex-grow-1 d-flex flex-column overflow-auto">

          {/* Video player */}
          <div style={{ background: '#000', position: 'relative' }}>
            {videoSrc ? (
              isEmbedUrl(videoSrc) ? (
                <div className="ratio ratio-16x9">
                  <iframe
                    key={selectedLesson?._id}
                    src={toEmbedUrl(videoSrc)}
                    title={selectedLesson?.title}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <div className="ratio ratio-16x9">
                  <video
                    key={selectedLesson?._id}
                    controls
                    autoPlay
                    src={videoSrc}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            ) : (
              <div
                className="ratio ratio-16x9 d-flex align-items-center justify-content-center"
                style={{ background: '#1e293b' }}
              >
                <div className="text-center text-white py-5">
                  <i className="bi bi-camera-video-off display-4 mb-3 d-block opacity-50" />
                  <p className="mb-0 opacity-75">No video available for this lesson</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson info + controls */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLesson?._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Title row */}
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                  <div>
                    <div className="text-muted small mb-1">
                      Lesson {currentIdx + 1} of {lessons.length}
                    </div>
                    <h4 className="fw-bold mb-0">{selectedLesson?.title}</h4>
                    {selectedLesson?.description && (
                      <p className="text-muted mt-2 mb-0" style={{ lineHeight: 1.7 }}>
                        {selectedLesson.description}
                      </p>
                    )}
                  </div>

                  {/* Mark complete button */}
                  <button
                    className={`btn fw-semibold flex-shrink-0 ${
                      isCompleted ? 'btn-success' : 'btn-outline-success'
                    }`}
                    onClick={handleMarkComplete}
                    disabled={markingComplete || isCompleted}
                  >
                    {isCompleted ? (
                      <><i className="bi bi-check-circle-fill me-2" />Completed</>
                    ) : markingComplete ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Marking...</>
                    ) : (
                      <><i className="bi bi-check-circle me-2" />Mark as Complete</>
                    )}
                  </button>
                </div>

                {/* Prev / Next navigation */}
                <div className="d-flex gap-2 pt-3 border-top">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && setSelectedLesson(prevLesson)}
                  >
                    <i className="bi bi-chevron-left me-1" />Previous
                  </button>
                  <button
                    className={`btn ms-auto ${nextLesson ? 'btn-primary' : 'btn-outline-secondary'}`}
                    disabled={!nextLesson}
                    onClick={() => nextLesson && setSelectedLesson(nextLesson)}
                  >
                    Next<i className="bi bi-chevron-right ms-1" />
                  </button>
                </div>
                {progressPct >= 100 && (
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleClaimCertificate}
                      disabled={claimingCertificate}
                    >
                      <i className="bi bi-award me-2" />
                      {claimingCertificate ? 'Claiming...' : 'Claim Your Certificate'}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Lesson sidebar ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-start overflow-hidden flex-shrink-0"
              style={{ background: 'var(--lms-surface)' }}
            >
              <div style={{ width: 320, height: '100%', overflowY: 'auto' }}>
                {/* Sidebar header */}
                <div className="p-3 border-bottom">
                  <div className="fw-bold small mb-1">Course Content</div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress flex-grow-1" style={{ height: 5 }}>
                      <div
                        className={`progress-bar ${progressPct >= 100 ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-muted" style={{ fontSize: 11 }}>
                      {completedLessons.size}/{lessons.length}
                    </span>
                  </div>
                </div>

                {/* Lesson list */}
                <div className="list-group list-group-flush">
                  {lessons.map((lesson, idx) => {
                    const done       = completedLessons.has(lesson._id);
                    const isActive   = selectedLesson?._id === lesson._id;
                    const hasVideo   = !!(lesson.videoFile || lesson.videoUrl);

                    return (
                      <button
                        key={lesson._id}
                        type="button"
                        onClick={() => setSelectedLesson(lesson)}
                        className={`list-group-item list-group-item-action d-flex align-items-start gap-3 py-3 px-3 border-0 ${
                          isActive ? 'active' : ''
                        }`}
                        style={{
                          background: isActive ? 'var(--lms-primary)' : 'transparent',
                          color: isActive ? '#fff' : 'var(--lms-text)',
                          borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                        }}
                      >
                        {/* Status circle */}
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                          style={{
                            width: 26,
                            height: 26,
                            fontSize: 11,
                            fontWeight: 700,
                            background: done
                              ? '#22C55E'
                              : isActive
                              ? 'rgba(255,255,255,0.25)'
                              : 'var(--lms-border)',
                            color: done || isActive ? '#fff' : 'var(--lms-text-muted)',
                          }}
                        >
                          {done ? (
                            <i className="bi bi-check" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-grow-1 min-w-0 text-start">
                          <div
                            className="fw-semibold text-truncate"
                            style={{ fontSize: 13 }}
                          >
                            {lesson.title}
                          </div>
                          <div
                            className="d-flex align-items-center gap-2 mt-1"
                            style={{ fontSize: 11, opacity: 0.75 }}
                          >
                            {hasVideo && (
                              <span>
                                <i className="bi bi-play-circle me-1" />
                                {lesson.videoUrl ? 'Video' : 'Uploaded'}
                              </span>
                            )}
                            {done && (
                              <span className={isActive ? 'text-white' : 'text-success'}>
                                Completed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Play icon */}
                        {isActive && (
                          <i className="bi bi-play-fill flex-shrink-0 mt-1" style={{ fontSize: 14 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonPlayer;
