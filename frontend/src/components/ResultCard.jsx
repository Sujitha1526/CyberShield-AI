import { motion } from 'framer-motion';
import { FiAlertOctagon, FiCheckCircle, FiPercent, FiAlertTriangle, FiEdit3 } from 'react-icons/fi';

function HighlightedText({ text, abusiveWords = [] }) {
  if (!abusiveWords.length) return <span>{text}</span>;

  const pattern = new RegExp(`(${abusiveWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        abusiveWords.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-pink-500/25 text-pink-300 rounded px-0.5 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ResultCard({ result, originalText }) {
  if (!result) return null;

  const isBullying = result.prediction === 1;
  const confidence = Math.round((result.confidence || 0) * 100);
  const toxicity   = Math.round((result.toxicityScore || 0) * 100);

  const getConfidenceExplanation = (conf) => {
    if (conf >= 90) return "The AI is highly certain of this prediction due to very clear linguistic patterns matching its training data.";
    if (conf >= 70) return "The AI is fairly confident, though the text may contain some ambiguity or mixed signals.";
    return "The AI is less certain. The message might rely on sarcasm, complex context, or uncommon phrasing.";
  };

  const getToxicityExplanation = (tox, bullying) => {
    if (tox >= 80) return "Severe. The message contains highly aggressive language or multiple explicit abusive words.";
    if (tox >= 50) return "Moderate. The content is flagged as toxic, likely containing some aggressive or disrespectful phrasing.";
    if (bullying) return "Borderline. Detected as cyberbullying, but lacks explicit slurs or extreme hostility.";
    return "Low. The message appears generally safe, with few to no toxic elements detected.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="enterprise-card overflow-hidden"
    >
      {/* Verdict Banner */}
      <div className={`px-6 py-4 flex items-center gap-3 ${
        isBullying
          ? 'bg-gradient-to-r from-pink-600/20 to-red-600/10 border-b border-pink-500/20'
          : 'bg-gradient-to-r from-green-600/15 to-emerald-600/10 border-b border-green-500/20'
      }`}>
        {isBullying
          ? <FiAlertOctagon className="text-pink-400 text-xl flex-shrink-0" />
          : <FiCheckCircle  className="text-green-400 text-xl flex-shrink-0" />
        }
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Analysis Result</p>
          <h3 className={`text-lg font-bold ${isBullying ? 'text-pink-300' : 'text-green-300'}`}>
            {isBullying ? 'Cyberbullying Detected' : 'Message Appears Safe'}
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Metrics row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Confidence */}
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiPercent className="text-blue-400 text-sm" />
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Confidence</p>
            </div>
            <p className="text-2xl font-black text-slate-100">{confidence}%</p>
            <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
              />
            </div>
          </div>

          {/* Toxicity */}
          <div className="enterprise-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className={`text-sm ${toxicity > 50 ? 'text-pink-400' : 'text-amber-400'}`} />
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Toxicity Score</p>
            </div>
            <p className={`text-2xl font-black ${toxicity > 50 ? 'text-pink-300' : 'text-amber-300'}`}>
              {toxicity}%
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${toxicity}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                className={`h-full rounded-full ${
                  toxicity > 50
                    ? 'bg-gradient-to-r from-pink-500 to-red-500'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Score Explanations */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="text-[11px] text-slate-500 leading-relaxed px-1">
            <strong className="text-slate-400">What this means:</strong> {getConfidenceExplanation(confidence)}
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed px-1">
            <strong className="text-slate-400">What this means:</strong> {getToxicityExplanation(toxicity, isBullying)}
          </div>
        </div>

        {/* Highlighted text */}
        {originalText && (
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-2">Analyzed Text</p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 leading-relaxed">
              <HighlightedText text={originalText} abusiveWords={result.abusiveWords || []} />
            </div>
          </div>
        )}

        {/* Abusive words */}
        {result.abusiveWords?.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold mb-2">
              Flagged Terms ({result.abusiveWords.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {result.abusiveWords.map((w) => (
                <span
                  key={w}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/20"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Message Rewrite Suggestion */}
        {isBullying && (
          <div className="mt-6 border-t border-white/[0.06] pt-5">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3 flex items-center gap-2">
              <FiEdit3 className="text-emerald-400" />
              Suggested Rewrite
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-200 leading-relaxed italic flex items-start gap-3">
              <span className="text-xl leading-none">"</span>
              <span className="mt-1">I disagree with your point of view, but I respect your perspective. Let's keep the discussion constructive.</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              * Choosing neutral phrasing helps maintain a safe and welcoming community.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
