'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ExternalLink, Calendar, Search, Briefcase, Trophy, Award, GraduationCap, RefreshCw } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { UserProfile, Opportunity } from '@/types'

const TYPE_CONFIG = {
  internship:    { icon: Briefcase,     label: 'Internship',    color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  hackathon:     { icon: Trophy,        label: 'Hackathon',     color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
  certification: { icon: Award,         label: 'Certification', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  scholarship:   { icon: GraduationCap, label: 'Scholarship',   color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
}

export default function OpportunitiesPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const p = localStorage.getItem('firstgen_profile')
    if (!p) { router.push('/'); return }
    setProfile(JSON.parse(p))
  }, [router])

  const fetchOpportunities = async () => {
    if (!profile) return
    setLoading(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      setOpportunities(data.opportunities || [])
      setLoaded(true)
    } catch {
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all' ? opportunities : opportunities.filter(o => o.type === filter)

  if (!profile) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-20">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-amber-300 mb-4">
            <Zap size={12} />
            Live opportunity radar
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Opportunities for you</h1>
          <p className="text-slate-400">
            Personalized for <span className="text-white">{profile.field_of_interest}</span> • {profile.current_year}
          </p>
        </div>

        {!loaded ? (
          <div className="text-center py-20">
            {loading ? (
              <div className="animate-fade-in">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin" />
                  <Search size={24} className="absolute inset-0 m-auto text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Scanning the web for you…</h2>
                <p className="text-slate-400">Finding live internships, hackathons, and certifications</p>
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
                  <Zap size={32} className="text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Find your next opportunity</h2>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  We'll search the web in real time for internships, hackathons, and certifications matched to your profile.
                </p>
                <button
                  onClick={fetchOpportunities}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-8 py-3.5 rounded-xl mx-auto transition-all"
                >
                  <Search size={18} />
                  Search opportunities now
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Filters + refresh */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 flex-wrap">
                {['all', 'internship', 'hackathon', 'certification', 'scholarship'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                      filter === f
                        ? 'bg-indigo-600 text-white'
                        : 'glass text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                onClick={fetchOpportunities}
                disabled={loading}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm glass px-3 py-1.5 rounded-lg transition-all"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {/* Opportunity cards */}
            <div className="space-y-4">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500">No {filter === 'all' ? '' : filter} opportunities found. Try refreshing.</div>
              )}
              {filtered.map((opp, i) => {
                const config = TYPE_CONFIG[opp.type] || TYPE_CONFIG.internship
                const Icon = config.icon
                return (
                  <div key={i} className="glass rounded-2xl p-6 hover:border-slate-700 transition-all animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                          <Icon size={18} className={config.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                              {config.label}
                            </span>
                            {opp.organizer && (
                              <span className="text-xs text-slate-500">{opp.organizer}</span>
                            )}
                          </div>
                          <h3 className="text-white font-semibold text-base mb-1">{opp.name}</h3>
                          <p className="text-slate-400 text-sm mb-3">{opp.eligibility}</p>
                          <div className="flex items-center gap-4 text-sm">
                            {opp.deadline && (
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Calendar size={13} />
                                <span>Deadline: {opp.deadline}</span>
                              </div>
                            )}
                            {opp.stipend && (
                              <span className="text-green-400 font-medium">{opp.stipend}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <a
                        href={opp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all flex-shrink-0"
                      >
                        Apply <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            {filtered.length > 0 && (
              <p className="text-center text-slate-600 text-xs mt-8">
                Opportunities sourced in real time. Always verify deadlines on the official website.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
