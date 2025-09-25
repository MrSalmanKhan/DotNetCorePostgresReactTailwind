import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

// Create a pre-configured Axios instance for API calls
const apiClient = axios.create({
    baseURL: "https://localhost:7092/api",
});

// Automatically attach JWT token to every request if available
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global error handler for API responses
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Log error for debugging
        console.error("API Error:", error);
        // Optionally, handle global auth errors here (e.g., redirect to login)
        return Promise.reject(error);
    }
);

export default apiClient;
