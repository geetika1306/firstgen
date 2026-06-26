'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles, Users, Map, Zap, BookOpen } from 'lucide-react'
import { FIELDS, YEARS } from '@/lib/utils'
import { UserProfile } from '@/types'

const QUESTIONS = [
  { key: 'name', label: 'What\'s your name?', type: 'text', placeholder: 'Your full name' },
  { key: 'current_year', label: 'Where are you right now?', type: 'select', options: YEARS },
  { key: 'field_of_interest', label: 'What field excites you most?', type: 'select', options: FIELDS },
  { key: 'target_role', label: 'What\'s your dream job title?', type: 'text', placeholder: 'e.g. Software Engineer at Google, Data Scientist, Doctor' },
  { key: 'target_company', label: 'Any dream company? (optional)', type: 'text', placeholder: 'e.g. Google, Infosys, AIIMS, any startup' },
]

export default function Home() {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<Partial<UserProfile>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentQ = QUESTIONS[step]
  const currentValue = profile[currentQ?.key as keyof UserProfile] || ''

  const handleNext = async () => {
    if (!currentValue && currentQ.key !== 'target_company') return

    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1)
    } else {
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      localStorage.setItem('firstgen_profile', JSON.stringify(data.profile))
      localStorage.setItem('firstgen_roadmap', JSON.stringify(data.roadmap))
      router.push('/dashboard')
    } catch (e) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const updateProfile = (value: string) => {
    setProfile(p => ({ ...p, [currentQ.key]: value }))
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col">
        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm text-indigo-300">
            <Sparkles size={14} />
            <span>AI-powered career companion for first-gen students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The mentor you
            <br />
            <span className="text-gradient">never had.</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            FirstGen is your knowledgeable older sibling — guiding you from Class 12 all the way to your dream job and beyond. Personalized roadmaps, live opportunities, and career guidance tailored to you.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-200 glow-brand"
          >
            Start your journey
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-4 text-slate-500 text-sm">Free • No signup required • 2 min setup</p>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl w-full">
            {[
              { icon: Map, label: 'Personalized Roadmap', desc: 'Week-by-week plan built for your specific goals' },
              { icon: Zap, label: 'Live Opportunities', desc: 'Real internships, hackathons & certifications now' },
              { icon: Users, label: 'Career Guide Chat', desc: 'Ask anything, get specific actionable advice' },
              { icon: BookOpen, label: 'Document Drafter', desc: 'SOPs, resumes, cover letters in minutes' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="glass rounded-2xl p-5 text-left">
                <Icon size={22} className="text-indigo-400 mb-3" />
                <p className="font-semibold text-white text-sm mb-1">{label}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-slate-800 py-6 px-6">
          <div className="flex justify-center gap-12 text-center">
            {[['500M+', 'first-gen students globally'], ['4 phases', 'of your career covered'], ['Real-time', 'opportunity radar']].map(([n, l]) => (
              <div key={n}>
                <p className="text-indigo-400 font-bold text-lg">{n}</p>
                <p className="text-slate-500 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  // Quiz flow
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-1.5 mb-10">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-500' : 'bg-slate-800'}`}
            />
          ))}
        </div>

        {loading ? (
          <div className="text-center animate-fade-in">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
              <Sparkles size={24} className="absolute inset-0 m-auto text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Building your roadmap…</h2>
            <p className="text-slate-400">Personalizing your journey based on your goals</p>
          </div>
        ) : (
          <div className="animate-slide-up">
            <p className="text-slate-400 text-sm mb-2">Question {step + 1} of {QUESTIONS.length}</p>
            <h2 className="text-3xl font-bold text-white mb-8">{currentQ.label}</h2>

            {currentQ.type === 'text' ? (
              <input
                autoFocus
                type="text"
                value={currentValue as string}
                onChange={e => updateProfile(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder={currentQ.placeholder}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            ) : (
              <div className="grid gap-2 max-h-80 overflow-y-auto pr-1">
                {currentQ.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { updateProfile(opt); setTimeout(handleNext, 150) }}
                    className={`text-left px-5 py-3.5 rounded-xl border transition-all duration-150 text-sm ${
                      currentValue === opt
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            {currentQ.type === 'text' && (
              <button
                onClick={handleNext}
                disabled={!currentValue && currentQ.key !== 'target_company'}
                className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                {step === QUESTIONS.length - 1 ? 'Generate my roadmap' : 'Continue'}
                <ArrowRight size={18} />
              </button>
            )}

            {currentQ.key === 'target_company' && (
              <button
                onClick={handleNext}
                className="mt-4 text-slate-400 hover:text-white text-sm transition-colors"
              >
                Skip this →
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
