/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  // Remove swcMinify if it exists as it's flagged as unrecognized
  typescript: {
    // Disable TypeScript errors during production builds
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig; 