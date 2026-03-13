import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ArticleList } from '@/components/articles/article-list'

export default async function ArticlesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: articles } = await supabase
    .from('articles')
    .select('*, projects(id, name, color)')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-muted-foreground">Write and manage your vibe coding articles</p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      <ArticleList articles={articles || []} />
    </div>
  )
}