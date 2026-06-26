import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PHASE_LABELS: Record<number, string> = {
  1: 'Pre-college',
  2: 'In College',
  3: 'Placement Prep',
  4: 'Post First Job',
}

export const PHASE_DESCRIPTIONS: Record<number, string> = {
  1: 'Choosing the right college and course for your goals',
  2: 'Building skills, projects, and experience during college',
  3: 'Preparing for placements and landing your first job',
  4: 'Growing in your career and planning your next move',
}

export const FIELDS = [
  'Computer Science / Software Engineering',
  'Artificial Intelligence / Machine Learning',
  'Data Science / Analytics',
  'Electronics / Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Commerce / Finance / CA',
  'Medicine / Healthcare',
  'Law',
  'Design / Architecture',
  'Business / MBA',
  'Agriculture / Environmental Science',
  'Arts / Humanities',
  'Other',
]

export const YEARS = [
  'Class 11',
  'Class 12',
  '1st Year College',
  '2nd Year College',
  '3rd Year College',
  '4th Year College',
  'Recent Graduate',
  'Working Professional (0-2 years)',
]

export function getPhaseFromYear(year: string): 1 | 2 | 3 | 4 {
  if (year.includes('Class')) return 1
  if (year.includes('1st') || year.includes('2nd') || year.includes('3rd')) return 2
  if (year.includes('4th') || year.includes('Graduate')) return 3
  return 4
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

export function daysUntil(dateStr: string): number {
  try {
    const diff = new Date(dateStr).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  } catch {
    return 999
  }
}
