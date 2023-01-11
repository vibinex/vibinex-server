const dotenv = require('dotenv');
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const env = {
	NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY: process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_WRITE_KEY,
	NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATA_PLANE_URL: process.env.NEXT_PUBLIC_RUDDERSTACK_CLIENT_DATAPLANE_URL,
	NEXT_PUBLIC_RUDDERSTACK_SERVER_WRITE_KEY: process.env.NEXT_PUBLIC_RUDDERSTACK_SERVER_WRITE_KEY,
	NEXT_PUBLIC_RUDDERSTACK_SERVER_DATA_PLANE_URL: process.env.NEXT_PUBLIC_RUDDERSTACK_SERVER_DATAPLANE_URL
}

module.exports = { nextConfig, env }
