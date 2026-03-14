import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt, encrypt, maskApiKey, isEncrypted } from '@/lib/encryption'

/**
 * GET /api/user/api-keys
 * Retrieve user's API keys (masked for security)
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: settings, error } = await supabase
      .from('user_settings')
      .select('llm_provider, llm_model, llm_api_key_encrypted, database_type, database_url_encrypted')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          llm: { provider: null, model: null, hasApiKey: false, maskedKey: null },
          database: { type: null, hasConnectionString: false },
        })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const hasApiKey = !!settings.llm_api_key_encrypted
    let maskedKey = null
    if (settings.llm_api_key_encrypted) {
      try {
        const decryptedKey = isEncrypted(settings.llm_api_key_encrypted)
          ? decrypt(settings.llm_api_key_encrypted)
          : settings.llm_api_key_encrypted
        maskedKey = maskApiKey(decryptedKey)
      } catch {
        maskedKey = '**** (unable to decrypt)'
      }
    }

    return NextResponse.json({
      llm: {
        provider: settings.llm_provider,
        model: settings.llm_model,
        hasApiKey,
        maskedKey,
      },
      database: {
        type: settings.database_type,
        hasConnectionString: !!settings.database_url_encrypted,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
  }
}

/**
 * PUT /api/user/api-keys
 * Update user's API keys (encrypts before storing)
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { llmProvider, llmModel, llmApiKey, databaseType, databaseUrl } = body

    const updateData: Record<string, string | null> = {}

    if (llmProvider !== undefined) updateData.llm_provider = llmProvider || null
    if (llmModel !== undefined) updateData.llm_model = llmModel || null
    if (llmApiKey !== undefined) {
      updateData.llm_api_key_encrypted = llmApiKey ? encrypt(llmApiKey) : null
    }
    if (databaseType !== undefined) updateData.database_type = databaseType || null
    if (databaseUrl !== undefined) {
      updateData.database_url_encrypted = databaseUrl ? encrypt(databaseUrl) : null
    }

    const { error } = await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, ...updateData })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update API keys' }, { status: 500 })
  }
}

/**
 * DELETE /api/user/api-keys
 * Delete user's API keys
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const keyType = searchParams.get('type')

    if (!keyType || !['llm', 'database'].includes(keyType)) {
      return NextResponse.json({ error: 'Invalid key type' }, { status: 400 })
    }

    const updateData = keyType === 'llm'
      ? { llm_api_key_encrypted: null, llm_provider: null, llm_model: null }
      : { database_url_encrypted: null, database_type: null }

    const { error } = await supabase
      .from('user_settings')
      .update(updateData)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete API keys' }, { status: 500 })
  }
}