import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL } from '@/lib/claude'
import { getOpportunityPrompt } from '@/lib/prompts'
import { serpSearch } from '@/lib/search'
import { UserProfile } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const profile: UserProfile = await req.json()

    const searchQuery = `${profile.field_of_interest} internships hackathons certifications for students India 2025 2026 open applications`
    const searchResults = await serpSearch(searchQuery)

    const prompt = getOpportunityPrompt(profile)

    const message = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nHere are recent search results to inform your response:\n${searchResults}\n\nReturn only the JSON object, no markdown.`,
        },
      ],
    })

    const text = message.choices[0].message.content ?? '{}'
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const data = JSON.parse(cleaned)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to find opportunities' }, { status: 500 })
  }
}