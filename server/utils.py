import os
from jinja2 import Environment, FileSystemLoader
from schemas import ResumeData

def generate_pdf(data: ResumeData) -> bytes:
    try:
        from weasyprint import HTML
    except OSError as e:
        raise RuntimeError(f"WeasyPrint dependency missing (GTK3). Please install it: {e}")
    except ImportError as e:
        raise RuntimeError(f"WeasyPrint not installed. Please install it: {e}")

    # Setup Jinja2 environment
    template_dir = os.path.join(os.path.dirname(__file__), 'templates')
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template('resume.html')

    # Labels per language
    labels_map = {
        'pt-br': {
            'summary': 'Resumo Profissional',
            'experience': 'Experiência',
            'education': 'Formação Acadêmica',
            'certifications': 'Certificações',
            'skills': 'Habilidades',
            'present': 'Atual',
        },
        'en': {
            'summary': 'Professional Summary',
            'experience': 'Experience',
            'education': 'Education',
            'certifications': 'Certifications',
            'skills': 'Skills',
            'present': 'Present',
        },
    }
    lang = getattr(data, 'output_language', 'pt-br') or 'pt-br'
    labels = labels_map.get(lang, labels_map['pt-br'])

    # Render the template with data
    rendered_html = template.render(data=data, labels=labels)

    # Generate PDF
    pdf_bytes = HTML(string=rendered_html).write_pdf()
    
    return pdf_bytes
