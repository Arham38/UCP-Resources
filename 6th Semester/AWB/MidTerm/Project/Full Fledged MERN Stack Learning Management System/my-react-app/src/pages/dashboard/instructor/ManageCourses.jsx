import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { getCourses, updateCourse, deleteCourse, getLessons, deleteLesson } from '../../../services/courseService';
import { getImageUrl } from '../../../utils/imageUrl';
import Loader from '../../../components/Loader';
import toast from 'react-hot-toast';

const CATEGORIES = ['Programming', 'Design', 'Marketing', 'Business', 'Data Science', 'Other'];

const ManageCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [expandedLessons, setExpandedLessons] = useState(null);
  const [lessonsMap, setLessonsMap] = useState({});
  const [formData, setFormData] = useState({ title: '', description: '', category: '', price: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchCourses = async () => {
    try {
      const { data } = await getCourses();
      const mine = (data.courses || []).filter((c) => c.instructor?._id === user?._id);
      setCourses(mine);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [user?._id]);

  const openEdit = (course) => {
    setEditing(course._id);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCourse(editing, formData);
      toast.success('Course updated');
      setEditing(null);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

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

  const toggleLessons = async (courseId) => {
    if (expandedLessons === courseId) {
      setExpandedLessons(null);
      return;
    }
    setExpandedLessons(courseId);
    if (!lessonsMap[courseId]) {
      try {
        const { data } = await getLessons(courseId);
        setLessonsMap((prev) => ({ ...prev, [courseId]: data.lessons || [] }));
      } catch {
        setLessonsMap((prev) => ({ ...prev, [courseId]: [] }));
      }
    }
  };

  const handleDeleteLesson = async (lessonId, courseId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(lessonId);
      toast.success('Lesson deleted');
      setLessonsMap((prev) => ({
        ...prev,
        [courseId]: prev[courseId].filter((l) => l._id !== lessonId),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Courses</h2>
        <Link to="/instructor/create-course" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-circle me-1" />New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-book display-4 text-muted mb-3 d-block" />
            <p className="text-muted">No courses yet.</p>
            <Link to="/instructor/create-course" className="btn btn-primary">Create Your First Course</Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {courses.map((course) => (
            <div key={course._id} className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex gap-3 align-items-start">
                  {/* Thumbnail */}
                  <div
                    className="bg-secondary rounded d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                    style={{ width: 72, height: 72 }}
                  >
                    {course.image ? (
                      <img src={getImageUrl(course.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className="bi bi-book text-white" style={{ fontSize: '1.5rem', opacity: 0.5 }} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <div>
                        <h6 className="fw-bold mb-1">{course.title}</h6>
                        <div className="d-flex gap-2 flex-wrap">
                          <span className="badge bg-light text-dark">{course.category}</span>
                          <span className="badge bg-primary">${course.price}</span>
                        </div>
                      </div>
                      <div className="d-flex gap-1 flex-wrap">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleLessons(course._id)}
                        >
                          <i className={`bi bi-chevron-${expandedLessons === course._id ? 'up' : 'down'} me-1`} />
                          Lessons
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(editing === course._id ? null : course)}
                        >
                          <i className="bi bi-pencil me-1" />Edit
                        </button>
                        <Link to={`/course/${course._id}`} className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-eye me-1" />View
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(course)}
                          disabled={deleting === course._id}
                        >
                          <i className="bi bi-trash me-1" />
                          {deleting === course._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <AnimatePresence>
                  {editing === course._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-top"
                    >
                      <form onSubmit={handleUpdate}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">Title</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              required
                              minLength={5}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label small fw-semibold">Category</label>
                            <select
                              className="form-select form-select-sm"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label small fw-semibold">Price ($)</label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              min={0}
                              required
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label small fw-semibold">Description</label>
                            <textarea
                              className="form-control form-control-sm"
                              rows={3}
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              required
                              minLength={20}
                            />
                          </div>
                          <div className="col-12 d-flex gap-2">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                              {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Lessons List */}
                <AnimatePresence>
                  {expandedLessons === course._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-top"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-semibold mb-0 small">
                          Lessons ({lessonsMap[course._id]?.length || 0})
                        </h6>
                        <Link to="/instructor/upload-lesson" className="btn btn-sm btn-outline-primary" style={{ fontSize: 11 }}>
                          <i className="bi bi-plus me-1" />Add Lesson
                        </Link>
                      </div>
                      {!lessonsMap[course._id] ? (
                        <div className="text-center py-2"><div className="spinner-border spinner-border-sm text-primary" /></div>
                      ) : lessonsMap[course._id].length === 0 ? (
                        <p className="text-muted small mb-0">No lessons yet.</p>
                      ) : (
                        <div className="list-group list-group-flush">
                          {lessonsMap[course._id].map((lesson, idx) => (
                            <div key={lesson._id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                              <div>
                                <span className="text-muted small me-2">{idx + 1}.</span>
                                <span className="small fw-semibold">{lesson.title}</span>
                                {lesson.videoUrl && (
                                  <span className="badge bg-light text-muted ms-2" style={{ fontSize: 10 }}>URL</span>
                                )}
                                {lesson.videoFile && (
                                  <span className="badge bg-light text-muted ms-2" style={{ fontSize: 10 }}>File</span>
                                )}
                              </div>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ fontSize: 11 }}
                                onClick={() => handleDeleteLesson(lesson._id, course._id)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ManageCourses;
