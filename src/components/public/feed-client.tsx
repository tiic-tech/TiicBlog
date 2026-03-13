'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PublicArticleCard } from './article-card'
import { FeedSkeleton } from './feed-skeleton'
import { Button } from '@/components/ui/button'
import type { PublicArticle, SortOption } from '@/types/public'

interface FeedClientProps {
  initialArticles: PublicArticle[]
  initialPage: number
  initialSort: SortOption
  initialPlatform: string | null
  initialHasMore: boolean
  initialTotal: number
}

export function FeedClient({
  initialArticles,
  initialPage,
  initialSort,
  initialPlatform,
  initialHasMore,
  initialTotal,
}: FeedClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<PublicArticle[]>(initialArticles)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sort = (searchParams.get('sort') as SortOption) || 'recent'
  const platform = searchParams.get('platform')

  // Reset when filters change
  useEffect(() => {
    setArticles(initialArticles)
    setPage(initialPage)
    setHasMore(initialHasMore)
  }, [initialArticles, initialPage, initialHasMore])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const nextPage = page + 1
      const params = new URLSearchParams()
      params.set('page', String(nextPage))
      params.set('limit', '12')
      if (sort !== 'recent') params.set('sort', sort)
      if (platform) params.set('platform', platform)

      const response = await fetch(`/api/public/articles?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load articles')
      }

      setArticles((prev) => [...prev, ...data.articles])
      setPage(nextPage)
      setHasMore(data.pagination.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more articles')
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, sort, platform])

  if (articles.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No articles found</p>
          <p className="text-sm mt-2">
            {platform
              ? `No articles found for platform "${platform}"`
              : 'Be the first to share your vibe coding journey!'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Article Count */}
      <p className="text-sm text-muted-foreground">
        {initialTotal} article{initialTotal !== 1 ? 's' : ''} found
      </p>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <PublicArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-4 text-destructive">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={loadMore}>
            Try Again
          </Button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}