import axios from 'axios';

export const api = axios.create({
    baseURL: '/todo',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._isRetry &&
        !originalRequest.url?.includes('/refresh')) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get(`/todo/refresh`, { withCredentials: true })
            localStorage.setItem('token', response.data.accessToken);
            return api.request(originalRequest);
        } catch (e) {
            console.log(e)
        }
    }
    throw error;
})