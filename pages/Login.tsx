import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Loader2, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        await signup(email, password, name);
        setMessage('Account created! Please check your email to verify your account.');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        await login(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || (isSignup ? 'Failed to create account' : 'Failed to sign in'));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-background">
      {/* Header Strip */}
      <div className="h-16 w-full bg-brand-primary border-b border-brand-primaryDark px-6 flex items-center">
         <div className="flex items-center gap-2 font-bold text-white text-xl">
             <ShieldCheck size={28} className="text-brand-mint" />
             <span>NurseVault</span>
         </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100">
          <div className="bg-brand-primary p-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-brand-mint/30">
              <Lock size={32} className="text-brand-mint" />
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-brand-mint/80">Secure access to your professional passport.</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    placeholder="Sarah Jenkins"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-brand-charcoal">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="name@nhs.net"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder={isSignup ? "Minimum 6 characters" : ""}
                  minLength={6}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                  {error}
                </div>
              )}

              {message && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center rounded-lg bg-brand-primary py-3 font-semibold text-white hover:bg-brand-primaryDark transition-colors disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : (isSignup ? 'Create Account' : 'Sign In')}
              </button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                    setMessage('');
                  }}
                  className="text-brand-primary hover:underline"
                >
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>

              {!isSignup && (
                <div className="text-center text-sm">
                  <a href="#" className="text-brand-primary hover:underline">Forgot your password?</a>
                </div>
              )}
            </form>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 text-center text-xs text-slate-500 border-t border-slate-100">
            Protected by robust encryption.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;