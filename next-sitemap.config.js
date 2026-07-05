/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.amplifyhopeafrica.org',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/*', '/admin/*'] },
    ],
    additionalSitemaps: [
      'https://www.amplifyhopeafrica.org/sitemap.xml',
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
