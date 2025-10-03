/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // proxy all frontend /api/* calls to the Express server on :4000
      { source: "/api/:path*", destination: "http://localhost:4000/api/:path*" },
    ];
  },
};

module.exports = nextConfig;
