# JonOptima ⚡ AI Career Architect

JonOptima is a Full-Stack AI Agent designed to solve the "Generic Resume" problem. It acts as a personal career consultant
that ingests a user's master profile and a specific Job Description (JD), then uses Generative AI to rewrite the summary and
experience bullets to strictly align with the target role—without hallucinating skills the user doesn't have.

Unlike standard resume builders that export messy HTML screenshots, JonOptima uses a headless browser engine
(WeasyPrint) to render pixel-perfect, ATS-friendly PDFs indistinguishable from manually typeset documents.

## 🚀 Key Features

```
智能 AI Tailoring: Uses Google Gemini 2.5 Flash with a "Strict Editor" prompt architecture to rewrite content based on
JD keywords.
ATS-Optimized PDF Engine: Server-side rendering using WeasyPrint and Jinja2 templates ensures the output is
100 % readable by Applicant Tracking Systems (no CSS Grid/Flexbox issues).
Persistent User Profiles: Firebase Authentication & Firestore integration allow users to "write once, tailor forever."
Smart Form Logic: Dynamic date handling (e.g., "Present" toggles), tag-based skill inputs, and auto-save functionality.
Dockerized Backend: The Python environment is containerized to support complex Linux libraries (Pango/Cairo)
required for PDF generation across any cloud provider.
```
## 🛠 Tech Stack

Frontend (The Face)
Framework: React 18 (Vite)


```
Styling: Tailwind CSS + Framer Motion (Animations)
State/Forms: React Hook Form + Context API
Auth/DB: Firebase SDK (Google Auth, Firestore)
Hosting: Vercel
```
Backend (The Brain)
Framework: FastAPI (Python 3.9)
AI Model: Google Generative AI (Gemini 1.5 Flash)
PDF Generation: WeasyPrint + Jinja2 Templating
Validation: Pydantic Schemas
Deployment: Docker + Render

## 🏗 Architecture

The application follows a decoupled Client-Server architecture:

1. Input: User logs in (Firebase) and fills the Master Profile. Data is synced to Firestore.
2. Trigger: User pastes a Job Description and clicks "Tailor".
3. Processing:
    Frontend sends JSON payload to FastAPI.
    Agent Layer: ai_agent.py constructs a context-aware prompt for Gemini.
    Gemini: Analyzes JD vs. Profile and returns optimized JSON + Cover Letter.
    Render Layer: utils.py injects the JSON into a clean HTML template.


```
Engine: WeasyPrint converts HTML -> PDF Bytes.
```
4. Output: API returns a Base64 encoded PDF and the generated email body to the client.

## 💻 Getting Started

Prerequisites
Node.js 18+
Python 3.9+
Google Gemini API Key
Firebase Project Credentials

1. Clone the Repository

```
git clone [https://github.com/yourusername/jonoptima.git](https://github.com/yourusername/jonoptima.git)
cd jonoptima
```
2. Backend Setup

```
cd server
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
```

```
pip install -r requirements.txt
```
Environment Variables: Create a .env file in /server:

```
GEMINI_API_KEY=your_google_api_key
```
Run Server:

```
uvicorn main:app --reload
# API will be live at [http://127.0.0.1:8000](http://127.0.0.1:8000)
```
3. Frontend Setup

```
cd client
npm install
```
Environment Variables: Create a .env file in /client:

```
VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
```
_(Plus your Firebase config keys in_ src/firebase.js _)_


Run Client:

```
npm run dev
# App will be live at http://localhost:
```
## 🐳 Deployment (Docker)

The backend includes a custom Dockerfile to handle system-level dependencies for PDF rendering.

Build & Run with Docker:

```
cd server
docker build -t jonoptima-api.
docker run -p 8000:8000 jonoptima-api
```
## 🤝 Contributing

Contributions are welcome! Please strictly adhere to the "No Hallucination" policy in the AI prompt engineering when
modifying the agent logic.

## 📄 License

This project is open-source and available under the MIT License.