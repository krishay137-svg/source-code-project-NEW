import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-brand-100/60 bg-white/40 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-lg font-bold gradient-text">NotesHub</span>
            </div>
            <p className="text-sm text-neutral-500 max-w-xs">
              Share notes, collaborate, and learn faster with your peers.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-neutral-500 hover:text-brand-600 transition-colors">Browse Notes</Link></li>
              <li><Link to="/upload" className="text-sm text-neutral-500 hover:text-brand-600 transition-colors">Upload</Link></li>
              <li><Link to="/login" className="text-sm text-neutral-500 hover:text-brand-600 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-sm text-neutral-500 hover:text-brand-600 transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">About</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-neutral-500">A collaborative e-learning notes sharing platform built with React, Tailwind CSS, and Express.</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-100/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} NotesHub. All rights reserved.</p>
          <p className="text-xs text-neutral-400">React + Tailwind CSS + Express + SQLite</p>
        </div>
      </div>
    </footer>
  );
}
