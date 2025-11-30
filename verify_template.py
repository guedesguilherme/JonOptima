import jinja2
import os
import sys

# Add current directory to path to import server modules
sys.path.append(os.getcwd())

from server.schemas import ResumeData, ContactInfo, Education, Experience, Skill, Certification

# Sample data using Pydantic models
sample_data = ResumeData(
    contact_info=ContactInfo(
        name="John Doe",
        email="john@example.com",
        phone="123-456-7890",
        linkedin="linkedin.com/in/johndoe",
        github="github.com/johndoe",
        portfolio_url="johndoe.com"
    ),
    summary="Experienced software engineer.",
    education=[
        Education(
            degree="B.S. Computer Science",
            institution="University of Tech",
            year="2020",
            details="GPA 3.8",
            description="Focus on AI"
        )
    ],
    experience=[
        Experience(
            role="Software Engineer",
            company="Tech Corp",
            start_date="2020",
            end_date="Present",
            is_current=True,
            description_points=["Built amazing things", "Optimized code"]
        )
    ],
    skills=[
        Skill(
            category="Programming",
            items=["Python", "JavaScript"]
        )
    ],
    certifications=[
        Certification(
            name="Certified Developer",
            issuer="Cloud Provider",
            date="2023",
            url="https://example.com/cert"
        )
    ],
    font_style="classic"
)

template_dir = os.path.join(os.path.dirname(__file__), 'server', 'templates')
env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir))
template = env.get_template('resume.html')

try:
    rendered_html = template.render(data=sample_data)
    print("Template rendered successfully!")
    with open('rendered_resume.html', 'w') as f:
        f.write(rendered_html)
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"Error rendering template: {e}")
