import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader, CheckCircle2, AlertCircle, Trash2, History, Settings, Scale, BookOpen, Cog, Sparkles, Brain, Palette } from 'lucide-react';
import PatternBackdrop from '../components/pattern-backdrop';

interface GeneratedBook {
  id: string;
  prompt: string;
  filename: string;
  timestamp: number;
  blob?: Blob;
}

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface ThinkingStep {
  id: string;
  action: string;
  status: 'pending' | 'in-progress' | 'completed';
  duration?: number;
}

const API_BASE = import.meta.env.VITE_PDFREE_API_BASE_URL ?? 'http://localhost:8000';

const GeneratorPage = () => {
  const [prompt, setPrompt] = useState('Write a comprehensive guide to machine learning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedBooks, setGeneratedBooks] = useState<GeneratedBook[]>([]);
  const [generationStage, setGenerationStage] = useState('');
  
  // Chat and thinking process
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  // PDF filename/title customization
  const [filenameInput, setFilenameInput] = useState('');
  const [useFilenameAsTitle, setUseFilenameAsTitle] = useState(true);

  // Result modal state
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<{ filename: string; objectUrl: string; success: boolean; message: string; title?: string } | null>(null);

  // Custom PDF metadata (single optional filename + checkbox to use as title)
  // `filenameInput` and `useFilenameAsTitle` declared above

  // Customization options
  const [model, setModel] = useState('gpt-4');
  const [speedLength, setSpeedLength] = useState('balanced');
  const [mode, setMode] = useState('creative');
  const [theme, setTheme] = useState('professional');
  const [connectModel, setConnectModel] = useState('default');

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
    setSuccess('');
    setGenerationStage('Initializing book generation...');
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: trimmedPrompt,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Add thinking steps
    const initialSteps: ThinkingStep[] = [
      { id: '1', action: 'Analyzing your request and context', status: 'in-progress' },
      { id: '2', action: 'Structuring book outline', status: 'pending' },
      { id: '3', action: 'Generating table of contents', status: 'pending' },
      { id: '4', action: 'Writing chapters and content', status: 'pending' },
      { id: '5', action: 'Applying theme and styling', status: 'pending' },
      { id: '6', action: 'Compiling PDF', status: 'pending' },
    ];
    setThinkingSteps(initialSteps);

    try {
      // Simulate step progression
      let currentStep = 0;
      const stepInterval = setInterval(() => {
        if (currentStep < initialSteps.length - 1) {
          currentStep++;
          setThinkingSteps((prev) =>
            prev.map((step, idx) => {
              if (idx === currentStep) return { ...step, status: 'in-progress' };
              if (idx < currentStep) return { ...step, status: 'completed' };
              return step;
            })
          );
        } else {
          clearInterval(stepInterval);
        }
      }, 2000);

      const response = await fetch(`${API_BASE}/generate-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          length_priority: speedLength,
        }),
      });

      clearInterval(stepInterval);
      
      // Mark all steps as completed
      setThinkingSteps((prev) =>
        prev.map((step) => ({ ...step, status: 'completed' }))
      );

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
      const finalFilename = filenameInput.trim() ? ensurePdfExtension(filenameInput.trim()) : filename;
      const finalTitle = useFilenameAsTitle && filenameInput.trim() ? filenameInput.trim().replace(/\.pdf$/i, '') : '';

      // Add agent message to chat
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `✓ Generated "${finalFilename}" successfully!\n\nYour book has been created with ${mode} writing style using the ${theme} theme.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMessage]);

      // Add to history
      const newBook: GeneratedBook = {
        id: Date.now().toString(),
        prompt: trimmedPrompt,
        filename: finalFilename,
        timestamp: Date.now(),
      };

      const updatedBooks = [newBook, ...generatedBooks].slice(0, 10);
      setGeneratedBooks(updatedBooks);
      localStorage.setItem('generatedBooks', JSON.stringify(updatedBooks));

      // Show result modal with preview
      setResultData({
        filename: finalFilename,
        objectUrl,
        success: true,
        message: `Your book has been created with ${mode} writing style using the ${theme} theme.`,
        title: finalTitle,
      });
      setShowResultModal(true);

      setGenerationStage('');
      setPrompt('Write a comprehensive guide to machine learning');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Generation failed.');
      setGenerationStage('');
      setShowErrorModal(true);
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
            Turn your ideas into a beautiful, professionally formatted PDF book in seconds.
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
            <form onSubmit={handleGenerateBook} className="rounded-3xl p-8 border border-slate-200 bg-white shadow-md">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Book Details</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Customization</label>
                <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-1 lg:grid-cols-3">
                  {/* Priority Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      Priority
                    </label>
                    <select
                      value={speedLength}
                      onChange={(e) => setSpeedLength(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="super fast" className="bg-white">Super Fast</option>
                      <option value="fast" className="bg-white">Fast</option>
                      <option value="balanced" className="bg-white">Balanced</option>
                      <option value="length" className="bg-white">Length (Detail)</option>
                    </select>
                  </div>

                  {/* Model Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                      <Settings className="w-3 h-3" />
                      Model
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="gpt-4" className="bg-white">GPT-4 (Best Quality)</option>
                      <option value="gpt-3.5" className="bg-white">GPT-3.5 (Fast)</option>
                      <option value="gpt-4o" className="bg-white">GPT-4o (Balanced)</option>
                    </select>
                  </div>

                  {/* Writing Mode */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Writing Mode
                    </label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="research" className="bg-white">Research (Formal)</option>
                      <option value="technical" className="bg-white">Technical (Code Examples)</option>
                      <option value="creative" className="bg-white">Creative (Storytelling)</option>
                    </select>
                  </div>
                </div>

                {/* Filename (optional) and checkbox to use as title */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-600 mb-2">Filename (optional)</label>
                  <input
                    value={filenameInput}
                    onChange={(e) => setFilenameInput(e.target.value)}
                    placeholder="my-book.pdf"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                  <label className="inline-flex items-center gap-2 mt-3 text-sm">
                    <input
                      type="checkbox"
                      checked={useFilenameAsTitle}
                      onChange={(e) => setUseFilenameAsTitle(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-slate-700">Use filename as PDF title</span>
                  </label>
                </div>

                {/* Advanced Options Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition flex items-center gap-2 mb-4"
                >
                  {showAdvanced ? 'Hide' : 'Show'} More Options
                </button>

                {/* Advanced Customization */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-3"
                    >
                      {/* Connect Your Model */}
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                          <Cog className="w-3 h-3" />
                          Connect Your Model
                        </label>
                        <select
                          value={connectModel}
                          onChange={(e) => setConnectModel(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        >
                          <option value="default">Default (PDFree)</option>
                          <option value="custom-api">Custom API Key</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>

                      {/* Theme or Style */}
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          Theme or Style
                        </label>
                        <select
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Your Request</label>
                <div className="flex gap-3">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    placeholder="Tell me what book you'd like to create..."
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Minimum 5 characters • Max 5000 characters</p>
              </div>

              {/* Chat Conversation */}
              {messages.length > 0 && (
                <div className="mb-6 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-purple-600 text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Thinking/Action Steps */}
              {thinkingSteps.length > 0 && isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-2xl p-6 border border-slate-200 bg-blue-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">Agent Status</h3>
                  </div>
                  <div className="min-h-8 flex items-center">
                    <AnimatePresence mode="wait">
                      {thinkingSteps
                        .filter((step) => step.status === 'in-progress')
                        .map((step) => (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3"
                          >
                            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                            <span className="text-sm text-blue-700 font-medium">
                              {step.action}...
                            </span>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-2xl p-6 border border-blue-200 bg-blue-50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-semibold text-slate-900">Generating Your Book</h3>
                  </div>
                  {generationStage && (
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-700 mb-3">
                      {generationStage}
                    </p>
                  )}
                  <div className="w-full bg-blue-200 rounded-full h-2 border border-blue-300">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 8 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2">Processing your request...</p>
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

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40"
              >
                {isGenerating ? (
                  <>
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
            <div className="rounded-3xl p-6 sticky top-32 border border-slate-200 bg-white shadow-md">
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
                        className="rounded-xl p-4 group hover:shadow-md transition-all border border-slate-200 bg-white hover:border-slate-300"
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
                            className="flex items-center justify-center text-red-600 p-2 rounded-lg hover:bg-red-50 transition border border-red-200"
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

        {/* Result Modal */}
        <AnimatePresence>
          {showErrorModal && error && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowErrorModal(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 18 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 max-w-lg w-full mx-4"
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Generation Failed</h2>
                      <p className="text-sm text-slate-600 mt-1">Please review the backend response</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-6">
                    <p className="text-sm text-red-800 whitespace-pre-wrap">{error}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowErrorModal(false)}
                      className="flex-1 py-3 px-6 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        setShowErrorModal(false);
                        setError('');
                      }}
                      className="py-3 px-6 border border-slate-300 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all"
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
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowResultModal(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  {/* Success Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Book Generated Successfully!</h2>
                      <p className="text-sm text-slate-600 mt-1">{resultData.filename}</p>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-slate-700 mb-6">{resultData.message}</p>

                  {/* Preview Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Preview</h3>
                    <div className="bg-slate-100 rounded-xl p-8 border-2 border-dashed border-slate-300 flex items-center justify-center h-96">
                      <div className="text-center">
                        <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-600 font-medium">PDF Preview</p>
                        <p className="text-sm text-slate-500 mt-1">Your book is ready to download</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = resultData.objectUrl;
                        downloadLink.download = resultData.filename;
                        downloadLink.click();
                      }}
                      className="flex-1 py-3 px-6 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
                    >
                      <Download className="w-5 h-5" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => setShowResultModal(false)}
                      className="py-3 px-6 border border-slate-300 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Close
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
