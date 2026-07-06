import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { addToast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Login successful!', 'success');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-violet-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="hero-blob w-96 h-96 bg-white/10 -top-20 -left-20" />
        <div className="hero-blob w-80 h-80 bg-violet-300/20 -bottom-32 -right-16" />

        <div className="relative z-10 max-w-md text-center">
          <div className="bg-white/15 backdrop-blur-sm rounded-full p-6 w-fit mx-auto mb-8 animate-float">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">Welcome Back!</h3>

          <div className="space-y-3 mb-8 text-left">
            {['Access your saved notes and study materials', 'Track your contributions and rating', 'Connect with fellow learners'].map((text, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {text}
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
            <p className="text-white/90 text-sm italic mb-3">&ldquo;NotesHub has completely changed how I prepare for exams. The community notes are incredibly helpful.&rdquo;</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-neutral-900">AS</div>
              <div>
                <p className="text-white text-sm font-medium">Aarav S.</p>
                <p className="text-white/60 text-xs">Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="glass-card rounded-2xl p-8 sm:p-10 w-full max-w-md animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-neutral-500 text-sm">Sign in to your NotesHub account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-modern"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-modern"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md shadow-brand-500/20"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
