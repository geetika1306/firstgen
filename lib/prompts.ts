import { UserProfile } from '@/types'

export function getRoadmapPrompt(profile: UserProfile): string {
  return `You are FirstGen, an expert career mentor for first-generation college students in India. You were once a first-gen student yourself and now work in ${profile.field_of_interest}.

Generate a detailed, personalized roadmap for this student:
- Name: ${profile.name}
- Stream: ${profile.stream}
- Current Year/Stage: ${profile.current_year}
- Field of Interest: ${profile.field_of_interest}
- Target Role: ${profile.target_role}
- Target Company: ${profile.target_company || 'Top companies in the field'}

Generate a roadmap for their CURRENT phase only. Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "phase": <1, 2, 3, or 4>,
  "phase_title": "<Pre-college|In College|Placement Prep|Post First Job>",
  "summary": "<2 sentence personal message to the student>",
  "items": [
    {
      "week_number": <1-12>,
      "title": "<specific task title>",
      "description": "<detailed description of what to do and why>",
      "benchmark": "<what successful students like them had at this stage>",
      "resources": [
        { "title": "<resource name>", "url": "<url if known>", "type": "<course|certification|article|tool|book>" }
      ],
      "status": "pending"
    }
  ]
}

Include 8-10 roadmap items. Be specific to their field. Include real resource names (Coursera, NPTEL, LeetCode, etc). Benchmark each item with what top students in that field typically achieve.`
}

export function getChatSystemPrompt(profile: UserProfile): string {
  return `You are FirstGen, the knowledgeable older sibling of ${profile.name}. You were also a first-generation college student and are now working as a ${profile.target_role} at a top company.

Student profile:
- Field: ${profile.field_of_interest}
- Stream: ${profile.stream}  
- Current stage: ${profile.current_year}
- Target role: ${profile.target_role}
- Target company: ${profile.target_company || 'top companies in the field'}

Your style:
- Warm, specific, and honest — not generic
- Give concrete actions, not vague advice
- When relevant, mention what students at similar stages typically have on their resume
- Use peer benchmarks: "Students who got into [company] by 3rd year typically had..."
- Keep responses focused and under 250 words
- Use bullet points for action items
- End with one specific next step they can do TODAY

You know the student's full profile. Tailor every answer to them specifically.`
}

export function getOpportunityPrompt(profile: UserProfile): string {
  return `Search for currently active opportunities for a ${profile.current_year} student interested in ${profile.field_of_interest} with a target role of ${profile.target_role}.

Find:
1. 3 internship opportunities (with applications open NOW or opening within 30 days)
2. 3 upcoming hackathons (within next 60 days)
3. 3 relevant certifications (free or low-cost, from Coursera/Google/Microsoft/AWS/NPTEL)

Return ONLY valid JSON:
{
  "opportunities": [
    {
      "name": "<opportunity name>",
      "type": "<internship|hackathon|certification|scholarship>",
      "deadline": "<deadline date or 'Rolling'>",
      "link": "<actual URL>",
      "eligibility": "<who can apply>",
      "stipend": "<stipend/prize if applicable>",
      "organizer": "<company/org name>"
    }
  ]
}

Prioritize India-based opportunities but include global remote ones. Only include real, verifiable opportunities.`
}

export function getDocumentPrompt(
  profile: UserProfile,
  docType: string,
  target: string,
  additionalContext: string
): string {
  const templates: Record<string, string> = {
    sop: `Write a compelling Statement of Purpose for ${profile.name} applying to ${target}.

Student background:
- Field: ${profile.field_of_interest}
- Current stage: ${profile.current_year}
- Target role: ${profile.target_role}
- Additional context: ${additionalContext}

Guidelines:
- 600-800 words
- Hook opener (not "I have always been fascinated by...")
- Specific experiences and projects
- Clear motivation for this particular program/institution
- Future goals tied to this opportunity
- First-generation student angle if relevant (optional, student may not want to highlight it)
- Professional but personal tone

Write the complete SOP now:`,

    resume: `Write strong resume bullet points for ${profile.name} targeting ${target}.

Profile: ${profile.field_of_interest} student, ${profile.current_year}, target: ${profile.target_role}
Context: ${additionalContext}

Generate:
1. 3 project bullet points (STAR format, quantified impact)
2. 3 skills summary lines
3. 2 extracurricular/achievement bullet points
4. A 2-line professional summary

Use action verbs. Quantify everything possible. Be specific to ${profile.field_of_interest}.`,

    cover_letter: `Write a cover letter for ${profile.name} applying to ${target}.

Profile: ${profile.field_of_interest}, ${profile.current_year}, targeting ${profile.target_role}
Context: ${additionalContext}

Guidelines:
- 300-400 words
- Strong opening hook
- Connect their background to the role
- Specific enthusiasm for this company
- Clear call to action
- Professional but not robotic

Write the complete cover letter:`
  }

  return templates[docType] || templates.sop
}
