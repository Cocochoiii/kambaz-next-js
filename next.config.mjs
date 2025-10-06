// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
    async rewrites() {
        return [
            // proxy all frontend /api/* calls to the Express server on :4000
            { source: "/api/:path*", destination: "http://127.0.0.1:4000/api/:path*" },
        ];
    },
};

export default nextConfig;
