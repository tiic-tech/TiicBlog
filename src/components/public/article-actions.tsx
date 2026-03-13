'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star, Share2, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { StarState } from '@/types/public'

interface ArticleActionsProps {
  articleId: string
  initialStarsCount: number
}

export default function ArticleActions({
  articleId,
  initialStarsCount,
}: ArticleActionsProps) {
  const [starState, setStarState] = useState<StarState>({
    isStarred: false,
    starsCount: initialStarsCount,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSharing, setIsSharing] = useState(false)

  // Fetch initial star state
  useEffect(() => {
    async function fetchStarState() {
      try {
        const response = await fetch(`/api/articles/${articleId}/star`)
        if (response.ok) {
          const data = await response.json()
          setStarState(data)
        }
      } catch (error) {
        console.error('Failed to fetch star state:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStarState()
  }, [articleId])

  const handleStar = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${articleId}/star`, {
        method: 'POST',
      })

      if (response.status === 401) {
        toast.error('Please sign in to star articles')
        return
      }

      if (response.ok) {
        const data = await response.json()
        setStarState(data)
        toast.success(data.isStarred ? 'Article starred!' : 'Star removed')
      } else {
        toast.error('Failed to update star')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const url = window.location.href
      const title = document.title

      if (navigator.share) {
        await navigator.share({
          title,
          url,
        })
        toast.success('Shared!')
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== 'AbortError') {
        toast.error('Failed to share')
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={starState.isStarred ? 'default' : 'outline'}
        size="sm"
        onClick={handleStar}
        disabled={isLoading}
        className="gap-2"
      >
        <Star
          className={`h-4 w-4 ${starState.isStarred ? 'fill-current' : ''}`}
        />
        <span>{starState.starsCount.toLocaleString()}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={isSharing}
        className="gap-2"
      >
        {isSharing ? (
          <Check className="h-4 w-4" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        <span>Share</span>
      </Button>
    </div>
  )
}