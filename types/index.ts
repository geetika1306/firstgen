export type Phase = 1 | 2 | 3 | 4

export interface UserProfile {
  id?: string
  name: string
  current_phase: Phase
  field_of_interest: string
  stream: string
  current_year: string
  target_role: string
  target_company?: string
  state?: string
}

export interface RoadmapItem {
  id?: string
  user_id?: string
  phase: Phase
  title: string
  description: string
  week_number: number
  status: 'pending' | 'done'
  resources: Resource[]
  benchmark?: string
}

export interface Resource {
  title: string
  url?: string
  type: 'course' | 'certification' | 'article' | 'tool' | 'book'
}

export interface Opportunity {
  name: string
  type: 'internship' | 'hackathon' | 'certification' | 'scholarship'
  deadline: string
  link: string
  eligibility: string
  stipend?: string
  organizer?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface Document {
  id?: string
  user_id?: string
  type: 'sop' | 'resume' | 'cover_letter'
  content: string
  target: string
  created_at?: string
}
