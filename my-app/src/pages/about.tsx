import { motion } from 'framer-motion';
import { Heart, Users, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
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
          className="mb-20 rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-12"
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
                  className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-lg transition-all"
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
          className="mb-20 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-12"
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
                name: "Sam Rodriguez",
                role: "Lead Engineer",
                bio: "Full-stack developer passionate about open-source and user-first design.",
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                <p className="text-purple-600 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-slate-600">{member.bio}</p>
              </motion.div>
            ))}
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
              href="#"
              className="px-8 py-4 border border-slate-300 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all"
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
