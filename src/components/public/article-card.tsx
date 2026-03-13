import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Clock, Star, Eye, FolderKanban } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { PublicArticle } from '@/types/public'

interface PublicArticleCardProps {
  article: PublicArticle
}

export function PublicArticleCard({ article }: PublicArticleCardProps) {
  const publishedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), {
        addSuffix: true,
        locale: zhCN,
      })
    : ''

  return (
    <Link href={`/article/${article.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 h-full">
        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5 p-4 pb-0">
          {article.vibe_platform && (
            <Badge variant="secondary" className="text-xs">
              {article.vibe_platform}
            </Badge>
          )}
          {article.vibe_duration_minutes && (
            <Badge variant="outline" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              {article.vibe_duration_minutes} min
            </Badge>
          )}
          {article.vibe_model && (
            <Badge variant="outline" className="text-xs">
              {article.vibe_model}
            </Badge>
          )}
        </div>

        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: article.projects?.color
                  ? `linear-gradient(135deg, ${article.projects.color}20, ${article.projects.color}40)`
                  : 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted-foreground)/10))',
              }}
            >
              <FolderKanban
                className="h-12 w-12 text-muted-foreground/30"
                style={{
                  color: article.projects?.color || undefined,
                }}
              />
            </div>
          )}
          {article.projects && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: article.projects.color || '#6366f1' }}
              />
              <span className="font-medium">{article.projects.name}</span>
            </div>
          )}
        </div>

        {/* Description Section */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {article.profiles.avatar_url && (
                <img
                  src={article.profiles.avatar_url}
                  alt={article.profiles.display_name || article.profiles.username}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="font-medium text-foreground">
                {article.profiles.display_name || article.profiles.username}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                <span>{article.stars_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{article.views_count}</span>
              </div>
              <span>{publishedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}