import { useState } from 'react';
import './App.css';
import ResumeForm from './components/ResumeForm';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Sparkles, Copy } from 'lucide-react';

function App() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Generating PDF...');
  const [jobDescription, setJobDescription] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Lifted form state
  const { register, control, handleSubmit, watch, reset, formState: { errors }, getValues } = useForm({
    defaultValues: {
      contact_info: {
        name: '',
        email: '',
        linkedin: '',
        phone: '',
        github: '',
        portfolio_url: ''
      },
      summary: '',
      experience: [
        { company: '', role: '', start_date: '', end_date: '', is_current: false, description_points: '' }
      ],
      education: [
        { institution: '', degree: '', year: '', details: '', description: '' }
      ],
      skills: [
        { category: '', items: [] }
      ]
    }
  });

  const processData = (data) => {
    return {
      ...data,
      experience: data.experience.map(exp => ({
        ...exp,
        description_points: exp.description_points.split('\n').filter(line => line.trim() !== '')
      })),
      skills: data.skills.map(skill => ({
        ...skill,
        items: Array.isArray(skill.items) ? skill.items : skill.items.split(',').map(item => item.trim()).filter(item => item !== '')
      }))
    };
  };

  const handleGeneratePreview = async (data) => {
    setIsLoading(true);
    setLoadingText('Generating Preview...');
    const processedData = processData(data);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${API_URL}/api/generate-preview`, processedData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate preview. Please check the backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a Job Description to tailor your resume.");
      return;
    }

    setIsLoading(true);
    setLoadingText('Analyzing keywords & Rewriting summary...');

    // Get current form data
    const currentData = getValues();
    const processedData = processData(currentData);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${API_URL}/api/tailor-cv`, {
        profile_data: processedData,
        job_description: jobDescription
      });

      // Handle JSON response
      const { pdf_base64, cover_letter } = response.data;

      // Convert Base64 to Blob
      const byteCharacters = atob(pdf_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setEmailBody(cover_letter);
    } catch (error) {
      console.error("Error tailoring resume:", error);
      alert("Failed to tailor resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailBody);
    alert("Email draft copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500/30">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-hidden">

        {/* Left Side: Form (Scrollable) */}
        <div className="h-full overflow-y-auto p-6 border-r border-slate-800 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          <header className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              JonOptima Builder
            </h1>
            <p className="text-slate-400 text-sm mt-1">Craft your professional resume</p>
          </header>

          <form onSubmit={handleSubmit(handleGeneratePreview)}>
            <ResumeForm register={register} control={control} errors={errors} watch={watch} handleSubmit={handleSubmit} reset={reset} />

            <div className="max-w-4xl mx-auto px-6 pb-6">
              <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg border border-slate-600">
                Generate Standard Preview
              </button>
            </div>
          </form>

          {/* Step 2: The Target */}
          <div className="max-w-4xl mx-auto px-6 pb-12 mt-8">
            <div className="bg-slate-900/80 p-6 rounded-lg border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
              <h2 className="text-xl font-bold text-teal-400 mb-4 flex items-center gap-2">
                <Sparkles size={20} />
                Step 2: The Target
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Paste the job description below. JonOptima AI will rewrite your summary and highlight relevant experience.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded p-3 focus:outline-none focus:border-teal-400 transition-colors h-40 mb-4"
                placeholder="Paste Job Description here..."
              />
              <button
                onClick={handleTailor}
                type="button"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200 text-lg flex items-center justify-center gap-2"
              >
                <Sparkles size={24} />
                Tailor with JonOptima AI
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Preview (Sticky/Fixed) */}
        <div className="h-full bg-slate-900 relative flex flex-col">
          <div className="flex-1 bg-slate-800/50 flex items-center justify-center p-8 overflow-hidden relative">

            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
                <p className="text-teal-400 animate-pulse">{loadingText}</p>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full rounded-lg shadow-2xl border border-slate-700 bg-white"
                title="Resume Preview"
              />
            ) : (
              <div className="text-center text-slate-500">
                <div className="mb-4 text-6xl opacity-20">📄</div>
                <p className="text-lg">Fill the form to see the magic</p>
                <p className="text-sm opacity-60">Your preview will appear here</p>
              </div>
            )}

          </div>

          {/* Draft Email Section */}
          {emailBody && (
            <div className="h-1/3 bg-slate-900 border-t border-slate-700 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-teal-400 font-bold flex items-center gap-2">
                  <span className="text-xl">✉️</span> Draft Email
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-white py-1 px-3 rounded border border-slate-600 flex items-center gap-1 transition-colors"
                >
                  <Copy size={14} /> Copy
                </button>
              </div>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full h-full bg-slate-800/50 border border-slate-700 rounded p-3 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 resize-none"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;