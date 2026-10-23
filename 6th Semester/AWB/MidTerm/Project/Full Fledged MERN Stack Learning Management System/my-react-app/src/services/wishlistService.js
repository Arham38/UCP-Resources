import api from './api';

export const getMyWishlist = () => api.get('/wishlist/my');
export const addToWishlist = (courseId) => api.post('/wishlist/add', { courseId });
export const removeFromWishlist = (courseId) =>
  api.delete('/wishlist/remove', { data: { courseId } });
