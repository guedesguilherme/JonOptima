from typing import List, Optional
from pydantic import BaseModel

class ContactInfo(BaseModel):
    name: str
    email: str
    phone: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio_url: Optional[str] = None

class Education(BaseModel):
    degree: str
    institution: str
    year: str
    details: Optional[str] = None
    description: Optional[str] = None

class Experience(BaseModel):
    role: str
    company: str
    start_date: str
    end_date: Optional[str] = None
    is_current: bool
    description_points: List[str]

class Skill(BaseModel):
    category: str
    items: List[str]

class Certification(BaseModel):
    name: str
    issuer: str
    date: str
    url: Optional[str] = None

class ResumeData(BaseModel):
    contact_info: ContactInfo
    summary: str
    education: List[Education]
    experience: List[Experience]
    skills: List[Skill]
    certifications: List[Certification] = []
    font_style: str = 'modern'
