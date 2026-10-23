import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourseContent, getMyProgress, submitContent } from '../../../services/academicService';
import { getImageUrl } from '../../../utils/imageUrl';

const toSubmissionKey = (contentType, contentId) => `${contentType}:${contentId}`;
const tabStyle = (isActive) => ({
  border: `1px solid ${isActive ? 'transparent' : 'var(--lms-border)'}`,
  background: isActive ? 'var(--lms-gradient-success)' : 'var(--lms-surface)',
  color: isActive ? '#fff' : 'var(--lms-text)',
  boxShadow: 'none',
});

const StudentAcademicContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [content, setContent] = useState({
    assignments: [],
    assessments: [],
    announcements: [],
    quizzes: [],
  });
  const [submissionMap, setSubmissionMap] = useState({});
  const [draftMap, setDraftMap] = useState({});
  const [activeTab, setActiveTab] = useState('assignments');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [contentRes, progressRes] = await Promise.all([
        getCourseContent(courseId),
        getMyProgress(),
      ]);

      const newContent = contentRes.data || {};
      setContent({
        assignments: newContent.assignments || [],
        assessments: newContent.assessments || [],
        announcements: newContent.announcements || [],
        quizzes: newContent.quizzes || [],
      });

      const courseProgress = (progressRes.data?.courses || []).find(
        (entry) => String(entry.course?._id) === String(courseId)
      );
      setCourseTitle(courseProgress?.course?.title || '');
      const map = {};
      (courseProgress?.submissions || []).forEach((s) => {
        map[toSubmissionKey(s.contentType, s.contentId)] = s;
      });
      setSubmissionMap(map);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load course academic content');
      navigate('/student/courses');
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDraftChange = (key, patch) => {
    setDraftMap((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), ...patch },
    }));
  };

  const handleSubmit = async (contentType, contentId) => {
    const key = toSubmissionKey(contentType, contentId);
    const draft = draftMap[key] || {};
    const formData = new FormData();
    formData.append('contentType', contentType);
    formData.append('contentId', contentId);
    if (draft.textAnswer) formData.append('textAnswer', draft.textAnswer);
    if (draft.file) formData.append('file', draft.file);

    if (!draft.textAnswer && !draft.file) {
      toast.error('Please add text answer or choose a file before submitting.');
      return;
    }

    try {
      setSavingKey(key);
      await submitContent(formData);
      toast.success('Submission saved successfully');
      setDraftMap((prev) => ({ ...prev, [key]: { textAnswer: '', file: null } }));
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSavingKey('');
    }
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString();
  };

  const renderAcademicCard = (item, type) => {
    const key = toSubmissionKey(type, item._id);
    const draft = draftMap[key] || {};
    const existingSubmission = submissionMap[key];
    const resourceUrl = item.fileUrl ? getImageUrl(item.fileUrl) : '';
    const submissionFileUrl = existingSubmission?.fileUrl ? getImageUrl(existingSubmission.fileUrl) : '';

    return (
      <div key={item._id} className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
            <div>
              <h6 className="fw-bold mb-1">{item.title}</h6>
              <p className="small text-muted mb-1">Due: {formatDate(item.dueDate)}</p>
              <p className="small text-muted mb-0">Total Marks: {item.totalMarks}</p>
            </div>
            <span className={`badge ${existingSubmission ? 'bg-success' : 'bg-warning text-dark'}`}>
              {existingSubmission ? 'Submitted' : 'Pending'}
            </span>
          </div>

          {item.description && <p className="mt-3 mb-2">{item.description}</p>}
          {item.instructions && <p className="small text-muted mb-2"><strong>Instructions:</strong> {item.instructions}</p>}

          {resourceUrl && (
            <a
              href={resourceUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary btn-sm mb-3"
              download
            >
              <i className="bi bi-download me-1" />
              Download {type === 'assignment' ? 'Assignment File' : 'File'}
            </a>
          )}

          {existingSubmission && (
            <div className="alert alert-success py-2 small">
              <div><strong>Submitted:</strong> {formatDate(existingSubmission.submittedAt)}</div>
              <div><strong>Status:</strong> {existingSubmission.status}</div>
              {existingSubmission.marksObtained !== null && (
                <div><strong>Marks:</strong> {existingSubmission.marksObtained}</div>
              )}
              {submissionFileUrl && (
                <div className="mt-1">
                  <a href={submissionFileUrl} target="_blank" rel="noreferrer" download>
                    Download Your Submitted File
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="border-top pt-3">
            <label className="form-label small fw-semibold">Text Answer (optional)</label>
            <textarea
              className="form-control mb-2"
              rows={3}
              value={draft.textAnswer || ''}
              onChange={(e) => handleDraftChange(key, { textAnswer: e.target.value })}
              placeholder={`Write your ${type} answer here...`}
            />
            <input
              type="file"
              className="form-control mb-2"
              onChange={(e) => handleDraftChange(key, { file: e.target.files?.[0] || null })}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleSubmit(type, item._id)}
              disabled={savingKey === key}
            >
              {savingKey === key ? 'Submitting...' : existingSubmission ? 'Resubmit' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Course Academic Content</h2>
          {courseTitle && <p className="text-muted mb-0">{courseTitle}</p>}
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/student/courses')}>
          Back to My Courses
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ background: 'var(--lms-surface)', color: 'var(--lms-text)' }}>
        <div
          className="card-header border-0 pb-0"
          style={{ background: 'var(--lms-surface)', borderBottom: '1px solid var(--lms-border-light)' }}
        >
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sm"
              style={tabStyle(activeTab === 'announcements')}
              onClick={() => setActiveTab('announcements')}
            >
              Announcements
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={tabStyle(activeTab === 'assignments')}
              onClick={() => setActiveTab('assignments')}
            >
              Assignments
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={tabStyle(activeTab === 'assessments')}
              onClick={() => setActiveTab('assessments')}
            >
              Assessments
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={tabStyle(activeTab === 'quizzes')}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes
            </button>
          </div>
        </div>
        <div className="card-body" style={{ background: 'var(--lms-surface)', color: 'var(--lms-text)' }}>
          {activeTab === 'announcements' && (
            <>
              <h5 className="fw-semibold mb-3">Announcements</h5>
              {content.announcements.length > 0 ? (
                <div className="list-group">
                  {content.announcements.map((a) => (
                    <div key={a._id} className="list-group-item" style={{ background: 'var(--lms-surface-alt)', color: 'var(--lms-text)', borderColor: 'var(--lms-border-light)' }}>
                      <div className="fw-semibold">{a.title}</div>
                      <div className="small text-muted mb-1">{formatDate(a.createdAt)}</div>
                      <div>{a.body}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info mb-0">No announcements available.</div>
              )}
            </>
          )}

          {activeTab === 'assignments' && (
            <>
              <h5 className="fw-semibold mb-3">Assignments</h5>
              {content.assignments.length > 0 ? content.assignments.map((a) => renderAcademicCard(a, 'assignment')) : (
                <div className="alert alert-info mb-0">No assignments available.</div>
              )}
            </>
          )}

          {activeTab === 'assessments' && (
            <>
              <h5 className="fw-semibold mb-3">Assessments</h5>
              {content.assessments.length > 0 ? content.assessments.map((a) => renderAcademicCard(a, 'assessment')) : (
                <div className="alert alert-info mb-0">No assessments available.</div>
              )}
            </>
          )}

          {activeTab === 'quizzes' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="fw-semibold mb-0">Quizzes</h5>
                <Link to={`/student/quiz/${courseId}`} className="btn btn-outline-primary btn-sm">
                  Open Quiz Dashboard
                </Link>
              </div>
              {content.quizzes.length > 0 ? (
                <div className="row g-3">
                  {content.quizzes.map((quiz) => (
                    <div key={quiz._id} className="col-md-6 col-xl-4">
                      <div className="card h-100 border" style={{ background: 'var(--lms-surface-alt)', borderColor: 'var(--lms-border-light)' }}>
                        <div className="card-body d-flex flex-column">
                          <h6 className="fw-bold mb-1">{quiz.title}</h6>
                          <p className="small text-muted mb-2">Due: {formatDate(quiz.dueDate)}</p>
                          <div className="small text-muted mb-3">
                            <div>Questions: Available in quiz view</div>
                            <div>Time Limit: {quiz.timeLimitMinutes || 'No limit'} mins</div>
                            <div>Total Marks: {quiz.totalMarks || 0}</div>
                          </div>
                          <Link to={`/student/quiz/${courseId}`} className="btn btn-primary btn-sm mt-auto">
                            Start / Attempt Quiz
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info mb-0">No quizzes available for this course yet.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicContent;
