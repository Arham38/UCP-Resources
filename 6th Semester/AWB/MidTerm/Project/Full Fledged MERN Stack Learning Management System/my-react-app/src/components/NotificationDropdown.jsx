import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  selectNotifications,
  selectUnreadCount,
} from '../store/slices/notificationSlice';
import { useAuth } from '../context/AuthContext';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (user) dispatch(fetchNotifications());
  }, [user, dispatch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (n) => {
    if (!n.read) dispatch(markNotificationRead(n._id));
    if (n.link) navigate(n.link);
    setOpen(false);
  };

  const typeIcon = (type) => {
    const map = { enrollment: '📚', course_update: '🎓', quiz_result: '📝', message: '💬', system: '🔔' };
    return map[type] || '🔔';
  };

  return (
    <div className="position-relative" ref={ref}>
      <button
        className="btn btn-sm btn-outline-light position-relative"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: 9 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="dropdown-menu show shadow border-0 p-0"
          style={{ right: 0, left: 'auto', minWidth: 320, maxHeight: 400, overflowY: 'auto', zIndex: 1050 }}
        >
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <span className="fw-semibold">Notifications</span>
            {unreadCount > 0 && (
              <button
                className="btn btn-link btn-sm p-0 text-decoration-none"
                onClick={() => dispatch(markAllNotificationsRead())}
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center text-muted py-4 small">No notifications</div>
          ) : (
            notifications.slice(0, 15).map((n) => (
              <button
                key={n._id}
                className={`dropdown-item d-flex gap-2 py-2 px-3 border-bottom ${!n.read ? 'fw-semibold' : ''}`}
                style={{ whiteSpace: 'normal', background: n.read ? '' : 'rgba(13,110,253,0.05)' }}
                onClick={() => handleClick(n)}
              >
                <span style={{ fontSize: 18 }}>{typeIcon(n.type)}</span>
                <div>
                  <div className="small">{n.title}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{n.message}</div>
                  <div className="text-muted" style={{ fontSize: 10 }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
