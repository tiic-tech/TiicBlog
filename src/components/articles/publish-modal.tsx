'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Lock, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface PublishModalProps {
  articleId: string
  articleTitle: string
}

const visibilityOptions = [
  { value: 'public', label: 'Public', icon: Globe, description: 'Visible to everyone' },
  { value: 'private', label: 'Private', icon: Lock, description: 'Only visible to you' },
  { value: 'unlisted', label: 'Unlisted', icon: EyeOff, description: 'Accessible via link only' },
]

export function PublishModal({ articleId, articleTitle }: PublishModalProps) {
  const router = useRouter()
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public')
  const [price, setPrice] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePublish = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/articles/${articleId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibility,
          price: price ? parseFloat(price) : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to publish')
      }

      router.push('/dashboard/articles')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Publish Article</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Publishing: <strong>{articleTitle}</strong>
          </p>
        </div>

        <div className="space-y-3">
          <Label>Visibility</Label>
          <div className="grid gap-2">
            {visibilityOptions.map((option) => {
              const Icon = option.icon
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    visibility === option.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={visibility === option.value}
                    onChange={() => setVisibility(option.value as typeof visibility)}
                    className="sr-only"
                  />
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {visibility === 'public' && (
          <div className="space-y-2">
            <Label htmlFor="price">Price (optional, leave empty for free)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
            <p className="text-xs text-muted-foreground">Set a price for paid articles (payment integration coming soon)</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}