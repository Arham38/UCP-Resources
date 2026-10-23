import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCourseById, getLessons } from '../services/courseService';
import { enroll, getMyCourses } from '../services/enrollmentService';
import { getCourseProgress, markLessonComplete } from '../services/progressService';
import { generateCertificate } from '../services/certificateService';
import { getImageUrl, getVideoUrl } from '../utils/imageUrl';
import ReviewSection from '../components/ReviewSection';
import WishlistButton from '../components/WishlistButton';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const toEmbedUrl = (url) => {
  if (!url || !url.startsWith('http')) return url;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
};

const isEmbedUrl = (url) => url && (url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo'));

const getVideoSource = (lesson) => {
  const src = lesson.videoFile || lesson.videoUrl || null;
  return src ? getVideoUrl(src) : null;
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [markingComplete, setMarkingComplete] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [claimingCertificate, setClaimingCertificate] = useState(false);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const courseRes = await getCourseById(id);
        setCourse(courseRes.data.course);

        let enrolled = false;

        // Check enrollment + progress if student
        if (user?.role === 'student') {
          const [enrollRes, progressRes] = await Promise.allSettled([
            getMyCourses(),
            getCourseProgress(id),
          ]);
          if (enrollRes.status === 'fulfilled') {
            enrolled = (enrollRes.value.data.enrollments || []).some(
              (e) => e.course?._id === id || e.course === id
            );
            setIsEnrolled(enrolled);
          }
          if (progressRes.status === 'fulfilled' && progressRes.value.data.progress) {
            const p = progressRes.value.data.progress;
            setProgress(p);
            setCompletedLessons(new Set(p.completedLessons?.map((l) => l._id || l)));
          }
        }

        // Students who are not enrolled will get 403 on lessons API.
        // Avoid turning that into a fake "Course not found" page.
        const shouldLoadLessons = user?.role !== 'student' || enrolled;
        if (shouldLoadLessons) {
          const lessonsRes = await getLessons(id);
          const lessonList = lessonsRes.data.lessons || [];
          setLessons(lessonList);
          if (lessonList.length) setSelectedLesson(lessonList[0]);
        } else {
          setLessons([]);
        }
      } catch (err) {
        const status = err?.response?.status;
        setError(status === 404 ? 'Course not found' : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { setError('Only students can enroll.'); return; }
    setEnrolling(true);
    setError('');
    try {
      await enroll(id);
      setIsEnrolled(true);
      toast.success('Enrolled successfully!');
      // Go straight to the lesson player
      navigate(`/student/learn/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed';
      if (msg.includes('Already enrolled')) {
        setIsEnrolled(true);
      } else {
        setError(msg);
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedLesson || markingComplete) return;
    setMarkingComplete(true);
    try {
      const { data } = await markLessonComplete(id, selectedLesson._id);
      setProgress(data.progress);
      setCompletedLessons(new Set(data.progress.completedLessons?.map((l) => l._id || l)));
      toast.success('Lesson marked as complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark complete');
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleClaimCertificate = async () => {
    setClaimingCertificate(true);
    try {
      const { data } = await generateCertificate(id);
      setCertificate(data.certificate);
      toast.success('Certificate generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setClaimingCertificate(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !course) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  const selectedVideo = selectedLesson && getVideoSource(selectedLesson);
  const isLessonCompleted = selectedLesson && completedLessons.has(selectedLesson._id);
  const progressPct = progress?.percentage || 0;

  return (
    <div className="py-5">
      <div className="container">
        <div className="row g-4">
          {/* Main content */}
          <div className="col-lg-8">
            {/* Course header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded mb-4 overflow-hidden bg-secondary d-flex align-items-center justify-content-center" style={{ maxHeight: 400, minHeight: 260 }}>
                {course?.image && !imageError ? (
                  <img
                    src={getImageUrl(course.image)}
                    alt={course.title}
                    className="img-fluid w-100"
                    style={{ maxHeight: 400, objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <i className="bi bi-image text-white" style={{ fontSize: '5rem', opacity: 0.4 }} />
                )}
              </div>

              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge bg-primary">{course?.category}</span>
                {course?.price === 0 && <span className="badge bg-success">Free</span>}
                <span className="badge bg-light text-dark d-flex align-items-center gap-1">
                  <StarRating rating={Number(course?.avgRating || 0)} size={12} readOnly />
                  {(Number(course?.avgRating || 0)).toFixed(1)} ({course?.totalReviews || 0})
                </span>
              </div>

              <h1 className="fw-bold mb-2">{course?.title}</h1>
              <p className="text-muted mb-1">
                <i className="bi bi-person me-1" />
                Instructor: <strong>{course?.instructor?.name}</strong>
              </p>
              <p className="lead mb-4">{course?.description}</p>

              {/* Progress bar (enrolled students) */}
              {isEnrolled && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold">Your Progress</span>
                      <span className="fw-bold text-primary">{progressPct}%</span>
                    </div>
                    <div className="progress mb-2" style={{ height: 10 }}>
                      <div
                        className={`progress-bar ${progressPct >= 100 ? 'bg-success' : 'bg-primary'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="d-flex gap-3 small text-muted">
                      <span>{completedLessons.size} / {lessons.length} lessons completed</span>
                      {progressPct >= 100 && <span className="text-success fw-semibold">✓ Course Completed!</span>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Video Player */}
            {selectedVideo && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-0">
                  <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-0">{selectedLesson?.title}</h6>
                      {selectedLesson?.description && (
                        <p className="text-muted small mb-0 mt-1">{selectedLesson.description}</p>
                      )}
                    </div>
                    {isEnrolled && user?.role === 'student' && (
                      <button
                        className={`btn btn-sm ${isLessonCompleted ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={handleMarkComplete}
                        disabled={markingComplete || isLessonCompleted}
                      >
                        {isLessonCompleted ? (
                          <><i className="bi bi-check-circle-fill me-1" />Completed</>
                        ) : markingComplete ? (
                          <><span className="spinner-border spinner-border-sm me-1" />Marking...</>
                        ) : (
                          <><i className="bi bi-check-circle me-1" />Mark Complete</>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="ratio ratio-16x9">
                    {isEmbedUrl(selectedVideo) ? (
                      <iframe
                        src={toEmbedUrl(selectedVideo)}
                        title={selectedLesson?.title}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video controls src={selectedVideo} className="w-100">
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Lessons list */}
            {lessons.length > 0 ? (
              <div>
                <h4 className="fw-bold mb-3">
                  Course Content
                  <span className="text-muted fw-normal fs-6 ms-2">({lessons.length} lessons)</span>
                </h4>
                {isEnrolled || user?.role === 'instructor' || user?.role === 'admin' ? (
                  <div className="list-group shadow-sm">
                    {lessons.map((lesson, idx) => {
                      const isCompleted = completedLessons.has(lesson._id);
                      const isSelected = selectedLesson?._id === lesson._id;
                      return (
                        <button
                          key={lesson._id}
                          type="button"
                          className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                                isCompleted ? 'bg-success text-white' : isSelected ? 'bg-white text-primary' : 'bg-light text-muted'
                              }`}
                              style={{ width: 28, height: 28, fontSize: 12, fontWeight: 600 }}
                            >
                              {isCompleted ? <i className="bi bi-check" /> : idx + 1}
                            </span>
                            <div className="text-start">
                              <div className="fw-semibold small">{lesson.title}</div>
                              {lesson.description && (
                                <div className={`${isSelected ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: 11 }}>
                                  {lesson.description.slice(0, 60)}{lesson.description.length > 60 ? '...' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                          <i className={`bi bi-play-circle${isSelected ? '-fill' : ''}`} />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <i className="bi bi-lock-fill me-2" />
                    <strong>Enroll to access course content</strong>
                    <p className="mb-0 mt-2 small">
                      This course has {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}. 
                      Enroll now to start learning!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2" />
                No lessons available yet. Check back soon!
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow sticky-top" style={{ top: 80 }}>
              <div className="card-body p-4">
                <h3 className="fw-bold text-primary mb-1">
                  {course?.price === 0 ? 'Free' : `$${course?.price}`}
                </h3>
                <p className="text-muted small mb-3">One-time payment · Lifetime access</p>

                {error && <div className="alert alert-danger small py-2">{error}</div>}

                {user?.role === 'student' ? (
                  isEnrolled ? (
                    <div>
                      <div className="alert alert-success py-2 small mb-3">
                        <i className="bi bi-check-circle me-1" />You're enrolled in this course
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <Link to={`/student/learn/${id}`} className="btn btn-primary w-100">
                          <i className="bi bi-play-circle me-2" />
                          {progressPct >= 100 ? 'Review Course' : progressPct > 0 ? 'Continue Learning' : 'Start Course'}
                        </Link>
                        <Link to={`/student/chat/${id}`} className="btn btn-outline-primary w-100">
                          <i className="bi bi-chat me-2" />Course Chat
                        </Link>
                        <Link to={`/student/quiz/${id}`} className="btn btn-outline-info w-100">
                          <i className="bi bi-pencil-square me-2" />Take Quiz
                        </Link>
                        {progressPct >= 100 && (
                          <button
                            type="button"
                            className="btn btn-success w-100"
                            onClick={handleClaimCertificate}
                            disabled={claimingCertificate}
                          >
                            <i className="bi bi-award me-2" />
                            {claimingCertificate ? 'Claiming...' : 'Claim Your Certificate'}
                          </button>
                        )}
                        {certificate?.certificateId && (
                          <Link to="/student/certificates" className="btn btn-outline-success w-100">
                            View Certificate
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary w-100 py-2"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Enrolling...</>
                      ) : (
                        <><i className="bi bi-mortarboard me-2" />Enroll Now</>
                      )}
                    </button>
                  )
                ) : !user ? (
                  <div>
                    <Link to="/login" className="btn btn-primary w-100 mb-2">Login to Enroll</Link>
                    <p className="text-center text-muted small mb-0">
                      New here? <Link to="/register">Create an account</Link>
                    </p>
                  </div>
                ) : (
                  <div className="alert alert-info small py-2">
                    <i className="bi bi-info-circle me-1" />
                    {user.role === 'instructor' ? 'Instructors cannot enroll in courses.' : 'Admins cannot enroll in courses.'}
                  </div>
                )}

                {/* Course info */}
                <hr />
                <div className="mb-3">
                  <WishlistButton courseId={id} className="w-100" />
                </div>
                <ul className="list-unstyled small text-muted mb-0">
                  <li className="mb-2"><i className="bi bi-play-circle me-2" />{lessons.length} lessons</li>
                  <li className="mb-2"><i className="bi bi-person me-2" />{course?.instructor?.name}</li>
                  <li className="mb-2"><i className="bi bi-tag me-2" />{course?.category}</li>
                  <li><i className="bi bi-infinity me-2" />Lifetime access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <ReviewSection courseId={id} isEnrolled={isEnrolled} />
      </div>
    </div>
  );
};

export default CourseDetails;
