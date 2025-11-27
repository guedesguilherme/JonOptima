from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import ai_agent
from schemas import ResumeData
from utils import generate_pdf
import base64

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://jon-optima.vercel.app/", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "JonOptima Core Systems: ONLINE 🚀"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "JonOptima AI"}

# --- RESUME GENERATION ---
@app.post("/api/generate-preview")
def generate_preview(data: ResumeData):
    pdf_bytes = generate_pdf(data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=resume.pdf"}
    )

# --- AI TAILORING ---
class TailorRequest(BaseModel):
    profile_data: ResumeData
    job_description: str

@app.post("/api/tailor-cv")
def tailor_cv(request: TailorRequest):
    # Convert Pydantic model to dict for the AI agent
    try:
        profile_dict = request.profile_data.model_dump()
    except AttributeError:
        profile_dict = request.profile_data.dict()

    tailored_result = ai_agent.tailor_resume(profile_dict, request.job_description)
    
    # Extract the resume data from the result
    tailored_data_dict = tailored_result.get("tailored_resume_data", profile_dict)
    cover_letter = tailored_result.get("cover_letter", "")
    
    # Convert back to Pydantic model for validation/consistency
    tailored_data = ResumeData(**tailored_data_dict)

    pdf_bytes = generate_pdf(tailored_data)
    
    # Encode PDF to Base64
    pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
    
    return {
        "pdf_base64": pdf_base64,
        "cover_letter": cover_letter
    }