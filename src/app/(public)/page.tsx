import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { FeedFilters } from '@/components/public/feed-filters'
import { FeedClient } from '@/components/public/feed-client'
import { FeedSkeleton } from '@/components/public/feed-skeleton'
import type { PublicArticle, SortOption, PublicArticlesResponse } from '@/types/public'

interface FeedPageProps {
  searchParams: Promise<{
    page?: string
    sort?: string
    platform?: string
  }>
}

async function getArticles(
  page: number,
  sort: SortOption,
  platform: string | null
): Promise<PublicArticlesResponse> {
  const supabase = await createClient()

  // Build base query for count
  let countQuery = supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('visibility', 'public')

  if (platform) {
    countQuery = countQuery.eq('vibe_platform', platform)
  }

  const { count } = await countQuery

  // Build main query
  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_image,
      vibe_platform,
      vibe_duration_minutes,
      vibe_model,
      stars_count,
      views_count,
      published_at,
      profiles!articles_user_id_fkey (
        username,
        display_name,
        avatar_url
      ),
      projects!articles_project_id_fkey (
        id,
        name,
        color
      )
    `)
    .eq('status', 'published')
    .eq('visibility', 'public')

  if (platform) {
    query = query.eq('vibe_platform', platform)
  }

  // Apply sorting
  switch (sort) {
    case 'trending':
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      query = query
        .gte('published_at', sevenDaysAgo.toISOString())
        .order('stars_count', { ascending: false })
        .order('views_count', { ascending: false })
        .order('published_at', { ascending: false })
      break
    case 'stars':
      query = query
        .order('stars_count', { ascending: false })
        .order('published_at', { ascending: false })
      break
    case 'recent':
    default:
      query = query.order('published_at', { ascending: false })
      break
  }

  // Apply pagination
  const limit = 12
  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data: articles } = await query

  return {
    articles: (articles || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      cover_image: article.cover_image,
      vibe_platform: article.vibe_platform,
      vibe_duration_minutes: article.vibe_duration_minutes,
      vibe_model: article.vibe_model,
      stars_count: article.stars_count,
      views_count: article.views_count,
      published_at: article.published_at || '',
      profiles: article.profiles || {
        username: 'unknown',
        display_name: null,
        avatar_url: null,
      },
      projects: article.projects,
    })),
    pagination: {
      page,
      limit,
      total: count || 0,
      hasMore: offset + limit < (count || 0),
    },
  }
}

async function getPlatforms(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('vibe_platform')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .not('vibe_platform', 'is', null)

  const platforms = new Set<string>()
  data?.forEach((article) => {
    if (article.vibe_platform) {
      platforms.add(article.vibe_platform)
    }
  })

  return Array.from(platforms).sort()
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const sort = (params.sort as SortOption) || 'recent'
  const platform = params.platform || null

  const [articlesData, platforms] = await Promise.all([
    getArticles(page, sort, platform),
    getPlatforms(),
  ])

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Discover Vibe Coding Journeys
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore how developers build with AI. Learn from their experiences,
          prompts, and the tools they use to ship faster.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FeedFilters
          platforms={platforms}
          selectedPlatform={platform}
          selectedSort={sort}
        />
      </div>

      {/* Feed */}
      <Suspense fallback={<FeedSkeleton />}>
        <FeedClient
          initialArticles={articlesData.articles}
          initialPage={page}
          initialSort={sort}
          initialPlatform={platform}
          initialHasMore={articlesData.pagination.hasMore}
          initialTotal={articlesData.pagination.total}
        />
      </Suspense>
    </div>
  )
}