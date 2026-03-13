import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PublishModal } from '@/components/articles/publish-modal'

interface PublishArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function PublishArticlePage({ params }: PublishArticlePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: article } = await supabase
    .from('articles')
    .select('id, title, status')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!article) {
    notFound()
  }

  if (article.status === 'published') {
    // Already published, redirect to edit
    notFound()
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Publish Article</h1>
        <p className="text-muted-foreground">Choose visibility and pricing options</p>
      </div>

      <PublishModal articleId={article.id} articleTitle={article.title} />
    </div>
  )
}