import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function StatCounter({ label, value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const [inView,  setInView]  = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(easeOutExpo(t) * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="enterprise-card stat-card p-6 text-center"
    >
      <p className="text-4xl font-black gradient-text tabular-nums">
        {display.toLocaleString()}{suffix}
      </p>
      <p className="text-slate-500 text-sm mt-2 font-medium">{label}</p>
    </motion.div>
  );
}
