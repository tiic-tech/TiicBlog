import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { ArticleDetail, RelatedArticle } from '@/types/public'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch the article
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        vibe_platform,
        vibe_duration_minutes,
        vibe_model,
        vibe_prompt,
        vibe_ai_response,
        is_premium,
        price,
        stars_count,
        views_count,
        published_at,
        user_id,
        profiles!articles_user_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          bio
        ),
        projects!articles_project_id_fkey (
          id,
          name,
          color,
          description
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('visibility', 'public')
      .single()

    if (error || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Increment views count
    await supabase
      .from('articles')
      .update({ views_count: (article.views_count || 0) + 1 })
      .eq('id', article.id)

    // Handle Supabase's array return for relationships
    const profile = Array.isArray(article.profiles)
      ? article.profiles[0]
      : article.profiles
    const project = Array.isArray(article.projects)
      ? article.projects[0]
      : article.projects

    const articleDetail: ArticleDetail = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      cover_image: article.cover_image,
      vibe_platform: article.vibe_platform,
      vibe_duration_minutes: article.vibe_duration_minutes,
      vibe_model: article.vibe_model,
      vibe_prompt: article.vibe_prompt,
      vibe_ai_response: article.vibe_ai_response,
      is_premium: article.is_premium,
      price: article.price,
      stars_count: article.stars_count,
      views_count: (article.views_count || 0) + 1, // Return incremented count
      published_at: article.published_at || '',
      profiles: profile || {
        id: '',
        username: 'unknown',
        display_name: null,
        avatar_url: null,
        bio: null,
      },
      projects: project || null,
    }

    // Fetch related articles (same author, excluding current)
    const { data: relatedData } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image,
        vibe_platform,
        vibe_duration_minutes,
        stars_count,
        views_count,
        published_at,
        profiles!articles_user_id_fkey (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('user_id', article.user_id)
      .eq('status', 'published')
      .eq('visibility', 'public')
      .neq('id', article.id)
      .order('published_at', { ascending: false })
      .limit(3)

    const relatedArticles: RelatedArticle[] = (relatedData || []).map(
      (item: any) => {
        const relatedProfile = Array.isArray(item.profiles)
          ? item.profiles[0]
          : item.profiles
        return {
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          cover_image: item.cover_image,
          vibe_platform: item.vibe_platform,
          vibe_duration_minutes: item.vibe_duration_minutes,
          stars_count: item.stars_count,
          views_count: item.views_count,
          published_at: item.published_at || '',
          profiles: relatedProfile || {
            username: 'unknown',
            display_name: null,
            avatar_url: null,
          },
        }
      }
    )

    return NextResponse.json({
      article: articleDetail,
      related: relatedArticles,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}