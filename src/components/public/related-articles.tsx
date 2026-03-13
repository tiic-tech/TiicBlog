import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Star, Eye } from 'lucide-react'
import type { RelatedArticle } from '@/types/public'

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">More from this author</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <RelatedArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}

function RelatedArticleCard({ article }: { article: RelatedArticle }) {
  const publishedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), {
        addSuffix: true,
        locale: zhCN,
      })
    : ''

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <h3 className="font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>{article.stars_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{article.views_count}</span>
          </div>
        </div>
        <span>{publishedDate}</span>
      </div>
    </Link>
  )
}