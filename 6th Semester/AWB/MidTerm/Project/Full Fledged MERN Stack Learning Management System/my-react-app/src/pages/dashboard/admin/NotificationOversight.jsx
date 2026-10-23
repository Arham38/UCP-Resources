import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getLmsOverview, getNotificationLogs } from '../../../services/adminLmsService';

const NotificationOversight = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [o, l] = await Promise.all([getLmsOverview(), getNotificationLogs(type ? { type } : {})]);
      setStats(o.data.stats);
      setLogs(l.data.notifications || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load admin oversight');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [type]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div>
      <h2 className="fw-bold mb-4">Notification Oversight</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-3"><div className="card border-0 shadow-sm"><div className="card-body"><div className="text-muted small">Students</div><div className="fs-4 fw-bold">{stats?.students || 0}</div></div></div></div>
        <div className="col-md-3"><div className="card border-0 shadow-sm"><div className="card-body"><div className="text-muted small">Instructors</div><div className="fs-4 fw-bold">{stats?.instructors || 0}</div></div></div></div>
        <div className="col-md-3"><div className="card border-0 shadow-sm"><div className="card-body"><div className="text-muted small">Courses</div><div className="fs-4 fw-bold">{stats?.courses || 0}</div></div></div></div>
        <div className="col-md-3"><div className="card border-0 shadow-sm"><div className="card-body"><div className="text-muted small">Enrollments</div><div className="fs-4 fw-bold">{stats?.enrollments || 0}</div></div></div></div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Notification Logs</span>
          <select className="form-select form-select-sm w-auto" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="assignment">Assignment</option>
            <option value="assessment">Assessment</option>
            <option value="announcement">Announcement</option>
            <option value="result_published">Result</option>
          </select>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead><tr><th>Type</th><th>Title</th><th>Message</th><th>Date</th></tr></thead>
              <tbody>
                {logs.map((n) => (
                  <tr key={n._id}>
                    <td><span className="badge bg-light text-dark">{n.type}</span></td>
                    <td>{n.title}</td>
                    <td>{n.message}</td>
                    <td>{new Date(n.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={4} className="text-muted text-center">No notifications</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationOversight;
