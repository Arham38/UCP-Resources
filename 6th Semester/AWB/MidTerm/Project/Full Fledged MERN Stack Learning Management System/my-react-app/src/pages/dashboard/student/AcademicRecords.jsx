import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyProgress } from '../../../services/academicService';

const AcademicRecords = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyProgress();
        setCourses(data.courses || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load academic records');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totals = useMemo(() => {
    let submissions = 0;
    let graded = 0;
    let pending = 0;
    courses.forEach((entry) => {
      const list = entry.submissions || [];
      submissions += list.length;
      graded += list.filter((s) => s.status === 'graded').length;
      pending += list.filter((s) => s.status !== 'graded').length;
    });
    return { submissions, graded, pending };
  }, [courses]);

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Academic Records</h2>
          <p className="text-muted mb-0">All courses, submissions, grades, and results in one place.</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Total Submissions</div>
              <div className="fw-bold fs-4">{totals.submissions}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Graded</div>
              <div className="fw-bold fs-4 text-success">{totals.graded}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-muted small">Pending Review</div>
              <div className="fw-bold fs-4 text-warning">{totals.pending}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        {courses.map((entry) => {
          const submissions = entry.submissions || [];
          const gradedCount = submissions.filter((s) => s.status === 'graded').length;
          return (
            <div key={entry.course._id} className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">{entry.course.title}</h6>
                    <div className="small text-muted">
                      {gradedCount}/{submissions.length} graded submissions
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {entry.result ? (
                      <span className="badge bg-success">
                        Grade {entry.result.grade} ({entry.result.percentage}%)
                      </span>
                    ) : (
                      <span className="badge bg-secondary">Result pending</span>
                    )}
                    <Link to={`/student/course/${entry.course._id}`} className="btn btn-sm btn-outline-primary">
                      Open Course Academic
                    </Link>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Submitted At</th>
                        <th>Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((s) => (
                        <tr key={s._id}>
                          <td className="text-capitalize">{s.contentType}</td>
                          <td>{s.status}</td>
                          <td>{new Date(s.submittedAt).toLocaleString()}</td>
                          <td>{s.marksObtained ?? '-'}</td>
                        </tr>
                      ))}
                      {submissions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-muted">No submissions yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
        {courses.length === 0 && <div className="alert alert-info">No academic records available yet.</div>}
      </div>
    </div>
  );
};

export default AcademicRecords;
