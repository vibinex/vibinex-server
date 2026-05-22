/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://vibinex.com',
  generateRobotsTxt: true,
  // Exclude private/auth/app routes from sitemap
  exclude: [
    '/auth/*',
    '/api/*',
    '/settings',
    '/repo',
    '/u',
    '/chartDemo',
    '/demo',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/settings',
          '/repo',
          '/u',
          '/chartDemo',
          '/demo',
        ],
      },
    ],
    additionalSitemaps: [
      'https://vibinex.com/sitemap.xml',
    ],
  },
};
