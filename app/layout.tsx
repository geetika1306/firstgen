import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FirstGen — Your Career Companion',
  description: 'The knowledgeable older sibling every first-generation student deserves. Personalized roadmaps, live opportunities, and career guidance from Class 12 to your dream job.',
  keywords: 'first generation student, college guidance, career roadmap, internships, India, AI mentor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  )
}
