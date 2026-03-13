import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Clock, Cpu, Zap, Calendar, Eye, Star, Folder } from 'lucide-react'
import type { ArticleDetail } from '@/types/public'

interface ArticleHeaderProps {
  article: ArticleDetail
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const { profiles, projects, published_at, vibe_platform, vibe_duration_minutes, vibe_model, views_count, stars_count } = article

  const authorName = profiles.display_name || profiles.username
  const authorInitials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formattedDate = published_at
    ? new Date(published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <header className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {article.title}
      </h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {article.excerpt}
        </p>
      )}

      {/* Meta badges */}
      <div className="flex flex-wrap items-center gap-2">
        {vibe_platform && (
          <Badge variant="secondary" className="gap-1">
            <Zap className="h-3 w-3" />
            {vibe_platform}
          </Badge>
        )}
        {vibe_duration_minutes && (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(vibe_duration_minutes)}
          </Badge>
        )}
        {vibe_model && (
          <Badge variant="outline" className="gap-1">
            <Cpu className="h-3 w-3" />
            {vibe_model}
          </Badge>
        )}
      </div>

      {/* Author and stats row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b py-4">
        {/* Author */}
        <Link
          href={`/@${profiles.username}`}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={profiles.avatar_url || undefined} alt={authorName} />
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{authorName}</div>
            <div className="text-muted-foreground text-sm">@{profiles.username}</div>
          </div>
        </Link>

        {/* Stats and date */}
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          {formattedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{stars_count.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Project badge */}
      {projects && (
        <div className="flex items-center gap-2">
          <Folder className="text-muted-foreground h-4 w-4" />
          <Link
            href={`/dashboard/projects/${projects.id}`}
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: projects.color || undefined }}
          >
            {projects.name}
          </Link>
        </div>
      )}
    </header>
  )
}