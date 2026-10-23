import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyCourses } from '../../../services/enrollmentService';
import { getCourseProgress } from '../../../services/progressService';
import { getImageUrl } from '../../../utils/imageUrl';
import Loader from '../../../components/Loader';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | in-progress | completed

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyCourses();
        const list = data.enrollments || [];
        setEnrollments(list);

        // Fetch per-lesson progress for each course
        const progressResults = await Promise.allSettled(
          list.map((e) => e.course?._id ? getCourseProgress(e.course._id) : Promise.resolve(null))
        );
        const map = {};
        progressResults.forEach((r, i) => {
          const courseId = list[i]?.course?._id;
          if (courseId && r.status === 'fulfilled' && r.value?.data?.progress) {
            map[courseId] = r.value.data.progress;
          }
        });
        setProgressMap(map);
      } catch {
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = enrollments.filter((e) => {
    const p = e.progress || 0;
    if (filter === 'completed') return p >= 100;
    if (filter === 'in-progress') return p > 0 && p < 100;
    return true;
  });

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Courses</h2>
        <Link to="/courses" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-circle me-1" />Find More
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="d-flex gap-2 mb-4">
        {['all', 'in-progress', 'completed'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${enrollments.length})` : f === 'in-progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-book display-4 text-muted mb-3 d-block" />
            <p className="text-muted mb-3">
              {filter === 'all' ? "You haven't enrolled in any courses yet." : `No ${filter} courses.`}
            </p>
            {filter === 'all' && <Link to="/courses" className="btn btn-primary">Browse Courses</Link>}
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((enrollment) => {
            const course = enrollment.course;
            if (!course) return null;
            const progress = enrollment.progress || 0;
            const detailedProgress = progressMap[course._id];
            const completedLessons = detailedProgress?.completedLessons?.length || 0;

            return (
              <div key={enrollment._id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div
                    className="bg-secondary d-flex align-items-center justify-content-center overflow-hidden"
                    style={{ height: 160 }}
                  >
                    {course.image ? (
                      <img src={getImageUrl(course.image)} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className="bi bi-book text-white" style={{ fontSize: '3rem', opacity: 0.5 }} />
                    )}
                    {progress >= 100 && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-success">✓ Completed</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-semibold mb-1">{course.title}</h6>
                    <p className="text-muted small mb-1">
                      <i className="bi bi-person me-1" />{course.instructor?.name}
                    </p>
                    <p className="text-muted small mb-2">
                      <i className="bi bi-tag me-1" />{course.category}
                    </p>

                    {/* Progress */}
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between small mb-1">
                        <span className="text-muted">Progress</span>
                        <span className="fw-semibold">{progress}%</span>
                      </div>
                      <div className="progress mb-1" style={{ height: 6 }}>
                        <div
                          className={`progress-bar ${progress >= 100 ? 'bg-success' : 'bg-primary'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {completedLessons > 0 && (
                        <p className="text-muted mb-2" style={{ fontSize: 11 }}>
                          {completedLessons} lesson{completedLessons !== 1 ? 's' : ''} completed
                        </p>
                      )}

                      <div className="d-flex gap-2 mt-2">
                        <Link to={`/student/learn/${course._id}`} className="btn btn-primary btn-sm flex-grow-1">
                          {progress >= 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start Course'}
                        </Link>
                        <Link
                          to={`/student/chat/${course._id}`}
                          className="btn btn-outline-secondary btn-sm"
                          title="Course Chat"
                        >
                          <i className="bi bi-chat" />
                        </Link>
                        <Link
                          to={`/student/quiz/${course._id}`}
                          className="btn btn-outline-info btn-sm"
                          title="Quizzes"
                        >
                          <i className="bi bi-pencil-square" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default MyCourses;
