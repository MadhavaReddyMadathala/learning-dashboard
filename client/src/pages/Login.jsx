import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, user, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  // Clear context error on mount
  useEffect(() => {
    clearError();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  const handleShortcutLogin = async (type) => {
    setFormError('');
    const credentials = {
      student: { email: 'student@demo.com', password: 'Student@123' },
      admin: { email: 'admin@demo.com', password: 'Admin@123' },
    };

    const creds = credentials[type];
    try {
      await login(creds.email, creds.password);
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-500/10 text-brand-400 p-3 rounded-2xl border border-brand-500/20 mb-3">
            <LogIn size={28} />
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to access your customized learning space
          </p>
        </div>

        {/* Auth Box */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          
          {(error || formError) && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm text-center font-medium animate-shake">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="name@domain.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </div>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <h2 className="text-xs uppercase font-bold text-center tracking-widest text-slate-500 mb-4">
              Demo Access Shortcuts
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleShortcutLogin('student')}
                className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl py-2 px-3 transition-all text-xs font-semibold"
              >
                <UserCheck size={14} className="text-brand-400" />
                <span>As Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleShortcutLogin('admin')}
                className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl py-2 px-3 transition-all text-xs font-semibold"
              >
                <ShieldCheck size={14} className="text-amber-400" />
                <span>As Admin</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
