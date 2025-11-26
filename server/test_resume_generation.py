import requests
import json

url = "http://127.0.0.1:8000/api/generate-preview"

data = {
    "contact_info": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1 234 567 890",
        "linkedin": "linkedin.com/in/johndoe",
        "github": "github.com/johndoe",
        "portfolio_url": "johndoe.com"
    },
    "summary": "Experienced software engineer with a passion for building scalable web applications.",
    "education": [
        {
            "degree": "B.S. Computer Science",
            "institution": "University of Tech",
            "year": "2018-2022",
            "details": "GPA: 3.8"
        }
    ],
    "experience": [
        {
            "role": "Software Engineer",
            "company": "Tech Corp",
            "duration": "2022-Present",
            "description_points": [
                "Developed RESTful APIs using FastAPI.",
                "Optimized database queries for better performance."
            ]
        }
    ],
    "skills": [
        {
            "category": "Languages",
            "items": ["Python", "JavaScript", "SQL"]
        },
        {
            "category": "Frameworks",
            "items": ["FastAPI", "React", "Django"]
        }
    ]
}

try:
    response = requests.post(url, json=data)
    if response.status_code == 200:
        with open("resume_preview.pdf", "wb") as f:
            f.write(response.content)
        print("PDF generated successfully: resume_preview.pdf")
    else:
        print(f"Failed to generate PDF. Status code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
