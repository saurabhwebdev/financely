import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipgpyilwkenedrubsuen.supabase.co'], // Add your Supabase domain
    unoptimized: process.env.NODE_ENV !== 'production', // For static exports in dev
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console logs in production
  },
  poweredByHeader: false, // Security: don't reveal technology stack
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
