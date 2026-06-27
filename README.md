FirstGen 🎓

The AI Mentor Every First-Generation Student Deserves

FirstGen is an AI-powered career guidance platform built exclusively for first-generation college students. It acts as a personal mentor, career advisor, opportunity hunter, and document writer — all in one place, available 24/7, completely free.


🚀 Live Demo

firstgen.vercel.app


🧠 The Problem

Millions of first-generation college students in India have no access to mentors, career networks, or professional guidance. They don't know which internships to apply for, what certifications matter, or how to write a professional email. FirstGen closes that gap using AI.


✨ Features


Personalized Roadmap — 5-question onboarding generates a custom career roadmap based on year, field, and goals
Live Opportunity Discovery — Real-time search for internships, hackathons, certifications, and fellowships using SerpAPI
Document Drafting — AI-generated cover letters, cold emails, resume summaries, and internship applications
AI Chat Mentor — Conversational AI that answers career questions with context-aware, personalized advice



🛠 Tech Stack

LayerTechnologyFrontendNext.js 14, TypeScript, Tailwind CSSAI ModelGroq API (LLaMA 3.3 70B)SearchSerpAPI (live Google search)DatabaseSupabaseDeploymentVercel


📦 Getting Started

Prerequisites


Node.js 18+
Groq API key — console.groq.com
SerpAPI key — serpapi.com
Supabase project — supabase.com


Installation


Clone the repository:


bashgit clone https://github.com/yourusername/firstgen.git
cd firstgen


Install dependencies:


bashnpm install


Create a .env.local file in the root directory:


envGROQ_API_KEY=your_groq_api_key_here
SERPAPI_API_KEY=your_serpapi_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Run the development server:


bashnpm run dev


Open http://localhost:3000 in your browser.



📁 Project Structure

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


🔑 Environment Variables

VariableDescriptionGROQ_API_KEYGroq API key for LLM inferenceSERPAPI_API_KEYSerpAPI key for live web searchNEXT_PUBLIC_SUPABASE_URLSupabase project URLNEXT_PUBLIC_SUPABASE_ANON_KEYSupabase anonymous key


🚢 Deployment

Deploy to Vercel


Push your code to GitHub
Go to vercel.com and import your repository
Add all environment variables in Settings → Environment Variables
Click Deploy



🗺 Roadmap


 Resume builder with ATS optimization
 Mock interview practice with AI feedback
 Peer community for first-gen students
 Vernacular language support (Hindi, Telugu, Tamil)
 College-specific opportunity filtering



🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change.


Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request



📄 License

This project is licensed under the MIT License.


👤 Author

Built with ❤️ for first-generation students across India.

Because the first generation should not have to figure it all out alone.
