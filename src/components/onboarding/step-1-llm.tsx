'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const LLM_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'google', name: 'Google AI', placeholder: 'AIza...' },
  { id: 'deepseek', name: 'DeepSeek', placeholder: 'sk-...' },
  { id: 'other', name: 'Other', placeholder: 'Enter your API key' },
] as const

interface Step1Props {
  onNext: () => void
  onSkip: () => void
}

export function Step1LLM({ onNext, onSkip }: Step1Props) {
  const [provider, setProvider] = useState<string>('openai')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Use secure API route for encrypted storage
      const response = await fetch('/api/user/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          llmProvider: provider,
          llmModel: model || null,
          llmApiKey: apiKey || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save')
        return
      }

      onNext()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Configure Your LLM</CardTitle>
        <CardDescription>
          Choose your preferred LLM provider and enter your API key. This will be stored securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>LLM Provider</Label>
            <div className="grid grid-cols-2 gap-2">
              {LLM_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                    provider === p.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder={LLM_PROVIDERS.find((p) => p.id === provider)?.placeholder}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored securely and never shared.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Default Model (Optional)</Label>
            <Input
              id="model"
              type="text"
              placeholder="e.g., gpt-4o, claude-3-5-sonnet"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          {error && (
            <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onSkip} disabled={loading}>
              Skip
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
