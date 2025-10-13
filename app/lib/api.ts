// app/lib/api.ts
import axios from "axios";

/**
 * Always talk to the backend through Next's /api proxy so the
 * session cookie is set for the same origin (both local and Vercel).
 */
const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

export default api;
