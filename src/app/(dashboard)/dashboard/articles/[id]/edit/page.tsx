import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArticleForm } from '@/components/articles/article-form'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <p className="text-muted-foreground">Update your article</p>
      </div>

      <ArticleForm article={article} />
    </div>
  )
}