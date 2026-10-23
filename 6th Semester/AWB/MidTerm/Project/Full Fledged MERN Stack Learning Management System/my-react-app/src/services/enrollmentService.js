import api from './api';

export const enroll = (courseId) =>
  api.post('/enrollments/enroll', { courseId });

export const getMyCourses = () =>
  api.get('/enrollments/my-courses');

export const updateProgress = (courseId, progress) =>
  api.put('/enrollments/progress', { courseId, progress });
