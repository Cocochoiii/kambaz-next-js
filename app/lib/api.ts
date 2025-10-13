// app/lib/api.ts
import axios from "axios";

// Determine if we're in production
const isProd = process.env.NODE_ENV === "production";

// In production, call the backend directly. In dev, use Next.js rewrites
const API_BASE = isProd
    ? "https://kambaz-node-server-app-final2.vercel.app/api"
    : "/api";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // CRITICAL: Include cookies in requests
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds for Vercel cold starts
});

// Request interceptor for debugging (can be removed in production)
api.interceptors.request.use(
    (config) => {
        // Only log in development
        if (!isProd) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // Only log in development
        if (!isProd) {
            console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        // Log errors always
        console.error(
            `[API Error] ${error.response?.status} ${error.config?.url}`,
            error.response?.data || error.message
        );

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Unauthorized - session expired or not logged in
            // Could redirect to signin here if desired
            console.log("Session expired or not authenticated");
        } else if (error.response?.status === 403) {
            // Forbidden - CORS or permission issue
            console.error("CORS or permission issue");
        } else if (!error.response) {
            // Network error
            console.error("Network error - backend might be down");
        }

        return Promise.reject(error);
    }
);

export default api;

// Export API endpoints as constants for consistency
export const API_ENDPOINTS = {
    // Auth
    SIGNIN: "/users/signin",
    SIGNUP: "/users/signup",
    SIGNOUT: "/users/signout",
    PROFILE: "/users/profile",

    // Users
    USERS: "/users",
    USER_BY_ID: (id: string) => `/users/${id}`,

    // Courses
    COURSES: "/courses",
    COURSE_BY_ID: (id: string) => `/courses/${id}`,
    USER_COURSES: (uid: string) => `/users/${uid}/courses`,

    // Enrollments
    ENROLL: (uid: string, cid: string) => `/users/${uid}/courses/${cid}`,

    // Add more as needed...
};