const isProd = process.env.NODE_ENV === "production";
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
    async rewrites() {
        if (!isProd) {
            return [{ source: "/api/:path*", destination: "http://127.0.0.1:4000/api/:path*" }];
        }
        return [];
    },
};
export default nextConfig;
