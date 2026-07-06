import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', otp: '', full_name: '', password: '' });
  const { addToast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    addToast('Account created successfully! Please log in.', 'success');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="hero-blob w-72 h-72 bg-brand-200/40 -top-20 -left-20" />
        <div className="hero-blob w-64 h-64 bg-amber-200/30 -bottom-20 -right-20" />

        <div className="glass-card rounded-2xl p-8 sm:p-10 w-full max-w-md relative z-10 animate-scale-in">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                  {step > s ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 3 && <div className={`w-8 sm:w-12 h-0.5 rounded transition-all duration-300 ${step > s ? 'bg-brand-600' : 'bg-neutral-200'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Get Started</h1>
                <p className="text-neutral-500 text-sm">Enter your email to create an account</p>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-5">
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
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  Send OTP
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Verify Email</h1>
                <p className="text-neutral-500 text-sm">Enter the OTP sent to {form.email}</p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    placeholder="Enter OTP"
                    className="input-modern text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  Verify
                </button>
              </form>
              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700 mt-3 transition-colors"
              >
                Back to email
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Complete Profile</h1>
                <p className="text-neutral-500 text-sm">Set up your account details</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
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
                    placeholder="At least 8 characters"
                    className="input-modern"
                    minLength={8}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  Create Account
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign In</Link>
          </p>
        </div>
      </div>

      {/* Right Panel — Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-amber-50 via-stone-100 to-neutral-200 relative items-center justify-center p-12 overflow-hidden">
        <div className="hero-blob w-80 h-80 bg-amber-300/20 -top-20 -right-20" />
        <div className="hero-blob w-72 h-72 bg-stone-300/20 -bottom-32 -left-16" />

        <div className="relative z-10 max-w-md text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 w-fit mx-auto mb-8 animate-float">
            <svg className="w-16 h-16 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-neutral-800 mb-6">Why Join NotesHub?</h3>
          <ul className="space-y-4 text-left">
            {[
              { title: 'Share Knowledge', desc: 'Upload your notes and help thousands of students worldwide.' },
              { title: 'Learn Together', desc: 'Discover notes curated by top students from top universities.' },
              { title: 'Earn Recognition', desc: 'Get rated and build your reputation as a subject expert.' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                  <p className="text-xs text-neutral-500">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
