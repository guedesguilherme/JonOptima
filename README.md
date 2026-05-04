# JonOptima — AI Resume Tailoring Tool

> Rewrites your resume for every job application using AI, with no hallucinations.

JonOptima takes your saved profile and a job description, then uses Google Gemini to tailor the resume content, generate an ATS-optimized PDF, and write a cover letter. The AI acts as a strict editor: it only rewrites and reorders what is already in your profile, never inventing skills, companies, or experiences.

---

## Features

**Resume Tailoring**
- AI rewrites the summary and experience bullets to match the job description language and keywords
- Certifications are filtered to include only the most relevant ones (top 3-5)
- One-page discipline enforced by the AI prompt
- No hallucinations: the AI is forbidden from adding skills or experiences not present in the candidate profile

**Cover Letter Generation**
- Produces a professional email body addressed to the hiring manager
- Generated independently from the resume tailoring, so a failure in one does not affect the other

**PDF Output**
- ATS-friendly layout: no images, no colors, pure semantic HTML rendered via WeasyPrint
- Two font styles: Sans-Serif (modern) and Serif (classic)
- Section headers adapt to the selected output language

**Multi-Area Support**
- Dedicated prompt context per professional area: Tecnologia, Administracao, Financeiro, Marketing, Juridico, Outro
- Each area adjusts AI tone, focus, and priorities accordingly
- Form UI adapts per area: placeholders, field visibility, and skill category suggestions change based on selection

**Language Support**
- Full UI in Brazilian Portuguese (PT-BR)
- Output language field controls whether the AI writes resume content and cover letter in PT-BR or English

**Profile Persistence**
- Google Sign-In via Firebase Auth
- Full profile saved to Firestore on demand
- Data restored on next login

**Form UX**
- All form sections are collapsible
- Quick-scroll button to jump directly to the job description input
- Buttons are disabled during loading to prevent duplicate requests
- Rotating loading messages inform the user during cold starts (free-tier backend may take up to 30 seconds on first request)
- AI errors surface as a dismissible warning banner instead of failing silently

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.11 |
| AI | Google Gemini 2.5 Flash |
| PDF | WeasyPrint, Jinja2 |
| Auth and Storage | Firebase Auth, Firestore |
| Deployment | Vercel (frontend), Docker + Render (backend) |

---

## Architecture

```
User fills profile form
        |
        v
React Frontend (React Hook Form, Firestore sync)
        |
        v
FastAPI Backend
        |
        +-- /api/generate-preview: skip AI, render PDF directly
        |
        +-- /api/tailor-cv:
                |
                v
        Gemini: tailor resume data (area-aware, language-aware)
                |
                v
        Gemini: generate cover letter (independent call)
                |
                v
        WeasyPrint renders Jinja2 template to PDF
                |
                v
        Response: { pdf_base64, cover_letter, ai_error }
        |
        v
Frontend displays PDF preview and cover letter draft
```

---

## Getting Started

```bash
git clone https://github.com/guedesguilherme/JonOptima.git
```

**Backend**

```bash
cd server
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

```env
GEMINI_API_KEY=your_key_here
```

**Frontend**

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and expects the backend at `http://127.0.0.1:8000` by default. Set `VITE_API_URL` to override.

---

## Why I Built This

I wanted to understand how LLMs perform in real document-processing tasks, specifically whether a generative model could reliably extract intent from a job description and map it to a candidate's existing experience in a consistent, non-hallucinating way.

This project taught me how to structure prompts for consistent structured output, how to handle LLM response variability in production code, and how to build a lightweight full-stack AI product end to end.

---

Built by [Guilherme Guedes](https://github.com/guedesguilherme)
