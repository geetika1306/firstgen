'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Sparkles, User, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Navbar from '@/components/Navbar'
import { UserProfile, ChatMessage } from '@/types'

const STARTERS = [
  'What should I do THIS weekend to get closer to my goal?',
  'Which certifications matter most for my target role?',
  'How do I get my first internship with no experience?',
  'Review my situation and give me your honest assessment.',
  'What do students who land dream jobs do differently?',
  'How should I spend my next 3 months?',
]

export default function ChatPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const p = localStorage.getItem('firstgen_profile')
    if (!p) { router.push('/'); return }
    setProfile(JSON.parse(p))
  }, [router])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || loading || !profile) return
    const userMsg: ChatMessage = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, profile }),
      })
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value)
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantText }
        ])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  if (!profile) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-20 pb-4">

        {/* Header */}
        <div className="py-6 border-b border-slate-800 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Your Career Guide</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Mentoring you toward <span className="text-indigo-400">{profile.target_role}</span>
              </p>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
              title="Clear chat"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles size={18} />
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
                  <p className="text-white text-sm leading-relaxed">
                    Hey {profile.name}! I'm your FirstGen career guide. I know you're targeting <strong>{profile.target_role}</strong> and you're currently at the <strong>{profile.current_year}</strong> stage. Ask me anything — no question is too basic.
                  </p>
                </div>
              </div>

              <p className="text-slate-500 text-xs mb-3 ml-13">Try asking:</p>
              <div className="grid gap-2">
                {STARTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm text-slate-300 glass hover:border-indigo-500/50 hover:text-white px-4 py-3 rounded-xl transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-fade-in`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles size={14} />
                </div>
              )}
              <div className={`max-w-lg ${msg.role === 'user'
                ? 'bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm'
                : 'glass px-4 py-3 rounded-2xl rounded-tl-sm text-slate-200'
              }`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content || '▋'}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} />
              </div>
              <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass rounded-2xl p-3 mt-2">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your guide anything…"
              rows={1}
              className="flex-1 bg-transparent text-white placeholder:text-slate-600 text-sm resize-none focus:outline-none py-1.5 max-h-32"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
