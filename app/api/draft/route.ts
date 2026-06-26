import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL } from '@/lib/claude'
import { getDocumentPrompt } from '@/lib/prompts'
import { UserProfile } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { profile, docType, target, additionalContext }: {
      profile: UserProfile
      docType: string
      target: string
      additionalContext: string
    } = await req.json()

    const prompt = getDocumentPrompt(profile, docType, target, additionalContext)

    const message = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.choices[0].message.content ?? ''

    return NextResponse.json({ content, docType, target })
  } catch (error) {
    console.error('Draft error:', error)
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 })
  }
}