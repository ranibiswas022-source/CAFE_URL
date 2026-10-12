// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Coffee, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mb-4">
            <Coffee size={28} className="text-gold" />
          </div>
          <h1 className="font-serif text-3xl text-white font-bold">Create Account</h1>
          <p className="text-textSecondary mt-1.5 text-sm">Join the Bean & Brew community</p>
        </div>

        <div className="bg-surface border border-border rounded-sm p-8">
          <form onSubmit={handleSubmit} id="register-form" className="space-y-5">
            <div>
              <label className="text-textSecondary text-sm block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input id="register-name" type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name" className="input-field pl-9" autoComplete="name" />
              </div>
            </div>
            <div>
              <label className="text-textSecondary text-sm block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field pl-9" autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="text-textSecondary text-sm block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                <input id="register-password" type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  className="input-field pl-9 pr-10" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm">{error}</motion.p>}
            <button type="submit" id="register-submit" disabled={isLoading}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-textSecondary text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-white transition-colors font-medium">Sign in</Link>
          </p>
        </div>
        <p className="text-center text-textSecondary text-xs mt-6">
          <Link to="/" className="hover:text-white transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </main>
  );
}
