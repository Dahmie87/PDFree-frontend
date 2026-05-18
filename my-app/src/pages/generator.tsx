import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader,
  CheckCircle2,
  AlertCircle,
  History,
  Settings,
  Scale,
  BookOpen,
  Cog,
  Sparkles,
  Palette,
  Lock,
} from 'lucide-react';
import PatternBackdrop from '../components/pattern-backdrop';

interface GeneratedBook {
  id: string;
  prompt: string;
  filename: string;
  timestamp: number;
  blob?: Blob;
}

const API_BASE = import.meta.env.VITE_PDFREE_API_BASE_URL ?? 'http://localhost:8000';

const GeneratorPage = () => {
  const [prompt, setPrompt] = useState('Write a comprehensive guide to machine learning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedBooks, setGeneratedBooks] = useState<GeneratedBook[]>([]);
  const [generationStage, setGenerationStage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  // PDF filename/title customization
  const [filenameInput, setFilenameInput] = useState('');
  const [useFilenameAsTitle, setUseFilenameAsTitle] = useState(true);

  // Result modal state
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<{
    filename: string;
    objectUrl: string;
    success: boolean;
    message: string;
    title?: string;
    generationTime?: string;
  } | null>(null);

  // Customization options
  const [model, setModel] = useState('llama-3.1-8b-instruct');
  const [speedLength, setSpeedLength] = useState('balanced');
  const [mode, setMode] = useState('creative');
  const [theme, setTheme] = useState('professional');
  const [connectModel, setConnectModel] = useState('default');
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

  const premiumModels = ['gpt-5.5', 'claude-new', 'claude-alt'];

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

  const ensurePdfExtension = (name: string) => {
    if (!name) return name;
    return name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`;
  };

  const getGenerationTimeLabel = (response: Response) => {
    const generationTime = response.headers.get('x-generation-time');
    if (!generationTime) return '';

    const generationTimeUnit = response.headers.get('x-generation-time-unit') || 'seconds';
    return `${generationTime} ${generationTimeUnit}`;
  };

  const handleGenerateBook = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length < 5) {
      setError('Prompt must be at least 5 characters long.');
      setShowErrorModal(true);
      return;
    }

    setIsGenerating(true);
    setError('');
    setGenerationStage('Preparing outline');

    try {
      const response = await fetch(`${API_BASE}/generate-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          length_priority: speedLength,
          filename: filenameInput.trim() ? ensurePdfExtension(filenameInput.trim()) : '',
        }),
      });

      if (!response.ok) {
        let errorDetail = 'Generation failed.';
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || errorDetail;
        } catch {
          errorDetail =
            response.status === 400
              ? 'Prompt validation failed. Please enter a longer request.'
              : errorDetail;
        }
        throw new Error(errorDetail);
      }

      setGenerationStage('Compiling PDF');

      const pdfBlob = await response.blob();
      const objectUrl = window.URL.createObjectURL(pdfBlob);
      const filename = getFilenameFromDisposition(response.headers.get('content-disposition'));
      const finalFilename = filenameInput.trim() ? ensurePdfExtension(filenameInput.trim()) : filename;
      const finalTitle =
        useFilenameAsTitle && filenameInput.trim()
          ? filenameInput.trim().replace(/\.pdf$/i, '')
          : '';
      const generationTime = getGenerationTimeLabel(response);

      const newBook: GeneratedBook = {
        id: Date.now().toString(),
        prompt: trimmedPrompt,
        filename: finalFilename,
        timestamp: Date.now(),
      };

      const updatedBooks = [newBook, ...generatedBooks].slice(0, 10);
      setGeneratedBooks(updatedBooks);
      localStorage.setItem('generatedBooks', JSON.stringify(updatedBooks));

      setResultData({
        filename: finalFilename,
        objectUrl,
        success: true,
        message: `Your book has been created with ${mode} writing style using the ${theme} theme.`,
        title: finalTitle,
        generationTime,
      });
      setShowResultModal(true);

      setGenerationStage('');
      setPrompt('Write a comprehensive guide to machine learning');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Generation failed.');
      setGenerationStage('');
      setShowErrorModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-stone-50 via-purple-50/40 to-white pt-24 pb-16">
      <PatternBackdrop tone="light" />

        <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <p className="mb-3 inline-flex items-center rounded-full border border-purple-300/70 bg-purple-100/70 px-4 py-1 text-xs font-semibold tracking-wide text-purple-900">
            PDFree Studio
          </p>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-stone-900 md:text-5xl">
            Generate your PDF book
          </h1>
          <p className="max-w-2xl text-base text-stone-600 md:text-lg">
            One clean flow. Describe your idea, tweak settings, and download when done.
          </p>
        </motion.div>

        <div className="grid gap-7 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleGenerateBook}
              className="rounded-3xl border border-stone-200 bg-white/95 p-7 shadow-[0_12px_50px_-30px_rgba(41,37,36,0.45)] md:p-8"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-stone-900">Book setup</h2>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
                  Max 5000 chars
                </span>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-600">
                    <Scale className="h-3.5 w-3.5" />
                    Priority
                  </label>
                  <select
                    value={speedLength}
                    onChange={(e) => setSpeedLength(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="super fast">Super Fast</option>
                    <option value="fast">Fast</option>
                    <option value="balanced">Balanced</option>
                    <option value="length">Length (Detail)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-600">
                    <Settings className="h-3.5 w-3.5" />
                    Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (premiumModels.includes(val)) {
                        setShowUnauthorizedModal(true);
                        return;
                      }
                      setModel(val);
                    }}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="llama-3.1-8b-instruct">llama-3.1-8b-instruct</option>
                    <option value="gpt-5.5">gpt-5.5 ★</option>
                    <option value="claude-new">claude-new ★</option>
                    <option value="claude-alt">claude-alt ★</option>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                    <option value="deepseek-chat">deepseek-chat</option>
                    <option value="qwen2.5-7b-instruct">qwen2.5-7b-instruct</option>
                    <option value="mistral-small">mistral-small</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    Writing Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="research">Research (Formal)</option>
                    <option value="technical">Technical (Code Examples)</option>
                    <option value="creative">Creative (Storytelling)</option>
                  </select>
                </div>
              </div>

              <div className="mb-5 rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-600">
                  Optional filename
                </label>
                <input
                  value={filenameInput}
                  onChange={(e) => setFilenameInput(e.target.value)}
                  placeholder="my-book.pdf"
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
                <label className="mt-3 inline-flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={useFilenameAsTitle}
                    onChange={(e) => setUseFilenameAsTitle(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  Use filename as PDF title
                </label>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="mb-4 text-sm font-semibold text-purple-700 transition hover:text-purple-900"
              >
                {showAdvanced ? 'Hide' : 'Show'} more options
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mb-5 grid gap-4 sm:grid-cols-2"
                  >
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-600">
                        <Cog className="h-3.5 w-3.5" />
                        Connect model
                      </label>
                      <select
                        value={connectModel}
                        onChange={(e) => setConnectModel(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100"
                      >
                        <option value="default">Default (PDFree)</option>
                        <option value="custom-api">Custom API Key</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-600">
                        <Palette className="h-3.5 w-3.5" />
                        Theme or style
                      </label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 outline-none transition focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-100"
                      >
                        <option value="professional">Professional</option>
                        <option value="minimal">Minimal</option>
                        <option value="colorful">Colorful</option>
                        <option value="academic">Academic</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-bold text-stone-800">Your request</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  placeholder="Tell me what book you'd like to create..."
                  className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                />
                <p className="mt-2 text-xs text-stone-500">Minimum 5 characters</p>
              </div>

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-2xl border border-purple-300 bg-purple-50 p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Loader className="h-4 w-4 animate-spin text-purple-600" />
                    <p className="text-sm font-semibold text-purple-900">
                      {generationStage || 'Generating your book'}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((segment) => (
                      <motion.div
                        key={segment}
                        className="h-1.5 rounded-full bg-purple-300"
                        animate={{ opacity: [0.35, 1, 0.35] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: segment * 0.18 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full rounded-2xl bg-stone-900 px-5 py-4 text-base font-bold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isGenerating ? 'Generating...' : 'Generate PDF Book'}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32 rounded-3xl border border-stone-200 bg-white/95 p-6 shadow-[0_12px_50px_-34px_rgba(41,37,36,0.55)]">
              <div className="mb-5 flex items-center gap-2">
                <History className="h-5 w-5 text-purple-700" />
                <h3 className="text-xl font-bold text-stone-900">History</h3>
              </div>

              <AnimatePresence>
                {generatedBooks.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500"
                  >
                    No books yet. Your next generation will appear here.
                  </motion.p>
                ) : (
                  <div className="space-y-3">
                    {generatedBooks.map((book) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl border border-stone-200 bg-stone-50 p-3.5"
                      >
                        <p className="truncate text-sm font-semibold text-stone-800">{book.filename}</p>
                        <p className="mt-1 text-xs text-stone-500">{formatDate(book.timestamp)}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showErrorModal && error && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowErrorModal(false)}
                className="fixed inset-0 z-40 bg-black/50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 18 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl mx-4"
              >
                <div className="p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-stone-900">Generation failed</h2>
                      <p className="mt-1 text-sm text-stone-600">Please review the backend response</p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="whitespace-pre-wrap text-sm text-red-800">{error}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowErrorModal(false)}
                      className="flex-1 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        setShowErrorModal(false);
                        setError('');
                      }}
                      className="rounded-xl border border-stone-300 px-6 py-3 font-bold text-stone-900 transition hover:bg-stone-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {showResultModal && resultData && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowResultModal(false)}
                className="fixed inset-0 z-40 bg-black/50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 18 }}
                className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white shadow-2xl mx-4"
              >
                <div className="p-6 md:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-stone-900 md:text-2xl">Book generated</h2>
                      <p className="mt-1 text-sm text-stone-600">{resultData.filename}</p>
                    </div>
                  </div>

                  <p className="mb-5 text-sm text-stone-700 md:text-base">{resultData.message}</p>

                  {resultData.generationTime && (
                    <div className="mb-5 rounded-2xl border border-purple-200 bg-purple-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                        Generation time
                      </p>
                      <p className="mt-1 text-sm font-semibold text-purple-900">
                        {resultData.generationTime}
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="mb-3 text-lg font-semibold text-stone-900">Preview</h3>
                    <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 md:h-72">
                      <div className="text-center">
                        <BookOpen className="mx-auto mb-3 h-12 w-12 text-stone-400 md:h-14 md:w-14" />
                        <p className="font-medium text-stone-700">PDF ready to download</p>
                        <p className="mt-1 text-sm text-stone-500">Open and review after download</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = resultData.objectUrl;
                        downloadLink.download = resultData.filename;
                        downloadLink.click();
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 font-bold text-white transition hover:bg-stone-800"
                    >
                        Download PDF
                    </button>
                    <button
                      onClick={() => setShowResultModal(false)}
                      className="rounded-xl border border-stone-300 px-6 py-3 font-bold text-stone-900 transition hover:bg-stone-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {showUnauthorizedModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUnauthorizedModal(false)}
                className="fixed inset-0 z-40 bg-black/50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 18 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl mx-4"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                      <Lock className="h-6 w-6 text-yellow-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Sign in required</h2>
                      <p className="mt-1 text-sm text-stone-600">This model requires authentication to use.</p>
                    </div>
                  </div>

                  <p className="mb-6 text-sm text-stone-700">Please sign in to access this premium model. Once signed in, you'll be able to select and use it.</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => (window.location.href = '/login')}
                      className="flex-1 rounded-xl bg-yellow-600 px-6 py-3 font-bold text-white transition hover:bg-yellow-700"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => setShowUnauthorizedModal(false)}
                      className="rounded-xl border border-stone-300 px-6 py-3 font-bold text-stone-900 transition hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GeneratorPage;
