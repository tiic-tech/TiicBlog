'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'
import { ChevronDown, ChevronRight, FolderKanban, FileText, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

interface TimelineGroup {
  date: string
  label: string
  projects: Project[]
  articles: Article[]
}

interface TimelineItemProps {
  group: TimelineGroup
  articlesByProject: Record<string, Article[]>
  onDeleteProject?: (id: string) => void
  onDeleteArticle?: (id: string) => void
}

export function TimelineItem({ group, articlesByProject, onDeleteProject, onDeleteArticle }: TimelineItemProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  return (
    <div className="relative">
      {/* Date marker */}
      <div className="sticky top-0 z-10 bg-background py-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm font-medium text-muted-foreground">{group.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="ml-4 border-l pl-6 space-y-4 py-2">
        {/* Projects */}
        {group.projects.map((project) => {
          const projectArticles = articlesByProject[project.id] || []
          const isExpanded = expandedProjects.has(project.id)

          return (
            <div key={project.id} className="group relative">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <button
                  onClick={() => toggleProject(project.id)}
                  className="flex items-center gap-2 flex-1"
                >
                  {projectArticles.length > 0 ? (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )
                  ) : (
                    <div className="w-4" />
                  )}
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color || '#6366f1' }}
                  />
                  <span className="font-medium">{project.name}</span>
                  {projectArticles.length > 0 && (
                    <span className="text-xs text-muted-foreground">({projectArticles.length} articles)</span>
                  )}
                </button>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <Link href={`/dashboard/projects/${project.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => onDeleteProject?.(project.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Nested articles */}
              {isExpanded && projectArticles.length > 0 && (
                <div className="ml-6 mt-1 space-y-1">
                  {projectArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group/article"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={`/dashboard/articles/${article.id}/edit`}
                        className="flex-1 text-sm hover:underline"
                      >
                        {article.title}
                      </Link>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        article.status === 'published' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {article.status}
                      </span>
                      <div className="opacity-0 group-hover/article:opacity-100 flex gap-1">
                        <Link href={`/dashboard/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => onDeleteArticle?.(article.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Standalone articles (no project) */}
        {group.articles
          .filter((a) => !a.project_id)
          .map((article) => (
            <div
              key={article.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group/article"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Link
                href={`/dashboard/articles/${article.id}/edit`}
                className="flex-1 text-sm hover:underline"
              >
                {article.title}
              </Link>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                article.status === 'published' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'
              }`}>
                {article.status}
              </span>
              <div className="opacity-0 group-hover/article:opacity-100 flex gap-1">
                <Link href={`/dashboard/articles/${article.id}/edit`}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => onDeleteArticle?.(article.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}