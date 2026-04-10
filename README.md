# JonOptima — AI Career Agent

> Tailors your resume to any job description in real-time using AI.

JonOptima analyzes a job description and rewrites your resume to maximize ATS score and relevance — powered by Google Gemini, built with React and FastAPI.

---

## Features

- **AI-powered resume tailoring** — matches your experience to the job description language
- **ATS optimization** — structured output for Applicant Tracking Systems
- **PDF generation** — download a ready-to-submit PDF via WeasyPrint
- **Real-time processing** — analysis and rewrite in seconds

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React · JavaScript |
| Backend | FastAPI · Python |
| AI | Google Gemini API |
| PDF | WeasyPrint |

---

## Architecture

```
User Input (Resume + Job Description)
        ↓
  React Frontend
        ↓
  FastAPI Backend
        ↓
  Gemini API (LLM)
        ↓
  Tailored Resume → PDF Output
```

---

## Getting Started

```bash
git clone https://github.com/guedesguilherme/JonOptima.git

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install && npm start
```

```env
GEMINI_API_KEY=your_key_here
```

---

## Why I Built This

I wanted to understand how LLMs perform in real document-processing tasks — whether a generative model could reliably extract intent from a job description and map it to a candidate's experience in a useful, consistent way.

This project taught me how to structure prompts for consistent structured output, how to handle LLM response variability in production code, and how to build a lightweight fullstack AI product end to end.

---

Built by [Guilherme Guedes](https://github.com/guedesguilherme)
