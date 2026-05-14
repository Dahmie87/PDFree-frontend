import { useEffect, useState, type FormEvent } from 'react';
import { 
  FileText, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X, 
  Lock, 
  Globe, 
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_PDFREE_API_BASE_URL ?? 'http://localhost:8000';

const getFilenameFromDisposition = (contentDisposition: string | null) => {
  if (!contentDisposition) {
    return 'book.pdf';
  }

  const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
  return match?.[1]?.replace(/"/g, '') || 'book.pdf';
};

const PDFreeLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prompt, setPrompt] = useState('Write a book about Python for beginners');
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [statusMessage, setStatusMessage] = useState('Checking backend health...');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/health`, { signal: controller.signal });

        if (!response.ok) {
          throw new Error('Backend returned an unhealthy status');
        }

        const data = await response.json();
        setBackendStatus('online');
        setStatusMessage(data.status === 'ok' ? 'Backend online and ready' : 'Backend responded');
      } catch {
        if (!controller.signal.aborted) {
          setBackendStatus('offline');
          setStatusMessage('Backend unavailable. Start the API on port 8000.');
        }
      }
    };

    checkHealth();

    return () => controller.abort();
  }, []);

  const handleGenerateBook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < 5) {
      setErrorMessage('Prompt must be at least 5 characters long.');
      setSuccessMessage('');
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE}/generate-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      });

      if (!response.ok) {
        let errorDetail = 'Generation failed.';

        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || errorDetail;
        } catch {
          errorDetail = response.status === 400
            ? 'Prompt validation failed. Please enter a longer request.'
            : errorDetail;
        }

        throw new Error(errorDetail);
      }

      const pdfBlob = await response.blob();
      const objectUrl = window.URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      const filename = getFilenameFromDisposition(response.headers.get('content-disposition'));

      downloadLink.href = objectUrl;
      downloadLink.download = filename;
      downloadLink.click();
      window.URL.revokeObjectURL(objectUrl);

      setSuccessMessage(`Your PDF is downloading as ${filename}.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-purple-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <FileText className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              PDFree
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
            <a href="#manifesto" className="hover:text-purple-600 transition-colors">Manifesto</a>
            <a href="#security" className="hover:text-purple-600 transition-colors">Security</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95"
            >
              Generate Free PDF
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-slate-100 -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-200/40 blur-3xl rounded-full -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <Zap className="w-3 h-3 fill-current" />
            The Internet's Last Free Tool
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-6 leading-[1.1]">
            PDFs should be <span className="text-slate-700 italic">free</span>. <br />
            So we made them.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            No paywalls, no "3 conversions left," and absolutely no credit cards. 
            Generate, convert, and edit high-quality PDFs instantly in your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              type="button"
              onClick={() => document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              Start Generating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href={`${API_BASE}/docs`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all inline-flex items-center justify-center"
            >
              View API Docs
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-400 text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> No Sign Up Required</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Privacy Focused</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Unlimited Export</div>
          </div>
        </div>
      </section>

      {/* --- GENERATOR SECTION --- */}
      <section id="generate" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-[0.2em]">
                Live backend integration
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 max-w-xl">
                Generate a PDF book from a prompt and download it instantly.
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                This form talks to POST /generate-book, waits for the PDF blob, and saves the returned file locally. The API health check above comes from GET /health.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Validation</p>
                  <p className="text-sm text-slate-700">Minimum prompt length is 5 characters.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Response</p>
                  <p className="text-sm text-slate-700">Binary PDF download with the filename from the backend.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Timing</p>
                  <p className="text-sm text-slate-700">Generation can take 30 to 120 seconds.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleGenerateBook} className="rounded-[2.5rem] border border-slate-200 bg-slate-900 p-6 md:p-8 text-white shadow-2xl shadow-slate-900/10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Book generator</p>
                  <h3 className="text-2xl font-bold">Turn an idea into a PDF book.</h3>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${
                    backendStatus === 'online'
                      ? 'bg-green-500/15 text-green-300'
                      : backendStatus === 'offline'
                        ? 'bg-red-500/15 text-red-300'
                        : 'bg-amber-500/15 text-amber-200'
                  }`}
                >
                  {backendStatus}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-5">{statusMessage}</p>

              <label className="block text-sm font-medium text-slate-200 mb-3" htmlFor="prompt">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={7}
                placeholder="Write a book about Python, startup finance, or any topic you want."
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white placeholder:text-slate-500 outline-none transition focus:border-purple-400 focus:bg-white/10"
              />

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-slate-400">
                <span>Minimum 5 characters</span>
                <span>Output: application/pdf</span>
              </div>

              {errorMessage ? (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  {successMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isGenerating}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {isGenerating ? 'Generating PDF...' : 'Generate PDF'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR --- */}
      <section className="py-10 border-y border-slate-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">Trusted by 50,000+ Students & Professionals</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale">
            <div className="font-black text-2xl tracking-tighter">STANFORD</div>
            <div className="font-black text-2xl tracking-tighter">MIT</div>
            <div className="font-black text-2xl tracking-tighter">REDDIT</div>
            <div className="font-black text-2xl tracking-tighter">AIRBNB</div>
          </div>
        </div>
      </section>

      {/* --- BENTO FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need. Zero cost.</h2>
            <p className="text-slate-600">Built for speed, engineered for the open web.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Bento Card */}
            <div className="md:col-span-2 bg-white p-10 rounded-4xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="relative z-10">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl w-fit mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Instant Conversion</h3>
                <p className="text-slate-600 max-w-sm mb-6">Drag and drop any file. Our servers process it in milliseconds. It’s faster than your coffee break.</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">DOCX to PDF</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">JPG to PDF</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">HTML to PDF</span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-100 rounded-tl-full -mr-10 -mb-10 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Feature Card 2 */}
            <div className="bg-slate-900 p-10 rounded-4xl text-white flex flex-col justify-between border border-slate-800">
              <div>
                <Lock className="text-purple-400 w-8 h-8 mb-6" />
                <h3 className="text-2xl font-bold mb-3">Privacy First</h3>
                <p className="text-slate-400">Files are deleted automatically 60 minutes after generation. We never look, we never store.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800 text-sm text-slate-500 font-mono">
                $ openssl genrsa -out private.key 2048
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-10 rounded-4xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="text-green-500 w-8 h-8 mb-6" />
              <h3 className="text-xl font-bold mb-3">No Watermarks</h3>
              <p className="text-slate-600">Your documents are yours. Clean, professional exports without our logo plastered everywhere.</p>
            </div>

            {/* Feature Card 4 */}
            <div className="md:col-span-2 bg-slate-900 p-10 rounded-4xl text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
              <div className="md:max-w-md">
                <Globe className="w-8 h-8 mb-6 text-slate-300" />
                <h3 className="text-2xl font-bold mb-3">Accessible to Everyone</h3>
                <p className="text-slate-300">The internet was built to share information. We provide the tools to make that happen for everyone, regardless of budget.</p>
              </div>
              <div className="shrink-0 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 scale-110 md:rotate-6">
                <div className="space-y-3">
                  <div className="h-2 w-32 bg-slate-400 rounded-full" />
                  <div className="h-2 w-48 bg-slate-300 rounded-full" />
                  <div className="h-2 w-40 bg-slate-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STORY / MANIFESTO SECTION --- */}
      <section id="manifesto" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <div className="absolute -top-10 -left-10 text-[15rem] font-serif text-slate-50 leading-none pointer-events-none -z-10 select-none">“</div>
             <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-8">
               Why we're doing this.
             </h2>
             <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
               <p>
                 Ever tried to edit a simple PDF only to be met with a <strong>$19.99/mo subscription</strong>? We have, and it frustrated us. 
               </p>
               <p>
                 We believe basic digital productivity tools are a utility, not a luxury. PDFree was built as a "Public Good" project. No shareholders to satisfy, no data to sell.
               </p>
               <p className="font-semibold text-slate-900">
                 Just free tools for a free web.
               </p>
             </div>
             <div className="mt-10 flex items-center gap-4">
                <img src="https://ui-avatars.com/api/?name=Founder+Name&background=8b5cf6&color=fff" className="w-12 h-12 rounded-full" alt="Founder" />
                <div>
                  <p className="font-bold text-slate-900">Alex Rivera</p>
                  <p className="text-sm text-slate-500">Founder, PDFree</p>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-200 rotate-1 shadow-2xl relative">
            <div className="absolute top-4 right-8 flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-slate-800">resume_final.pdf</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold tracking-wide">COMPLETED</span>
              </div>
              <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
                <FileText className="text-slate-300 w-12 h-12" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 italic">"I switched to PDFree for my students. It saves them hundreds a year."</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
            <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-slate-800 pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Stop paying for what <br className="hidden md:block" /> should be yours.</h2>
            <p className="text-slate-400 mb-10 text-lg relative z-10">Join 50k+ users who've already ditched the paywalls.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button
                type="button"
                onClick={() => document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all text-lg shadow-xl shadow-purple-900/20"
              >
                Get Started Now
              </button>
              <a
                href={`${API_BASE}/docs`}
                target="_blank"
                rel="noreferrer"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-lg inline-flex items-center justify-center"
              >
                View API Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-purple-600 p-1.5 rounded-lg">
                  <FileText className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-slate-900 uppercase tracking-tighter">PDFree</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Making the internet a little better, one free document at a time.
              </p>
              <div className="flex gap-4">
                <div className="w-5 h-5 text-slate-400 hover:text-purple-600 cursor-pointer transition-colors" />
                <Globe className="w-5 h-5 text-slate-400 hover:text-purple-600 cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="hover:text-purple-600 cursor-pointer">All Tools</li>
                <li className="hover:text-purple-600 cursor-pointer">Merge PDF</li>
                <li className="hover:text-purple-600 cursor-pointer">Edit PDF</li>
                <li className="hover:text-purple-600 cursor-pointer">Protect PDF</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="hover:text-purple-600 cursor-pointer">About Us</li>
                <li className="hover:text-purple-600 cursor-pointer">Manifesto</li>
                <li className="hover:text-purple-600 cursor-pointer">Open Source</li>
                <li className="hover:text-purple-600 cursor-pointer">Security</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="hover:text-purple-600 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-purple-600 cursor-pointer">Terms of Service</li>
                <li className="hover:text-purple-600 cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">© 2026 PDFree. Open source and proudly independent.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-100 p-6 md:hidden animate-fade-in-up">
          <div className="flex justify-between items-center mb-12">
            <span className="font-bold text-xl uppercase">PDFree</span>
            <button onClick={() => setIsMenuOpen(false)}><X /></button>
          </div>
          <div className="flex flex-col gap-8 text-2xl font-bold">
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#manifesto" onClick={() => setIsMenuOpen(false)}>Manifesto</a>
            <a href="#security" onClick={() => setIsMenuOpen(false)}>Security</a>
          </div>
          <div className="mt-12 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
            >
              Try Now
            </button>
            <a
              href={`${API_BASE}/docs`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 border border-slate-200 rounded-2xl font-bold text-center"
            >
              API Docs
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFreeLanding;