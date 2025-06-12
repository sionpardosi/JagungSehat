import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://jagungsehat-production.up.railway.app/api', 
    timeout: 15000, 
});


axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
}, error => {
    return Promise.reject(error); 
});

axiosInstance.interceptors.response.use(response => {
    return response; 
}, error => {
    if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('authToken'); 
        window.location.href = '/auth/login'; 
    }
    return Promise.reject(error); 
});

export default axiosInstance;
