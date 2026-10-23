import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { getMyProgress } from '../../../services/academicService';

const MyProgress = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyProgress();
        setCourses(data.courses || []);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const exportResultPdf = (entry) => {
    if (!entry?.result) return;
    const r = entry.result;
    const pdf = new jsPDF();
    let y = 15;
    pdf.setFontSize(14);
    pdf.text('Result Sheet', 14, y); y += 8;
    pdf.setFontSize(11);
    pdf.text(`Course: ${entry.course.title}`, 14, y); y += 6;
    pdf.text(`Total: ${r.totalObtained}/${r.totalPossible}`, 14, y); y += 6;
    pdf.text(`Percentage: ${r.percentage}%`, 14, y); y += 6;
    pdf.text(`Grade: ${r.grade}`, 14, y); y += 8;
    pdf.text('Evaluations:', 14, y); y += 6;
    r.evaluations.forEach((ev) => {
      pdf.text(`- ${ev.title}: ${ev.obtainedMarks}/${ev.maxMarks}`, 16, y);
      y += 6;
      if (y > 280) { pdf.addPage(); y = 15; }
    });
    pdf.save(`result-${entry.course.title.replace(/\s+/g, '-')}.pdf`);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div>
      <h2 className="fw-bold mb-4">My Progress</h2>
      <div className="d-flex flex-column gap-3">
        {courses.map((entry) => {
          const graded = entry.submissions.filter((s) => s.status === 'graded').length;
          const total = entry.submissions.length;
          const progress = total ? Math.round((graded / total) * 100) : entry.enrollmentProgress;
          return (
            <div key={entry.course._id} className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h6 className="fw-bold mb-1">{entry.course.title}</h6>
                    <p className="small text-muted mb-2">{graded}/{total} graded submissions</p>
                  </div>
                  {entry.result && (
                    <div className="text-end">
                      <div className="badge bg-success">Grade {entry.result.grade}</div>
                      <div className="small mt-1">{entry.result.percentage}%</div>
                    </div>
                  )}
                </div>
                <div className="progress mb-2" style={{ height: 8 }}>
                  <div className="progress-bar bg-primary" style={{ width: `${progress}%` }} />
                </div>
                <div className="small text-muted mb-2">Completion: {progress}%</div>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead><tr><th>Type</th><th>Status</th><th>Marks</th></tr></thead>
                    <tbody>
                      {entry.submissions.map((s) => (
                        <tr key={s._id}>
                          <td className="text-capitalize">{s.contentType}</td>
                          <td>{s.status}</td>
                          <td>{s.marksObtained ?? '-'}</td>
                        </tr>
                      ))}
                      {entry.submissions.length === 0 && <tr><td colSpan={3} className="text-muted">No submissions yet</td></tr>}
                    </tbody>
                  </table>
                </div>
                {entry.result && (
                  <button className="btn btn-outline-primary btn-sm" onClick={() => exportResultPdf(entry)}>
                    Download Result PDF
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {courses.length === 0 && <div className="alert alert-info">No enrolled course progress found.</div>}
      </div>
    </div>
  );
};

export default MyProgress;
