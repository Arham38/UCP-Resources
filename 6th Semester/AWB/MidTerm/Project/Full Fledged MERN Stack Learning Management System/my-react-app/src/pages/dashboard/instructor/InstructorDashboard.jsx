import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { getCourses, getLessons } from '../../../services/courseService';
import { getImageUrl } from '../../../utils/imageUrl';
import StatsCard from '../../../components/StatsCard';
import Loader from '../../../components/Loader';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [lessonCounts, setLessonCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourses();
        const mine = (data.courses || []).filter((c) => c.instructor?._id === user?._id);
        setCourses(mine);

        // Fetch lesson counts for each course
        const counts = {};
        await Promise.allSettled(
          mine.map(async (c) => {
            const res = await getLessons(c._id);
            counts[c._id] = res.data.lessons?.length || 0;
          })
        );
        setLessonCounts(counts);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  const totalLessons = Object.values(lessonCounts).reduce((s, n) => s + n, 0);

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Instructor Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name}</p>
        </div>
        <Link to="/instructor/create-course" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2" />New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatsCard title="My Courses" value={courses.length} icon="book" color="primary" />
        </div>
        <div className="col-md-4">
          <StatsCard title="Total Lessons" value={totalLessons} icon="play-circle" color="success" />
        </div>
        <div className="col-md-4">
          <StatsCard title="Published" value={courses.length} icon="check-circle" color="info" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Quick Actions</h6>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/instructor/create-course" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2" />Create Course
            </Link>
            <Link to="/instructor/upload-lesson" className="btn btn-outline-primary">
              <i className="bi bi-cloud-upload me-2" />Upload Lesson
            </Link>
            <Link to="/instructor/courses" className="btn btn-outline-secondary">
              <i className="bi bi-list-ul me-2" />Manage Courses
            </Link>
          </div>
        </div>
      </div>

      {/* My Courses Table */}
      {courses.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-transparent fw-bold d-flex justify-content-between">
            <span>My Courses</span>
            <Link to="/instructor/courses" className="btn btn-sm btn-outline-primary">Manage All</Link>
          </div>
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Course</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Lessons</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-secondary rounded d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                          style={{ width: 40, height: 40 }}
                        >
                          {c.image ? (
                            <img src={getImageUrl(c.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <i className="bi bi-book text-white small" />
                          )}
                        </div>
                        <span className="fw-semibold small">{c.title}</span>
                      </div>
                    </td>
                    <td><span className="badge bg-light text-dark">{c.category}</span></td>
                    <td className="fw-semibold text-primary">${c.price}</td>
                    <td>{lessonCounts[c._id] ?? '—'}</td>
                    <td>
                      <Link to="/instructor/courses" className="btn btn-sm btn-outline-primary me-1">Edit</Link>
                      <Link to={`/course/${c._id}`} className="btn btn-sm btn-outline-secondary">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {courses.length === 0 && (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-book display-4 text-muted mb-3 d-block" />
            <h5 className="fw-bold">No courses yet</h5>
            <p className="text-muted">Create your first course to get started.</p>
            <Link to="/instructor/create-course" className="btn btn-primary">Create Course</Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InstructorDashboard;
