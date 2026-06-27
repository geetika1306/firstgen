# FirstGen 🎓
### The AI Mentor Every First-Generation Student Deserves

FirstGen is an AI-powered career guidance platform built exclusively for first-generation college students. It acts as a personal mentor, career advisor, opportunity hunter, and document writer — all in one place, available 24/7, completely free.

---

## 🚀 Live Demo

[firstgen.vercel.app](https://firstgen.vercel.app)

---

## 🧠 The Problem

Millions of first-generation college students in India have no access to mentors, career networks, or professional guidance. They don't know which internships to apply for, what certifications matter, or how to write a professional email. FirstGen closes that gap using AI.

---

## ✨ Features

- **Personalized Roadmap** — 5-question onboarding generates a custom career roadmap based on year, field, and goals
- **Live Opportunity Discovery** — Real-time search for internships, hackathons, certifications, and fellowships using SerpAPI
- **Document Drafting** — AI-generated cover letters, cold emails, resume summaries, and internship applications
- **AI Chat Mentor** — Conversational AI that answers career questions with context-aware, personalized advice

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| AI Model | Groq API (LLaMA 3.3 70B) |
| Search | SerpAPI (live Google search) |
| Database | Supabase |
| Deployment | Vercel |

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- Groq API key — [console.groq.com](https://console.groq.com)
- SerpAPI key — [serpapi.com](https://serpapi.com)
- Supabase project — [supabase.com](https://supabase.com)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firstgen.git
cd firstgen
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
SERPAPI_API_KEY=your_serpapi_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
firstgen/
├── app/
│   ├── api/
│   │   ├── chat/        # AI chat endpoint
│   │   ├── onboard/     # Roadmap generation endpoint
│   │   ├── search/      # Opportunity discovery endpoint
│   │   └── draft/       # Document drafting endpoint
│   └── ...
├── components/          # React UI components
├── lib/
│   ├── claude.ts        # Groq client setup
│   ├── search.ts        # SerpAPI integration
│   └── prompts.ts       # AI prompt templates
├── types/               # TypeScript type definitions
└── ...
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for LLM inference |
| `SERPAPI_API_KEY` | SerpAPI key for live web search |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add all environment variables in **Settings → Environment Variables**
4. Click **Deploy**

---

## 🗺 Roadmap

- [ ] Resume builder with ATS optimization
- [ ] Mock interview practice with AI feedback
- [ ] Peer community for first-gen students
- [ ] Vernacular language support (Hindi, Telugu, Tamil)
- [ ] College-specific opportunity filtering

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Built with ❤️ for first-generation students across India.

*Because the first generation should not have to figure it all out alone.*
