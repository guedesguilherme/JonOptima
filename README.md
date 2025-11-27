<!-- ========================================================= -->
<!-- ===============  JONOPTIMA - README v2  ================== -->
<!-- ========================================================= -->

<h1 align="center">⚡ JonOptima — AI Career Architect</h1>

<p align="center">
  <strong>Your personal AI agent for creating job-tailored resumes</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Framework-FastAPI-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/PDF-WeasyPrint-AA0000" />
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Hosting-Vercel-000000?logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Docker-2496ED?logo=docker&logoColor=white" />
</p>

---

# 📘 English Version

## ⚡ Overview

JonOptima is a **Full-Stack AI Agent** designed to eliminate the “Generic Resume” problem.  
It acts as a personal career consultant: it ingests a master profile and a Job Description (JD), then rewrites the summary and experience bullet points to strictly align with the target role — **without hallucinating skills**.

Unlike common resume builders that export HTML screenshots, JonOptima uses a **headless browser engine (WeasyPrint)** to generate perfectly typeset, ATS-friendly PDFs.

---

## 🚀 Key Features

### 🤖 AI Tailoring  
Powered by **Google Gemini 2.5 Flash** using a "Strict Editor" architecture to ensure accuracy and JD alignment.

### 📄 ATS-Optimized PDF Engine  
Server-side PDF rendering using **WeasyPrint + Jinja2**.  
100% readable by Applicant Tracking Systems.

### 🔐 Persistent User Profiles  
Firestore + Firebase Auth:  
Write once → tailor forever.

### 🧠 Smart UI Logic  
- Auto-save  
- Skill tags  
- Present-date toggles  
- Dynamic forms via React Hook Form

### 🐳 Dockerized Backend  
Supports Linux dependencies like **Cairo** and **Pango** required for PDF rendering.

---

## 🛠 Tech Stack

### **Frontend (The Face)**
- React 18 (Vite)  
- Tailwind CSS  
- Framer Motion  
- React Hook Form + Context API  
- Firebase Auth + Firestore  
- Deployed on Vercel  

### **Backend (The Brain)**
- FastAPI (Python 3.9)  
- Gemini 1.5 Flash  
- Jinja2 Templates  
- WeasyPrint  
- Docker + Render  

---

## 🏗 Architecture

1. **User logs in** via Firebase → Firestore sync  
2. **User pastes job description** → clicks *Tailor*  
3. **Flow:**
   - JSON sent to FastAPI  
   - `ai_agent.py` builds context-aware prompt  
   - Gemini compares JD × Profile  
   - Returns optimized JSON + Cover Letter  
   - `utils.py` injects into HTML  
   - WeasyPrint → PDF bytes  
4. **Frontend receives** Base64 PDF + email draft  

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Gemini API Key
- Firebase project

---

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/jonoptima.git
cd jonoptima
````

---

### 2. Backend Setup

```bash
cd server
python -m venv venv
```

Activate:
Windows:

```bash
.\venv\Scripts\activate
```

Mac/Linux:

```bash
source venv/bin/activate
```

Install:

```bash
pip install -r requirements.txt
```

Create `.env`:

```
GEMINI_API_KEY=your_api_key
```

Run:

```bash
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

---

## 🐳 Docker Deployment

```bash
cd server
docker build -t jonoptima-api .
docker run -p 8000:8000 jonoptima-api
```

---

## 🤝 Contributing

Please follow the **No Hallucination Policy** when modifying the AI agent logic.

---

## 📄 License

MIT License.

---

# 🇧🇷 Versão em Português (PT-BR)

<h1 align="center">⚡ JonOptima — Arquiteto de Carreira com IA</h1>

## ⚡ Visão Geral

JonOptima é um **Agente de IA Full-Stack** criado para eliminar o problema do “Currículo Genérico”.
Ele funciona como um consultor de carreira: analisa o seu perfil mestre + a vaga (Job Description) e reescreve o resumo e as experiências **sem inventar habilidades**.

Diferente de construtores de currículo que exportam HTML como imagem, o JonOptima usa **WeasyPrint** para gerar PDFs impecáveis e compatíveis com ATS.

---

## 🚀 Principais Funcionalidades

### 🤖 Personalização via IA

Usa **Google Gemini 2.5 Flash** com arquitetura *Strict Editor* para alinhamento preciso com a vaga.

### 📄 PDFs Otimizados para ATS

Renderização server-side com **WeasyPrint + Jinja2** → 100% legível por rastreadores automáticos.

### 🔐 Perfis Persistentes

Com Firebase Auth + Firestore:
Escreva uma vez → adapte para sempre.

### 🧠 Lógica Inteligente no Front

* Autosave
* Inputs com tags de habilidades
* Alternância “até o presente”
* Forms dinâmicos com React Hook Form

### 🐳 Backend Dockerizado

Inclui dependências como **Cairo** e **Pango** para geração de PDF.

---

## 🛠 Tecnologias

### **Frontend (A Face)**

* React 18 (Vite)
* Tailwind CSS
* Framer Motion
* React Hook Form
* Firebase
* Hospedado na Vercel

### **Backend (O Cérebro)**

* FastAPI (Python 3.9)
* Gemini 1.5 Flash
* Jinja2
* WeasyPrint
* Docker + Render

---

## 🏗 Arquitetura

1. Usuário faz login (Firebase)
2. Cole a descrição da vaga → clique em *Tailor*
3. Pipeline:

   * JSON → FastAPI
   * `ai_agent.py` cria o prompt
   * Gemini compara Perfil × Vaga
   * Retorna JSON otimizado + Carta de Apresentação
   * `utils.py` injeta em HTML
   * WeasyPrint → PDF
4. API retorna PDF em Base64 + rascunho de email

---

## 💻 Como Rodar

### Pré-requisitos

* Node.js 18+
* Python 3.9+
* Chave Gemini
* Firebase

---

### 1. Clonando o Repositório

```bash
git clone https://github.com/yourusername/jonoptima.git
cd jonoptima
```

---

### 2. Configurando o Backend

```bash
cd server
python -m venv venv
```

Ativar:
Windows:

```bash
.\venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

Instalar:

```bash
pip install -r requirements.txt
```

Criar `.env`:

```
GEMINI_API_KEY=sua_chave
```

Rodar:

```bash
uvicorn main:app --reload
```

---

### 3. Configurando o Frontend

```bash
cd client
npm install
```

Criar `.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

Rodar:

```bash
npm run dev
```

---

## 🐳 Deploy com Docker

```bash
cd server
docker build -t jonoptima-api .
docker run -p 8000:8000 jonoptima-api
```

---

## 🤝 Contribuição

Siga a política de **Zero Alucinação** ao alterar a lógica do agente.

---

## 📄 Licença

MIT.
