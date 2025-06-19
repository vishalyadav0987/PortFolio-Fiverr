import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://portfolio-fiverr.onrender.com/api/v1',
  withCredentials: true, // 🔥 applies to ALL requests
});

export default axiosInstance;
