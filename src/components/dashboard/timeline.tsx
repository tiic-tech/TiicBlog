'use client'

import { useMemo } from 'react'
import { format, isToday, isYesterday, isThisWeek, isThisMonth, parseISO } from 'date-fns'
import { TimelineItem } from './timeline-item'
import { FolderKanban, FileText } from 'lucide-react'

interface Project {
  id: string
  name: string
  color: string | null
  description: string | null
  created_at: string
}

interface Article {
  id: string
  title: string
  status: string
  created_at: string
  project_id: string | null
}

interface TimelineProps {
  projects: Project[]
  articles: Article[]
  onDeleteProject?: (id: string) => void
  onDeleteArticle?: (id: string) => void
}

function getDateLabel(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  if (isThisWeek(date)) return format(date, 'EEEE')
  if (isThisMonth(date)) return format(date, 'MMMM d')
  return format(date, 'MMMM d, yyyy')
}

function getDateKey(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy-MM-dd')
}

export function Timeline({ projects, articles, onDeleteProject, onDeleteArticle }: TimelineProps) {
  // Group by date
  const { timelineGroups, articlesByProject } = useMemo(() => {
    const groups: Record<string, { projects: Project[]; articles: Article[] }> = {}
    const byProject: Record<string, Article[]> = {}

    // Group articles by project
    articles.forEach((article) => {
      if (article.project_id) {
        if (!byProject[article.project_id]) {
          byProject[article.project_id] = []
        }
        byProject[article.project_id].push(article)
      }
    })

    // Group projects by date
    projects.forEach((project) => {
      const key = getDateKey(project.created_at)
      if (!groups[key]) {
        groups[key] = { projects: [], articles: [] }
      }
      groups[key].projects.push(project)
    })

    // Group standalone articles by date
    articles.forEach((article) => {
      if (!article.project_id) {
        const key = getDateKey(article.created_at)
        if (!groups[key]) {
          groups[key] = { projects: [], articles: [] }
        }
        groups[key].articles.push(article)
      }
    })

    // Sort by date (newest first) and add labels
    const sortedGroups = Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, data]) => ({
        date,
        label: getDateLabel(date),
        ...data,
      }))

    return { timelineGroups: sortedGroups, articlesByProject: byProject }
  }, [projects, articles])

  if (projects.length === 0 && articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center gap-4 mb-4">
          <FolderKanban className="h-12 w-12 text-muted-foreground" />
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No activity yet</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Create a project or write an article to see your timeline.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {timelineGroups.map((group) => (
        <TimelineItem
          key={group.date}
          group={group}
          articlesByProject={articlesByProject}
          onDeleteProject={onDeleteProject}
          onDeleteArticle={onDeleteArticle}
        />
      ))}
    </div>
  )
}