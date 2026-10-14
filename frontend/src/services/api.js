import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token from localStorage fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tripsync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Places Endpoints
export const placesAPI = {
  getPlaces: (params) => api.get('/places', { params }),
  getNearby: (params) => api.get('/places/nearby', { params }),
  getDetails: (identifier) => api.get(`/places/${identifier}`),
  create: (data) => api.post('/places', data),
  update: (id, data) => api.put(`/places/${id}`, data),
  delete: (id) => api.delete(`/places/${id}`),
};

// Transport Endpoints
export const transportAPI = {
  compare: (params) => api.get('/transport/compare', { params }),
  getById: (id) => api.get(`/transport/${id}`),
};

// Review Endpoints
export const reviewsAPI = {
  create: (formData) => api.post('/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getByPlace: (placeId) => api.get(`/reviews/place/${placeId}`),
  upvote: (id) => api.post(`/reviews/${id}/upvote`),
};

// Trips Endpoints
export const tripsAPI = {
  create: (data) => api.post('/trips', data),
  getMyTrips: () => api.get('/trips'),
  getById: (id) => api.get(`/trips/${id}`),
  addPlace: (tripId, placeId) => api.post(`/trips/${tripId}/places`, { placeId }),
  removePlace: (tripId, placeId) => api.delete(`/trips/${tripId}/places/${placeId}`),
  addCollaborator: (tripId, data) => api.post(`/trips/${tripId}/collaborators`, data),
};

// Itinerary Endpoints
export const itineraryAPI = {
  generate: (tripId) => api.post('/itinerary/generate', { tripId }),
  getByTrip: (tripId) => api.get(`/itinerary/trip/${tripId}`),
  whatIf: (data) => api.post('/itinerary/what-if', data),
};

// Accommodation & Restaurant Endpoints
export const staysAPI = {
  getAll: (params) => api.get('/accommodations', { params }),
  getById: (id) => api.get(`/accommodations/${id}`),
};

export const restaurantsAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
};

// Stories Endpoints
export const storiesAPI = {
  getAll: (params) => api.get('/stories', { params }),
  create: (formData) => api.post('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleLike: (id) => api.post(`/stories/${id}/like`),
};

// Local Experts Endpoints
export const expertsAPI = {
  getAll: (params) => api.get('/experts', { params }),
  getById: (id) => api.get(`/experts/${id}`),
  bookTour: (data) => api.post('/experts/book', data),
  verifyPayment: (data) => api.post('/experts/verify-payment', data),
};

// Events Endpoints
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
};

// Expenses Endpoints
export const expensesAPI = {
  add: (data) => api.post('/expenses', data),
  getSummary: (tripId) => api.get(`/expenses/trip/${tripId}`),
  markSettled: (data) => api.post('/expenses/settle', data),
};

// Emergency Endpoints
export const emergencyAPI = {
  triggerSos: (data) => api.post('/emergency/sos', data),
  getContacts: () => api.get('/emergency/contacts'),
  addContact: (data) => api.post('/emergency/contacts', data),
  deleteContact: (id) => api.delete(`/emergency/contacts/${id}`),
};

// Packing Endpoints
export const packingAPI = {
  generate: (data) => api.post('/packing/generate', data),
  get: (params) => api.get('/packing', { params }),
  toggle: (data) => api.post('/packing/toggle', data),
};

// Compare Destinations
export const compareAPI = {
  destinations: (params) => api.get('/compare/destinations', { params }),
};

// Chatbot Endpoints
export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
};

// User & Location History Endpoints
export const userAPI = {
  recordDwell: (data) => api.post('/users/location/dwell', data),
  getLocationHistory: () => api.get('/users/history/location'),
  createProOrder: (data) => api.post('/users/pro/order', data),
  verifyPro: (data) => api.post('/users/pro/verify', data),
  getAllUsers: (params) => api.get('/users', { params }),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

export default api;
