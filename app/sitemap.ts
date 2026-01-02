import { getArticles } from '@/features/article/utils/getArticles'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: 'https://blog.okmkm.dev',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1.0,
    },
    {
      url: 'https://blog.okmkm.dev/articles',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://blog.okmkm.dev/zenn',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ]

  const posts = await getArticles();

  const artiblePages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://blog.okmkm.dev/articles/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...defaultPages, ...artiblePages];
}
