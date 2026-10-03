import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      if (localStorage.getItem('travel_token')) {
        localStorage.removeItem('travel_token');
        localStorage.removeItem('travel_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  demoLogin: (role = 'user') => api.post('/auth/demo', { role }),
};

export const destinationsAPI = {
  getAll: (popular = false) => api.get(`/destinations${popular ? '?popular=true' : ''}`),
  getById: (id) => api.get(`/destinations/${id}`),
};

export const hotelsAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  addReview: (id, reviewData) => api.post(`/hotels/${id}/reviews`, reviewData),
};

export const ticketsAPI = {
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
};

export const guidesAPI = {
  getAll: (params) => api.get('/guides', { params }),
  getById: (id) => api.get(`/guides/${id}`),
};

export const searchAPI = {
  search: (params) => api.get('/search', { params }),
};

export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
};

export const paymentsAPI = {
  checkout: (data) => api.post('/payments/checkout', data),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const chatbotAPI = {
  sendMessage: (messages) => api.post('/chat', { messages }),
  getSuggestions: () => api.get('/chat/suggestions'),
};

export default api;
