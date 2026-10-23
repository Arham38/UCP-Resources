import api from './api';

export const createAssignment = (payload) => api.post('/academic/assignments', payload);
export const createAssessment = (payload) => api.post('/academic/assessments', payload);
export const createAnnouncement = (payload) => api.post('/academic/announcements', payload);
export const getCourseContent = (courseId) => api.get(`/academic/course/${courseId}/content`);
export const submitContent = (payload) => api.post('/academic/submissions', payload);
export const gradeSubmission = (submissionId, marksObtained) =>
  api.put(`/academic/submissions/${submissionId}/grade`, { marksObtained });
export const getCourseSubmissions = (courseId) => api.get(`/academic/course/${courseId}/submissions`);
export const updateCourseWeightage = (courseId, payload) => api.put(`/academic/course/${courseId}/weightage`, payload);
export const generateResults = (courseId) => api.post(`/academic/course/${courseId}/results/generate`);
export const sendResults = (courseId) => api.post(`/academic/course/${courseId}/results/send`);
export const getMyProgress = () => api.get('/academic/my-progress');
