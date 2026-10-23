import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getUsers, deleteUser, updateUserRole } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/Loader';
import toast from 'react-hot-toast';

const ROLES = ['student', 'instructor', 'admin'];
const roleColor = { admin: 'danger', instructor: 'success', student: 'primary' };

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await getUsers(params);
      setUsers(data.users || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleDelete = async (user) => {
    if (user._id === currentUser?._id) {
      toast.error("You can't delete your own account");
      return;
    }
    if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    setDeleting(user._id);
    try {
      await deleteUser(user._id);
      toast.success('User deleted');
      fetchUsers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?._id) {
      toast.error("You can't change your own role");
      return;
    }
    setUpdatingRole(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success('Role updated');
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Users</h2>
          <p className="text-muted mb-0">{pagination.total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body py-3">
          <div className="row g-2">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search" /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                    <i className="bi bi-x" />
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(''); setRoleFilter(''); }}>
                <i className="bi bi-arrow-counterclockwise me-1" />Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-muted">No users found</td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className={`rounded-circle bg-${roleColor[u.role] || 'secondary'} d-flex align-items-center justify-content-center text-white flex-shrink-0`}
                              style={{ width: 36, height: 36, fontSize: 14, fontWeight: 600 }}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold small">{u.name}</div>
                              {u._id === currentUser?._id && (
                                <span className="badge bg-light text-muted" style={{ fontSize: 10 }}>You</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="small text-muted">{u.email}</td>
                        <td>
                          <select
                            className={`form-select form-select-sm border-0 bg-${roleColor[u.role]}-subtle text-${roleColor[u.role]}`}
                            style={{ width: 'auto', fontWeight: 600, fontSize: 12 }}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={updatingRole === u._id || u._id === currentUser?._id}
                          >
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td className="small text-muted">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(u)}
                            disabled={deleting === u._id || u._id === currentUser?._id}
                          >
                            {deleting === u._id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <i className="bi bi-trash" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center gap-1 mt-3">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={pagination.page <= 1}
                onClick={() => fetchUsers(pagination.page - 1)}
              >
                <i className="bi bi-chevron-left" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`btn btn-sm ${p === pagination.page ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => fetchUsers(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchUsers(pagination.page + 1)}
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default ManageUsers;
