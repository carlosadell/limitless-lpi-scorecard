import { useState } from 'react';
import { LogIn, UserPlus, User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AuthScreen({ onLogin, loading, error: externalError }) {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const displayError = externalError || error;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (mode === 'signup' && !trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    onLogin({
      name: mode === 'signup' ? trimmedName : '',
      email: trimmedEmail,
      password,
      isSignUp: mode === 'signup',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
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
            <h2 className="text-lg font-bold text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-brand-gray mt-1">
              {mode === 'signin'
                ? 'Sign in to access your scorecard'
                : 'Set up your scorecard account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (signup only) */}
            {mode === 'signup' && (
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
            )}

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
                  autoFocus={mode === 'signin'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl pl-10 pr-11 py-3 text-white text-sm placeholder:text-brand-gray/50 focus:outline-none focus:border-brand-red transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-gray hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {displayError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{displayError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red hover:bg-brand-redGlow disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-5">
            {mode === 'signin' ? (
              <p className="text-sm text-brand-gray">
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-brand-red hover:text-brand-redGlow font-semibold transition-colors"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-brand-gray">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(''); }}
                  className="text-brand-red hover:text-brand-redGlow font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-brand-gray/40 mt-6">
          Powered by <span className="text-brand-red">A.I.</span><span className="text-white">conic</span>
        </p>
      </div>
    </div>
  );
}
