// Public API Types

export interface PublicArticle {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  vibe_platform: string | null
  vibe_duration_minutes: number | null
  vibe_model: string | null
  stars_count: number
  views_count: number
  published_at: string
  profiles: {
    username: string
    display_name: string | null
    avatar_url: string | null
  }
  projects: {
    id: string
    name: string
    color: string | null
  } | null
}

export interface PublicProfile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  website_url: string | null
  github_username: string | null
  twitter_username: string | null
  created_at: string
  stats: {
    articles_count: number
    stars_received: number
  }
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

export interface PublicArticlesResponse {
  articles: PublicArticle[]
  pagination: PaginationInfo
}

export type SortOption = 'recent' | 'trending' | 'stars'

// Article Detail Types
export interface ArticleDetail {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  vibe_platform: string | null
  vibe_duration_minutes: number | null
  vibe_model: string | null
  vibe_prompt: string | null
  vibe_ai_response: string | null
  is_premium: boolean
  price: number | null
  stars_count: number
  views_count: number
  published_at: string
  profiles: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    bio: string | null
  }
  projects: {
    id: string
    name: string
    color: string | null
    description: string | null
  } | null
}

export interface StarState {
  isStarred: boolean
  starsCount: number
}

export interface RelatedArticle {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  vibe_platform: string | null
  vibe_duration_minutes: number | null
  stars_count: number
  views_count: number
  published_at: string
  profiles: {
    username: string
    display_name: string | null
    avatar_url: string | null
  }
}

// Profile Types
export interface ProfileWithArticles {
  profile: PublicProfile
  articles: PublicArticle[]
  pagination: PaginationInfo
}
