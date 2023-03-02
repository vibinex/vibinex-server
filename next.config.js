const dotenv = require('dotenv');
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/dms/image/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      dns: false,
      tls: false,
      'pg-native': false,
    };

    return config;
  },
}

const env = {
	NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY: process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY,
	NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATA_PLANE_URL: process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATAPLANE_URL,
}

module.exports = { nextConfig, env }
