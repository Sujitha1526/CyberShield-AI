import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiZap, FiEdit3, FiArrowRight } from 'react-icons/fi';
import { analyzeText, saveAnalysis } from '../utils/api';
import ResultCard from '../components/ResultCard';

const sampleText = 'You are so dumb and worthless, nobody likes you.';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

export default function DetectionPage() {
  const [text,    setText]    = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [liveResult, setLiveResult] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!text.trim()) {
        setLiveResult(null);
        return;
      }
      setLiveLoading(true);
      try {
        const response = await analyzeText(text);
        setLiveResult(response);
      } catch (err) {
        // fail silently for live updates
      } finally {
        setLiveLoading(false);
      }
    }, 600); // 600ms debounce
    return () => clearTimeout(handler);
  }, [text]);

  const runAnalysis = async () => {
    if (!text.trim()) { setError('Please enter a message to analyze.'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await analyzeText(text);
      setResult(response);
      await saveAnalysis({
        text,
        prediction:   response.prediction,
        confidence:   response.confidence,
        toxicityScore: response.toxicityScore,
        abusiveWords:  response.abusiveWords,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">

      {/* Page header */}
      <motion.div {...fadeUp()} className="mb-12">
        <span className="section-badge mb-4 inline-flex">
          <FiZap className="text-xs" />
          AI Detection Console
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-100 leading-tight">
          Analyze Any <span className="gradient-text">Message</span>
        </h1>
        <p className="text-slate-500 mt-3 max-w-xl leading-relaxed">
          Paste any social media comment or chat message and let CyberShield evaluate its toxicity, aggression level, and abusive intent instantly.
        </p>
      </motion.div>

      {/* Two-column layout: Input | Result */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">

        {/* Left: Input Console */}
        <motion.div {...fadeUp(0.1)} className="space-y-4">
          <div className="enterprise-card overflow-hidden">
            {/* Console header bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-[#131629]">
              <FiEdit3 className="text-blue-400 text-sm" />
              <span className="text-xs text-slate-500 font-medium">Message Input</span>
              <span className="ml-auto text-xs text-slate-700 font-mono">{text.length} chars</span>
            </div>

            <div className="p-5 space-y-4">
              <textarea
                id="message"
                rows={9}
                value={text}
                onChange={(e) => { setText(e.target.value); setError(''); }}
                placeholder="Paste a social media comment, chat message, or any text to analyze…"
                className="cyber-input"
              />

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-pink-400 bg-pink-500/10 border border-pink-500/20 rounded-xl px-4 py-3">
                  <FiAlertCircle className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Live Toxicity Meter */}
              {text.trim() && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 bg-slate-900/50 mt-2">
                   <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                     Message Toxicity:
                   </div>
                   {liveLoading ? (
                     <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                   ) : liveResult ? (
                     <div className="flex items-center gap-3">
                       <span className={`text-sm font-black ${liveResult.toxicityScore * 100 > 75 ? 'text-pink-400' : liveResult.toxicityScore * 100 > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                         {Math.round(liveResult.toxicityScore * 100)}%
                       </span>
                     </div>
                   ) : (
                     <span className="text-sm text-slate-500">-</span>
                   )}
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex items-center gap-3 text-sm text-blue-400 bg-blue-500/8 border border-blue-500/15 rounded-xl px-4 py-3">
                  <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  AI scanning message structure and toxicity signals…
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  id="btn-analyze"
                  onClick={runAnalysis}
                  disabled={loading}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  {loading ? 'Analyzing…' : 'Analyze Message'}
                  {!loading && <FiArrowRight />}
                </button>
                <button
                  id="btn-sample"
                  onClick={() => { setText(sampleText); setResult(null); setError(''); }}
                  className="btn-outline"
                >
                  Load Sample
                </button>
                {text && (
                  <button
                    id="btn-clear"
                    onClick={() => { setText(''); setResult(null); setError(''); }}
                    className="btn-outline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tips card */}
          <div className="enterprise-card p-5">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold mb-3">Detection Tips</p>
            <ul className="space-y-2 text-sm text-slate-500">
              {[
                'Works best with complete sentences or phrases',
                'Load a sample to see the detection in action',
                'Results include confidence score and flagged terms',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Right: Result */}
        <motion.div {...fadeUp(0.2)}>
          {result ? (
            <ResultCard result={result} originalText={text} />
          ) : (
            <div className="enterprise-card h-full min-h-[280px] flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <FiZap className="text-blue-400 text-2xl" />
              </div>
              <h3 className="text-slate-400 font-semibold mb-2">Awaiting Analysis</h3>
              <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
                Submit a message to see the AI analysis results and toxicity breakdown here.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
