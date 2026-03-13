import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProfileHeader from '@/components/public/profile-header'
import ProfileArticles from '@/components/public/profile-articles'
import type { PublicProfile, PublicArticle, PaginationInfo } from '@/types/public'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Generate SEO metadata
export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/public/users/${username}`
    )

    if (!response.ok) {
      return { title: 'User Not Found' }
    }

    const { profile } = await response.json()
    const displayName = profile.display_name || profile.username

    return {
      title: `${displayName} (@${profile.username})`,
      description: profile.bio || `Articles by ${displayName} on Viblog`,
      openGraph: {
        title: `${displayName} (@${profile.username})`,
        description: profile.bio || `Articles by ${displayName} on Viblog`,
        type: 'profile',
        images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
      },
      twitter: {
        card: 'summary',
        title: `${displayName} (@${profile.username})`,
        description: profile.bio || `Articles by ${displayName} on Viblog`,
        images: profile.avatar_url ? [profile.avatar_url] : [],
      },
    }
  } catch {
    return { title: 'Profile' }
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  let profile: PublicProfile
  let articles: PublicArticle[]
  let pagination: PaginationInfo

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/public/users/${username}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      notFound()
    }

    const data = await response.json()
    profile = data.profile
    articles = data.articles
    pagination = data.pagination
  } catch {
    notFound()
  }

  return (
    <div className="container py-8">
      <ProfileHeader profile={profile} />
      <div className="mt-8">
        <ProfileArticles
          initialArticles={articles}
          initialPagination={pagination}
          username={profile.username}
        />
      </div>
    </div>
  )
}