import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function StickyNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors ${isActive ? 'text-brand-700' : 'text-neutral-500 hover:text-neutral-900'}`;

  const renderActiveIndicator = ({ isActive }) =>
    isActive ? <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-brand-500 rounded-full" /> : null;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text">NotesHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={linkClass} end>{renderActiveIndicator({ isActive: false })}Browse</NavLink>
            <NavLink to="/upload" className={linkClass}>{renderActiveIndicator({ isActive: false })}Upload</NavLink>
            <NavLink to="/profile" className={linkClass}>{renderActiveIndicator({ isActive: false })}Profile</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-500 hover:text-neutral-900"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-down bg-white/80 backdrop-blur-xl rounded-3xl p-4 mb-2 space-y-3">
            <NavLink to="/" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-neutral-700 hover:text-brand-600">Browse</NavLink>
            <NavLink to="/upload" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-neutral-700 hover:text-brand-600">Upload</NavLink>
            <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-neutral-700 hover:text-brand-600">Profile</NavLink>
            <hr className="border-neutral-200" />
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-neutral-500 hover:text-neutral-900">Sign In</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-brand-700 hover:text-brand-800">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
