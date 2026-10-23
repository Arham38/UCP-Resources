import api from './api';

export const getCourseQuizzes = (courseId) => api.get(`/quizzes/course/${courseId}`);
export const getQuiz = (id) => api.get(`/quizzes/${id}`);
export const submitQuiz = (id, payload) => api.post(`/quizzes/${id}/submit`, payload);
export const getMyAttempts = (quizId) => api.get(`/quizzes/${quizId}/attempts`);
export const createQuiz = (data) => api.post('/quizzes', data);
