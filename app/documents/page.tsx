'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Copy, Download, Sparkles, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { UserProfile } from '@/types'

const DOC_TYPES = [
  { key: 'sop', label: 'Statement of Purpose', desc: 'For college applications', icon: '🎓' },
  { key: 'resume', label: 'Resume Bullets', desc: 'Projects, skills & achievements', icon: '📄' },
  { key: 'cover_letter', label: 'Cover Letter', desc: 'For internships & jobs', icon: '✉️' },
]

export default function DocumentsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [docType, setDocType] = useState('')
  const [target, setTarget] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<{ type: string; target: string; content: string }[]>([])

  useEffect(() => {
    const p = localStorage.getItem('firstgen_profile')
    if (!p) { router.push('/'); return }
    setProfile(JSON.parse(p))
  }, [router])

  const generate = async () => {
    if (!docType || !target || !profile) return
    setLoading(true)
    setResult('')
    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, docType, target, additionalContext: context }),
      })
      const data = await res.json()
      setResult(data.content)
      setHistory(prev => [{ type: docType, target, content: data.content }, ...prev.slice(0, 4)])
    } catch {
      setResult('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `firstgen-${docType}-${target.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!profile) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-20">

        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-green-300 mb-4">
            <FileText size={12} />
            Document drafter
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Draft your documents</h1>
          <p className="text-slate-400">Personalized for {profile.name} • targeting {profile.target_role}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: form */}
          <div className="space-y-6">
            {/* Doc type */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-3 block">What do you need?</label>
              <div className="space-y-2">
                {DOC_TYPES.map(dt => (
                  <button
                    key={dt.key}
                    onClick={() => setDocType(dt.key)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all ${
                      docType === dt.key
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl">{dt.icon}</span>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${docType === dt.key ? 'text-indigo-300' : 'text-white'}`}>{dt.label}</p>
                      <p className="text-slate-500 text-xs">{dt.desc}</p>
                    </div>
                    {docType === dt.key && <ChevronRight size={16} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Target */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">
                {docType === 'sop' ? 'Target college/program' : docType === 'cover_letter' ? 'Target company/role' : 'Target role/company'}
              </label>
              <input
                type="text"
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder={
                  docType === 'sop' ? 'e.g. IIT Delhi B.Tech CS, BITS Pilani' :
                  docType === 'cover_letter' ? 'e.g. Google SWE Intern, Flipkart Data Analyst' :
                  'e.g. Software Engineer at a product startup'
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Context */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-2 block">
                Anything specific to include? <span className="text-slate-600">(optional)</span>
              </label>
              <textarea
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="e.g. I built a ML project on crop disease detection, won a hackathon, did an internship at XYZ…"
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <button
              onClick={generate}
              disabled={!docType || !target || loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate document
                </>
              )}
            </button>
          </div>

          {/* Right: result */}
          <div>
            {result ? (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-semibold text-sm">Generated document</p>
                  <div className="flex gap-2">
                    <button
                      onClick={copy}
                      className="flex items-center gap-1.5 text-xs glass px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
                    >
                      <Copy size={13} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={download}
                      className="flex items-center gap-1.5 text-xs glass px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
                    >
                      <Download size={13} />
                      Download
                    </button>
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 h-[500px] overflow-y-auto">
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
                    <FileText size={24} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm">Your document will appear here</p>
                  {history.length > 0 && (
                    <div className="mt-6">
                      <p className="text-slate-600 text-xs mb-3">Recent documents</p>
                      <div className="space-y-2">
                        {history.map((h, i) => (
                          <button
                            key={i}
                            onClick={() => setResult(h.content)}
                            className="w-full text-left glass px-3 py-2.5 rounded-xl hover:border-slate-700 transition-all"
                          >
                            <p className="text-white text-xs font-medium">{DOC_TYPES.find(d => d.key === h.type)?.label}</p>
                            <p className="text-slate-500 text-xs mt-0.5">for {h.target}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
