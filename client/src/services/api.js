import axios from 'axios';
import { API_URL } from '../Constants';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor: Add access token to headers
axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 (Unauthorized) error for token refresh
axiosInstance.interceptors.response.use(
    (response) => response, 
    async (error) => {
        // If we get a 401 Unauthorized error (Access token expired)
        if (error.response && error.response.status === 401) {
            try {
                const refreshToken = localStorage.getItem("refreshToken");

                // If no refresh token, force logout
                if (!refreshToken) {
                    throw new Error("No refresh token found, please log in again");
                }

                // Request to refresh the access token
                const refreshResponse = await axios.post(`${API_URL}/auth/refreshToken`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    },
                    withCredentials: true
                });

                // Store new tokens
                localStorage.setItem("refreshToken", refreshResponse.data.refreshToken); // Optionally update refresh token
                localStorage.setItem("accessToken", refreshResponse.data.accessToken);

                // Retry the original request with the new access token
                error.config.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
                return axiosInstance(error.config);  // Retry the original request

            } catch (refreshError) {
                console.error("Error refreshing access token: ", refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
