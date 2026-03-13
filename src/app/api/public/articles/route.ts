import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { PublicArticle, PublicArticlesResponse, SortOption } from '@/types/public'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50)
    const sort = (searchParams.get('sort') as SortOption) || 'recent'
    const platform = searchParams.get('platform')

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

    const { count, error: countError } = await countQuery

    if (countError) {
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }

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
        // Trending: weighted by stars + views, last 7 days
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
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: articles, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
    }

    // Transform the data to handle Supabase's array return for relationships
    const formattedArticles: PublicArticle[] = (articles || []).map((article: any) => {
      // Supabase returns relationships as arrays, take the first element
      const profile = Array.isArray(article.profiles)
        ? article.profiles[0]
        : article.profiles
      const project = Array.isArray(article.projects)
        ? article.projects[0]
        : article.projects

      return {
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
        profiles: profile || {
          username: 'unknown',
          display_name: null,
          avatar_url: null,
        },
        projects: project || null,
      }
    })

    const response: PublicArticlesResponse = {
      articles: formattedArticles,
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: offset + limit < (count || 0),
      },
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}