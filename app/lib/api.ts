import axios from "axios";

// Determine if we're in production
const isProd = process.env.NODE_ENV === "production";

// Use environment variable if set, otherwise use default backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kambaz-node-server-app-final2.vercel.app";

// In production, call the backend directly. In dev, use Next.js rewrites
const API_BASE = isProd ? `${BACKEND_URL}/api` : "/api";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // CRITICAL: Include cookies in all requests
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds for Vercel cold starts
});

// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        // Ensure we're not duplicating /api in the URL
        if (config.url?.startsWith("/api/")) {
            config.url = config.url.replace(/^\/api/, "");
        }

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
        if (!isProd && response.config.url !== "/users/profile") {
            console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        // Don't log 401 errors for profile checks
        if (!(error.response?.status === 401 && error.config?.url?.includes("/profile"))) {
            console.error(
                `[API Error] ${error.response?.status} ${error.config?.url}`,
                error.response?.data || error.message
            );
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Unauthorized - session expired or not logged in
            // Don't log for profile checks as they're expected
            if (!error.config?.url?.includes("/profile")) {
                console.log("Session expired or not authenticated");
            }
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

    // Modules
    COURSE_MODULES: (cid: string) => `/courses/${cid}/modules`,

    // Assignments
    COURSE_ASSIGNMENTS: (cid: string) => `/courses/${cid}/assignments`,

    // Quizzes
    COURSE_QUIZZES: (cid: string) => `/courses/${cid}/quizzes`,

    // Pazza
    PAZZA_FOLDERS: (cid: string) => `/pazza/${cid}/folders`,
    PAZZA_QUESTIONS: (cid: string) => `/pazza/${cid}/questions`,

    // Add more as needed...
};