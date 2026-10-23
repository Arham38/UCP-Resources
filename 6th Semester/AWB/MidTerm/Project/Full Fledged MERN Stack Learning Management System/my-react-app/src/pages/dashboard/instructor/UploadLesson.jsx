import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCourses, getLessons, createLesson, deleteLesson } from '../../../services/courseService';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/Loader';
import toast from 'react-hot-toast';

const UploadLesson = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessons, setLessons] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', videoUrl: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [useVideoUrl, setUseVideoUrl] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourses();
        const mine = (data.courses || []).filter((c) => c.instructor?._id === user?._id);
        setCourses(mine);
        if (mine.length) setSelectedCourse(mine[0]._id);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  useEffect(() => {
    if (!selectedCourse) return;
    const load = async () => {
      setLoadingLessons(true);
      try {
        const { data } = await getLessons(selectedCourse);
        setLessons(data.lessons || []);
      } catch {
        setLessons([]);
      } finally {
        setLoadingLessons(false);
      }
    };
    load();
  }, [selectedCourse]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !formData.title.trim()) {
      toast.error('Please select a course and enter a lesson title.');
      return;
    }
    if (useVideoUrl && !formData.videoUrl.trim()) {
      toast.error('Please enter a video URL.');
      return;
    }
    if (!useVideoUrl && !videoFile) {
      toast.error('Please upload a video file.');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description || '');
      if (useVideoUrl) {
        data.append('videoUrl', formData.videoUrl);
      } else if (videoFile) {
        data.append('videoFile', videoFile);
      }
      await createLesson(selectedCourse, data, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      toast.success('Lesson added successfully!');
      setFormData({ title: '', description: '', videoUrl: '' });
      setVideoFile(null);
      setUploadProgress(0);
      // Refresh lessons list
      const { data: lessonsData } = await getLessons(selectedCourse);
      setLessons(lessonsData.lessons || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lesson');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(lessonId);
      toast.success('Lesson deleted');
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="fw-bold mb-4">Upload Lesson</h2>

      {courses.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5">
          <div className="card-body">
            <i className="bi bi-book display-4 text-muted mb-3 d-block" />
            <p className="text-muted">Create a course first, then add lessons here.</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent fw-semibold">Add New Lesson</div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Course <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Lesson Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      placeholder="e.g. Introduction to React Hooks"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={3}
                      placeholder="What will students learn in this lesson?"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Video source toggle */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Video Source</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="useUrl"
                          checked={useVideoUrl}
                          onChange={() => { setUseVideoUrl(true); setVideoFile(null); }}
                        />
                        <label className="form-check-label" htmlFor="useUrl">
                          <i className="bi bi-link-45deg me-1" />Video URL
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="useFile"
                          checked={!useVideoUrl}
                          onChange={() => setUseVideoUrl(false)}
                        />
                        <label className="form-check-label" htmlFor="useFile">
                          <i className="bi bi-upload me-1" />Upload File
                        </label>
                      </div>
                    </div>
                  </div>

                  {useVideoUrl ? (
                    <div className="mb-4">
                      <label className="form-label">YouTube / Vimeo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="videoUrl"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={handleChange}
                      />
                      <div className="form-text">Supports YouTube and Vimeo links</div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <label className="form-label">Video File</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      />
                      <div className="form-text">Max 100MB. MP4, WebM, OGG, or MOV.</div>
                      {videoFile && (
                        <div className="mt-2 small text-muted">
                          <i className="bi bi-file-earmark-play me-1" />
                          {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
                        </div>
                      )}
                    </div>
                  )}

                  {submitting && !useVideoUrl && (
                    <div className="mb-3">
                      <div className="progress" style={{ height: 8 }}>
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="form-text text-center">Uploading... {uploadProgress}%</div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                    {submitting ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Adding Lesson...</>
                    ) : (
                      <><i className="bi bi-plus-circle me-2" />Add Lesson</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent fw-semibold d-flex justify-content-between">
                <span>Lessons in Selected Course</span>
                <span className="badge bg-primary">{lessons.length}</span>
              </div>
              <div className="card-body p-0">
                {loadingLessons ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="text-center py-4 text-muted small">No lessons yet. Add your first lesson!</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {lessons.map((lesson, idx) => (
                      <div key={lesson._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 24, height: 24, fontSize: 11 }}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <div className="small fw-semibold">{lesson.title}</div>
                            {lesson.description && (
                              <div className="text-muted" style={{ fontSize: 11 }}>
                                {lesson.description.slice(0, 50)}{lesson.description.length > 50 ? '...' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          {lesson.videoUrl && <i className="bi bi-link-45deg text-muted small" title="URL" />}
                          {lesson.videoFile && <i className="bi bi-file-earmark-play text-muted small" title="File" />}
                          <button
                            className="btn btn-sm btn-outline-danger ms-1"
                            style={{ fontSize: 11, padding: '2px 6px' }}
                            onClick={() => handleDeleteLesson(lesson._id)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UploadLesson;
