import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Book, AlertCircle, ChevronDown } from 'lucide-react';
import PatternBackdrop from '../components/pattern-backdrop';

const SupportPage = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is PDFree really free?",
      answer: "Yes, 100%. PDFree is completely free with no hidden charges, paywalls, or freemium limitations. We generate PDFs for everyone equally.",
    },
    {
      question: "What happens to my data after I generate a PDF?",
      answer: "Your data is not stored on our servers. PDFs are generated, sent to you immediately, and deleted. We don't track, sell, or use your data for training AI models.",
    },
    {
      question: "How long does PDF generation take?",
      answer: "Typically 1-2 minutes depending on complexity and book length. We send real-time progress updates so you know what stage we're at.",
    },
    {
      question: "Can I customize the PDF format?",
      answer: "Yes! You can adjust page length, tone (temperature), number of chapters, and styling options before generation.",
    },
    {
      question: "Do I need an account to use PDFree?",
      answer: "No account required. However, creating one lets you save your generation history and customize your preferences.",
    },
    {
      question: "Can I use generated PDFs commercially?",
      answer: "Yes, all PDFs generated are yours to use however you want—personally, commercially, or however suits your needs.",
    },
    {
      question: "What if the AI generates incorrect information?",
      answer: "AI can hallucinate. Always review generated content carefully, especially for technical or factual material. We're working on improving accuracy.",
    },
    {
      question: "How do I report a bug or suggest a feature?",
      answer: "Use the feedback form on this page or email us at feedback@pdfree.dev. We read and consider every suggestion.",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Response within 24 hours",
      contact: "support@pdfree.dev",
    },
    {
      icon: MessageCircle,
      title: "Discord Community",
      description: "Chat with other users",
      contact: "Join Discord",
    },
    {
      icon: Book,
      title: "Documentation",
      description: "Self-serve help articles",
      contact: "View Docs",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white pt-24 pb-16 overflow-hidden">
      <PatternBackdrop tone="light" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">How Can We Help?</h1>
          <p className="text-xl text-slate-600">
            Find answers to common questions or reach out to our support team
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-8 text-center hover:shadow-lg transition-all group"
              >
                <div className="bg-purple-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{method.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{method.description}</p>
                <a
                  href={method.contact.includes('@') ? `mailto:${method.contact}` : '#'}
                  className="text-purple-600 font-bold hover:text-purple-700 transition"
                >
                  {method.contact}
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="glass rounded-2xl overflow-hidden hover:shadow-md transition-all"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-purple-50/50 transition"
                >
                  <h3 className="font-bold text-slate-900 text-lg">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openFAQ === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openFAQ === idx ? 'auto' : 0,
                    opacity: openFAQ === idx ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-slate-600 border-t border-slate-200 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Send Us Feedback</h2>
          <p className="text-slate-600 mb-8">
            Have a question that's not answered above? Or want to suggest a feature? We'd love to hear from you.
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-xl glass-sm px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Subject</label>
              <input
                type="text"
                placeholder="What's your question or suggestion?"
                className="w-full rounded-xl glass-sm px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Message</label>
              <textarea
                rows={6}
                placeholder="Tell us what's on your mind..."
                className="w-full rounded-xl glass-sm px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Status Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mt-20 glass rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-green-900">All Systems Operational</h3>
              <p className="text-sm text-green-800 mt-1">
                PDFree is running smoothly. Check our <a href="#" className="underline font-bold">status page</a> for real-time updates.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;
