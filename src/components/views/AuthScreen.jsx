import { useState } from 'react';
import { LogIn, User, Mail, AlertCircle } from 'lucide-react';

export default function AuthScreen({ onLogin, loading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    onLogin({ name: trimmedName, email: trimmedEmail });
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo + Branding */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/icon-192.png" alt="Limitless" className="w-14 h-14 rounded-xl object-cover" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wider uppercase text-white">
            LPI Scorecard
          </h1>
          <p className="text-sm text-brand-gray tracking-widest uppercase mt-2">
            Limitless Performance Indicators
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white">Welcome</h2>
            <p className="text-sm text-brand-gray mt-1">
              Enter your details to access your scorecard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. John Smith"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-redGlow disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-brand-gray/60 text-center mt-5 leading-relaxed">
            Your data is tied to your email address.<br />
            Use the same email each time to access your scorecard.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-brand-gray/40 mt-6">
          Powered by <span className="text-brand-red">A.I.</span><span className="text-white">conic</span>
        </p>
      </div>
    </div>
  );
}
