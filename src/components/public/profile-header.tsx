import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { FileText, Star, Calendar, ExternalLink, Github, Twitter } from 'lucide-react'
import type { PublicProfile } from '@/types/public'

interface ProfileHeaderProps {
  profile: PublicProfile
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const displayName = profile.display_name || profile.username
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formattedDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : ''

  return (
    <div className="space-y-6">
      {/* Avatar and name */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>

          {profile.bio && (
            <p className="mt-2 max-w-lg">{profile.bio}</p>
          )}

          {/* Social links */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            )}
            {profile.github_username && (
              <a
                href={`https://github.com/${profile.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
              >
                <Github className="h-4 w-4" />
                {profile.github_username}
              </a>
            )}
            {profile.twitter_username && (
              <a
                href={`https://twitter.com/${profile.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
              >
                <Twitter className="h-4 w-4" />
                @{profile.twitter_username}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center justify-center gap-6 border-t border-b py-4 sm:justify-start">
        <div className="flex items-center gap-2">
          <FileText className="text-muted-foreground h-5 w-5" />
          <div>
            <div className="font-semibold">
              {profile.stats.articles_count.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">Articles</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="text-muted-foreground h-5 w-5" />
          <div>
            <div className="font-semibold">
              {profile.stats.stars_received.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">Stars</div>
          </div>
        </div>
        {formattedDate && (
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-5 w-5" />
            <div>
              <div className="text-sm">Joined {formattedDate}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}