import api from './api';

export const getLmsOverview = () => api.get('/admin/lms/overview');
export const getNotificationLogs = (params) => api.get('/admin/lms/notifications/logs', { params });
export const getStudentProgressAdmin = (studentId) => api.get(`/admin/lms/students/${studentId}/progress`);
