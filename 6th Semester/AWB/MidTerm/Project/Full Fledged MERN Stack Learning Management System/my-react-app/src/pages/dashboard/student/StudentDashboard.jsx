import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { getMyCourses } from '../../../services/enrollmentService';
import { getRecommendations } from '../../../services/userService';
import CourseImage from '../../../components/CourseImage';
import StatsCard from '../../../components/StatsCard';
import Loader from '../../../components/Loader';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrollRes, recRes] = await Promise.all([
          getMyCourses(),
          getRecommendations().catch(() => ({ data: { recommendations: [] } })),
        ]);
        setEnrollments(enrollRes.data.enrollments || []);
        setRecommendations(recRes.data.recommendations || []);
      } catch {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completedCount = enrollments.filter((e) => e.progress >= 100).length;
  const inProgressCount = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length)
    : 0;

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Welcome back, {user?.name}! 👋</h2>
          <p className="text-muted mb-0">Here's what's happening with your learning.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/student/quiz-dashboard" className="btn btn-outline-success">
            <i className="bi bi-clipboard-check me-2" />My Quizzes
          </Link>
          <Link to="/courses" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2" />Browse Courses
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatsCard title="Enrolled" value={enrollments.length} icon="book" color="primary" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard title="Completed" value={completedCount} icon="check-circle" color="success" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard title="In Progress" value={inProgressCount} icon="hourglass-split" color="warning" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard title="Avg Progress" value={`${avgProgress}%`} icon="graph-up" color="info" />
        </div>
      </div>

      {/* Continue Learning */}
      {enrollments.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold mb-3">Continue Learning</h5>
          <div className="row g-3">
            {enrollments.slice(0, 3).map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;
              return (
                <div key={enrollment._id} className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div
                      className="bg-secondary d-flex align-items-center justify-content-center overflow-hidden"
                      style={{ height: 120 }}
                    >
                      <CourseImage 
                        src={course.image} 
                        alt={course.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        fallbackIcon="bi-book"
                        fallbackSize="2rem"
                      />
                    </div>
                    <div className="card-body">
                      <h6 className="fw-semibold mb-1 text-truncate">{course.title}</h6>
                      <p className="text-muted small mb-2">{course.instructor?.name}</p>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Progress</span>
                        <span className="fw-semibold">{enrollment.progress || 0}%</span>
                      </div>
                      <div className="progress mb-3" style={{ height: 6 }}>
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <Link to={`/student/learn/${course._id}`} className="btn btn-primary btn-sm flex-grow-1">
                          {(enrollment.progress || 0) >= 100 ? 'Review' : (enrollment.progress || 0) > 0 ? 'Continue' : 'Start Course'}
                        </Link>
                        <Link to={`/student/chat/${course._id}`} className="btn btn-outline-secondary btn-sm" title="Course Chat">
                          <i className="bi bi-chat" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {enrollments.length > 3 && (
            <div className="text-center mt-3">
              <Link to="/student/courses" className="btn btn-outline-primary btn-sm">
                View all {enrollments.length} courses
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h5 className="fw-bold mb-3">Recommended for You</h5>
          <div className="row g-3">
            {recommendations.slice(0, 4).map((course) => (
              <div key={course._id} className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div
                    className="bg-secondary d-flex align-items-center justify-content-center overflow-hidden"
                    style={{ height: 100 }}
                  >
                    <CourseImage 
                      src={course.image} 
                      alt={course.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      fallbackIcon="bi-book"
                      fallbackSize="1.5rem"
                    />
                  </div>
                  <div className="card-body p-3">
                    <h6 className="fw-semibold mb-1 small text-truncate">{course.title}</h6>
                    <p className="text-muted mb-2" style={{ fontSize: 11 }}>{course.category}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary small">${course.price}</span>
                      <Link to={`/course/${course._id}`} className="btn btn-outline-primary btn-sm" style={{ fontSize: 11 }}>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {enrollments.length === 0 && (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-mortarboard display-4 text-muted mb-3 d-block" />
            <h5 className="fw-bold">Start Your Learning Journey</h5>
            <p className="text-muted">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudentDashboard;
