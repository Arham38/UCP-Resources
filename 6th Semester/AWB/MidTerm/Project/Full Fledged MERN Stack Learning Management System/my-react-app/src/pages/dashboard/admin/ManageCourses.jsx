import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourses, deleteCourse } from '../../../services/courseService';
import { getImageUrl } from '../../../utils/imageUrl';
import Loader from '../../../components/Loader';
import toast from 'react-hot-toast';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchCourses = async () => {
    try {
      const { data } = await getCourses();
      const list = data.courses || [];
      setCourses(list);
      setFiltered(list);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    let list = courses;
    if (search) {
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(search.toLowerCase()) ||
          c.instructor?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryFilter) {
      list = list.filter((c) => c.category === categoryFilter);
    }
    setFiltered(list);
  }, [search, categoryFilter, courses]);

  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setDeleting(course._id);
    try {
      await deleteCourse(course._id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Courses</h2>
          <p className="text-muted mb-0">{filtered.length} of {courses.length} courses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="row g-2">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search" /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title or instructor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                    <i className="bi bi-x" />
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(''); setCategoryFilter(''); }}>
                <i className="bi bi-arrow-counterclockwise me-1" />Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">No courses found</td>
                </tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-secondary rounded d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                          style={{ width: 40, height: 40 }}
                        >
                          {course.image ? (
                            <img src={getImageUrl(course.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <i className="bi bi-book text-white small" />
                          )}
                        </div>
                        <div>
                          <div className="fw-semibold small">{course.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="small">{course.instructor?.name || '—'}</td>
                    <td><span className="badge bg-light text-dark">{course.category}</span></td>
                    <td className="fw-semibold text-primary">${course.price}</td>
                    <td className="small text-muted">
                      {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/course/${course._id}`} className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-eye" />
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(course)}
                          disabled={deleting === course._id}
                        >
                          {deleting === course._id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <i className="bi bi-trash" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageCourses;
