import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'defdpaewkfkpvdzyhvsr.supabase.co',
      'gamerplug-gameplay-videos.s3.us-east-2.amazonaws.com',
      'd11fcxbq4rxmpu.cloudfront.net'
    ],
    remotePatterns: [
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
