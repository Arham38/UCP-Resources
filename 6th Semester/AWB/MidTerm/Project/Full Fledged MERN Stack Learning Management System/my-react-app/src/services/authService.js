import api from './api';

export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const refreshToken = () => api.post('/auth/refresh');
export const logout = () => api.post('/auth/logout');
