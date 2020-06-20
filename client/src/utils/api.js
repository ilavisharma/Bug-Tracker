import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV !== 'production'
      ? 'http://localhost:4000'
      : 'https://api.bugtracker.lavisharma.me',
});

api.interceptors.request.use(
  config => {
    config.headers = {
      authorization: localStorage.getItem('token'),
      ...config.headers,
    };
    return config;
  },
  err => Promise.reject(err)
);

export default api;
