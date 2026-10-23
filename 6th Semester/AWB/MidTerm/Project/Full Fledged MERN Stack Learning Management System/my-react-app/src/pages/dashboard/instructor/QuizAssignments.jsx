import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const QuizAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('assignments');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/quizzes/assignments/instructor', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (data.success) setAssignments(data.assignments || []);
    } catch (error) {
      toast.error('Failed to fetch quiz assignments');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (assignment) => {
    try {
      const response = await fetch(`/api/quizzes/${assignment.quiz._id}/results`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();

      if (data.success) {
        setSelectedAssignment({ ...assignment, results: data.results, stats: data.stats });
        setActiveTab('results');
      }
    } catch {
      toast.error('Failed to fetch quiz results');
    }
  };

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
    const completedCount = assignment.assignedStudents.filter((student) => student.completed).length;
    const totalCount = assignment.assignedStudents.length;

    if (dueDate && now > dueDate) return <span className="badge bg-danger">Overdue</span>;
    if (completedCount === totalCount) return <span className="badge bg-success">Completed</span>;
    if (completedCount > 0) return <span className="badge bg-warning">In Progress</span>;
    return <span className="badge bg-primary">Active</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Quiz Management</h2>
          <p className="text-muted mb-0">Assign quizzes and track student results</p>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <i className="bi bi-list-task me-2" />
            Quiz Assignments ({assignments.length})
          </button>
        </li>
        {selectedAssignment && (
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              <i className="bi bi-bar-chart me-2" />
              Results: {selectedAssignment.quiz.title}
            </button>
          </li>
        )}
      </ul>

      {activeTab === 'assignments' && (
        <div className="row g-4">
          {assignments.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-clipboard-x text-muted" style={{ fontSize: '4rem' }} />
                <h4 className="text-muted mt-3">No Quiz Assignments</h4>
                <p className="text-muted">Create quizzes and assign them to students from your course tools.</p>
              </div>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment._id} className="col-lg-6 col-xl-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-header bg-white border-0 pb-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{assignment.quiz.title}</h6>
                        <p className="text-muted small mb-2">{assignment.course.title}</p>
                      </div>
                      {getStatusBadge(assignment)}
                    </div>
                  </div>

                  <div className="card-body pt-2">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-muted">Progress</span>
                        <span className="small fw-semibold">
                          {assignment.assignedStudents.filter((student) => student.completed).length}/
                          {assignment.assignedStudents.length}
                        </span>
                      </div>
                      <div className="progress" style={{ height: 6 }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{
                            width: `${(assignment.assignedStudents.filter((student) => student.completed).length / assignment.assignedStudents.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold text-primary">{assignment.quiz.questions?.length || 0}</div>
                          <div className="small text-muted">Questions</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold text-success">{assignment.assignedStudents.length}</div>
                          <div className="small text-muted">Students</div>
                        </div>
                      </div>
                    </div>

                    <div className="small text-muted mb-3">
                      <div className="d-flex align-items-center gap-1 mb-1">
                        <i className="bi bi-calendar" />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-clock" />
                        <span>Created: {formatDate(assignment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer bg-white border-0 pt-0">
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleViewResults(assignment)}
                    >
                      <i className="bi bi-bar-chart me-1" />
                      Results
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'results' && selectedAssignment && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h6 className="fw-bold mb-0">Individual Results</h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Time Taken</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAssignment.results.map((result) => (
                    <tr key={result._id}>
                      <td>
                        <div className="fw-semibold">{result.student.name}</div>
                        <small className="text-muted">{result.student.email}</small>
                      </td>
                      <td>
                        <span className={`fw-bold ${result.score >= 70 ? 'text-success' : 'text-danger'}`}>
                          {result.score}%
                        </span>
                        <small className="text-muted ms-1">({result.earnedPoints}/{result.totalPoints})</small>
                      </td>
                      <td>
                        <span className={`badge ${result.passed ? 'bg-success' : 'bg-danger'}`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td>{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</td>
                      <td>{formatDate(result.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAssignments;
