import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Only use local rewrites if NEXT_PUBLIC_API_URL is NOT set
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
