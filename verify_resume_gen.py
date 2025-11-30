import sys
import os

# Add server directory to path
sys.path.append(os.path.join(os.getcwd(), 'server'))

from schemas import ResumeData, ContactInfo, Education, Experience, Skill, Certification
from utils import generate_pdf

def test_resume_generation():
    print("Testing Resume Generation...")

    # Sample Data
    data = ResumeData(
        contact_info=ContactInfo(
            name="Soham P",
            email="soham@example.com",
            phone="123-456-7890",
            linkedin="linkedin.com/in/soham",
            github="github.com/soham"
        ),
        summary="Experienced software engineer.",
        education=[
            Education(institution="University of Tech", degree="B.S. CS", year="2020", details="GPA 3.8")
        ],
        experience=[
            Experience(
                company="Tech Corp",
                role="Senior Dev",
                start_date="2020",
                is_current=True,
                description_points=["Built cool things", "Led team"]
            )
        ],
        skills=[
            Skill(category="Languages", items=["Python", "JS"])
        ],
        certifications=[
            Certification(name="AWS Certified", issuer="Amazon", date="2023", url="https://aws.amazon.com")
        ],
        font_style="classic"
    )

    try:
        pdf_bytes = generate_pdf(data)
        print(f"Successfully generated PDF with size: {len(pdf_bytes)} bytes")
        
        # Save to file for manual inspection if needed (optional)
        with open("test_resume_classic.pdf", "wb") as f:
            f.write(pdf_bytes)
        print("Saved test_resume_classic.pdf")

    except Exception as e:
        print(f"Error generating PDF: {e}")
        sys.exit(1)

    # Test Modern
    data.font_style = "modern"
    try:
        pdf_bytes = generate_pdf(data)
        with open("test_resume_modern.pdf", "wb") as f:
            f.write(pdf_bytes)
        print("Saved test_resume_modern.pdf")
    except Exception as e:
        print(f"Error generating Modern PDF: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_resume_generation()
