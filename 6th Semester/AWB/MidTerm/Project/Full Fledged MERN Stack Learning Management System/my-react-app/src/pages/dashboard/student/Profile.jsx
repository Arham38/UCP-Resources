import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      // Profile update endpoint — we'll call it optimistically and update localStorage
      await api.put('/auth/profile', formData);
      const updated = { ...user, name: formData.name, bio: formData.bio };
      localStorage.setItem('user', JSON.stringify(updated));
      window.location.reload(); // simplest way to refresh AuthContext state
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPass.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPass(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      toast.success('Password changed successfully');
      setPasswords({ current: '', newPass: '', confirm: '' });
      setShowPassForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  const roleColor = { admin: 'danger', instructor: 'success', student: 'primary' };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h2 className="fw-bold mb-4">My Profile</h2>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4">
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 80, height: 80, fontSize: 32, color: 'white' }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h5 className="fw-bold mb-1">{user?.name}</h5>
            <p className="text-muted small mb-2">{user?.email}</p>
            <span className={`badge bg-${roleColor[user?.role] || 'secondary'} mb-3`}>
              {user?.role}
            </span>
            {user?.bio && <p className="text-muted small">{user.bio}</p>}
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setEditing(!editing)}
            >
              <i className="bi bi-pencil me-1" />{editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Edit / Info */}
        <div className="col-md-8">
          {editing ? (
            <div className="card border-0 shadow-sm">
              <div className="card-header fw-semibold bg-transparent">Edit Profile</div>
              <div className="card-body">
                <form onSubmit={handleSaveProfile}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      maxLength={500}
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                    <div className="form-text">{formData.bio.length}/500</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header fw-semibold bg-transparent">Account Information</div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label text-muted small">Full Name</label>
                    <p className="fw-semibold mb-0">{user?.name}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-muted small">Email Address</label>
                    <p className="fw-semibold mb-0">{user?.email}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-muted small">Role</label>
                    <p className="fw-semibold mb-0 text-capitalize">{user?.role}</p>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label text-muted small">Member Since</label>
                    <p className="fw-semibold mb-0">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  {user?.bio && (
                    <div className="col-12">
                      <label className="form-label text-muted small">Bio</label>
                      <p className="mb-0">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          <div className="card border-0 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center bg-transparent">
              <span className="fw-semibold">Security</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowPassForm(!showPassForm)}
              >
                {showPassForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            {showPassForm && (
              <div className="card-body">
                <form onSubmit={handleChangePassword}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={changingPass}>
                    {changingPass ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
