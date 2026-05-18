import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, CheckCircle2, Sparkles, BookOpen, Lightbulb, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatternBackdrop from '../components/pattern-backdrop';

const API_BASE = import.meta.env.VITE_PDFREE_API_BASE_URL ?? 'http://localhost:8000';

const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    const timer = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        if (current < text.length) {
          setDisplayText(text.slice(0, current + 1));
          current++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, isTyping]);

  return <span>{displayText}</span>;
};

const Landing = () => {
  useEffect(() => {
    const controller = new AbortController();

    const pingHealth = async () => {
      try {
        await fetch(`${API_BASE}/health`, { signal: controller.signal });
      } catch {
        // Ignore health check failures on the public landing page.
      }
    };

    pingHealth();

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <PatternBackdrop tone="light" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white mb-6"
          >
            <Zap className="w-3 h-3 fill-current text-purple-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">The Internet's Last Free Tool</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 mb-6 leading-[1.1]"
          >
            <TypingText text="PDFs should be" delay={300} />
            <span className="text-purple-600 italic block">
              <TypingText text="free. So we made them." delay={800} />
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Generate complete books from prompts, convert PDFs, and edit documents instantly. No paywalls. No limits. No credit cards needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              to="/generate"
              className="w-full sm:w-auto px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
            >
              Start Generating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 glass text-slate-700 font-bold rounded-2xl hover:glass transition-all inline-flex items-center justify-center"
            >
              View Documentation
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.1 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-slate-500 text-sm"
          >
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Sign Up Required</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Privacy Focused</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Export</div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <PatternBackdrop tone="light" className="opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Real World Use Cases</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">See how creators, students, and professionals use PDFree</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Paste a Table of Content",
                description: "Provide a table of contents and let AI generate the complete book with each chapter fleshed out.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Lightbulb,
                title: "Convert Paid PDFs",
                description: "See a premium PDF design? Extract it and let our AI recreate it with your own content.",
                color: "from-amber-500 to-amber-600",
              },
              {
                icon: Layers,
                title: "Batch Conversions",
                description: "Generate multiple books at once, customize styling, and download them all in one go.",
                color: "from-purple-500 to-pink-600",
              },
            ].map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="group rounded-3xl p-8 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className={`bg-gradient-to-br ${useCase.color} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{useCase.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{useCase.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-purple-950 text-white overflow-hidden">
        <PatternBackdrop tone="dark" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Everything you need, nothing you don't</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Generation",
                description: "Our advanced AI creates coherent, well-structured content every time.",
              },
              {
                icon: CheckCircle2,
                title: "Instant Downloads",
                description: "Get your PDF in seconds, ready to use, share, or print.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized servers mean your PDFs are ready before your coffee gets cold.",
              },
              {
                icon: BookOpen,
                title: "Fully Customizable",
                description: "Control page length, tone, detail level, and styling to match your needs.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="flex gap-6 group cursor-pointer"
                >
                  <div className="shrink-0">
                    <div className="bg-purple-600 p-3 rounded-xl group-hover:bg-purple-500 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The PDFree Difference - Feature Showcase */}
      <section className="relative py-24 bg-slate-50 overflow-hidden">
        <PatternBackdrop tone="light" className="opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The PDFree Difference</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Why creators, students, and professionals choose PDFree</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: BookOpen,
                title: "500+ Pages",
                description: "Generate books of any length. No artificial page limits like other tools.",
              },
              {
                icon: Sparkles,
                title: "Zero Watermarks",
                description: "Your PDFs are 100% yours. No branding, no watermarks, no compromises.",
              },
              {
                icon: Zap,
                title: "Entirely Free",
                description: "No hidden paywalls, no freemium tiers, no 'upgrade' nags. Ever.",
              },
              {
                icon: Lightbulb,
                title: "No Signup Required",
                description: "Start generating immediately. Your privacy is protected—always.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl p-6 border border-slate-200 bg-white hover:shadow-md transition-all text-center"
                >
                  <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <PatternBackdrop tone="light" className="opacity-60" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 border border-slate-200 bg-white"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-slate-600 mb-10">Generate your first book in under 2 minutes.</p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 px-10 py-5 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 hover:shadow-xl transition-all group shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40"
            >
              Generate Your First PDF
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 text-slate-300 py-12 border-t border-purple-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">PDFree</h3>
              <p className="text-sm text-slate-400">The internet's last free PDF tool. No limits. No paywalls.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/generate" className="hover:text-white transition">Generate</Link></li>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="hover:text-white transition">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/support" className="hover:text-white transition">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex justify-between items-center">
            <p className="text-sm text-slate-400">&copy; 2026 PDFree. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
