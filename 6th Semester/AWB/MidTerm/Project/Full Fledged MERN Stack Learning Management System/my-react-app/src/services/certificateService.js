import api from './api';

export const generateCertificate = (courseId, grade = '') =>
  api.post('/certificates/generate', { courseId, grade });

export const getMyCertificates = () => api.get('/certificates/my');

export const verifyCertificate = (certificateId) =>
  api.get(`/certificates/verify/${certificateId}`);
