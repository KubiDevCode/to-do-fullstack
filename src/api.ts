import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

interface RefreshResponse {
    accessToken: string;
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _isRetry?: boolean;
}

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

api.interceptors.response.use(
    (config) => config,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._isRetry &&
            !originalRequest.url?.includes('/refresh')
        ) {
            originalRequest._isRetry = true;

            const response = await axios.get<RefreshResponse>('/todo/refresh', {
                withCredentials: true,
            });

            localStorage.setItem('token', response.data.accessToken);
            return api.request(originalRequest);
        }

        throw error;
    }
);