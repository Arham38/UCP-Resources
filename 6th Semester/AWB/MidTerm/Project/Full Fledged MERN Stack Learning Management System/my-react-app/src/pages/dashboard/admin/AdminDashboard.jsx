import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUsers } from '../../../services/userService';
import { getCourses } from '../../../services/courseService';
import { getMyCourses } from '../../../services/enrollmentService';
import StatsCard from '../../../components/StatsCard';
import Loader from '../../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, students: 0, instructors: 0, admins: 0,
    totalCourses: 0, totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          getUsers(),
          getCourses(),
        ]);
        const users = usersRes.data.users || [];
        const courses = coursesRes.data.courses || [];

        setStats({
          totalUsers: users.length,
          students: users.filter((u) => u.role === 'student').length,
          instructors: users.filter((u) => u.role === 'instructor').length,
          admins: users.filter((u) => u.role === 'admin').length,
          totalCourses: courses.length,
          totalRevenue: courses.reduce((s, c) => s + (c.price || 0), 0),
        });
        setRecentUsers(users.slice(-5).reverse());
        setRecentCourses(courses.slice(-5).reverse());
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const roleColor = { admin: 'danger', instructor: 'success', student: 'primary' };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">Platform overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-2">
          <StatsCard title="Total Users" value={stats.totalUsers} icon="people" color="primary" />
        </div>
        <div className="col-6 col-md-2">
          <StatsCard title="Students" value={stats.students} icon="person" color="info" />
        </div>
        <div className="col-6 col-md-2">
          <StatsCard title="Instructors" value={stats.instructors} icon="person-badge" color="success" />
        </div>
        <div className="col-6 col-md-2">
          <StatsCard title="Admins" value={stats.admins} icon="shield-check" color="danger" />
        </div>
        <div className="col-6 col-md-2">
          <StatsCard title="Courses" value={stats.totalCourses} icon="book" color="warning" />
        </div>
        <div className="col-6 col-md-2">
          <StatsCard title="Revenue" value={`$${stats.totalRevenue}`} icon="currency-dollar" color="success" />
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Users */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Recent Users</span>
              <Link to="/admin/users" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {recentUsers.length === 0 ? (
                <div className="text-center py-4 text-muted small">No users yet</div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentUsers.map((u) => (
                    <div key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                          style={{ width: 32, height: 32, fontSize: 13, fontWeight: 600 }}
                        >
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="small fw-semibold">{u.name}</div>
                          <div className="text-muted" style={{ fontSize: 11 }}>{u.email}</div>
                        </div>
                      </div>
                      <span className={`badge bg-${roleColor[u.role] || 'secondary'}`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Recent Courses</span>
              <Link to="/admin/courses" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {recentCourses.length === 0 ? (
                <div className="text-center py-4 text-muted small">No courses yet</div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentCourses.map((c) => (
                    <div key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="small fw-semibold">{c.title}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>
                          {c.instructor?.name} · {c.category}
                        </div>
                      </div>
                      <span className="fw-bold text-primary small">${c.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h6 className="fw-bold mb-3">Quick Actions</h6>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/admin/users" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-people me-1" />Manage Users
            </Link>
            <Link to="/admin/courses" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-book me-1" />Manage Courses
            </Link>
            <Link to="/admin/analytics" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-graph-up me-1" />View Analytics
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
