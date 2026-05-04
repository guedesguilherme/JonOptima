import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found. AI features will be disabled.")

AREA_INSTRUCTIONS = {
    'tecnologia':   "The candidate works in Technology/Software. Prioritize technical achievements, stack proficiency, system scalability, delivery metrics, and engineering impact. Use precise technical language.",
    'administracao':"The candidate works in Administration/Management. Prioritize leadership, process optimization, team management, operational efficiency, and organizational results. Use corporate, results-oriented language.",
    'financeiro':   "The candidate works in Finance. Prioritize financial metrics, budget management, compliance, cost reduction, investment returns, and analytical rigor. Use precise financial language.",
    'marketing':    "The candidate works in Marketing. Prioritize campaigns, brand growth, ROI, audience metrics, lead generation, and creative strategy. Use dynamic, impact-focused language.",
    'juridico':     "The candidate works in Law/Legal. Prioritize legislation expertise, case outcomes, contracts, compliance, risk management, and legal research. Use formal, precise legal language.",
    'outro':        "Adapt the tone and focus to best match the job description provided. Use professional, clear language.",
}


def _tailor_resume_data(current_data: dict, job_description: str) -> dict:
    """Calls Gemini to tailor the resume fields. Returns the tailored resume dict."""
    output_language = current_data.get('output_language', 'pt-br')
    language_instruction = (
        "Write ALL text fields (summary, description_points) in formal Brazilian Portuguese (PT-BR)."
        if output_language == 'pt-br'
        else "Write ALL text fields (summary, description_points) in English."
    )
    area = current_data.get('area', 'tecnologia')
    area_instruction = AREA_INSTRUCTIONS.get(area, AREA_INSTRUCTIONS['outro'])

    prompt = f"""
    You are an Expert Resume Writer and Career Coach.

    Candidate resume data (JSON):
    {json.dumps(current_data, indent=2)}

    Job Description:
    {job_description}

    TASK: Tailor the resume to better match the job description.
    - Rewrite 'summary' to align with the Job Description keywords and tone.
    - Re-order or rewrite 'experience' description_points to highlight matching keywords and achievements.
    - Select the top 3-5 most relevant certifications. Discard irrelevant ones.
    - Do NOT invent new experiences, companies, degrees, or hard skills.
    - Keep the same structure for 'contact_info', 'education', and 'skills'.

    AREA CONTEXT: {area_instruction}
    LANGUAGE: {language_instruction}

    CRITICAL RULES:
    1. NO HALLUCINATIONS: You are FORBIDDEN from adding companies, degrees, or hard skills not in the Candidate Profile.
    2. Transferable Skills Only: If the JD asks for a skill the candidate lacks, do NOT add it.
    3. One Page Limit: Summary max 3 lines. Max 3 bullet points per role.

    Return ONLY valid JSON with the full resume structure (same fields as input). No markdown, no extra text.
    """

    response = model.generate_content(prompt)
    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]

    result = json.loads(text)

    # If AI returned the wrapper structure instead of raw resume, unwrap it
    if "tailored_resume_data" in result:
        return result["tailored_resume_data"]
    return result


def _generate_cover_letter(tailored_data: dict, job_description: str, output_language: str) -> str:
    """Calls Gemini to generate a cover letter based on the tailored resume."""
    language_instruction = (
        "Write the cover letter in formal Brazilian Portuguese (PT-BR)."
        if output_language == 'pt-br'
        else "Write the cover letter in English."
    )

    prompt = f"""
    You are an Expert Career Coach writing a professional cover letter (email body).

    Candidate resume (JSON):
    {json.dumps(tailored_data, indent=2)}

    Job Description:
    {job_description}

    TASK: Write a professional Cover Letter (email body only, no subject line).
    - Addressed to the Hiring Manager.
    - Engaging and professional tone.
    - Highlight the top 2 skills from the resume that match the job description.
    - Keep it concise: 3 short paragraphs maximum.

    LANGUAGE: {language_instruction}

    Return ONLY the plain text of the cover letter. No JSON, no markdown.
    """

    response = model.generate_content(prompt)
    return response.text.strip()


def tailor_resume(current_data: dict, job_description: str) -> dict:
    if not model:
        raise RuntimeError("Gemini API key not configured.")

    output_language = current_data.get('output_language', 'pt-br')

    # Step 1: Tailor resume data
    try:
        tailored_data = _tailor_resume_data(current_data, job_description)
    except Exception as e:
        print(f"Error tailoring resume data: {e}")
        return {
            "tailored_resume_data": current_data,
            "cover_letter": "",
            "ai_error": "Não foi possível otimizar o currículo com IA. O PDF foi gerado com seus dados originais.",
        }

    # Step 2: Generate cover letter (independently — resume is safe even if this fails)
    try:
        cover_letter = _generate_cover_letter(tailored_data, job_description, output_language)
    except Exception as e:
        print(f"Error generating cover letter: {e}")
        cover_letter = ""
        return {
            "tailored_resume_data": tailored_data,
            "cover_letter": "",
            "ai_error": "Currículo otimizado com sucesso, mas houve um erro ao gerar a carta de apresentação.",
        }

    return {
        "tailored_resume_data": tailored_data,
        "cover_letter": cover_letter,
        "ai_error": None,
    }
