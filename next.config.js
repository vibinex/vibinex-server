const rawStrapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL?.trim();
const strapiHostname = (() => {
	if (!rawStrapiApiUrl) return null;
	try {
		return rawStrapiApiUrl.includes('://')
			? new URL(rawStrapiApiUrl).hostname
			: rawStrapiApiUrl;
	} catch {
		return null;
	}
})();

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
			},
			...(strapiHostname ? [{
				protocol: 'https',
				hostname: strapiHostname, // Blog server
				pathname: '/**',
			}] : []),
			{
				protocol: 'https',
				hostname: 'github.com', // GitHub README images
				pathname: '/vibinex/.github/assets/**'
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
				// Auth API routes: full CORS + never cache (sessions must always be fresh)
				// Access-Control-Allow-Origin must be explicit (not *) when credentials are true
				source: "/api/auth/:path*",
				headers: [
					{ key: "Access-Control-Allow-Origin", value: "https://vibinex.com" },
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
					},
					{ key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
				],
			},
			{
				// Other API routes: CORS headers + no cache (API responses are user-specific)
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
					},
					{ key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
				],
			},
			{
				// Auth-gated pages: never cache (login state must be checked fresh every request)
				source: "/u",
				headers: [
					{ key: "Cache-Control", value: "private, no-store, no-cache, must-revalidate" },
				],
			},
			{
				// Public pages and static assets: cache aggressively at CDN
				// Use explicit exclusions rather than negative lookahead on single chars
				// to avoid accidentally excluding future routes like /users, /updates, etc.
				source: "/((?!api/)(?!u$).*)",
				headers: [{
					key: "Cache-Control",
					value: "public, max-age=86400, s-maxage=86400, stale-while-revalidate",
				}],
			},
		];
	},
	experimental: {
		mdxRs: true,
	},
};

const withMDX = require('@next/mdx')();

module.exports = withMDX(nextConfig);
