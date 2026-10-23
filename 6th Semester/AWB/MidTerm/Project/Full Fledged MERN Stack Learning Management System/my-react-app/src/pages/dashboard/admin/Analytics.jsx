import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUsers } from '../../../services/userService';
import { getCourses } from '../../../services/courseService';
import StatsCard from '../../../components/StatsCard';
import Loader from '../../../components/Loader';

// ─── BarChart Component ───────────────────────────────────────────────────────
const BarChart = ({ data, color = 'primary' }) => {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="d-flex flex-column gap-2">
      {Object.entries(data).map(([key, val]) => (
        <div key={key}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-capitalize">{key}</span>
            <span className="fw-semibold">{val}</span>
          </div>
          <div className="progress" style={{ height: 10 }}>
            <div
              className={`progress-bar bg-${color}`}
              style={{ width: `${(val / max) * 100}%`, transition: 'width 0.8s ease' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Analytics Component ──────────────────────────────────────────────────────
const Analytics = () => {
  const [data, setData] = useState({
    users: [], courses: [],
    roleCounts: {}, categoryCounts: {},
    priceRanges: {}, monthlyUsers: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([getUsers(), getCourses()]);
        const users = usersRes.data.users || [];
        const courses = coursesRes.data.courses || [];

        const roleCounts = users.reduce((acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1;
          return acc;
        }, {});

        const categoryCounts = courses.reduce((acc, c) => {
          const cat = c.category || 'Other';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        const priceRanges = courses.reduce((acc, c) => {
          const p = c.price || 0;
          const range = p === 0 ? 'Free' : p <= 20 ? '$1–$20' : p <= 50 ? '$21–$50' : '$50+';
          acc[range] = (acc[range] || 0) + 1;
          return acc;
        }, {});

        // Monthly user registrations (last 6 months)
        const monthlyUsers = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
          monthlyUsers[key] = 0;
        }
        users.forEach((u) => {
          if (!u.createdAt) return;
          const d = new Date(u.createdAt);
          const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
          if (key in monthlyUsers) monthlyUsers[key]++;
        });

        setData({ users, courses, roleCounts, categoryCounts, priceRanges, monthlyUsers });
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const totalRevenue = data.courses.reduce((s, c) => s + (c.price || 0), 0);
  const avgPrice = data.courses.length
    ? (totalRevenue / data.courses.length).toFixed(2)
    : 0;
  const freeCourses = data.courses.filter((c) => c.price === 0).length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="fw-bold mb-4">Analytics & Reports</h2>

      {/* Summary Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatsCard title="Total Users" value={data.users.length} icon="people" color="primary" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard title="Total Courses" value={data.courses.length} icon="book" color="warning" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard title="Total Revenue" value={`$${totalRevenue}`} icon="currency-dollar" color="success" />
        </div>
        <div className="col-6 col-md-3">
          <StatsCard title="Avg Course Price" value={`$${avgPrice}`} icon="tag" color="info" />
        </div>
      </div>

      <div className="row g-4">
        {/* Users by Role */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent fw-semibold">Users by Role</div>
            <div className="card-body">
              {Object.keys(data.roleCounts).length === 0 ? (
                <p className="text-muted small">No data</p>
              ) : (
                <BarChart data={data.roleCounts} color="primary" />
              )}
            </div>
          </div>
        </div>

        {/* Courses by Category */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent fw-semibold">Courses by Category</div>
            <div className="card-body">
              {Object.keys(data.categoryCounts).length === 0 ? (
                <p className="text-muted small">No data</p>
              ) : (
                <BarChart data={data.categoryCounts} color="warning" />
              )}
            </div>
          </div>
        </div>

        {/* Price Distribution */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent fw-semibold">Course Price Distribution</div>
            <div className="card-body">
              {Object.keys(data.priceRanges).length === 0 ? (
                <p className="text-muted small">No data</p>
              ) : (
                <BarChart data={data.priceRanges} color="success" />
              )}
              <div className="mt-3 pt-3 border-top d-flex gap-4">
                <div>
                  <div className="text-muted small">Free Courses</div>
                  <div className="fw-bold">{freeCourses}</div>
                </div>
                <div>
                  <div className="text-muted small">Paid Courses</div>
                  <div className="fw-bold">{data.courses.length - freeCourses}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Registrations */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent fw-semibold">Monthly User Registrations</div>
            <div className="card-body">
              <BarChart data={data.monthlyUsers} color="info" />
            </div>
          </div>
        </div>

        {/* Top Instructors */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent fw-semibold">Top Instructors by Course Count</div>
            <div className="card-body">
              {data.courses.length === 0 ? (
                <p className="text-muted small">No data</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Instructor</th>
                        <th>Courses</th>
                        <th>Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        data.courses.reduce((acc, c) => {
                          const name = c.instructor?.name || 'Unknown';
                          if (!acc[name]) acc[name] = { count: 0, revenue: 0 };
                          acc[name].count++;
                          acc[name].revenue += c.price || 0;
                          return acc;
                        }, {})
                      )
                        .sort((a, b) => b[1].count - a[1].count)
                        .slice(0, 5)
                        .map(([name, info], idx) => (
                          <tr key={name}>
                            <td className="text-muted">{idx + 1}</td>
                            <td className="fw-semibold">{name}</td>
                            <td>{info.count}</td>
                            <td className="text-success fw-semibold">${info.revenue}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
