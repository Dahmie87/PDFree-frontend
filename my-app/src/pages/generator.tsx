import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader, CheckCircle2, AlertCircle, Trash2, History, Settings } from 'lucide-react';
import PatternBackdrop from '../components/pattern-backdrop';

interface GeneratedBook {
  id: string;
  prompt: string;
  filename: string;
  timestamp: number;
  blob?: Blob;
}

const API_BASE = 'http://localhost:8000';

const GeneratorPage = () => {
  const [prompt, setPrompt] = useState('Write a comprehensive guide to machine learning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedBooks, setGeneratedBooks] = useState<GeneratedBook[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);
  const [generationStage, setGenerationStage] = useState('');

  // Customization options
  const [model, setModel] = useState('gpt-4');
  const [speedLength, setSpeedLength] = useState('balanced');
  const [mode, setMode] = useState('creative');
  const [pageLength, setPageLength] = useState(20);
  const [temperature, setTemperature] = useState(0.7);
  const [numPages, setNumPages] = useState(20);

  useEffect(() => {
    const stored = localStorage.getItem('generatedBooks');
    if (stored) {
      try {
        const books = JSON.parse(stored);
        setGeneratedBooks(books.filter((b: GeneratedBook) => !b.blob));
      } catch {
        // Invalid storage
      }
    }
  }, []);

  const getFilenameFromDisposition = (contentDisposition: string | null) => {
    if (!contentDisposition) return 'book.pdf';
    const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
    return match?.[1]?.replace(/"/g, '') || 'book.pdf';
  };

  const handleGenerateBook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length < 5) {
      setError('Prompt must be at least 5 characters long.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');
    setGenerationStage('Initializing book generation...');

    try {
      // Simulate progress stages
      const stages = [
        'Analyzing your prompt...',
        'Generating book structure...',
        'Creating table of contents...',
        'Writing chapters...',
        'Formatting and styling...',
        'Compiling PDF...',
      ];

      let stageIndex = 0;
      const stageInterval = setInterval(() => {
        if (stageIndex < stages.length - 1) {
          stageIndex++;
          setGenerationStage(stages[stageIndex]);
        }
      }, 3000); // Change stage every 3 seconds

      const response = await fetch(`${API_BASE}/generate-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          page_length: pageLength,
          temperature: temperature,
          num_pages: numPages,
        }),
      });

      clearInterval(stageInterval);

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

      setGenerationStage('Finalizing your PDF...');

      const pdfBlob = await response.blob();
      const objectUrl = window.URL.createObjectURL(pdfBlob);
      const filename = getFilenameFromDisposition(response.headers.get('content-disposition'));

      // Add to history
      const newBook: GeneratedBook = {
        id: Date.now().toString(),
        prompt: trimmedPrompt,
        filename,
        timestamp: Date.now(),
      };

      const updatedBooks = [newBook, ...generatedBooks].slice(0, 10);
      setGeneratedBooks(updatedBooks);
      localStorage.setItem('generatedBooks', JSON.stringify(updatedBooks));

      // Auto download
      const downloadLink = document.createElement('a');
      downloadLink.href = objectUrl;
      downloadLink.download = filename;
      downloadLink.click();
      window.URL.revokeObjectURL(objectUrl);

      setSuccess(`Your PDF "${filename}" is ready!`);
      setGenerationStage('');
      setPrompt('Write a comprehensive guide to machine learning');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Generation failed.');
      setGenerationStage('');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteBook = (id: string) => {
    const updatedBooks = generatedBooks.filter((b) => b.id !== id);
    setGeneratedBooks(updatedBooks);
    localStorage.setItem('generatedBooks', JSON.stringify(updatedBooks));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="relative min-h-screen bg-white pt-24 pb-16 overflow-hidden">
      <PatternBackdrop tone="light" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Generate Your Book</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Turn your ideas into a beautiful, professionally formatted PDF book in minutes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Generator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleGenerateBook} className="glass rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Book Details</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Customization</label>
                <div className="grid grid-cols-3 gap-4 mb-6 md:grid-cols-1 lg:grid-cols-3">
                  {/* Model Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Model</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl glass-sm text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="gpt-4" className="bg-white">GPT-4 (Best Quality)</option>
                      <option value="gpt-3.5" className="bg-white">GPT-3.5 (Fast)</option>
                      <option value="gpt-4o" className="bg-white">GPT-4o (Balanced)</option>
                    </select>
                  </div>

                  {/* Speed vs Length */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Priority</label>
                    <select
                      value={speedLength}
                      onChange={(e) => setSpeedLength(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl glass-sm text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="speed" className="bg-white">⚡ Speed (Faster Generation)</option>
                      <option value="balanced" className="bg-white">⚖️ Balanced</option>
                      <option value="length" className="bg-white">📖 Length (More Detail)</option>
                    </select>
                  </div>

                  {/* Writing Mode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Writing Mode</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl glass-sm text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="research" className="bg-white">🔬 Research (Formal)</option>
                      <option value="technical" className="bg-white">⚙️ Technical (Code Examples)</option>
                      <option value="creative" className="bg-white">✨ Creative (Storytelling)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Your Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={7}
                  placeholder="Describe your book. Example: Write a comprehensive guide to Python for beginners..."
                  className="w-full rounded-2xl glass-sm px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
                <p className="text-xs text-slate-500 mt-2">Minimum 5 characters • Max 5000 characters</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 glass-sm rounded-2xl p-6 border border-purple-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                    <h3 className="font-bold text-slate-900">Generating Your Book</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-4">{generationStage}</p>
                  <div className="w-full bg-blue-100 rounded-full h-2 border border-blue-200">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: isGenerating ? 8 : 0 }}
                      className="bg-purple-700 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">This typically takes 1-2 minutes...</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate PDF Book
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Sidebar - History */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="glass rounded-3xl p-6 sticky top-32 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-900">Generation History</h3>
              </div>

              <AnimatePresence>
                {generatedBooks.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-slate-500 text-center py-8"
                  >
                    No books generated yet. Start creating!
                  </motion.p>
                ) : (
                  <div className="space-y-3">
                    {generatedBooks.map((book) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-sm rounded-xl p-4 group hover:shadow-md transition-all border border-purple-100/50 hover:border-purple-200"
                      >
                        <p className="text-xs font-bold text-slate-700 truncate mb-2">{book.filename}</p>
                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{book.prompt}</p>
                        <p className="text-xs text-slate-500 mb-3">{formatDate(book.timestamp)}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = book.filename;
                              link.download = book.filename;
                              link.click();
                            }}
                            className="flex-1 flex items-center justify-center gap-1 bg-purple-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-purple-700 transition shadow-md shadow-purple-600/30"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                          <button
                            onClick={() => deleteBook(book.id)}
                            className="flex items-center justify-center glass-sm text-red-600 p-2 rounded-lg hover:bg-red-50 transition border border-red-100/50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;
