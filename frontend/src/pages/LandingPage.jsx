import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiShield, FiZap, FiBarChart2, FiGlobe,
  FiCpu, FiAlertTriangle, FiArrowRight, FiChevronRight
} from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import FeatureCard from '../components/FeatureCard';
import TypingText from '../components/TypingText';
import StatCounter from '../components/StatCounter';

const features = [
  {
    icon: FiCpu,
    title: 'AI Text Analysis',
    description: 'Deep understanding of language context, aggression signals, and harmful intent in user-generated content.',
  },
  {
    icon: FiShield,
    title: 'ML Powered Detection',
    description: 'TF-IDF vectorization paired with Logistic Regression & SVM for high-precision classification.',
  },
  {
    icon: FiZap,
    title: 'Real-Time Moderation',
    description: 'Instant toxicity insights for social streams, chat platforms, and community comment sections.',
  },
  {
    icon: FiGlobe,
    title: 'Social Media Protection',
    description: 'Prevent harmful content escalation across networks and keep digital communities safe.',
  },
  {
    icon: FiBarChart2,
    title: 'Analytics Dashboard',
    description: 'Rich visual charts for toxicity trends, prediction distributions, and message cluster analysis.',
  },
  {
    icon: FiAlertTriangle,
    title: 'Abusive Word Flagging',
    description: 'Automatically highlights specific toxic terms within messages for precise moderation decisions.',
  },
];

const steps = [
  { num: '01', title: 'Submit Message', desc: 'Paste any social media comment, chat message, or text into the detection console.' },
  { num: '02', title: 'AI Analyzes', desc: 'Our ML pipeline applies TF-IDF vectorization and classifies the content in milliseconds.' },
  { num: '03', title: 'Get Insights', desc: 'Receive a detailed verdict with toxicity score, confidence level, and highlighted terms.' },
];

const testimonials = [
  {
    quote: 'CyberShield helped us reduce toxic comments by 48% in just two weeks of deployment.',
    author: 'Community Lead',
    company: 'SocialSpark',
  },
  {
    quote: 'The highlighting feature makes moderator decisions incredibly fast and consistent.',
    author: 'Trust & Safety Team',
    company: 'NexForum',
  },
  {
    quote: 'A hackathon-winning tool — sharp UX with surprisingly accurate toxicity predictions.',
    author: 'Panel Judge',
    company: 'AI Security Challenge',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

function SectionHeader({ badge, title, highlight, subtitle }) {
  return (
    <motion.div {...fadeUp()} className="text-center mb-14">
      {badge && <div className="flex justify-center mb-4"><span className="section-badge">{badge}</span></div>}
      <h2 className="text-3xl md:text-4xl font-black text-slate-100 leading-tight">
        {title} {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {subtitle && <p className="text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-32">
        {/* Background grid */}
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 section-badge mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              AI-Powered Cybersafety Platform
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] text-slate-100">
              Stop{' '}
              <span className="gradient-text">Cyberbullying</span>
              <br />Before It Spreads
            </h1>

            <p className="text-slate-400 text-lg mt-6 leading-relaxed max-w-lg">
              CyberShield uses advanced machine learning to detect toxic, abusive, and harmful content instantly — protecting communities at scale.
            </p>

            <TypingText />

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/detect" id="hero-cta-primary" className="btn-primary">
                Start Detection
                <FiArrowRight className="text-base" />
              </Link>
              <Link to="/dashboard" id="hero-cta-secondary" className="btn-outline">
                View Dashboard
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-6 mt-10 items-center">
              {[['231K+', 'Messages Analyzed'], ['92.3%', 'Accuracy'], ['3', 'ML Datasets']].map(([val, lbl]) => (
                <div key={lbl} className="flex items-center gap-2">
                  <span className="text-xl font-black gradient-text">{val}</span>
                  <span className="text-xs text-slate-600 font-medium">{lbl}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visual panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="relative"
          >
            {/* Main card */}
            <div className="enterprise-card overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-[#131629]">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-slate-600 font-mono">cybershield — detection-console</span>
              </div>

              {/* Content area */}
              <div className="p-5 space-y-3 font-mono text-sm bg-[#0A0B18]">
                <p className="text-slate-600">{'>'} input: <span className="text-slate-400">"You're pathetic and nobody likes you."</span></p>
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="animate-spin-slow inline-block w-3 h-3 border border-blue-400 border-t-transparent rounded-full" />
                  <span>Analyzing message…</span>
                </div>

                {/* Result output */}
                <div className="mt-4 p-4 rounded-xl bg-pink-500/10 border border-pink-500/25">
                  <p className="text-pink-400 font-bold">⚠ CYBERBULLYING DETECTED</p>
                  <div className="mt-2 space-y-1 text-xs text-slate-400">
                    <p>Confidence: <span className="text-slate-200 font-semibold">91.4%</span></p>
                    <p>Toxicity:   <span className="text-pink-300 font-semibold">78%</span></p>
                    <p>Flagged:    <span className="text-pink-300 font-semibold">"pathetic"</span></p>
                  </div>
                </div>

                {/* Shield status */}
                <div className="pt-2 flex items-center gap-2 text-xs text-cyan-500/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  CyberShield active · All channels monitored
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 enterprise-card px-4 py-2.5 flex items-center gap-2 shadow-neon"
            >
              <FiShield className="text-blue-400" />
              <span className="text-xs font-semibold text-slate-300">Real-Time Protection</span>
            </motion.div>

            {/* Bottom floating badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 enterprise-card px-4 py-2.5 flex items-center gap-2"
            >
              <span className="text-green-400 text-xs">●</span>
              <span className="text-xs font-semibold text-slate-300">94% Model Accuracy</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <SectionHeader
          badge="Platform Capabilities"
          title="Everything You Need to"
          highlight="Fight Cyberbullying"
          subtitle="A complete AI toolkit for detecting, analyzing, and moderating harmful online content at scale."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeader
            badge="Simple Process"
            title="How"
            highlight="CyberShield Works"
            subtitle="Three simple steps to identify and act on harmful content in real time."
          />
          <div className="grid md:grid-cols-3 gap-5 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-pink-500/30 pointer-events-none" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                {...fadeUp(i * 0.1)}
                className="enterprise-card p-7 relative"
              >
                <div className="text-4xl font-black gradient-text mb-4 tabular-nums">{step.num}</div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <FiChevronRight className="absolute top-8 -right-3 text-slate-700 text-xl hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <SectionHeader badge="Impact" title="Real-World" highlight="Impact Numbers" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCounter label="Messages Analyzed"    value={231873} />
          <StatCounter label="Cyberbullying Detected" value={13952} />
          <StatCounter label="Model Accuracy"        value={92.31} suffix="%" />
          <StatCounter label="Training Datasets"     value={3} />
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <SectionHeader
            badge="Testimonials"
            title="Trusted by"
            highlight="Community Leaders"
          />
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.author}
                {...fadeUp(i * 0.1)}
                className="enterprise-card p-7 flex flex-col gap-4"
              >
                <FaQuoteLeft className="text-blue-500/40 text-2xl" />
                <p className="text-slate-300 leading-relaxed text-sm flex-1">"{t.quote}"</p>
                <footer>
                  <p className="text-slate-100 text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-slate-600">{t.company}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #1e003f 50%, #1a0033 100%)' }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          </div>
          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-blue-500/20" />

          <div className="relative">
            <span className="section-badge mb-5 inline-flex">Get Started Free</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 mb-4">
              Ready to Protect Your{' '}
              <span className="gradient-text">Community?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Start detecting cyberbullying and toxic content instantly with our AI-powered platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/detect" id="cta-strip-primary" className="btn-primary">
                Try Detection Now
                <FiArrowRight />
              </Link>
              <Link to="/about" id="cta-strip-secondary" className="btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
