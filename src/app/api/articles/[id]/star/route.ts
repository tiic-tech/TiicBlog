import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if already starred
    const { data: existingStar } = await supabase
      .from('stars')
      .select('id')
      .eq('article_id', id)
      .eq('user_id', user.id)
      .single()

    if (existingStar) {
      // Unstar: remove the star
      const { error: deleteError } = await supabase
        .from('stars')
        .delete()
        .eq('id', existingStar.id)

      if (deleteError) {
        return NextResponse.json({ error: 'Failed to unstar' }, { status: 500 })
      }

      // Decrement stars_count
      const { data: article } = await supabase
        .from('articles')
        .select('stars_count')
        .eq('id', id)
        .single()

      if (article) {
        await supabase
          .from('articles')
          .update({ stars_count: Math.max(0, (article.stars_count || 0) - 1) })
          .eq('id', id)
      }

      return NextResponse.json({
        isStarred: false,
        starsCount: Math.max(0, (article?.stars_count || 0) - 1),
      })
    } else {
      // Star: add the star
      const { error: insertError } = await supabase.from('stars').insert({
        article_id: id,
        user_id: user.id,
      })

      if (insertError) {
        return NextResponse.json({ error: 'Failed to star' }, { status: 500 })
      }

      // Increment stars_count
      const { data: article } = await supabase
        .from('articles')
        .select('stars_count')
        .eq('id', id)
        .single()

      if (article) {
        await supabase
          .from('articles')
          .update({ stars_count: (article.stars_count || 0) + 1 })
          .eq('id', id)
      }

      return NextResponse.json({
        isStarred: true,
        starsCount: (article?.stars_count || 0) + 1,
      })
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get stars count
    const { data: article } = await supabase
      .from('articles')
      .select('stars_count')
      .eq('id', id)
      .single()

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Check if user has starred
    let isStarred = false
    if (user) {
      const { data: star } = await supabase
        .from('stars')
        .select('id')
        .eq('article_id', id)
        .eq('user_id', user.id)
        .single()

      isStarred = !!star
    }

    return NextResponse.json({
      isStarred,
      starsCount: article.stars_count || 0,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}