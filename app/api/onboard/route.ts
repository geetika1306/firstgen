import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL } from '@/lib/claude'
import { getRoadmapPrompt } from '@/lib/prompts'
import { getPhaseFromYear } from '@/lib/utils'
import { UserProfile } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const profile: UserProfile = await req.json()
    profile.current_phase = getPhaseFromYear(profile.current_year)

    const prompt = getRoadmapPrompt(profile)

    const message = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.choices[0].message.content ?? ''
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const roadmap = JSON.parse(cleaned)

    return NextResponse.json({ roadmap, profile: { ...profile } })
  } catch (error) {
    console.error('Onboard error:', error)
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 })
  }
}