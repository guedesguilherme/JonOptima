import google.generativeai as genai
import os
import json
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import schemas

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None
    print("Warning: GEMINI_API_KEY not found. AI features will be disabled.")

def tailor_resume(current_data: dict, job_description: str) -> dict:
    if not model:
        raise RuntimeError("Gemini API key not configured.")

    output_language = current_data.get('output_language', 'pt-br')
    if output_language == 'pt-br':
        language_instruction = "Write ALL text fields (summary, description_points, cover_letter) in formal Brazilian Portuguese (PT-BR). Use professional, formal language appropriate for the Brazilian job market."
    else:
        language_instruction = "Write ALL text fields (summary, description_points, cover_letter) in English."

    area_instructions = {
        'tecnologia': "The candidate works in Technology/Software. Prioritize technical achievements, stack proficiency, system scalability, delivery metrics, and engineering impact. Use precise technical language.",
        'administracao': "The candidate works in Administration/Management. Prioritize leadership, process optimization, team management, operational efficiency, and organizational results. Use corporate, results-oriented language.",
        'financeiro': "The candidate works in Finance. Prioritize financial metrics, budget management, compliance, cost reduction, investment returns, and analytical rigor. Use precise financial language.",
        'marketing': "The candidate works in Marketing. Prioritize campaigns, brand growth, ROI, audience metrics, lead generation, and creative strategy. Use dynamic, impact-focused language.",
        'juridico': "The candidate works in Law/Legal. Prioritize legislation expertise, case outcomes, contracts, compliance, risk management, and legal research. Use formal, precise legal language.",
        'outro': "Adapt the tone and focus to best match the job description provided. Use professional, clear language.",
    }
    area = current_data.get('area', 'tecnologia')
    area_instruction = area_instructions.get(area, area_instructions['outro'])

    prompt = f"""
    You are an Expert Resume Writer and Career Coach.

    Here is the candidate's current resume data in JSON format:
    {json.dumps(current_data, indent=2)}

    Here is the Job Description they are applying for:
    {job_description}

    Your task is two-fold:
    1. Tailor the resume to better match the job description.
       - Rewrite the 'summary' to align with the Job Description keywords and tone.
       - Re-order or rewrite the 'experience' description_points to highlight matching keywords and achievements relevant to the job.
       - Analyze the candidate's list of certifications. Select the top 3-5 that are most relevant to the Job Description. If a certification is highly specific to the role (e.g., AWS Certified for a Cloud role), prioritize it. Discard irrelevant ones.
       - Do NOT invent new experiences or skills, only optimize existing ones.
       - Keep the same structure for 'contact_info', 'education', and 'skills'.

    2. Write a professional Cover Letter (Email Body).
       - Addressed to the Hiring Manager.
       - Engaging and professional tone.
       - Highlight the top 2 skills from the resume that match the job description.

    AREA CONTEXT: {area_instruction}

    LANGUAGE RULE: {language_instruction}

    CRITICAL: Return ONLY valid JSON with the following structure:
    {{
        "tailored_resume_data": {{ ... the full resume JSON structure ... }},
        "cover_letter": "The full text of the cover letter..."
    }}

    CRITICAL RULES (Violating these causes failure):
    1. **NO HALLUCINATIONS:** You are FORBIDDEN from adding companies, degrees, or hard skills that are not explicitly present in the Candidate Profile.
    2. **Transferable Skills Only:** If the JD asks for a skill the candidate lacks, do NOT add it. Instead, emphasize soft skills or adjacent technologies they *do* have.
    3. **One Page Limit:** Keep the summary to max 3 lines. Limit job descriptions to the 3 most relevant bullet points per role. Concise is better.

    Do not include markdown backticks or any other text.
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean up markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        result = json.loads(text)
        
        # Validate structure roughly
        if "tailored_resume_data" not in result:
            # Fallback if AI messed up structure but returned resume
            if "contact_info" in result:
                return {"tailored_resume_data": result, "cover_letter": ""}
            return {"tailored_resume_data": current_data, "cover_letter": "Error generating content."}
            
        return result
    except Exception as e:
        print(f"Error tailoring resume: {e}")
        # In case of error, return the original data to avoid breaking the flow
        return {"tailored_resume_data": current_data, "cover_letter": "Error generating content."}
