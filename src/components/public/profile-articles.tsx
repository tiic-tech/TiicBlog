'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PublicArticleCard } from './article-card'
import type { PublicArticle, PaginationInfo } from '@/types/public'

interface ProfileArticlesProps {
  initialArticles: PublicArticle[]
  initialPagination: PaginationInfo
  username: string
}

export default function ProfileArticles({
  initialArticles,
  initialPagination,
  username,
}: ProfileArticlesProps) {
  const [articles, setArticles] = useState<PublicArticle[]>(initialArticles)
  const [pagination, setPagination] = useState<PaginationInfo>(initialPagination)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = async () => {
    if (isLoading || !pagination.hasMore) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/public/users/${username}?page=${pagination.page + 1}&limit=${pagination.limit}`
      )

      if (response.ok) {
        const data = await response.json()
        setArticles((prev) => [...prev, ...data.articles])
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to load more articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (articles.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        No articles published yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <PublicArticleCard key={article.id} article={article} />
        ))}
      </div>

      {pagination.hasMore && (
        <div className="flex justify-center pt-4">
          <Button onClick={loadMore} disabled={isLoading} variant="outline">
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}