import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nuopwfehaekxrrmzfqyv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'defdpaewkfkpvdzyhvsr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'gamerplug-gameplay-videos.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/users/**',
      },
      {
        protocol: 'https',
        hostname: 'd11fcxbq4rxmpu.cloudfront.net',
      }
    ]
  }
};

export default nextConfig;
