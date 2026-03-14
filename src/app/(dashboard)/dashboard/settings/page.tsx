'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'

const LLM_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'google', name: 'Google AI', placeholder: 'AIza...' },
  { id: 'deepseek', name: 'DeepSeek', placeholder: 'sk-...' },
  { id: 'other', name: 'Other', placeholder: 'Enter your API key' },
] as const

const DATABASE_TYPES = [
  { id: 'supabase', name: 'Supabase' },
  { id: 'clickhouse', name: 'ClickHouse' },
  { id: 'sqlite', name: 'SQLite' },
] as const

interface ApiKeysData {
  llm: {
    provider: string | null
    model: string | null
    hasApiKey: boolean
    maskedKey: string | null
  }
  database: {
    type: string | null
    hasConnectionString: boolean
  }
}

export default function SettingsPage() {
  const [data, setData] = useState<ApiKeysData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [llmProvider, setLlmProvider] = useState('openai')
  const [llmApiKey, setLlmApiKey] = useState('')
  const [llmModel, setLlmModel] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [dbType, setDbType] = useState('supabase')
  const [dbUrl, setDbUrl] = useState('')
  const [showDbUrl, setShowDbUrl] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/api-keys')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const result = await response.json()
      setData(result)
      setLlmProvider(result.llm?.provider || 'openai')
      setLlmModel(result.llm?.model || '')
      setDbType(result.database?.type || 'supabase')
    } catch {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveLlm = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          llmProvider,
          llmModel: llmModel || null,
          llmApiKey: llmApiKey || undefined,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to save')
      }

      setSuccess('LLM settings saved successfully')
      setLlmApiKey('')
      fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDatabase = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseType: dbType,
          databaseUrl: dbUrl || undefined,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to save')
      }

      setSuccess('Database settings saved successfully')
      setDbUrl('')
      fetchSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLlm = async () => {
    if (!confirm('Are you sure you want to delete your LLM API key?')) return

    try {
      const response = await fetch('/api/user/api-keys?type=llm', { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      setSuccess('LLM API key deleted')
      fetchSettings()
    } catch {
      setError('Failed to delete API key')
    }
  }

  const handleDeleteDatabase = async () => {
    if (!confirm('Are you sure you want to delete your database connection?')) return

    try {
      const response = await fetch('/api/user/api-keys?type=database', { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      setSuccess('Database connection deleted')
      fetchSettings()
    } catch {
      setError('Failed to delete database connection')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* LLM Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>LLM Configuration</CardTitle>
          <CardDescription>
            Configure your preferred LLM provider and API key for AI-powered features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.llm?.hasApiKey && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Current API Key:</p>
              <p className="font-mono text-sm">{data.llm.maskedKey}</p>
              <p className="text-sm text-muted-foreground">
                Provider: {LLM_PROVIDERS.find(p => p.id === data.llm?.provider)?.name || data.llm?.provider}
                {data.llm.model && ` (${data.llm.model})`}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>LLM Provider</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LLM_PROVIDERS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setLlmProvider(p.id)}
                  className={`rounded-lg border p-2 text-left text-sm transition-colors ${
                    llmProvider === p.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">
              {data?.llm?.hasApiKey ? 'Update API Key (leave empty to keep current)' : 'API Key'}
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder={LLM_PROVIDERS.find(p => p.id === llmProvider)?.placeholder}
                value={llmApiKey}
                onChange={e => setLlmApiKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Default Model (Optional)</Label>
            <Input
              id="model"
              type="text"
              placeholder="e.g., gpt-4o, claude-3-5-sonnet"
              value={llmModel}
              onChange={e => setLlmModel(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveLlm} disabled={saving}>
              {saving ? 'Saving...' : 'Save LLM Settings'}
            </Button>
            {data?.llm?.hasApiKey && (
              <Button variant="destructive" onClick={handleDeleteLlm} disabled={saving}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Key
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Database Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Database Configuration</CardTitle>
          <CardDescription>
            Configure an external database for advanced features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.database?.hasConnectionString && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Database connected</p>
              <p className="text-sm">
                Type: {DATABASE_TYPES.find(d => d.id === data.database?.type)?.name || data.database?.type}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Database Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {DATABASE_TYPES.map(db => (
                <button
                  key={db.id}
                  type="button"
                  onClick={() => setDbType(db.id)}
                  className={`rounded-lg border p-2 text-sm transition-colors ${
                    dbType === db.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {db.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbUrl">
              {data?.database?.hasConnectionString ? 'Update Connection String (leave empty to keep current)' : 'Connection String'}
            </Label>
            <div className="relative">
              <Input
                id="dbUrl"
                type={showDbUrl ? 'text' : 'password'}
                placeholder="Enter your database connection URL"
                value={dbUrl}
                onChange={e => setDbUrl(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowDbUrl(!showDbUrl)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showDbUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveDatabase} disabled={saving}>
              {saving ? 'Saving...' : 'Save Database Settings'}
            </Button>
            {data?.database?.hasConnectionString && (
              <Button variant="destructive" onClick={handleDeleteDatabase} disabled={saving}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}