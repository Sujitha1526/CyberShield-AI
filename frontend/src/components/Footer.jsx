import { Link } from 'react-router-dom';
import { FiShield, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const footerLinks = {
  Product: [
    { label: 'Detection',  to: '/detect' },
    { label: 'Dashboard',  to: '/dashboard' },
    { label: 'About',      to: '/about' },
  ],
  Technology: [
    { label: 'TF-IDF NLP',         to: '/about' },
    { label: 'ML Classification',  to: '/about' },
    { label: 'Real-Time Analysis', to: '/detect' },
  ],
  Resources: [
    { label: 'Jigsaw Dataset',     to: '/about' },
    { label: 'Twitter Dataset',    to: '/about' },
    { label: 'Hate Speech Data',   to: '/about' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#0D0F1E] mt-32">

      {/* Top gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">

        {/* Grid: Brand + Links */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5" id="footer-logo">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <FiShield className="text-white text-lg" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                Cyber<span className="gradient-text">Shield</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered cyberbullying detection platform keeping digital communities safer through machine learning.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: FiGithub,   href: '#', label: 'GitHub' },
                { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
                { icon: FiTwitter,  href: '#', label: 'Twitter' },
                { icon: FiMail,     href: '#', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-500 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} CyberShield. All rights reserved.</p>
          <p>Built with AI · Protecting Digital Communities</p>
        </div>
      </div>
    </footer>
  );
}
