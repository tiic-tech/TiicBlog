'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, TrendingUp, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortOption } from '@/types/public'

interface FeedFiltersProps {
  platforms: string[]
  selectedPlatform: string | null
  selectedSort: SortOption
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'recent', label: 'Latest', icon: <Clock className="h-4 w-4" /> },
  { value: 'trending', label: 'Trending', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'stars', label: 'Most Starred', icon: <Star className="h-4 w-4" /> },
]

export function FeedFilters({
  platforms,
  selectedPlatform,
  selectedSort,
}: FeedFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (platform: string | null, sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())

    if (platform) {
      params.set('platform', platform)
    } else {
      params.delete('platform')
    }

    if (sort !== 'recent') {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }

    params.delete('page')

    const queryString = params.toString()
    router.push(queryString ? `/?${queryString}` : '/')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Platform Filter */}
        {platforms.length > 0 && (
          <Select
            value={selectedPlatform || 'all'}
            onValueChange={(value) =>
              updateFilters(value === 'all' ? null : value, selectedSort)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Sort Options */}
        <div className="flex items-center border rounded-md overflow-hidden">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedSort === option.value ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none h-9 gap-1.5"
              onClick={() => updateFilters(selectedPlatform, option.value)}
            >
              {option.icon}
              <span className="hidden sm:inline">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}