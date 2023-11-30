const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'media.licdn.com', // LinkedIn profile images
				pathname: '/dms/image/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com', // Google profile images
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com', // GitHub profile images
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'avatar-management--avatars.us-west-2.prod.public.atl-paas.net', // Bitbucket profile images
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'secure.gravatar.com', // Bitbucket profile images (additional)
				pathname: '/**'
			},
			{
				protocol: 'https',
				hostname: 'gitlab.com', // GitLab profile images
				pathname: '/uploads/-/system/user/avatar/**',
			}
		],
	},
	webpack: (config, { isServer }) => {
		config.resolve.fallback = {
			fs: false,
			net: false,
			dns: false,
			tls: false,
			'pg-native': false,
		};

		// Exclude pg-cloudflare from client-side bundles 
		if (!isServer) { config.externals.push('pg-cloudflare'); }
		return config;
	},
	async headers() {
		return [
			{
				// Apply these headers to all static assets
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" }, //TODO - narrow down this value
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
					},
				],
			}, {
				source: "/(.*)",
				headers: [{
					key: "Cache-Control",
					value: "max-age=86400, s-maxage=86400, stale-while-revalidate",
				},
				],
			},
		];
	},
	experimental: {
		mdxRs: true,
	},
};

const withMDX = require('@next/mdx')();

module.exports = withMDX(nextConfig)
