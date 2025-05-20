import { env } from '@/services/env.service';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/analysis', '/api/'],
        },
        sitemap: `${env.siteURL}/sitemap.xml`,
    };
}
