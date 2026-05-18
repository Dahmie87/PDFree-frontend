import { motion } from 'framer-motion';
import { Heart, Users, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatternBackdrop from '../components/pattern-backdrop';

const AboutPage = () => {
  const profile = {
    name: 'Omotayo Damilare',
    title: 'Lead AI Engerr',
    website: 'https://www.omotayodamilare.me/',
    github: 'https://github.com/Dahmie87',
    projects: 'https://www.omotayodamilare.me/projects',
    bio: `Software Engineer with a niche in AI. I engineer software with AI at the core combining full-stack development with large language models to build applications that are not just functional, but intelligent.`,
  };

  return (
    <div className="relative min-h-screen bg-white pt-24 pb-16 overflow-hidden">
      <PatternBackdrop tone="light" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Made for Everyone, By Everyone
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            PDFree isn't just a tool—it's a movement to democratize digital document creation and make professional-quality PDFs accessible to everyone, regardless of budget or technical skill.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 rounded-3xl p-12 border border-slate-200 bg-white shadow-md"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            Every day, millions of people pay $10-20/month just to convert a few documents into PDFs or edit them. We believe that's wrong. Document creation shouldn't be a luxury—it's a fundamental utility in the digital age. PDFree exists to prove that you can build powerful, free tools without compromising on quality or drowning users in ads and dark patterns.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "User-First Design",
                description: "We prioritize your needs over profit margins. Every feature is built for you.",
              },
              {
                icon: Globe,
                title: "Truly Free",
                description: "No hidden paywalls, no freemium traps. PDFree works the same for everyone.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Your time matters. We optimize for speed at every step.",
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Built with feedback from real users who rely on us every day.",
              },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="rounded-2xl p-8 border border-slate-200 bg-white hover:shadow-lg transition-all"
                >
                  <div className="bg-purple-100 p-3 rounded-xl w-fit mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 rounded-3xl bg-purple-950 text-white p-12"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">By The Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Users" },
              { number: "500K+", label: "PDFs Generated" },
              { number: "0", label: "Ads" },
              { number: "100%", label: "Free" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold text-purple-400 mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">The Story</h2>
          <div className="space-y-6 text-slate-700 leading-relaxed text-lg max-w-4xl">
            <p>
              PDFree started on a Tuesday afternoon when our founder spent $20 to convert a single PDF document, then realized millions of others were doing the same thing. Frustrated with $19.99/month subscriptions for basic functionality, we decided to build something different.
            </p>
            <p>
              What began as a weekend project turned into a full-time mission. We assembled a team of engineers passionate about building beautiful, functional tools that respect users' time and wallets. We proved that profitable companies don't need to resort to dark patterns, AI-training data theft, or paywalls to sustain themselves.
            </p>
            <p>
              Today, PDFree is used by students, professionals, and creators worldwide. We're not backed by venture capital (no pressure to sell your data), and we're not profitable (yet). Every feature is designed based on real user feedback, and every decision is made with your interests in mind.
            </p>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Small Team, Big Impact</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Founder & CEO",
                bio: "Former software engineer at Google. Frustrated with PDF tools, decided to build a better one.",
              },
              {
                name: profile.name,
                role: profile.title,
                bio: profile.bio,
              },
              {
                name: "Jordan Kim",
                role: "Product Designer",
                bio: "Design lead focused on simplicity and accessibility. Makes sure PDFree doesn't suck.",
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-200 bg-white p-8 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-purple-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-purple-600 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-slate-600">{member.bio}</p>
                {member.name === profile.name && (
                  <div className="mt-4 flex justify-center gap-3">
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 font-semibold">Portfolio</a>
                    <a href={profile.projects} target="_blank" rel="noopener noreferrer" className="text-sm text-stone-700">Projects</a>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-sm text-stone-700">GitHub</a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What People Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700 mb-4">“Omotayo's AI-first approach turned our prototype into a production-ready feature in weeks. His LLM integrations are thoughtful and reliable.”</p>
              <p className="text-sm font-semibold text-slate-900">— Product team lead</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700 mb-4">“Smart, pragmatic engineering. The project improved performance and user satisfaction after his contributions.”</p>
              <p className="text-sm font-semibold text-slate-900">— User researcher</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-700 mb-4">“Combines full-stack skill with deep model knowledge — ideal for building practical AI products.”</p>
              <p className="text-sm font-semibold text-slate-900">— Open-source contributor</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Join Us in Making PDFs Free</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Whether you're a user, contributor, or just passionate about free tools, we'd love to have you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generate"
              className="px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all"
            >
              Start Using PDFree
            </Link>
            <a
              href={profile.github}
              className="px-8 py-4 border border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all"
              target="_blank" rel="noopener noreferrer"
            >
              Contribute on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
