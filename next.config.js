/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true
    },
    async rewrites() {
        // Only use rewrites in development
        if (process.env.NODE_ENV !== 'production') {
            return [
                {
                    source: '/api/:path*',
                    destination: 'http://localhost:4000/api/:path*',
                },
            ];
        }
        return [];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;