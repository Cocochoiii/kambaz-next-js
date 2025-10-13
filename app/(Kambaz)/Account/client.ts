// app/lib/client.ts (or your current path: app/(Kambaz)/Account/client.ts)
import axios from "axios";

/**
 * Dev:
 *   - leave NEXT_PUBLIC_HTTP_SERVER empty
 *   - Next dev rewrite proxies /api/* → http://127.0.0.1:4000/api
 *
 * Prod (Vercel):
 *   - set NEXT_PUBLIC_HTTP_SERVER to your backend URL, e.g.
 *     https://kambaz-node-server-app-final.vercel.app
 */
const backendRoot = (process.env.NEXT_PUBLIC_HTTP_SERVER || "").replace(/\/+$/, "");

// If no env is set, stick to relative "/api" (works with Next rewrites)
const baseURL = backendRoot ? `${backendRoot}/api` : "/api";

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Safety: if someone calls api with a URL that still starts with "/api/...",
// normalize it so we don't end up with "/api/api/...".
api.interceptors.request.use((config) => {
    if (config.url?.startsWith("/api/")) {
        config.url = config.url.replace(/^\/api/, "");
    }
    return config;
});

export default api;

// Optional convenience if you want the same constant everywhere:
export const USERS_API = "/users";
