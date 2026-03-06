import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/cuenta/', '/checkout/', '/auth/'] },
    ],
    sitemap: 'https://titanesgraficos.com.ve/sitemap.xml',
  }
}
