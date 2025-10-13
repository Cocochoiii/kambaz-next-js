// app/lib/api.ts
import axios from "axios";

// Force production mode for Vercel deployments
const isProd = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_VERCEL === "1";

// Backend URL - no trailing slash
const BACKEND_URL = "https://kambaz-node-server-app-final2.vercel.app";

// Always use direct backend URL in production, rewrites in dev
const API_BASE = isProd ? BACKEND_URL : "";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Ensure proper URL construction
        if (config.url) {
            // Remove any duplicate /api
            config.url = config.url.replace(/\/api\/api/, '/api');

            // In production, ensure /api prefix
            if (isProd && !config.url.startsWith('/api') && !config.url.startsWith('http')) {
                config.url = `/api${config.url}`;
            }
        }

        // Debug logging in development
        if (!isProd) {
            const fullUrl = config.baseURL + (config.url || '');
            console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`);
        }

        return config;
    },
    (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        if (!isProd && !response.config.url?.includes('/profile')) {
            console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        // Only log non-401 errors or non-profile 401s
        if (!(error.response?.status === 401 && error.config?.url?.includes('/profile'))) {
            console.error(`[API Error] ${error.response?.status} ${error.config?.url}`,
                error.response?.data?.message || error.message);
        }
        return Promise.reject(error);
    }
);

export default api;