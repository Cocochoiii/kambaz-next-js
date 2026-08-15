// Next.js settings.
// I turn off image optimization so my course images always load
// the same way on my computer and on the deployed site.
/** @type {import('next').NextConfig} */
const nextConfig = { images: { unoptimized: true } };
export default nextConfig;
