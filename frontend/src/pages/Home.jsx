import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import NoteCard from '../components/NoteCard';
import NoteCardSkeleton from '../components/NoteCardSkeleton';

const GRAIN_DATA_URI = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E`;

const subjects = ['All Subjects', 'Mathematics', 'Chemistry', 'Computer Science', 'Physics', 'Biology'];

export default function Home() {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (subject && subject !== 'All Subjects') params.subject = subject;
      const data = await api.get('/notes', { params });
      setNotes(data.notes || []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [search, subject]);

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  return (
    <div className="page-enter">
      <section className="relative min-h-screen flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/hero-bg.jpg')` }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `url("${GRAIN_DATA_URI}")`, backgroundSize: '256px 256px', opacity: 0.03 }}
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-30 pt-4 px-4">
          <div className="max-w-5xl mx-auto rounded-full bg-white/70 backdrop-blur-xl ring-1 ring-white/60 px-6 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="font-bold text-neutral-900">NotesHub</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#browse" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Browse</a>
              <Link to="/upload" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Upload</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Sign In</Link>
              <Link to="/register" className="bg-neutral-900 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-neutral-800 transition-colors">Login</Link>
            </div>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-1 text-neutral-500"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileNavOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileNavOpen && (
            <div className="max-w-5xl mx-auto mt-2 bg-white/90 backdrop-blur-xl rounded-3xl p-4 animate-slide-down shadow-lg">
              <a href="#browse" onClick={() => setMobileNavOpen(false)} className="block py-2 text-sm font-medium text-neutral-700">Browse</a>
              <Link to="/upload" onClick={() => setMobileNavOpen(false)} className="block py-2 text-sm font-medium text-neutral-700">Upload</Link>
              <hr className="my-2 border-neutral-200" />
              <Link to="/login" onClick={() => setMobileNavOpen(false)} className="block py-2 text-sm font-medium text-neutral-600">Sign In</Link>
              <Link to="/register" onClick={() => setMobileNavOpen(false)} className="block py-2 text-sm font-semibold text-neutral-900">Login</Link>
            </div>
          )}
        </div>

        <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1 text-white/80 text-sm mb-6 animate-fade-in">
            500+ notes shared this week
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight animate-slide-up">
            Share Notes.<br />Learn Faster.
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-lg mx-auto mb-8 animate-fade-in">
            Discover and share study notes with fellow students. Collaborate, learn, and excel together.
          </p>

          <div className="flex items-center gap-4 animate-slide-up">
            <a
              href="#browse"
              className="bg-amber-400 text-neutral-900 rounded-full px-8 py-3 font-semibold shadow-lg shadow-amber-400/30 hover:shadow-xl hover:shadow-amber-400/40 transition-all inline-flex items-center gap-2"
            >
              Start Exploring
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#browse" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Browse Notes
            </a>
          </div>
        </div>

        <div className="relative z-20 flex justify-center pb-8 animate-float">
          <div className="bg-neutral-900/70 backdrop-blur-sm rounded-full px-4 py-2 text-white/60 text-[10px] tracking-[0.2em] uppercase flex items-center gap-2">
            Scroll
            <svg className="w-3.5 h-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      <section id="browse" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Browse Notes</h2>
          {subject !== 'All Subjects' || search ? (
            <button
              onClick={() => { setSearch(''); setSubject('All Subjects'); }}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-neutral-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="appearance-none w-full sm:w-44 pl-4 pr-10 py-2.5 bg-transparent border border-neutral-200 rounded-xl text-sm text-neutral-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <NoteCardSkeleton key={i} />)}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state rounded-2xl border border-neutral-200 bg-white">
            <span className="text-4xl mb-3">🔍</span>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">No notes found</h3>
            <p className="text-sm text-neutral-500">Try adjusting your search or filter to find what you are looking for.</p>
          </div>
        )}
      </section>
    </div>
  );
}
