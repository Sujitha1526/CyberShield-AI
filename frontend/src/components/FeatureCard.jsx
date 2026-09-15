import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="enterprise-card p-6 group cursor-default"
    >
      {/* Icon */}
      <div className="icon-pill mb-5 group-hover:scale-110 transition-transform duration-300">
        {Icon && <Icon className="text-blue-400 text-lg" />}
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-slate-100 mb-2 leading-snug">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>

      {/* Hover accent line */}
      <div className="mt-5 h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-violet-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}
