import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getCourses } from '../../../services/courseService';
import {
  createAnnouncement,
  createAssessment,
  createAssignment,
  gradeSubmission,
  generateResults,
  getCourseContent,
  getCourseSubmissions,
  sendResults,
  updateCourseWeightage,
} from '../../../services/academicService';
import { getImageUrl } from '../../../utils/imageUrl';

const tabStyle = (isActive) => ({
  border: `1px solid ${isActive ? 'transparent' : 'var(--lms-border)'}`,
  background: isActive ? 'var(--lms-gradient-success)' : 'var(--lms-surface)',
  color: isActive ? '#fff' : 'var(--lms-text)',
  boxShadow: 'none',
});

const AcademicManager = () => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [activeTab, setActiveTab] = useState('assignments');
  const [generatingResults, setGeneratingResults] = useState(false);
  const [sendingResults, setSendingResults] = useState(false);
  const [generatedResults, setGeneratedResults] = useState([]);
  const [lastGeneratedAt, setLastGeneratedAt] = useState(null);
  const [savingWeightage, setSavingWeightage] = useState(false);
  const [weightage, setWeightage] = useState({ assignment: 40, assessment: 30, quiz: 30 });
  const assignForm = useForm();
  const assessForm = useForm();
  const announceForm = useForm();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getCourses();
        setCourses(data.courses || []);
        if (data.courses?.length) setCourseId(data.courses[0]._id);
      } catch {
        toast.error('Failed to load courses');
      }
    };
    load();
  }, []);

  const refreshSubs = useCallback(async (cid = courseId) => {
    if (!cid) return;
    try {
      setLoadingSubs(true);
      const { data } = await getCourseSubmissions(cid);
      setSubmissions(data.submissions || []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSubs(false);
    }
  }, [courseId]);

  useEffect(() => { refreshSubs(); }, [refreshSubs]);
  useEffect(() => {
    const loadWeightage = async () => {
      if (!courseId) return;
      try {
        const { data } = await getCourseContent(courseId);
        setWeightage(data.academicWeightage || { assignment: 40, assessment: 30, quiz: 30 });
      } catch {
        setWeightage({ assignment: 40, assessment: 30, quiz: 30 });
      }
    };
    loadWeightage();
  }, [courseId]);

  const onCreateAssignment = assignForm.handleSubmit(async (values) => {
    try {
      const payload = new FormData();
      payload.append('courseId', courseId);
      payload.append('title', values.title);
      payload.append('description', values.description || '');
      payload.append('instructions', values.instructions || '');
      payload.append('dueDate', values.dueDate);
      payload.append('totalMarks', values.totalMarks);
      if (values.file?.[0]) payload.append('file', values.file[0]);
      await createAssignment(payload);
      toast.success('Assignment created and notifications sent');
      assignForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    }
  });

  const onCreateAssessment = assessForm.handleSubmit(async (values) => {
    try {
      await createAssessment({ courseId, ...values });
      toast.success('Assessment created and notifications sent');
      assessForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create assessment');
    }
  });

  const onCreateAnnouncement = announceForm.handleSubmit(async (values) => {
    try {
      await createAnnouncement({ courseId, ...values });
      toast.success('Announcement posted and notifications sent');
      announceForm.reset({ priority: 'normal', title: '', body: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    }
  });

  const onGrade = async (submissionId, marks) => {
    if (marks === '' || Number.isNaN(Number(marks))) {
      toast.error('Please enter valid marks');
      return;
    }
    try {
      await gradeSubmission(submissionId, Number(marks));
      toast.success('Submission graded');
      refreshSubs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to grade');
    }
  };

  const handleGenerateResults = async () => {
    if (!courseId) {
      toast.error('Please select a course first');
      return;
    }
    try {
      setGeneratingResults(true);
      const { data } = await generateResults(courseId);
      const results = data?.results || [];
      setGeneratedResults(results);
      if (data?.academicWeightage) setWeightage(data.academicWeightage);
      setLastGeneratedAt(new Date());
      toast.success(`Result sheet generated for ${results.length} student(s)`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Generate failed');
    } finally {
      setGeneratingResults(false);
    }
  };

  const handleSendResults = async () => {
    if (!courseId) {
      toast.error('Please select a course first');
      return;
    }
    if (!generatedResults.length) {
      toast.error('Generate result sheet first');
      return;
    }
    try {
      setSendingResults(true);
      await sendResults(courseId);
      toast.success('Results sent to students');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Send failed');
    } finally {
      setSendingResults(false);
    }
  };

  const handleSaveWeightage = async () => {
    const assignment = Number(weightage.assignment);
    const assessment = Number(weightage.assessment);
    const quiz = Number(weightage.quiz);
    const total = assignment + assessment + quiz;
    if ([assignment, assessment, quiz].some((v) => Number.isNaN(v) || v < 0 || v > 100)) {
      toast.error('Each weightage must be between 0 and 100');
      return;
    }
    if (total !== 100) {
      toast.error('Total weightage must be exactly 100%');
      return;
    }
    try {
      setSavingWeightage(true);
      const { data } = await updateCourseWeightage(courseId, { assignment, assessment, quiz });
      setWeightage(data.academicWeightage);
      toast.success('Course weightage updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update weightage');
    } finally {
      setSavingWeightage(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">Academic Manager</h2>
        <select className="form-select w-auto" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>

      <div className="card border-0 shadow-sm" style={{ background: 'var(--lms-surface)', color: 'var(--lms-text)' }}>
        <div
          className="card-header border-0 pb-0"
          style={{ background: 'var(--lms-surface)', borderBottom: '1px solid var(--lms-border-light)' }}
        >
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-sm" style={tabStyle(activeTab === 'announcements')} onClick={() => setActiveTab('announcements')}>Announcements</button>
            <button type="button" className="btn btn-sm" style={tabStyle(activeTab === 'assignments')} onClick={() => setActiveTab('assignments')}>Assignments</button>
            <button type="button" className="btn btn-sm" style={tabStyle(activeTab === 'assessments')} onClick={() => setActiveTab('assessments')}>Assessments</button>
            <button type="button" className="btn btn-sm" style={tabStyle(activeTab === 'submissions')} onClick={() => setActiveTab('submissions')}>Submissions</button>
            <button type="button" className="btn btn-sm" style={tabStyle(activeTab === 'results')} onClick={() => setActiveTab('results')}>Grade Book</button>
          </div>
        </div>
        <div className="card-body" style={{ background: 'var(--lms-surface)', color: 'var(--lms-text)' }}>
          {activeTab === 'assignments' && (
            <div className="card border-0 shadow-sm" style={{ background: 'var(--lms-surface-alt)' }}>
              <div className="card-body">
                <h6 className="fw-semibold">Create Assignment</h6>
                <form onSubmit={onCreateAssignment} className="d-grid gap-2">
                  <input className="form-control" placeholder="Title" {...assignForm.register('title', { required: true })} />
                  <textarea className="form-control" placeholder="Description" rows={2} {...assignForm.register('description')} />
                  <textarea className="form-control" placeholder="Instructions" rows={2} {...assignForm.register('instructions')} />
                  <input type="datetime-local" className="form-control" {...assignForm.register('dueDate', { required: true })} />
                  <input type="number" min="1" className="form-control" placeholder="Total marks" {...assignForm.register('totalMarks', { required: true })} />
                  <input type="file" className="form-control" accept=".pdf,.doc,.docx" {...assignForm.register('file')} />
                  <button className="btn btn-primary btn-sm">Create Assignment</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="card border-0 shadow-sm" style={{ background: 'var(--lms-surface-alt)' }}>
              <div className="card-body">
                <h6 className="fw-semibold">Create Assessment</h6>
                <form onSubmit={onCreateAssessment} className="d-grid gap-2">
                  <input className="form-control" placeholder="Title" {...assessForm.register('title', { required: true })} />
                  <textarea className="form-control" placeholder="Description" rows={2} {...assessForm.register('description')} />
                  <input type="datetime-local" className="form-control" {...assessForm.register('dueDate', { required: true })} />
                  <input type="number" min="1" className="form-control" placeholder="Total marks" {...assessForm.register('totalMarks', { required: true })} />
                  <button className="btn btn-primary btn-sm">Create Assessment</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="card border-0 shadow-sm" style={{ background: 'var(--lms-surface-alt)' }}>
              <div className="card-body">
                <h6 className="fw-semibold">Post Announcement</h6>
                <form onSubmit={onCreateAnnouncement} className="d-grid gap-2">
                  <input className="form-control" placeholder="Title" {...announceForm.register('title', { required: true })} />
                  <textarea className="form-control" placeholder="Body" rows={3} {...announceForm.register('body', { required: true })} />
                  <select className="form-select" {...announceForm.register('priority')}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <button className="btn btn-primary btn-sm">Post Announcement</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            loadingSubs ? <div className="text-center py-3"><div className="spinner-border spinner-border-sm" /></div> : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>Student</th><th>Type</th><th>Submitted</th><th>Status</th><th>Response</th><th>Marks</th></tr></thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <div className="fw-semibold">{s.student?.name}</div>
                          {s.contentTitle && <div className="small text-muted">{s.contentTitle}</div>}
                        </td>
                        <td className="text-capitalize">{s.contentType}</td>
                        <td>{new Date(s.submittedAt).toLocaleString()}</td>
                        <td><span className={`badge ${s.status === 'graded' ? 'bg-success' : 'bg-warning text-dark'}`}>{s.status}</span></td>
                        <td style={{ minWidth: 220 }}>
                          <div className="small d-flex flex-column gap-1">
                            {s.textAnswer ? (
                              <span className="text-truncate" title={s.textAnswer}>
                                <strong>Text:</strong> {s.textAnswer}
                              </span>
                            ) : (
                              <span className="text-muted">No text answer</span>
                            )}
                            {s.fileUrl ? (
                              <a href={getImageUrl(s.fileUrl)} target="_blank" rel="noreferrer" download>
                                Download submitted file
                              </a>
                            ) : (
                              <span className="text-muted">No file attached</span>
                            )}
                          </div>
                        </td>
                        <td style={{ maxWidth: 200 }}>
                          <div className="input-group input-group-sm">
                            <input defaultValue={s.marksObtained ?? ''} type="number" min="0" max={s.totalMarks || undefined} className="form-control" id={`m-${s._id}`} />
                            <button className="btn btn-outline-primary" onClick={() => onGrade(s._id, document.getElementById(`m-${s._id}`).value)}>Save</button>
                          </div>
                          {Number.isFinite(s.totalMarks) && s.totalMarks > 0 && (
                            <div className="small text-muted mt-1">Max: {s.totalMarks}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-3">No submissions yet</td></tr>}
                  </tbody>
                </table>
              </div>
            )
          )}

          {activeTab === 'results' && (
            <div className="card border-0 shadow-sm" style={{ background: 'var(--lms-surface-alt)' }}>
              <div className="card-body">
                <h6 className="fw-semibold mb-3">Grade Book Actions</h6>
                <p className="small text-muted mb-3">Generate course result sheet from graded submissions, then publish results to students.</p>
                <div className="card border-0 mb-3" style={{ background: 'var(--lms-surface)' }}>
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                      <h6 className="mb-0">Course Weightage (%)</h6>
                      <span className={`badge ${(Number(weightage.assignment) + Number(weightage.assessment) + Number(weightage.quiz)) === 100 ? 'bg-success' : 'bg-warning text-dark'}`}>
                        Total: {Number(weightage.assignment) + Number(weightage.assessment) + Number(weightage.quiz)}%
                      </span>
                    </div>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Assignments</label>
                        <input type="number" min="0" max="100" className="form-control" value={weightage.assignment}
                          onChange={(e) => setWeightage((prev) => ({ ...prev, assignment: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Assessments</label>
                        <input type="number" min="0" max="100" className="form-control" value={weightage.assessment}
                          onChange={(e) => setWeightage((prev) => ({ ...prev, assessment: e.target.value }))} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small mb-1">Quizzes</label>
                        <input type="number" min="0" max="100" className="form-control" value={weightage.quiz}
                          onChange={(e) => setWeightage((prev) => ({ ...prev, quiz: e.target.value }))} />
                      </div>
                    </div>
                    <button className="btn btn-outline-primary btn-sm mt-3" onClick={handleSaveWeightage} disabled={savingWeightage}>
                      {savingWeightage ? 'Saving...' : 'Save Weightage'}
                    </button>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={handleGenerateResults} disabled={generatingResults || !courseId}>
                    {generatingResults ? 'Generating...' : 'Generate Result Sheet'}
                  </button>
                  <button className="btn btn-success btn-sm" onClick={handleSendResults} disabled={sendingResults || generatingResults || !generatedResults.length}>
                    {sendingResults ? 'Sending...' : 'Send to Students'}
                  </button>
                </div>
                {!generatedResults.length && (
                  <p className="small text-muted mt-3 mb-0">No generated result sheet yet for selected course.</p>
                )}
                {generatedResults.length > 0 && (
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                      <h6 className="mb-0">Generated Result Preview</h6>
                      {lastGeneratedAt && (
                        <span className="small text-muted">Generated: {lastGeneratedAt.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="row g-3">
                      {generatedResults.map((r) => (
                        <div key={r._id} className="col-lg-6">
                          <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                              background: 'linear-gradient(135deg, var(--lms-surface-alt) 0%, var(--lms-surface) 100%)',
                              border: '1px solid var(--lms-border-light)',
                            }}
                          >
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <div className="small text-muted">Student</div>
                                  <h6 className="fw-bold mb-1">{r.student?.name || 'Unknown Student'}</h6>
                                  <div className="small text-muted">{r.student?.email || '-'}</div>
                                </div>
                                <span className="badge bg-success fs-6 px-3 py-2">{r.grade}</span>
                              </div>

                              <div className="row g-2 mb-3">
                                <div className="col-4">
                                  <div className="rounded p-2 text-center" style={{ background: 'var(--lms-surface)' }}>
                                    <div className="small text-muted">Obtained</div>
                                    <div className="fw-bold">{r.totalObtained}</div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="rounded p-2 text-center" style={{ background: 'var(--lms-surface)' }}>
                                    <div className="small text-muted">Total</div>
                                    <div className="fw-bold">{r.totalPossible}</div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="rounded p-2 text-center" style={{ background: 'var(--lms-surface)' }}>
                                    <div className="small text-muted">Percent</div>
                                    <div className="fw-bold text-primary">{r.percentage}%</div>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-2 d-flex justify-content-between small">
                                <span className="text-muted">Performance</span>
                                <span className="fw-semibold">{r.percentage}%</span>
                              </div>
                              <div className="progress" style={{ height: 8 }}>
                                <div className="progress-bar bg-success" style={{ width: `${Math.min(100, r.percentage)}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicManager;
