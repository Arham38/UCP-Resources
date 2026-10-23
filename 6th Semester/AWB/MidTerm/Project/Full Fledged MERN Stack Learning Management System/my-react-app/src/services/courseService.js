import api from './api';

export const getCourses = () => api.get('/courses');
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (formData, options = {}) =>
  api.post('/courses', formData, {
    onUploadProgress: options.onUploadProgress,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
export const updateCourse = (id, courseData) => api.put(`/courses/${id}`, courseData);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

export const getLessons = (courseId) => api.get(`/courses/${courseId}/lessons`);
export const createLesson = (courseId, formData, options = {}) =>
  api.post(`/courses/${courseId}/lessons`, formData, {
    onUploadProgress: options.onUploadProgress,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
export const deleteLesson = (id) => api.delete(`/lessons/${id}`);
