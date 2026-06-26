'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Circle, ExternalLink, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { UserProfile, RoadmapItem } from '@/types'
import { PHASE_LABELS, PHASE_DESCRIPTIONS } from '@/lib/utils'

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [roadmap, setRoadmap] = useState<{ phase: number; phase_title: string; summary: string; items: RoadmapItem[] } | null>(null)
  const [expanded, setExpanded] = useState<number | null>(0)
  const [items, setItems] = useState<RoadmapItem[]>([])

  useEffect(() => {
    const p = localStorage.getItem('firstgen_profile')
    const r = localStorage.getItem('firstgen_roadmap')
    if (!p || !r) { router.push('/'); return }
    const parsedProfile = JSON.parse(p)
    const parsedRoadmap = JSON.parse(r)
    setProfile(parsedProfile)
    setRoadmap(parsedRoadmap)
    setItems(parsedRoadmap.items || [])
  }, [router])

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, status: item.status === 'done' ? 'pending' : 'done' } : item
    ))
  }

  const doneCount = items.filter(i => i.status === 'done').length
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0

  const typeColors: Record<string, string> = {
    course: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    certification: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    article: 'bg-green-500/10 text-green-400 border-green-500/20',
    tool: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    book: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  }

  if (!profile || !roadmap) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-20">

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-indigo-300 mb-4">
            <Sparkles size={12} />
            Phase {roadmap.phase} — {roadmap.phase_title}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Hey {profile.name}! 👋
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">{roadmap.summary}</p>
        </div>

        {/* Progress bar */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">Your progress</p>
              <p className="text-slate-400 text-sm mt-0.5">{doneCount} of {items.length} tasks completed</p>
            </div>
            <div className="text-3xl font-bold text-gradient">{progress}%</div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Journey phases */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map(phase => (
            <div
              key={phase}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                phase === roadmap.phase
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                  : phase < roadmap.phase
                  ? 'border-slate-700 bg-slate-800/50 text-slate-400'
                  : 'border-slate-800 bg-slate-900/30 text-slate-600'
              }`}
            >
              <span className="mr-1.5">{phase < roadmap.phase ? '✓' : phase === roadmap.phase ? '→' : '○'}</span>
              {PHASE_LABELS[phase]}
            </div>
          ))}
        </div>

        {/* Roadmap items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all duration-200 ${
                item.status === 'done'
                  ? 'border-slate-700 bg-slate-900/30 opacity-70'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div
                className="flex items-start gap-4 p-5 cursor-pointer"
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                <button
                  onClick={e => { e.stopPropagation(); toggleItem(index) }}
                  className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
                >
                  {item.status === 'done'
                    ? <CheckCircle size={22} className="text-indigo-500" />
                    : <Circle size={22} className="text-slate-600 hover:text-indigo-400" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Week {item.week_number}</p>
                      <h3 className={`font-semibold ${item.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                        {item.title}
                      </h3>
                    </div>
                    {expanded === index
                      ? <ChevronUp size={16} className="text-slate-500 flex-shrink-0 mt-1" />
                      : <ChevronDown size={16} className="text-slate-500 flex-shrink-0 mt-1" />
                    }
                  </div>
                </div>
              </div>

              {expanded === index && (
                <div className="px-5 pb-5 pl-14 animate-fade-in">
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>

                  {item.benchmark && (
                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-3 mb-4">
                      <p className="text-xs text-indigo-400 font-medium mb-1">📊 Peer benchmark</p>
                      <p className="text-slate-300 text-sm">{item.benchmark}</p>
                    </div>
                  )}

                  {item.resources && item.resources.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">Resources</p>
                      <div className="flex flex-wrap gap-2">
                        {item.resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${typeColors[res.type] || typeColors.course}`}
                          >
                            {res.title}
                            {res.url && <ExternalLink size={11} />}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA to chat */}
        <div className="mt-10 glass rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Have questions about your roadmap?</p>
            <p className="text-slate-400 text-sm mt-0.5">Chat with your personal career guide</p>
          </div>
          <a
            href="/chat"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
          >
            Ask guide <ArrowRight size={16} />
          </a>
        </div>
      </main>
    </div>
  )
}
