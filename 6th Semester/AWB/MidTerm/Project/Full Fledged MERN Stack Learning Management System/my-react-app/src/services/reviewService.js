import api from './api';

export const addReview = (payload) => api.post('/reviews', payload);
export const getCourseReviews = (courseId) => api.get(`/reviews/course/${courseId}`);
export const updateReview = (reviewId, payload) => api.put(`/reviews/${reviewId}`, payload);
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);
