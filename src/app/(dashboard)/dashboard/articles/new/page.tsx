import { ArticleForm } from '@/components/articles/article-form'

export default async function NewArticlePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Article</h1>
        <p className="text-muted-foreground">Write about your vibe coding experience</p>
      </div>

      <ArticleForm />
    </div>
  )
}