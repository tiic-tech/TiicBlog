import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { Timeline } from '@/components/dashboard/timeline'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user's projects count
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  // Fetch user's articles count
  const { count: articlesCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  // Fetch projects for timeline
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, color, description, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  // Fetch articles for timeline
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, status, created_at, project_id')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here is your vibe coding journey.</p>
      </div>

      <DashboardStats projectsCount={projectsCount || 0} articlesCount={articlesCount || 0} />

      <div>
        <h2 className="mb-4 text-xl font-semibold">Timeline</h2>
        <Timeline projects={projects || []} articles={articles || []} />
      </div>
    </div>
  )
}
