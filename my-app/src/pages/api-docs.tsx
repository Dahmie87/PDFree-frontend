import { motion } from 'framer-motion';
import { BookOpen, Key, Code, ServerCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatternBackdrop from '../components/pattern-backdrop';

const ApiDocs = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative py-16">
        <PatternBackdrop tone="light" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 bg-white mb-4">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700">API Documentation</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">PDFree API Reference</h1>
            <p className="text-lg text-slate-600">Generate, customize, and download PDFs programmatically with simple REST endpoints.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              {/* Overview */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-600" />
                  Overview
                </h3>
                <p className="text-slate-600">The PDFree API allows you to generate professional PDFs from text prompts. Submit a generation request with customization options and receive a downloadable PDF or preview link.</p>
              </motion.section>

              {/* Base URL */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-3">Base URL</h3>
                <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-700">
                  https://api.pdfree.com/v1
                </div>
              </motion.section>

              {/* Authentication */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-600" />
                  Authentication
                </h3>
                <p className="text-slate-600 mb-4">Include your API key in the Authorization header for all requests.</p>
                <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
                  <pre>Authorization: Bearer YOUR_API_KEY</pre>
                </div>
                <p className="text-xs text-slate-500 mt-2">Keep keys secure. Rotate regularly and never commit to version control.</p>
              </motion.section>

              {/* Endpoint */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-4">Generate Book — POST /generate-book</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Request</h4>
                  <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-auto">
                    <pre>{`POST /generate-book
Content-Type: application/json

{
  "prompt": "Write a beginner's guide to machine learning",
  "length_priority": "balanced",
  "filename": "ml-guide.pdf"
}`}</pre>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Parameters</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li><span className="font-mono bg-purple-50 px-2 py-1 rounded">prompt</span> <span className="text-red-500">*required</span> — Description or topic for the PDF</li>
                    <li><span className="font-mono bg-purple-50 px-2 py-1 rounded">length_priority</span> — One of: `super_fast`, `fast`, `balanced`, `length` (default: balanced)</li>
                    <li><span className="font-mono bg-purple-50 px-2 py-1 rounded">filename</span> — Optional custom filename (default: generated)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h4>
                  <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-auto">
                    <pre>{`Content-Type: application/pdf
Content-Disposition: attachment; filename="ml-guide.pdf"

[PDF Binary Data]`}</pre>
                  </div>
                </div>
              </motion.section>

              {/* Code Examples */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-4">Examples</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">cURL</h4>
                  <div className="bg-slate-50 rounded-lg p-4 font-mono text-xs overflow-auto">
                    <pre>{`curl -X POST https://api.pdfree.com/v1/generate-book \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A guide to sustainable gardening",
    "length_priority": "balanced"
  }' \\
  --output guide.pdf`}</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">JavaScript/TypeScript</h4>
                  <div className="bg-slate-50 rounded-lg p-4 font-mono text-xs overflow-auto">
                    <pre>{`const response = await fetch('https://api.pdfree.com/v1/generate-book', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A guide to sustainable gardening',
    length_priority: 'balanced',
  }),
});

const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'guide.pdf';
a.click();`}</pre>
                  </div>
                </div>
              </motion.section>

              {/* Error Handling */}
              <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl p-8 border border-slate-200 bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-4">Error Handling</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono font-semibold text-red-600 mb-2">400 Bad Request</h4>
                    <div className="bg-slate-50 rounded p-3 text-sm">Invalid or missing parameters. Check prompt length (&gt;5 chars) and length_priority values.</div>
                  </div>
                  <div>
                    <h4 className="font-mono font-semibold text-red-600 mb-2">401 Unauthorized</h4>
                    <div className="bg-slate-50 rounded p-3 text-sm">Missing or invalid API key. Verify Authorization header.</div>
                  </div>
                  <div>
                    <h4 className="font-mono font-semibold text-red-600 mb-2">500 Internal Server Error</h4>
                    <div className="bg-slate-50 rounded p-3 text-sm">Server error. Retry with exponential backoff. Contact support if persistent.</div>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm sticky top-24">
                <h4 className="font-bold text-slate-900 mb-3">Quick Start</h4>
                <Link to="/generate" className="block w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition text-center mb-3">
                  Try Generator
                </Link>
                <a href="https://docs.pdfree.com/api-keys" target="_blank" rel="noopener noreferrer" className="block w-full px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition text-center">
                  Get API Key
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <ServerCog className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-slate-900">Performance</h4>
                </div>
                <p className="text-sm text-slate-600">Typical response time: 3–15 seconds depending on prompt length and priority setting.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
                <h4 className="font-bold text-slate-900 mb-3">Related</h4>
                <ul className="text-sm space-y-2">
                  <li><a href="https://github.com/pdfree/samples" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">GitHub Samples</a></li>
                  <li><Link to="/support" className="text-purple-600 hover:underline">Support</Link></li>
                  <li><a href="https://status.pdfree.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Status Page</a></li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiDocs;
